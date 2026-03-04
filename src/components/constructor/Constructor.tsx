import Palette from "./palette/Palette.tsx";
import Plane from "./plane/Plane.tsx";
import classNames from "classnames";
import PALETTE_ITEMS from "./palette/PaletteItems.ts";

export type ConstructorProps = {
    className?: string;
}

export default function Constructor({className}: ConstructorProps) {
    return (
        <div className={classNames(className, "bg-gray-500 h-full d-grid grid-cols-12")}>
            <Palette className="col-span-3" items={PALETTE_ITEMS}/>
            <Plane className="col-span-9" items={PALETTE_ITEMS}/>
        </div>
    )
}