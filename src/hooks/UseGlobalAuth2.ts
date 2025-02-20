import { getAccessAndRefreshTokens, getTenants } from "../api/preInstallApi";
import { ISettings } from "../types/settings";
import { ITenant } from "../api/types";
import { Maybe } from "@deskpro/app-sdk/esm/types";
import { useCallback, useState } from "react";
import { useDeskproAppEvents, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import type { OAuth2Result } from "@deskpro/app-sdk";

export type Result = {
  onSignIn: () => void,
  authUrl: string | null,
  error: Maybe<string>,
  isLoading: boolean,
  tenants: ITenant[] | null,
  message: { error?: string; success?: string } | null,
  selectedTenant: string | null,
  setSelectedTenant: (tenant: string) => void,
};

const useGlobalAuth2 = (): Result => {
  const [error, setError] = useState<Maybe<string>>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tenants, setTenants] = useState<ITenant[] | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const { context } = useDeskproLatestAppContext<unknown, ISettings>();
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!context?.settings) {
        return
      }

      const clientId = context.settings.client_id;
      const mode = context.settings.use_deskpro_saas ? "global" : "local";

      if (mode === "local" && !clientId) {
        setAuthUrl(null)
        return
      }


      try {
        if (mode === "global") {
          console.log("[Log] Entering OAuth2: ", mode)
          await client.startOauth2Global("D48B4D38D21B429891AC05258AB37E1E");
          console.log("[Log] Finished OAuth2")
        }
      } catch (e) {
        console.log("[Log] Error: ", e)

      }

      const oauth2 =
        mode === "local"
          ? await client.startOauth2Local(
            ({ state, callbackUrl }) => {
              return `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&scope=openid profile email accounting.transactions accounting.contacts accounting.reports.read accounting.attachments accounting.transactions offline_access&state=${state}`;
            },
            /\?code=(?<code>.+?)&/, // Regex to extract the authorization code
            async (code: string): Promise<OAuth2Result> => {

              const url = new URL(oauth2.authorizationUrl);
              const redirectUri = url.searchParams.get("redirect_uri");
              if (!redirectUri) throw new Error("Failed to get callback URL");

              console.log("[Log] Getting tokens")

              const data = await getAccessAndRefreshTokens(
                settings ?? {},
                code,
                redirectUri,
                client
              );
              console.log("[Log] Acquired tokens")

              return { data };
            }
          )
          : await client.startOauth2Global("D48B4D38D21B429891AC05258AB37E1E");

      console.log("[Log] OAuth2: ", oauth2)
      setAuthUrl(oauth2.authorizationUrl);
      setIsLoading(false);

      try {
        console.log("[Log] Polling starts, Mode: ", mode)

        const result = await oauth2.poll();
        console.log("[Log] Polling ends")
        await Promise.all([
          client.setUserState("oauth/global/access_token", result.data.access_token, { backend: true }),
          result.data.refresh_token ? client.setUserState("oauth/global/refresh_token", result.data.refresh_token, { backend: true }) : Promise.resolve()
        ]);

        const tenantsData = await getTenants(client, result.data.access_token);
        console.log("[Log] Tenants: ", tenantsData)

        setTenants(tenantsData);
        setMessage({ success: "Successfully signed in." });
        // navigate("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setMessage({ error: err instanceof Error ? err.message : "Unknown error" });
        setIsLoading(false);
      }
    },
    [context?.settings]
  );

  const onSignIn = useCallback(() => {
    setIsLoading(true);
    window.open(authUrl ?? "", '_blank');
  }, [setIsLoading, authUrl]);

  return { authUrl, onSignIn, error, message, isLoading, tenants, selectedTenant, setSelectedTenant };
};

export { useGlobalAuth2 };
