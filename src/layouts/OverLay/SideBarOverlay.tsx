type SideBarOverlayProps = { visible: boolean; onClick: () => void };

export function SideBarOverlay({ visible, onClick }: SideBarOverlayProps) {
    if (!visible) return null;
    return <div className="sidebar-overlay" onClick={onClick} />;
}