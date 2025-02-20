import { AnchorButton, Button, H1, Radio, Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalAuth2 } from "../../hooks/UseGlobalAuth2";

export const GlobalAuth = () => {
  const { theme } = useDeskproAppTheme();
  const [tenant, setTenant] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState<boolean>(false);


  useEffect(() => {
    document.body.style.margin = "0px";
  }, []);

  const { onSignIn, message, isLoading, authUrl, tenants, setSelectedTenant } = useGlobalAuth2();

  return (
    <Stack vertical gap={10}>
      {authUrl && !message?.success && (
        <Link to={authUrl} target="_blank">
          <Button
            text="Sign In"
            data-testid="submit-button"
            onClick={onSignIn}
            disabled={!authUrl || isLoading}
            loading={isLoading}
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
                `Selected ${tenants.find((e) => e.tenantId === tenant)?.tenantName
                }.`}
            </H1>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
