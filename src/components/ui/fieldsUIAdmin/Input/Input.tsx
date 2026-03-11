import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
    value?: string | number;
    onChange?: (value: string) => void;
};

export default function Input({ value, onChange, className = "", ...props }: Props) {
    return (
        <input
            {...props}
            className={`form-control ${className}`.trim()}
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
        />
    );
}