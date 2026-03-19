import './Switch.css';

type Props = {
    checked?: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    name?: string;
};

export default function Switch({ checked = false, onChange, disabled, label, name, required }: Props) {
    return (
        <label className={`switch-label ${disabled ? 'switch-label--disabled' : ''}`}>
            {required && <span className="required">*</span>}
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

            {label && <span className="switch-text">{label}</span>}
        </label>
    );
}
