import { useCallback, useEffect, useMemo, useState } from 'react';

type Options = {
    storageKey?: string;
    desktopMinWidth?: number;
    defaultCollapsed?: boolean;
};

type SidebarApi = {
    isDesktop: boolean;
    isCollapsed: boolean;
    isOverlayOpen: boolean;

    toggle: () => void;
    open: () => void;
    close: () => void;
    collapse: () => void;
    expand: () => void;

    wrapperClassName: string;
    overlayVisible: boolean;
};

function readBool(key: string, fallback: boolean) {
    try {
        const raw = sessionStorage.getItem(key);
        if (raw == null) return fallback;
        return raw === '1';
    } catch {
        return fallback;
    }
}

function writeBool(key: string, value: boolean) {
    try {
        sessionStorage.setItem(key, value ? '1' : '0');
    } catch (e) {
        console.error(e);
    }
}

export function useSideBar(options: Options = {}): SidebarApi {
    const storageKey = options.storageKey ?? 'ui.sidebar.collapsed';
    const desktopMinWidth = options.desktopMinWidth ?? 992;
    const defaultCollapsed = options.defaultCollapsed ?? false;

    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window === 'undefined' ? true : window.innerWidth >= desktopMinWidth
    );

    const [isCollapsed, setIsCollapsed] = useState(() =>
        typeof window === 'undefined' ? defaultCollapsed : readBool(storageKey, defaultCollapsed)
    );

    const [overlayOpenRaw, setOverlayOpenRaw] = useState(false);

    useEffect(() => {
        const onResize = () => setIsDesktop(window.innerWidth >= desktopMinWidth);
        window.addEventListener('resize', onResize, { passive: true });
        return () => window.removeEventListener('resize', onResize);
    }, [desktopMinWidth]);

    const isOverlayOpen = !isDesktop && overlayOpenRaw;

    const collapse = useCallback(() => {
        setIsCollapsed(true);
        writeBool(storageKey, true);
    }, [storageKey]);

    const expand = useCallback(() => {
        setIsCollapsed(false);
        writeBool(storageKey, false);
    }, [storageKey]);

    const open = useCallback(() => {
        if (isDesktop) expand();
        else setOverlayOpenRaw(true);
    }, [isDesktop, expand]);

    const close = useCallback(() => {
        if (isDesktop) collapse();
        else setOverlayOpenRaw(false);
    }, [isDesktop, collapse]);

    const toggle = useCallback(() => {
        if (isDesktop) {
            setIsCollapsed((prev) => {
                const next = !prev;
                writeBool(storageKey, next);
                return next;
            });
        } else {
            setOverlayOpenRaw((prev) => !prev);
        }
    }, [isDesktop, storageKey]);
    useEffect(() => {
        if (!isOverlayOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOverlayOpenRaw(false);
        };

        const onPointerDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            if (target.closest('.app-sidebar')) return;
            setOverlayOpenRaw(false);
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('mousedown', onPointerDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mousedown', onPointerDown);
        };
    }, [isOverlayOpen]);

    const wrapperClassName = useMemo(() => {
        const cls = ['app-wrapper'];

        if (isDesktop) {
            if (isCollapsed) cls.push('sidebar-collapse');
        } else {
            if (isOverlayOpen) cls.push('sidebar-open');
        }

        return cls.join(' ');
    }, [isDesktop, isCollapsed, isOverlayOpen]);

    return {
        isDesktop,
        isCollapsed,
        isOverlayOpen,
        toggle,
        open,
        close,
        collapse,
        expand,
        wrapperClassName,
        overlayVisible: isOverlayOpen,
    };
}
