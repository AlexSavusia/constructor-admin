import type {
    PaletteItemDescriptor,
    PaletteItemSetting,
    PaletteItemSettingsValues,
    ValueTypeAlias,
} from "./type.ts";
import {useEditorContext} from "../../pages/Programs/editor/EditorContext.tsx";

type OptionItem = {
    label: string;
    value: string;
};

type SettingsSidebarProps = {
    items: PaletteItemDescriptor[]
    onChange: (key: string, value: ValueTypeAlias) => void;
};

function isSettingVisible(
    setting: PaletteItemSetting,
    values: PaletteItemSettingsValues,
) {
    if (!setting.visibleWhen) return true;

    const currentValue = values?.[setting.visibleWhen.key];
    const expected = setting.visibleWhen.equals;

    if (Array.isArray(expected)) {
        return expected.includes(currentValue as never);
    }

    return currentValue === expected;
}

function getDescriptor(
    key: string,
    descriptors: PaletteItemDescriptor[],
): PaletteItemDescriptor | null {
    return descriptors.find((x) => x.key === key) ?? null;
}

export default function SettingsSidebar({items}: SettingsSidebarProps) {
    // const s = useEditorContext(s=>s)
    const field = useEditorContext((s) => s.editingField?.draft);
    const editingField = useEditorContext((s) => s.editingField);
    const updateEditingFieldSettings = useEditorContext((s) => s.updateEditingFieldSettings);


    const persistEditingField = useEditorContext(s => s.persistEditingField);
    const resetEditingField = useEditorContext(s => s.resetEditingField);
    const setEditingRule = useEditorContext(s=>s.setEditingRule)
    if (!field || !editingField) return null;

    // debugger
    const visibleSettings = getDescriptor(field.descriptorKey, items)!.settings.filter((setting) =>
        isSettingVisible(setting, field.settingsValues),
    );

    const handleChange = (key: string, value: ValueTypeAlias) => {
        updateEditingFieldSettings({ [key]: value });
    };
    // const resetEditingField = useEditorContext(s=>s.resetEditingField)
    // const persistEditingField = useEditorContext(s=>s.persistEditingField)


    return (
        <>
            <div className="d-flex flex-column gap-3">
                <div>
                    <button
                        type="button"
                        className="btn btn-light w-100"
                        onClick={()=>setEditingRule(
                            [...editingField!.path, "logic", "validation"],
                            "FIELD_SCOPE_DECISION",
                            {
                                editingFieldProperty: "validation"
                            })}
                    >
                        Валидация
                    </button>
                </div>

                {/*<div>*/}
                {/*    <button*/}
                {/*        type="button"*/}
                {/*        className="btn btn-light w-100"*/}
                {/*        onClick={onCalculateValueClick}*/}
                {/*    >*/}
                {/*        Рассчитать значение*/}
                {/*    </button>*/}
                {/*</div>*/}

                {visibleSettings.map((setting) => {
                    const value = field.settingsValues?.[setting.key];

                    if (setting.key === "visible") {
                        return (
                            <div key={setting.key} className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center justify-content-between gap-2">
                                    <div className="form-check mb-0">
                                        <input
                                            id={setting.key}
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={Boolean(value)}
                                            onChange={(e) => handleChange(setting.key, e.target.checked)}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={setting.key}
                                        >
                                            Видимость
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-light btn-sm"
                                        onClick={()=>setEditingRule(
                                            [...editingField!.path, "logic", "visibility"],
                                            "FIELD_SCOPE_PROPERTY",
                                            {
                                                editingFieldProperty: "visibility"
                                            }
                                        )}
                                    >
                                        Условия
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    if (setting.key === "disabled") {
                        return (
                            <div key={setting.key} className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center justify-content-between gap-2">
                                    <div className="form-check mb-0">
                                        <input
                                            id={setting.key}
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={Boolean(value)}
                                            onChange={(e) => handleChange(setting.key, e.target.checked)}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={setting.key}
                                        >
                                            Включено
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-light btn-sm"
                                        onClick={()=>setEditingRule(
                                            [...editingField!.path, "logic", "enabled"],
                                            "FIELD_SCOPE_PROPERTY",
                                            {
                                                editingFieldProperty: "enabled"
                                            }
                                        )}
                                    >
                                        Условия
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    if (setting.key === "required") {
                        return (
                            <div key={setting.key} className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center justify-content-between gap-2">
                                    <div className="form-check mb-0">
                                        <input
                                            id={setting.key}
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={Boolean(value)}
                                            onChange={(e) => handleChange(setting.key, e.target.checked)}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={setting.key}
                                        >
                                            {setting.title}
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light"
                                        onClick={()=>setEditingRule(
                                            [...editingField!.path, "logic", "required"],
                                            "FIELD_SCOPE_PROPERTY",
                                            {
                                                editingFieldProperty: "required"
                                            })}
                                    >
                                        Условие
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    if (setting.key === "mask") {
                        return (
                            <div key={setting.key}>
                                <label className="form-label">{setting.title}</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={String(value ?? "")}
                                    onChange={(e) => handleChange(setting.key, e.target.value)}
                                    placeholder="Например: +7 (999) 99-99-99"
                                />
                            </div>
                        );
                    }

                    if (setting.key === "options") {
                        const options = Array.isArray(value)
                            ? (value as OptionItem[])
                            : [];

                        const updateOption = (
                            index: number,
                            patch: Partial<OptionItem>,
                        ) => {
                            const next = options.map((item, i) =>
                                i === index ? { ...item, ...patch } : item,
                            );
                            handleChange(setting.key, next);
                        };

                        const addOption = () => {
                            const nextIndex = options.length + 1;
                            const next = [
                                ...options,
                                {
                                    label: `Вариант ${nextIndex}`,
                                    value: `option_${nextIndex}`,
                                },
                            ];
                            handleChange(setting.key, next);
                        };

                        const removeOption = (index: number) => {
                            const next = options.filter((_, i) => i !== index);
                            handleChange(setting.key, next);
                        };

                        return (
                            <div key={setting.key} className="d-flex flex-column gap-2">
                                <label className="form-label mb-0">{setting.title}</label>

                                {options.map((option, index) => (
                                    <div
                                        key={`${setting.key}-${index}`}
                                        className="border rounded p-2 d-flex flex-column gap-2"
                                    >
                                        <div>
                                            <label className="form-label mb-1">
                                                Label
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={option.label}
                                                onChange={(e) =>
                                                    updateOption(index, {
                                                        label: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className="form-label mb-1">
                                                Value
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={option.value}
                                                onChange={(e) =>
                                                    updateOption(index, {
                                                        value: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger align-self-start"
                                            onClick={() => removeOption(index)}
                                        >
                                            Удалить вариант
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addOption}
                                >
                                    Добавить вариант
                                </button>
                            </div>
                        );
                    }

                    if (setting.valType === "boolean") {
                        return (
                            <div className="form-check" key={setting.key}>
                                <input
                                    id={setting.key}
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={Boolean(value)}
                                    onChange={(e) => handleChange(setting.key, e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={setting.key}>
                                    {setting.title}
                                </label>
                            </div>
                        );
                    }

                    if (setting.multiValVariants?.length) {
                        return (
                            <div key={setting.key}>
                                <label className="form-label">{setting.title}</label>
                                <select
                                    className="form-select"
                                    value={String(value ?? "")}
                                    onChange={(e) => handleChange(setting.key, e.target.value)}
                                >
                                    {setting.multiValVariants.map((variant) => (
                                        <option key={String(variant)} value={String(variant)}>
                                            {String(variant)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }

                    if (setting.valType === "number") {
                        return (
                            <div key={setting.key}>
                                <label className="form-label">{setting.title}</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={Number(value ?? 0)}
                                    onChange={(e) =>
                                        handleChange(setting.key, Number(e.target.value))
                                    }
                                />
                            </div>
                        );
                    }

                    return (
                        <div key={setting.key}>
                            <label className="form-label">{setting.title}</label>
                            <input
                                className="form-control"
                                type="text"
                                value={String(value ?? "")}
                                onChange={(e) => handleChange(setting.key, e.target.value)}
                            />
                        </div>
                    );
                })}

                <div className="d-flex gap-2 mt-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={persistEditingField}
                    >
                        Сохранить
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={resetEditingField}
                    >
                        Отмена
                    </button>
                </div>
            </div>

        </>
    );
}