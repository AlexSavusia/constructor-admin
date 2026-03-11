import {type ChangeEvent, useId } from "react";

type Props = {
    name: string;
    label: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: boolean) => void;
    className?: string;
};

export default function Checkbox({name, label, checked, disabled, onChange, required, className = ""}: Props) {
    const id = useId();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
    };

    return (
        <div className={`form-check ${className}`.trim()}>
            <input
                id={id}
                name={name}
                type="checkbox"
                className="form-check-input"
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
                required={required}
            />
            <label htmlFor={id} className="form-check-label">
                {label}
            </label>
        </div>
    );
}