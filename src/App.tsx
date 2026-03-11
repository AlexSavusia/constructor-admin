import {type JSX, useEffect} from 'react'
import {useKeycloak} from "@react-keycloak/web";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import InternalErrorPage from "./pages/InternalErrorPage.tsx";
import ForbiddenErrorPage from "./pages/ForbiddenErrorPage.tsx";
import NotFoundErrorPage from "./pages/NotFoundErrorPage.tsx";
import DefaultLayout from "./layouts/DefaultLayout.tsx";
import CalculationsPage from "./pages/Calculations";
import CalculationsEditPage from "./pages/Calculations/edit.tsx";
import DictionariesPage from "./pages/Dictionaries";
import ProgramsPage from "./pages/Programs";
import CreateProgramsPage from "./pages/Programs/create.tsx";
import HomePage from "./pages/HomePage.tsx";


function PrivateRoute({ children }: { children: JSX.Element }) {
    const { keycloak, initialized } = useKeycloak();
    const location = useLocation();

    if(import.meta.env.VITE_KEYCLOAK_DISABLED === "true")
        return children;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!initialized) return;
        if (keycloak.authenticated) return;

        keycloak.login({
            redirectUri: window.location.origin + location.pathname + location.search,
        });
    }, [initialized, keycloak, location.pathname, location.search]);

    if (!initialized || !keycloak.authenticated) return <div>SPINNER</div>;

    return children;
}

function App() {
  return(
    <BrowserRouter>
        <Routes>
            <Route path="/505" element={<InternalErrorPage/>}/>
            <Route path="/403" element={<ForbiddenErrorPage/>}/>
            <Route path="/404" element={<NotFoundErrorPage/>}/>
            <Route path="/" element={
                <PrivateRoute>
                    <DefaultLayout/>
                </PrivateRoute>
            }>
                <Route path="" element={<HomePage/>}/>
                <Route path="calculations" element={<CalculationsPage/>}/>
                <Route path="calculations/:id" element={<CalculationsEditPage/>}/>
                <Route path="dictionaries" element={<DictionariesPage/>}>
                </Route>
                <Route path="programs" element={<ProgramsPage/>}/>
                <Route path="programs/create" element={<CreateProgramsPage/>}/>
            </Route>
            <Route path="*" element={<NotFoundErrorPage/>}/>
        </Routes>
        <Toaster position="top-center" />
    </BrowserRouter>
  )
}

export default App
