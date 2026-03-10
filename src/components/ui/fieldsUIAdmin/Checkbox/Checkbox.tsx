import {type ChangeEvent, type ReactNode, useId } from "react";

type Props = {
    name: string;
    children: ReactNode;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
    className?: string;
};

export default function Checkbox({name, children, checked, disabled, onChange, className = ""}: Props) {
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
            />
            <label htmlFor={id} className="form-check-label">
                {children}
            </label>
        </div>
    );
}