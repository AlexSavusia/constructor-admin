import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import "overlayscrollbars/styles/overlayscrollbars.css";
import "icheck-bootstrap/icheck-bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import './index.css'
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./api/auth.ts";
import App from "./App.tsx";

const authInitOptions = {
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={authInitOptions}
        // onTokens={(tokens) => {
        //     // put token into axios here
        // }}
        // onEvent={(event, error) => {
        //
        // }}
      >
      <App/>
    </ReactKeycloakProvider>
  </StrictMode>,
)
