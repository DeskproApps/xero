/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { GlobalAuth } from "./pages/admin/GlobalAuth";
import { Main } from "./pages/Main";

import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";

import { LoadingSpinner } from "@deskpro/app-sdk";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import { Suspense } from "react";
import { Redirect } from "./components/Redirect/Redirect";
import { FindCreateAccount } from "./pages/FindCreate/Contact";
import { ViewList } from "./pages/ViewList/ViewList";
import { query } from "./utils/query";

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={query}>
        <Suspense fallback={<LoadingSpinner />}>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                <Routes>
                  <Route path="/">
                    <Route path="/redirect" element={<Redirect />} />
                    <Route index element={<Main />} />
                    <Route path="list">
                      <Route
                        path=":objectName/:objectId"
                        element={<ViewList />}
                      />
                    </Route>
                    <Route path="view">
                      <Route
                        path=":objectName/:objectId"
                        element={<ViewList />}
                      />
                    </Route>
                    <Route path="admin">
                      <Route path="globalauth" element={<GlobalAuth />} />
                    </Route>
                    <Route path="findCreate">
                      <Route path="account" element={<FindCreateAccount />} />
                    </Route>
                  </Route>
                </Routes>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Suspense>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
