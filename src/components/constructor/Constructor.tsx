import Palette from "./palette/Palette.tsx";
import Plane from "./plane/Plane.tsx";
import classNames from "classnames";
import PALETTE_ITEMS from "./palette/PaletteItems.ts";
import type {FormDefinition} from "../../logic/type.ts";
import {useEditorContext} from "../../pages/Programs/editor/EditorContext.tsx";

export type ConstructorProps = {
    className?: string;
}

export default function Constructor({className}: ConstructorProps) {
    const currentStepKey = useEditorContext(s=>s.stepKey)
    const setEditingRule = useEditorContext(s=>s.setEditingRule)
    return (
        <div className={classNames(className,  "d-flex flex-column flex-lg-row max-w-[1620px]","w-100","gap-3")}
             style={{ minHeight: "70vh" }}>
            <div  className="flex-shrink-0"
                  style={{width: "100%",maxWidth: 320}}>
                <Palette items={PALETTE_ITEMS}/>
            </div>
            <div className="flex-grow-1">
                <Plane items={PALETTE_ITEMS}/>
            </div>
            <button
                className="btn btn-primary"
                onClick={()=>setEditingRule(["form", "steps", currentStepKey!, "transition", "rules", 0], "STEP_TRANSITION_SCOPE")}
            >
                edit transition
            </button>
        </div>
    )
}