import { AnchorButton, Button, H1, Radio, Stack } from "@deskpro/deskpro-ui";
import { useEffect, useState } from "react";
import { useGlobalAuth } from "../../hooks/UseGlobalAuth";
import { useDeskproAppTheme, } from "@deskpro/app-sdk";

export const GlobalAuth = () => {
  const { theme } = useDeskproAppTheme();
  const [tenant, setTenant] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState<boolean>(false);


  useEffect(() => {
    document.body.style.margin = "0px";
  }, []);

  const { onSignIn, message, isLoading, authUrl, tenants, setSelectedTenant } = useGlobalAuth();

  return (
    <Stack vertical gap={10}>
      {/* Login button */}
      {authUrl && !message?.success && (
        <AnchorButton
          data-testid="submit-button"
          disabled={!authUrl || isLoading}
          href={authUrl || "#"}
          loading={isLoading}
          target="_blank"
          onClick={onSignIn}
          text="Sign In"
        />
      )}

      {/* Error/Feedback Message */}
      {!message ? (
        <div></div>
      ) : message.error ? (
        <H1 style={{ color: theme?.colors?.red100 }}>{message.error}</H1>
      ) : (
        <H1>{message.success}</H1>
      )}

      {/* Show the available tenants after the user has logged in */}
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

            {/* Show selected tenant after submission */}
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
