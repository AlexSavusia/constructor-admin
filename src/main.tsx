import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.rtl.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'admin-lte/dist/css/adminlte.min.css';
import 'overlayscrollbars/styles/overlayscrollbars.css';
import 'icheck-bootstrap/icheck-bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './index.css';
import App from './App.tsx';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './api/auth.ts';

const authInitOptions = {
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ReactKeycloakProvider authClient={keycloak} initOptions={authInitOptions}>
            <App />
        </ReactKeycloakProvider>
    </StrictMode>
);
