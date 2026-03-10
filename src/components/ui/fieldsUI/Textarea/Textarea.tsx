import type { TextareaHTMLAttributes } from "react";
import "./Textarea.css";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    value?: string;
    onChange?: (value: string) => void;
};

export default function Textarea({ value, onChange, ...props }: Props) {
    return (
        <textarea
            className="textarea"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            {...props}
        />
    );
}