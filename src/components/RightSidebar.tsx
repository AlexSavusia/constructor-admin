import {useEffect} from "react";
import classNames from "classnames";

type RightSidebarProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
};

export default function RightSidebar({ open, onClose, children, title }: RightSidebarProps) {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    return (
        <>
            <div
                className={classNames("right-sidebar-overlay", {"is-open": open})}
                onClick={onClose}
            />
            <aside
                data-bs-theme="dark"
                className={classNames("bg-body-secondary right-sidebar", {"is-open": open})}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="right-sidebar-header">
                    <span>{title}</span>
                    <button type="button" className="btn btn-light">
                        <i className="fa-regular fa-circle-xmark"></i>
                    </button>
                </div>

                <div className="right-sidebar-body">{children}</div>
            </aside>
        </>
    );
}