import { NavLink } from "react-router-dom";

type SidebarItemProps = {
    to: string;
    end?: boolean;
    icon: string;
    label: string;
};

type SideBarProps = {
    onNavigate?: () => void;
};

function Item({ to, end, icon, label }: SidebarItemProps) {
    return (
        <li className="nav-item">
            <NavLink to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <i className={`nav-icon fas ${icon}`} />
                <p>{label}</p>
            </NavLink>
        </li>
    );
}

export function SideBar({ onNavigate }: SideBarProps) {
    return (
        <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
            <div className="sidebar-brand">
                <NavLink to="/calculations" className="brand-link" onClick={onNavigate}>
                    <span className="brand-text fw-light">Калькулятор</span>
                </NavLink>
            </div>

            <div className="sidebar-wrapper">
                <nav className="mt-2">
                    <ul className="nav sidebar-menu flex-column" role="menu">
                        <Item to="/calculations" icon="fa-calculator" label="Расчёты" />
                        <Item to="/dictionaries" icon="fa-book" label="Справочники" />
                        <Item to="/programs" end icon="fa-layer-group" label="Программы" />
                        <Item to="/programs/create" icon="bi bi-border-center" label="Создать программу" />
                    </ul>
                </nav>
            </div>
        </aside>
    );
}