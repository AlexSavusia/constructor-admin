import type {
    PaletteItemPreviewProps,
    PaletteItemProps,
    PalletItemInputDescriptor
} from "../../type.ts";
import classNames from "classnames";
// import { useState } from "react";
 import Input from "../../../fieldsUI/Input/Input.tsx"
//  import InputDate from "../../../fieldsUI/InputDate/InputDate.tsx"
// import Checkbox from "../../../fieldsUI/Checkbox/Checkbox.tsx"

function PaletteItemInput({className}: PaletteItemProps){
    // const [date, setDate] = useState("");

    return (
        <div className={classNames(className)}>
            <Input label="Фамилия, Имя, Отчество" />
        </div>
    )
}

function PaletteItemInputPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames("mb-0", className)}>
            <label className="form-label mb-1">Label</label>
            <input className="form-control form-control-sm" placeholder="Placeholder" />
        </div>
    );
}

const InputDescriptor: PalletItemInputDescriptor = {
    key: "input",
    title: "Поле ввода",
    type: "input",
    minWidth: 1,
    settings: [
        {
            title: "Название",
            valType: "string"
        }
    ],
    ElementPreview: PaletteItemInputPreview,
    Element: PaletteItemInput
}

export default InputDescriptor;