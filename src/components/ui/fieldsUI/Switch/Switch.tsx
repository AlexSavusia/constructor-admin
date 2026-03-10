import type { ReactNode } from "react";
import "./Switch.css";

type Props = {
    checked?: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    children?: ReactNode;
    name?: string;
};

export default function Switch({checked = false, onChange, disabled, children, name}: Props) {
    return (
        <label className={`switch-label ${disabled ? "switch-label--disabled" : ""}`}>
            <input
                className="switch-input"
                type="checkbox"
                name={name}
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.checked)}
            />

            <span className="switch-track">
        <span className="switch-thumb" />
      </span>

            {children && <span className="switch-text">{children}</span>}
        </label>
    );
}