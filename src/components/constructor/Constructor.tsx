import Palette from "./palette/Palette.tsx";
import Plane from "./plane/Plane.tsx";
import classNames from "classnames";
import PALETTE_ITEMS from "./palette/PaletteItems.ts";
import type {FormDefinition, Key} from "../../logic/type.ts";

export type ConstructorProps = {
    className?: string;
    onSave: (form: FormDefinition) => void,
}

export default function Constructor({className, onSave}: ConstructorProps) {
    return (
        <div className={classNames(className,  "d-flex flex-column flex-lg-row max-w-[1620px]","w-100","gap-3")}
             style={{ minHeight: "70vh" }}>
            <div  className="flex-shrink-0"
                  style={{width: "100%",maxWidth: 320}}>
                <Palette items={PALETTE_ITEMS}/>
            </div>
            <div className="flex-grow-1">
                <Plane onSave={onSave} items={PALETTE_ITEMS}/>
            </div>

        </div>
    )
}