import {
    type Layout,
    ReactGridLayout,
    useContainerWidth,
    useGridLayout,
    verticalCompactor,
} from "react-grid-layout";
import classNames from "classnames";
import { useMemo, useState } from "react";
import type { PaletteItemDescriptor, PaletteItemSetting } from "../type.ts";
import * as React from "react";
import RightSidebar from "../../RightSidebar.tsx";

export type PlaneProps = {
    className?: string;
    items: PaletteItemDescriptor[];
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function getDescriptor(key: string, descriptors: PaletteItemDescriptor[]): PaletteItemDescriptor | null {
    return descriptors.find((x) => x.key == key) ?? null;
}

function getLayoutDescriptor(id: string, descriptors: LayoutPaletteItemDescriptor[]): LayoutPaletteItemDescriptor | null {
    return descriptors.find((x) => x.id == id) ?? null;
}

type LayoutPaletteItemDescriptor = PaletteItemDescriptor & { id: string };

export default function Plane({ className, items }: PlaneProps) {
    const marginX = 0;
    const marginY = 0;
    const paddingX = 0;
    const paddingY = 0;
    const cols = 3;
    const rowHeight = 40;
    const [layoutItems, setLayoutItems] = useState<LayoutPaletteItemDescriptor[]>([]);
    const [itemSettings, setItemSettings] = useState<PaletteItemSetting[] | null>(null)
    const { width, containerRef, mounted } = useContainerWidth();
    const initialLayout = useMemo<Layout>(()=>[{ i: "a", x: 0, y: 0, w: 1, h: 3, minW: 1, resizeHandles: ["e", "w"]}],[])

    const { layout, setLayout } = useGridLayout({
        layout: initialLayout,
        cols
    });

    const colW = width / cols;

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const descriptorKey = e.dataTransfer.getData("application/x-descriptor");
        if(!descriptorKey) return;

        const rect = containerRef.current!.getBoundingClientRect();

        const px = e.clientX - rect.left - paddingX;
        const py = e.clientY - rect.top - paddingY;

        const x = clamp(Math.round(px / (colW + marginX)), 0, cols - 1);
        const y = Math.max(0, Math.round(py / (rowHeight + marginY)));

        const id = crypto.randomUUID();

        const descriptor = getDescriptor(descriptorKey, items)
        setLayoutItems((p) => [...p, {...descriptor, id} as LayoutPaletteItemDescriptor]);
        setLayout([
            ...layout.concat(),
            { i: id, x, y, w: descriptor?.minWidth ?? 1, h: 3, minW: descriptor?.minWidth, resizeHandles: ["e", "w"] },
        ]);

    };

    return (
        <>
            <div className={classNames(className, "card card-outline card-secondary h-100 mb-0")}>
                <div className="card-header">
                    <h3 className="card-title mb-0">Полотно</h3>
                    <div className="card-tools d-flex align-items-center gap-2">

                        <button className="btn btn-success btn-sm">
                            <i className="fas fa-save me-1"></i>
                            Сохранить
                        </button>
                    </div>

                </div>

                <div className="card-body p-2">
                    <div
                        onDrop={onDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className={classNames("w-100")}
                        ref={containerRef}
                    >
                        {mounted && (
                            <div
                                className="position-relative rounded"
                                style={{
                                    width: "100%",
                                    height: '100%',
                                    border: "1px dashed rgba(0,0,0,.25)",
                                    backgroundColor: "var(--bs-body-bg)",
                                    overflow: "hidden",
                                    backgroundImage: `
                                    repeating-linear-gradient(
                                      to right,
                                      rgba(0,0,0,0.08) 0px,
                                      rgba(0,0,0,0.08) 1px,
                                      transparent 1px,
                                      transparent ${colW}px
                                    )
                                  `,
                                }}
                            >
                                <ReactGridLayout
                                    style={{ background: "rgba(108,117,125,0.37)" }}
                                    width={width}
                                    layout={layout}
                                    gridConfig={{ cols, rowHeight }}
                                    dragConfig={{
                                        enabled: true,
                                        handle: ".handle",
                                        cancel: ".react-resizable-handle, input, textarea, select, button, [contenteditable=true]",
                                    }}
                                    compactor={verticalCompactor}
                                    onLayoutChange={setLayout}
                                >
                                    {layout.map((it) => {
                                        const l = getLayoutDescriptor(it.i, layoutItems)
                                        if(!l) return <p>invalid component</p>;
                                        const {Element} = l
                                        return (
                                            <div key={it.i} className="card shadow-sm mb-0">
                                                <div className="card-header handle text-muted py-1 d-flex align-items-center justify-content-end"
                                                     style={{cursor: "move"}}
                                                >
                                                          <span
                                                              className="text-muted"
                                                              title="Переместить"
                                                              style={{ lineHeight: 1}}
                                                          >
                                                            <i className="fas fa-grip-lines" />
                                                          </span>
                                                </div>

                                                <div className="card-body p-2">
                                                    <Element />
                                                </div>

                                                <div className="card-footer py-0 d-flex justify-content-end">
                                                    {!!l.settings.length && (
                                                        <p style={{marginBottom:0,  fontSize: "12px", cursor: "pointer", textDecoration: "underline"}}    onClick={() => setItemSettings(l.settings)}
                                                        >
                                                          Настроить
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ReactGridLayout>
                                {!layout.length && (
                                    <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                        Перетащите элемент из палитры сюда
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-footer text-muted small">Перетаскивание: за “ручку” в шапке блока</div>
            </div>
        <RightSidebar title="Настройки поля" open={!!itemSettings} onClose={()=>setItemSettings(null)}>
            <div><p>p</p></div>
        </RightSidebar>
        </>
    );
}