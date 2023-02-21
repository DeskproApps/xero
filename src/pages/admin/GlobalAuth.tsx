import {
  Button,
  H1,
  H2,
  Input,
  P1,
  Radio,
  Stack,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
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
    <Stack vertical gap={10} style={{ margin: "0px", height: "1000px" }}>
      {callbackUrl && (
        <>
          <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
          <Stack
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
          >
            <Input defaultValue={callbackUrl}></Input>
            <Stack style={{ marginLeft: "12px" }}>
              <CopyToClipboard text={callbackUrl}>
                <Button
                  text="Copy"
                  icon={faCopy}
                  intent="secondary"
                  style={{ boxShadow: "none" }}
                />
              </CopyToClipboard>
            </Stack>
          </Stack>
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
