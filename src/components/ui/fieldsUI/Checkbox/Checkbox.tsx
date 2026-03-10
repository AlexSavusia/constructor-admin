import {type ReactNode, type ChangeEvent, useId } from "react";
import "./Checkbox.css";

type Props = {
    name: string;
    children: ReactNode;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
};

export default function Checkbox({name, children, checked, disabled, onChange}: Props) {
    const id = useId();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
    };

    return (
        <div className="checkbox">
            <input
                id={id}
                className="checkbox-input"
                type="checkbox"
                name={name}
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
            />

            <label htmlFor={id} className="checkbox-label">
                <div className="checkbox-box">
                    <svg className="checkbox-icon"  width="11" height="8" viewBox="0 0 11 8" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.18945 3.70758C0.310792 3.5876 0.475345 3.5202 0.646922 3.5202C0.818499 3.5202 0.983052 3.5876 1.10439 3.70758L3.87058 6.44354L9.88371 0.199148C10.0019 0.0760896 10.1648 0.00452838 10.3364 0.000207602C10.5079 -0.00411317 10.6742 0.0591604 10.7987 0.176109C10.9231 0.293057 10.9954 0.4541 10.9998 0.623811C11.0042 0.793521 10.9402 0.957997 10.8219 1.08106L4.35134 7.80096C4.29178 7.86294 4.22027 7.91248 4.14103 7.94667C4.06179 7.98085 3.97643 7.99899 3.88999 8H3.88222C3.71063 7.99996 3.54607 7.93251 3.42475 7.81248L0.18945 4.61253C0.0681453 4.49251 0 4.32976 0 4.16005C0 3.99035 0.0681453 3.8276 0.18945 3.70758Z"/>
                    </svg>
                </div>
                <div className="checkbox-text">{children}</div>
            </label>
        </div>
    );
}