import type {
    PaletteItemPreviewProps,
    PaletteItemProps,
    PalletItemInputDescriptor
} from "../../type.ts";
import classNames from "classnames";
// import { useState } from "react";
  import InputUI from "../../../ui/fieldsUI/Input/Input.tsx"
//  import InputDate from "../../../ui/fieldsUI/InputDate/InputDate.tsx"
// import Checkbox from "../../../ui/fieldsUI/Checkbox/Checkbox.tsx"
// import RadioButtons from "../../../ui/fieldsUI/RadioButtons/RadioButtons.tsx"
// import Switch from "../../../ui/fieldsUI/Switch/Switch.tsx"
//  import Textarea from "../../../ui/fieldsUI/Textarea/Textarea.tsx"
import Input from "../../../ui/fieldsUIAdmin/Input/Input.tsx"

function PaletteItemInput({className}: PaletteItemProps){
    // const [date, setDate] = useState("");
    // const [value, setValue] = useState("1");
    // const [enabled, setEnabled] = useState(false);

    return (
        <div className={classNames(className)}>
            <InputUI label="Фамилия, Имя, Отчество" />
        </div>
    )
}

function PaletteItemInputPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames("mb-0", className)}>
            <Input  placeholder="Фамилия, Имя, Отчество" />
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