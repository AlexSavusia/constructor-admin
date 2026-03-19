import './Input.css';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    required?: boolean;
};

export default function InputUI({ label, error, required, ...props }: Props) {
    return (
        <div className="field">
            <div className={`inputWrapper ${error ? 'error' : ''}`}>
                <input className="input" placeholder=" " {...props} />
                <label className="label">
                    {required && <span className="required">*</span>}
                    <span>{label}</span>
                </label>
            </div>
            {error && <div className="errorText">{error}</div>}
        </div>
    );
}
