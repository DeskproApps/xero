import styled from "styled-components";
import { Stack, H1, H2, Button } from "@deskpro/deskpro-ui";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../Layout";
import { parseJsonErrorMessage } from "../../utils/utils";

const SETTINGS_ERROR = "Please check that your settings for this app in admin are correct."

const ErrorBlock = styled(Stack)`
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.red100};
`;

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  let errMessage = parseJsonErrorMessage(error.message);

  try {
    const parsedError = JSON.parse(error.message);

    switch (parsedError.status) {
      case 500:
        errMessage = SETTINGS_ERROR;
        break;
    }
  } catch {
    // nothing need to do
  }

  return (
    <Container >
      <ErrorBlock as={Stack} vertical gap={10} role="alert">
        <H1>Something went wrong:</H1>
        <H2>{errMessage}</H2>
        <Button
          text="Reload"
          onClick={resetErrorBoundary}
          icon={faRefresh as never}
          intent="secondary"
        />
      </ErrorBlock>
    </Container>
  );
};
