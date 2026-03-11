import type {
    PaletteItemPreviewProps,
    PaletteItemProps,
    PaletteItemDescriptor,
    PaletteItemType,
} from "../../type.ts";
import classNames from "classnames";

import InputUI from "../../../ui/fieldsUI/Input/Input.tsx";
import TextareaUI from "../../../ui/fieldsUI/Textarea/Textarea.tsx";
import CheckboxUI from "../../../ui/fieldsUI/Checkbox/Checkbox.tsx";
import RadioButtonsUI from "../../../ui/fieldsUI/RadioButtons/RadioButtons.tsx";
import SwitchUI from "../../../ui/fieldsUI/Switch/Switch.tsx";
import InputDateUI from "../../../ui/fieldsUI/InputDate/InputDate.tsx";

import InputPreview from "../../../ui/fieldsUIAdmin/Input/Input.tsx";
import { useMemo, useState } from "react";

function PaletteItemField({ className, settingsValues }: PaletteItemProps) {
    const label = String(settingsValues?.label ?? "Название поля");
    const required = Boolean(settingsValues?.required ?? false);
    const fieldType = String(settingsValues?.fieldType ?? "input") as PaletteItemType;

    const inputType = String(settingsValues?.inputType ?? "text");
    const placeholder = String(settingsValues?.placeholder ?? "");
    const name = String(settingsValues?.name ?? "field");
    const checked = Boolean(settingsValues?.checked ?? false);
    const disabled = Boolean(settingsValues?.disabled ?? false);

    const radioOption1 = String(settingsValues?.radioOption1 ?? "Вариант 1");
    const radioOption2 = String(settingsValues?.radioOption2 ?? "Вариант 2");
    const radioValue1 = String(settingsValues?.radioValue1 ?? "var1");
    const radioValue2 = String(settingsValues?.radioValue2 ?? "var2");

    const [radioValue, setRadioValue] = useState(radioValue1);
    const [switchEnabled, setSwitchEnabled] = useState(false);

    const radioData = useMemo(
        () => [
            { label: radioOption1, value: radioValue1 },
            { label: radioOption2, value: radioValue2 },
        ],
        [radioOption1, radioOption2, radioValue1, radioValue2],
    );

    if (fieldType === "textarea") {
        return (
            <div className={classNames(className)}>
                <TextareaUI
                    label={label}
                    required={required}
                    placeholder={placeholder}
                />
            </div>
        );
    }

    if (fieldType === "checkbox") {
        return (
            <div className={classNames(className)}>
                <CheckboxUI
                    name={name}
                    label={label}
                    checked={checked}
                    required={required}
                    disabled={disabled}
                    onChange={() => {}}
                />
            </div>
        );
    }

    if (fieldType === "radio") {
        return (
            <div className={classNames(className)}>
                <RadioButtonsUI
                    name={name}
                    title={label}
                    required={required}
                    currentValue={radioValue}
                    onChange={setRadioValue}
                    data={radioData}
                />
            </div>
        );
    }

    if (fieldType === "switch") {
        return (
            <div className={classNames(className)}>
                <SwitchUI
                    name={name}
                    label={label}
                    required={required}
                    checked={switchEnabled}
                    onChange={setSwitchEnabled}
                />
            </div>
        );
    }

    if (fieldType === "date") {
        return (
            <div className={classNames(className)}>
                <InputDateUI
                    label={label}
                    disabled={disabled}
                    onChange={() => {}}
                />
            </div>
        );
    }

    return (
        <div className={classNames(className)}>
            <InputUI
                label={label}
                required={required}
                type={inputType}
                placeholder={placeholder}
            />
        </div>
    );
}

function PaletteItemFieldPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames("mb-0", className)}>
            <InputPreview placeholder="placeholder" />
        </div>
    );
}

const FieldDescriptor: PaletteItemDescriptor = {
    key: "field",
    title: "Поле формы",
    type: "input",
    minWidth: 1,
    settings: [
        {
            key: "fieldType",
            title: "Тип поля",
            valType: "string",
            defaultValue: "input",
            multiValVariants: [
                "input",
                "textarea",
                "checkbox",
                "radio",
                "switch",
                "date",
            ],
        },

        {
            key: "label",
            title: "Название",
            valType: "string",
            defaultValue: "Название поля",
        },
        {
            key: "name",
            title: "Name",
            valType: "string",
            defaultValue: "field",
        },
        {
            key: "required",
            title: "Обязательное поле",
            valType: "boolean",
            defaultValue: false,
            visibleWhen: {
                key: "fieldType",
                equals: ["input", "textarea", "checkbox", "radio", "switch"],
            },
        },
        {
            key: "disabled",
            title: "Disabled",
            valType: "boolean",
            defaultValue: false,
            visibleWhen: {
                key: "fieldType",
                equals: ["checkbox", "date"],
            },
        },

        {
            key: "placeholder",
            title: "Placeholder",
            valType: "string",
            defaultValue: "",
            visibleWhen: {
                key: "fieldType",
                equals: ["input", "textarea"],
            },
        },
        {
            key: "inputType",
            title: "HTML type input",
            valType: "string",
            defaultValue: "text",
            multiValVariants: ["text", "email", "number", "password", "tel"],
            visibleWhen: {
                key: "fieldType",
                equals: "input",
            },
        },

        {
            key: "checked",
            title: "Отмечен по умолчанию",
            valType: "boolean",
            defaultValue: false,
            visibleWhen: {
                key: "fieldType",
                equals: "checkbox",
            },
        },

        {
            key: "radioOption1",
            title: "Radio option 1 label",
            valType: "string",
            defaultValue: "Вариант 1",
            visibleWhen: {
                key: "fieldType",
                equals: "radio",
            },
        },
        {
            key: "radioValue1",
            title: "Radio option 1 value",
            valType: "string",
            defaultValue: "var1",
            visibleWhen: {
                key: "fieldType",
                equals: "radio",
            },
        },
        {
            key: "radioOption2",
            title: "Radio option 2 label",
            valType: "string",
            defaultValue: "Вариант 2",
            visibleWhen: {
                key: "fieldType",
                equals: "radio",
            },
        },
        {
            key: "radioValue2",
            title: "Radio option 2 value",
            valType: "string",
            defaultValue: "var2",
            visibleWhen: {
                key: "fieldType",
                equals: "radio",
            },
        },
    ],
    ElementPreview: PaletteItemFieldPreview,
    Element: PaletteItemField,
};

export default FieldDescriptor;