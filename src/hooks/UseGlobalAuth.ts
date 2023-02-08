// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import jwt_decode from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

import { ISettings } from "../types/settings";
import { getAccessAndRefreshTokens, getTenants } from "../api/preInstallApi";
import { IConnectToken } from "../api/types";
import { ITenant } from "../api/types";

export const useGlobalAuth = () => {
  const { client } = useDeskproAppClient();
  const key = useMemo(() => uuidv4(), []);

  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  const [poll, setPoll] = useState<(() => Promise<{ token: string }>) | null>(
    null
  );
  const [oauth2Tokens, setOauth2Tokens] = useState<IConnectToken | null>(null);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [tenants, setTenants] = useState<ITenant[] | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    error?: string;
    success?: string;
  } | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useInitialisedDeskproAppClient(
    (client) => {
      (async () => {
        const { callbackUrl, poll } = await client
          .oauth2()
          .getAdminGenericCallbackUrl(
            key,
            /\?(code)=(?<token>[^&]+)/,
            // eslint-disable-next-line no-useless-escape
            /(&state)=(?<key>[^&]+)/
          );

        setCallbackUrl(callbackUrl);

        setPoll(() => poll);
      })();
    },
    [key]
  );

  useEffect(() => {
    if (!key || !callbackUrl) return;

    setAuthUrl(
      `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${
        settings?.client_id
      }&redirect_uri=${new URL(
        callbackUrl as string
      ).toString()}&scope=openid profile email accounting.transactions accounting.contacts accounting.reports.read accounting.attachments accounting.transactions offline_access&state=${key}`
    );
  }, [settings?.client_id, callbackUrl, key]);

  const signOut = () => {
    client?.setAdminSetting("");

    setAccessCode(null);
  };

  const signIn = async () => {
    if (!callbackUrl || !poll) {
      setMessage({
        error:
          "Error getting callback URL. Please wait for the app to be initialized.",
      });

      return;
    }

    const code = await poll()
      .then((e) => e.token)
      .catch(() => false);

    if (!code) {
      setMessage({
        error: "Error getting access code. Please try again.",
      });

      return;
    }

    setAccessCode(code as string);
  };

  useInitialisedDeskproAppClient(
    (client) => {
      if (![accessCode, callbackUrl].every((e) => e)) return;

      (async () => {
        const tokens: IConnectToken = await getAccessAndRefreshTokens(
          settings as ISettings,
          accessCode as string,
          callbackUrl as string,
          client
        );

        if (tokens.error) {
          setMessage({
            error: "Error signing in. Please try again: " + tokens.error,
          });

          return;
        }

        const user = (jwt_decode(tokens.id_token) as { name: string }).name;

        setOauth2Tokens(tokens);

        setMessage({
          success: `Successfully signed in. Welcome ${user}!`,
        });
      })();
    },
    [accessCode, callbackUrl]
  );

  useEffect(() => {
    if (!selectedTenant || !client || !oauth2Tokens) return;

    client.setAdminSetting(
      JSON.stringify({ ...oauth2Tokens, tenant_id: selectedTenant })
    );
  }, [selectedTenant, client, oauth2Tokens]);

  useEffect(() => {
    if (!oauth2Tokens || !client) return;

    (async () => {
      const tenants = await getTenants(client, oauth2Tokens.access_token);

      setTenants(tenants);
    })();
  }, [oauth2Tokens, client]);

  return {
    callbackUrl,
    poll,
    key,
    setAccessCode,
    signIn,
    signOut,
    message,
    authUrl,
    tenants,
    selectedTenant,
    setSelectedTenant,
  };
};
