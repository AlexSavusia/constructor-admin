import type {
    PaletteItemPreviewProps,
    PaletteItemProps,
    PaletteItemDescriptor,
    PaletteItemType,
    ValueTypeAlias,
    OptionItem,
} from "../../type.ts";
import classNames from "classnames";

import InputUI from "../../../ui/fieldsUI/Input/Input.tsx";
import TextareaUI from "../../../ui/fieldsUI/Textarea/Textarea.tsx";
import CheckboxUI from "../../../ui/fieldsUI/Checkbox/Checkbox.tsx";
import RadioButtonsUI, {
    type RadioItem,
} from "../../../ui/fieldsUI/RadioButtons/RadioButtons.tsx";
import SwitchUI from "../../../ui/fieldsUI/Switch/Switch.tsx";
import InputDateUI from "../../../ui/fieldsUI/InputDate/InputDate.tsx";
import SelectUI from "../../../ui/fieldsUI/Select/Select.tsx";

import InputPreview from "../../../ui/fieldsUIAdmin/Input/Input.tsx";
import { useMemo, useState } from "react";

const defaultOptions: RadioItem[] = [
    { label: "Вариант 1", value: "var1" },
    { label: "Вариант 2", value: "var2" },
];

function isRadioItemArray(
    value:
        | string
        | number
        | boolean
        | Date
        | OptionItem[]
        | ValueTypeAlias[]
        | undefined,
): value is RadioItem[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                item &&
                typeof item === "object" &&
                "label" in item &&
                "value" in item &&
                typeof item.label === "string" &&
                (typeof item.value === "string" || typeof item.value === "number"),
        )
    );
}

function PaletteItemField({ className, settingsValues }: PaletteItemProps) {
    const label = String(settingsValues?.label ?? "Название поля");
    const required = Boolean(settingsValues?.required ?? false);
    const fieldType = String(settingsValues?.fieldType ?? "input") as PaletteItemType;

    const inputType = String(settingsValues?.inputType ?? "text");
    const placeholder = String(settingsValues?.placeholder ?? "");
    const name = String(settingsValues?.name ?? "field");
    const checked = Boolean(settingsValues?.checked ?? false);
    const disabled = Boolean(settingsValues?.disabled ?? false);

    const optionsData = useMemo<RadioItem[]>(() => {
        if (isRadioItemArray(settingsValues?.options)) {
            return settingsValues.options;
        }

        return defaultOptions;
    }, [settingsValues?.options]);

    const [radioValue, setRadioValue] = useState<string>(
        String(optionsData[0]?.value ?? ""),
    );
    const [switchEnabled, setSwitchEnabled] = useState(false);

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
                    data={optionsData}
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

    if (fieldType === "select") {
        return (
            <div className={classNames(className)}>
                <SelectUI
                    name={name}
                    label={label}
                    required={required}
                    disabled={disabled}
                    options={optionsData}
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
                disabled={disabled}
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
            key: "mask",
            title: "Маска",
            valType: "string",
            defaultValue: "",
            visibleWhen: {
                key: "fieldType",
                equals: ["input"],
            },
        },
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
                "select",
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
            title: "Обязательное",
            valType: "boolean",
            defaultValue: false,
            visibleWhen: {
                key: "fieldType",
                equals: ["input", "textarea", "checkbox", "radio", "switch", "select"],
            },
        },
        {
            key: "visible",
            title: "Видимость",
            valType: "boolean",
            defaultValue: false,
            visibleWhen: {
                key: "fieldType",
                equals: ["input", "textarea", "checkbox", "radio", "switch", "select"],
            },
        },
        {
            key: "disabled",
            title: "Включено",
            valType: "boolean",
            defaultValue: false,
            visibleWhen: {
                key: "fieldType",
                equals: ["input", "checkbox", "date", "select"],
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
                equals: ["input"],
            },
        },
        {
            key: "checked",
            title: "Отмечен по умолчанию",
            valType: "boolean",
            defaultValue: false,
            visibleWhen: {
                key: "fieldType",
                equals: ["checkbox"],
            },
        },
        {
            key: "options",
            title: "Варианты ответа",
            valType: "string",
            defaultValue: defaultOptions,
            visibleWhen: {
                key: "fieldType",
                equals: ["radio", "select"],
            },
        },
    ],
    ElementPreview: PaletteItemFieldPreview,
    Element: PaletteItemField,
};

export default FieldDescriptor;