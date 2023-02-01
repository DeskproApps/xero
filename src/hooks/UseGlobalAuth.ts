// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { useMemo, useState } from "react";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

import { ISettings } from "../types/settings";
import { getAccessAndRefreshTokens } from "../api/preInstallApi";

export const useGlobalAuth = () => {
  const { client } = useDeskproAppClient();
  const key = useMemo(() => uuidv4(), []);

  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [poll, setPoll] = useState<(() => Promise<{ token: string }>) | null>(
    null
  );
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);

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
    if (!callbackUrl || !poll) return false;

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

    if (!code) return false;

    setAccessCode(code as string);

    return true;
  };

  useInitialisedDeskproAppClient(
    (client) => {
      if (![accessCode, callbackUrl, settings].every((e) => e)) return;

      (async () => {
        const tokens = await getAccessAndRefreshTokens(
          settings as ISettings,
          accessCode as string,
          callbackUrl as string,
          client
        );

        if (tokens.error) return false;

        client.setAdminSetting(JSON.stringify(tokens));
      })();
    },
    [accessCode, callbackUrl, settings]
  );

  return {
    callbackUrl,
    poll,
    key,
    setAccessCode,
    signIn,
    signOut,
  };
};
