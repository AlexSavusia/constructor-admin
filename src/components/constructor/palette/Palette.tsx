import * as React from "react";
import classNames from 'classnames';
import type {PaletteItemDescriptor} from "../type.ts";

export type PaletteProps = {
    className?: string
    itemClassName?: string
    items: PaletteItemDescriptor[]
}

export default function Palette({className, items, itemClassName}: PaletteProps) {


    const onDragStart = (item: PaletteItemDescriptor) => {
        return (e: React.DragEvent) => {
            e.dataTransfer.setData("application/x-descriptor", item.key);
            e.dataTransfer.effectAllowed = "copy";
        };
    }
    return (
        <div className={classNames(className, "w-full")}>
            <ul className="space-y-2" style={{paddingLeft: 0, padding: "0.5rem"}}>
                {items.map((item) => {
                    const {ElementPreview, title, key} = item
                    const dragHandler = onDragStart(item)
                    return (
                        <li draggable onDragStart={dragHandler} key={key} className={itemClassName} style={{cursor: "grab", userSelect: "none"}}>
                            <p>{title}</p>
                            <ElementPreview/>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}