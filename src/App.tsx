/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HashRouter, Routes, Route } from "react-router-dom";
import { Main } from "./pages/Main";
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { GlobalAuth } from "./pages/admin/GlobalAuth";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import { FindCreateAccount } from "./pages/FindCreate/Contact";
import { query } from "./utils/query";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { Suspense } from "react";
import { ViewList } from "./pages/ViewList/ViewList";

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
                    <Route index element={<Main />} />
                    <Route path="list">
                      <Route path=":object/:contactId" element={<ViewList />} />
                    </Route>
                    <Route path="view">
                      <Route path=":object/:id" element={<ViewList />} />
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
