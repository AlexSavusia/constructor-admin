import {type Layout, ReactGridLayout, useContainerWidth, useGridLayout, verticalCompactor} from "react-grid-layout";
import classNames from "classnames";
import {useMemo, useState} from "react";
import type {PaletteItemDescriptor, PaletteItemSetting} from "../type.ts";
import * as React from "react";
import RightSidebar from "../../RightSidebar.tsx";

export type PlaneProps = {
    className?: string
    items: PaletteItemDescriptor[]
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function getDescriptor(key: string, descriptors: PaletteItemDescriptor[]): PaletteItemDescriptor | null {
    return descriptors.find(x=>x.key==key) ?? null;
}

function getLayoutDescriptor(id: string, descriptors: LayoutPaletteItemDescriptor[]): LayoutPaletteItemDescriptor | null {
    return descriptors.find(x=>x.id==id) ?? null;
}

type LayoutPaletteItemDescriptor = PaletteItemDescriptor & {id: string}

export default function Plane({className, items}: PlaneProps) {
    const marginX = 0;
    const marginY = 0;
    const paddingX = 0;
    const paddingY = 0;
    const cols = 3;
    const rowHeight = 30;
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
            <div
                onDrop={onDrop}
                onDragOver={e=>e.preventDefault()}
                className={classNames(className)} ref={containerRef}>
                {mounted && (
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: 500,
                            backgroundImage: `
            repeating-linear-gradient(
              to right,
              rgba(0,0,0,0.15) 0px,
              rgba(0,0,0,0.15) 1px,
              transparent 1px,
              transparent ${colW}px
            )
          `,
                        }}
                    >
                        <ReactGridLayout
                            style={{background: "red"}}
                            width={width}
                            layout={layout}
                            gridConfig={{ cols, rowHeight }}
                            dragConfig={{ enabled: true, handle: '.handle' }}
                            compactor={verticalCompactor}
                            onLayoutChange={setLayout}
                        >
                            {layout.map((it) => {
                                const l = getLayoutDescriptor(it.i, layoutItems)
                                if(!l) return <p>invalid component</p>;
                                const {Element} = l
                                return (
                                    <div className="handle" key={it.i} style={{ border: "1px solid #999", background: "#fff" }}>
                                        <Element/>
                                        {l.settings.length && <button onClick={()=>setItemSettings(l.settings)}>Настроить</button>}
                                    </div>
                                )
                            })}
                        </ReactGridLayout>
                    </div>
                )}
            </div>
        <RightSidebar title="Настройки поля" open={!!itemSettings} onClose={()=>setItemSettings(null)}>
            <div><p>p</p></div>
        </RightSidebar>
        </>
    );
}