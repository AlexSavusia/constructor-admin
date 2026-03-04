import * as React from "react";
import classNames from "classnames";
import type { PaletteItemDescriptor } from "../type.ts";

export type PaletteProps = {
    className?: string;
    itemClassName?: string;
    items: PaletteItemDescriptor[];
};

export default function Palette({ className, items, itemClassName }: PaletteProps) {
    const onDragStart = (item: PaletteItemDescriptor) => {
        return (e: React.DragEvent) => {
            e.dataTransfer.setData("application/x-descriptor", item.key);
            e.dataTransfer.effectAllowed = "copy";
        };
    };

    return (
        <div className={classNames(className, "card card-outline card-primary h-100")}>
            <div className="card-header">
                <h3 className="card-title mb-0">Элементы</h3>
            </div>

            <div className="card-body p-2">
                <div className="list-group">
                    {items.map((item) => {
                        const { ElementPreview, title, key } = item;
                        const dragHandler = onDragStart(item);

                        return (
                            <div
                                key={key}
                                draggable
                                onDragStart={dragHandler}
                                className={classNames(
                                    "list-group-item list-group-item-action",
                                    "d-flex flex-column gap-2",
                                    itemClassName
                                )}
                                style={{ cursor: "grab", userSelect: "none" }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="fw-semibold">{title}</div>
                                    <span className="text-muted" title="Перетащите на полотно">
                    <i className="fas fa-grip-vertical" />
                  </span>
                                </div>

                                <div className="bg-body-secondary rounded p-2">
                                    <ElementPreview />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="card-footer text-muted small">
                Перетащите элемент на полотно справа
            </div>
        </div>
    );
}