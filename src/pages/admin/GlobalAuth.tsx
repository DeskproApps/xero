import { Button, H1, H2, P1, Radio, Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppTheme,
  CopyToClipboardInput
} from "@deskpro/app-sdk";
import { useGlobalAuth } from "../../hooks/UseGlobalAuth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const GlobalAuth = () => {
  const { theme } = useDeskproAppTheme();
  const [tenant, setTenant] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.margin = "0px";
  }, []);

  const { callbackUrl, signIn, message, authUrl, tenants, setSelectedTenant } =
    useGlobalAuth();

  return (
    <Stack vertical gap={10}>
      {callbackUrl && (
        <>
          <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
          <CopyToClipboardInput value={callbackUrl}></CopyToClipboardInput>
          <P1
            style={{
              marginBottom: "16px",
              marginTop: "8px",
              color: theme.colors.grey80,
            }}
          >
            The callback URL will be required during the Xero app setup
          </P1>
        </>
      )}
      {authUrl && !message?.success && (
        <Link to={authUrl} target="_blank">
          <Button
            text="Sign In"
            data-testid="submit-button"
            onClick={signIn}
          ></Button>
        </Link>
      )}
      {!message ? (
        <div></div>
      ) : message.error ? (
        <H1 style={{ color: theme?.colors?.red100 }}>{message.error}</H1>
      ) : (
        <H1>{message.success}</H1>
      )}
      {tenants && (
        <Stack vertical>
          <H1>Please select the tenant you'd like to use:</H1>
          <Stack vertical style={{ marginTop: "10px" }} gap={10}>
            {!submitted && (
              <Stack vertical gap={10}>
                {tenants.map((tenantApi, i) => (
                  <Stack gap={5} key={i}>
                    <Radio
                      style={{
                        color: theme.colors.grey500,
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                      checked={tenant === tenantApi.tenantId}
                      onChange={() => setTenant(tenantApi.tenantId)}
                    />
                    <H1>{tenantApi.tenantName}</H1>
                  </Stack>
                ))}
                <Button
                  text="Confirm"
                  data-testid="submit-button"
                  onClick={() => {
                    if (!tenant) return;

                    setSelectedTenant(tenant);
                    setSubmitted(true);
                  }}
                ></Button>
              </Stack>
            )}
            <H1>
              {submitted &&
                `Selected ${
                  tenants.find((e) => e.tenantId === tenant)?.tenantName
                }.`}
            </H1>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
