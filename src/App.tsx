/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HashRouter, Routes, Route } from "react-router-dom";
import { Main } from "./pages/Main";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { GlobalAuth } from "./pages/admin/GlobalAuth";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

function App() {
  return (
    <HashRouter>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            <Routes>
              <Route path="/">
                <Route index element={<Main />} />
                <Route path="admin">
                  <Route path="globalauth" element={<GlobalAuth />} />
                </Route>
              </Route>
            </Routes>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </HashRouter>
  );
}

export default App;
