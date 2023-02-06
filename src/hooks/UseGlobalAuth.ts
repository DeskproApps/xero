// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import jwt_decode from "jwt-decode";
import { useMemo, useState } from "react";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

import { ISettings } from "../types/settings";
import { getAccessAndRefreshTokens } from "../api/preInstallApi";
import { IConnectToken } from "../types/connectToken";

export const useGlobalAuth = () => {
  const { client } = useDeskproAppClient();
  const key = useMemo(() => uuidv4(), []);

  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [poll, setPoll] = useState<(() => Promise<{ token: string }>) | null>(
    null
  );
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    error?: string;
    success?: string;
  } | null>(null);

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

    window.open(
      `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${
        settings?.client_id
      }&redirect_uri=${new URL(
        callbackUrl as string
      ).toString()}&scope=openid profile email offline_access&state=${key}`
    );

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

        client.setAdminSetting(JSON.stringify(tokens));

        setMessage({
          success: `Successfully signed in. Welcome ${user}!`,
        });
      })();
    },
    [accessCode, callbackUrl]
  );

  return {
    callbackUrl,
    poll,
    key,
    setAccessCode,
    signIn,
    signOut,
    message,
  };
};
