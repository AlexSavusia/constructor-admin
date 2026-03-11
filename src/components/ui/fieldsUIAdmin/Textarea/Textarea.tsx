import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    value?: string;
    onChange?: (value: string) => void;
};

export default function Textarea({ value, onChange, className = "", ...props }: Props) {
    return (
        <textarea
            {...props}
            className={`form-control ${className}`.trim()}
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
        />
    );
}