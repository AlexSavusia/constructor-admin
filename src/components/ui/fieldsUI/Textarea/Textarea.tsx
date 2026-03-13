import { type TextareaHTMLAttributes, useId } from 'react';
import './Textarea.css';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
};

export default function Textarea({ value, placeholder, label, onChange, required, ...props }: Props) {
    const id = useId();
    return (
        <div className="Textarea">
            <label htmlFor={id} className="checkbox-label">
                {required && <span className="required">*</span>}
                <div className="checkbox-text">{label}</div>
            </label>
            <textarea
                className="textarea"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                {...props}
            />
            {required && <div className="errorText">Заполните поле</div>}
        </div>
    );
}
