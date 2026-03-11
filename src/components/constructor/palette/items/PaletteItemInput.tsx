import type {
    PaletteItemPreviewProps,
    PaletteItemProps,
    PaletteItemDescriptor,
} from "../../type.ts";
import classNames from "classnames";
import InputUI from "../../../ui/fieldsUI/Input/Input.tsx";
import Input from "../../../ui/fieldsUIAdmin/Input/Input.tsx";

function PaletteItemInput({ className, settingsValues }: PaletteItemProps) {
    const label = String(settingsValues?.label ?? "Название поля");
    const required = Boolean(settingsValues?.required ?? false);
    const inputType = String(settingsValues?.inputType ?? "text");

    return (
        <div className={classNames(className)}>
            <InputUI
                label={label}
                required={required}
                type={inputType}
            />
        </div>
    )
}

function PaletteItemInputPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames("mb-0", className)}>
            <Input placeholder="placeholder" />
        </div>
    );
}

const InputDescriptor: PaletteItemDescriptor = {
    key: "input",
    title: "Поле ввода",
    type: "input",
    minWidth: 1,
    settings: [
        {
            key: "label",
            title: "Название",
            valType: "string",
            defaultValue: "Название поля",
        },
        {
            key: "required",
            title: "Обязательное поле",
            valType: "boolean",
            defaultValue: false,
        },
        {
            key: "inputType",
            title: "Тип ввода",
            valType: "string",
            defaultValue: "text",
            multiValVariants: ["text", "email", "number", "password", "tel"],
        },
    ],
    ElementPreview: PaletteItemInputPreview,
    Element: PaletteItemInput,
};

export default InputDescriptor;