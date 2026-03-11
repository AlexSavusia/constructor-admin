import type {
    PaletteItemSetting,
    PaletteItemSettingsValues,
    ValueTypeAlias,
} from "./type.ts";

type SettingsSidebarProps = {
    settings: PaletteItemSetting[];
    values: PaletteItemSettingsValues;
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

export default function SettingsSidebar({
                                            settings,
                                            values,
                                            onChange,
                                        }: SettingsSidebarProps) {
    const visibleSettings = settings.filter((setting) =>
        isSettingVisible(setting, values),
    );

    return (
        <div className="d-flex flex-column gap-3">
            {visibleSettings.map((setting) => {
                const value = values?.[setting.key];

                if (setting.valType === "boolean") {
                    return (
                        <div className="form-check" key={setting.key}>
                            <input
                                id={setting.key}
                                className="form-check-input"
                                type="checkbox"
                                checked={Boolean(value)}
                                onChange={(e) => onChange(setting.key, e.target.checked)}
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
                                onChange={(e) => onChange(setting.key, e.target.value)}
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
                                    onChange(setting.key, Number(e.target.value))
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
                            onChange={(e) => onChange(setting.key, e.target.value)}
                        />
                    </div>
                );
            })}
        </div>
    );
}