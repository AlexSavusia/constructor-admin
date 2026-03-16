import "./Select.css";

type Option = {
    value: string | number;
    label: string;
};

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: string;
    required?: boolean;
    options: Option[];
};

export default function SelectUI({
                                     label,
                                     error,
                                     required,
                                     options,
                                     ...props
                                 }: Props) {
    return (
        <div className="field">
            <div className={`inputWrapper ${error ? "error" : ""}`}>
                <select
                    className="input"
                    defaultValue=""
                    required={required}
                    {...props}
                >
                    <option value="" disabled hidden></option>

                    {options.map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <label className="label">
                    {required && <span className="required">*</span>}
                    <span>{label}</span>
                </label>
            </div>

            {error && <div className="errorText">{error}</div>}
        </div>
    );
}