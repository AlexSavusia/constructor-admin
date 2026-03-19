import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useSideBar } from './hooks/useSideBar';
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { SideBarOverlay } from './OverLay/SideBarOverlay';

export default function DefaultLayout() {
    const sidebar = useSideBar({
        storageKey: 'constructor.sidebar.collapsed',
        desktopMinWidth: 1024,
        defaultCollapsed: false,
    });

    useEffect(() => {
        document.body.classList.add('hold-transition', 'layout-fixed', 'sidebar-mini', 'sidebar-expand-lg');
        return () => {
            document.body.classList.remove('hold-transition', 'layout-fixed', 'sidebar-mini', 'sidebar-expand-lg');
        };
    }, []);

    return (
        <div className={sidebar.wrapperClassName}>
            <Header onToggleSidebar={sidebar.toggle} />

            <SideBar
                onNavigate={() => {
                    if (!sidebar.isDesktop) sidebar.close();
                }}
            />

            <main className="app-main">
                <div className="app-content p-3 d-flex justify-content-center">
                    <Outlet />
                </div>
            </main>

            <footer className="app-footer">
                <strong>Калькулятор</strong> - WebRise.
            </footer>

            <SideBarOverlay visible={sidebar.overlayVisible} onClick={sidebar.close} />
        </div>
    );
}
