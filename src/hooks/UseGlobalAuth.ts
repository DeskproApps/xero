// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { createSearchParams } from "react-router-dom";
import { getAccessAndRefreshTokens, getTenants } from "../api/preInstallApi";
import { IConnectToken } from "../api/types";
import { ISettings } from "../types/settings";
import { ITenant } from "../api/types";
import { useCallback, useState } from "react";
import { IOAuth2, OAuth2Result, useDeskproAppClient, useDeskproLatestAppContext, useInitialisedDeskproAppClient, } from "@deskpro/app-sdk";

export const useGlobalAuth = () => {

    const [authUrl, setAuthUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [isPolling, setIsPolling] = useState(false)
    const [oAuth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)
    const [oAuth2Tokens, setOAuth2Tokens] = useState<IConnectToken | null>(null);
    const [tenants, setTenants] = useState<ITenant[] | null>(null);

    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext<unknown, ISettings>()
    const [message, setMessage] = useState<{
        error?: string;
        success?: string;
    } | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<string | null>(null);


    useInitialisedDeskproAppClient(async (client) => {
        if (context?.settings.use_deskpro_saas === undefined) {
            // Make sure settings have loaded.
            return
        }

        const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && typeof clientId !== 'string') {
            // Local mode requires a clientId.
            setAuthUrl(null)
            // setMessage({error: "A client ID is required"});
            return
        }

        const oAuth2Response = mode === "local" ?
            await client.startOauth2Local(
                ({ state, callbackUrl }) => {
                    return `https://login.xero.com/identity/connect/authorize?${createSearchParams([
                        ["response_type", "code"],
                        ["client_id", clientId ?? ""],
                        ["redirect_uri", callbackUrl],
                        ["scope", "openid profile email accounting.transactions accounting.contacts accounting.reports.read accounting.attachments accounting.transactions offline_access"],
                        ["state", state],
                    ])}`;
                },
                /\bcode=(?<code>[^&#]+)/,
                async (code: string): Promise<OAuth2Result> => {
                    // Extract the callback URL from the authorization URL
                    const url = new URL(oAuth2Response.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data = await getAccessAndRefreshTokens(context.settings, code, redirectUri, client);

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("D48B4D38D21B429891AC05258AB37E1E");

        setAuthUrl(oAuth2Response.authorizationUrl)
        setOAuth2Context(oAuth2Response)

    }, [setAuthUrl, context?.settings])


    useInitialisedDeskproAppClient((client) => {
        if (!oAuth2Context) {
            return
        }

        const startPolling = async () => {
            try {
                const result = await oAuth2Context.poll()

                client.setUserState("oauth/global/access_token", result.data.access_token, { backend: true })

                await client.setUserState("oauth/global/access_token", result.data.access_token, { backend: true })

                if (result.data.refresh_token) {
                    await client.setUserState("oauth/global/refresh_token", result.data.refresh_token, { backend: true })
                }

                setOAuth2Tokens({
                    access_token: result.data.access_token,
                    refresh_token: result.data.refresh_token
                });


                const tenantsData = await getTenants(client, result.data.access_token);
                setTenants(tenantsData);
                setMessage({ success: "Successfully signed in." });

            } catch (e) {
                setMessage({ error: e instanceof Error ? e.message : "Unknown error" });
            } finally {
                setIsLoading(false)
                setIsPolling(false)
            }
        }

        if (isPolling) {
            startPolling()
        }
    }, [isPolling, oAuth2Context])


    const onSignOut = () => {
        client?.setAdminSetting("");
    };

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        setIsPolling(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);


    useInitialisedDeskproAppClient((client) => {
        if (!selectedTenant || !oAuth2Tokens) {
            return
        };

        client.setAdminSetting(
            JSON.stringify({ ...oAuth2Tokens, tenant_id: selectedTenant })
        );
    }, [selectedTenant, oAuth2Tokens]);

    return { authUrl, onSignIn, onSignOut, message, isLoading, tenants, selectedTenant, setSelectedTenant };
}