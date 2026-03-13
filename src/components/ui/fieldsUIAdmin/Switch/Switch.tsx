import { type ChangeEvent, type ReactNode, useId } from 'react';

type Props = {
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
    children?: ReactNode;
    className?: string;
};

export default function Switch({ name, checked, disabled, onChange, children, className = '' }: Props) {
    const id = useId();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
    };

    return (
        <div className={`form-check form-switch ${className}`.trim()}>
            <input
                id={id}
                name={name}
                type="checkbox"
                role="switch"
                className="form-check-input"
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
            />
            {children && (
                <label htmlFor={id} className="form-check-label">
                    {children}
                </label>
            )}
        </div>
    );
}
