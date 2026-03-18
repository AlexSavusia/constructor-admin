import './Text.css';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    required?: boolean;
};

export default function TextUI({ label, error, required, ...props }: Props) {
    return (
        <div className="field">
            <div className={`textWrapper ${error ? 'error' : ''}`}>
                <label className="textLabel">
                    {required && <span className="required">*</span>}
                    <span>{label}</span>
                </label>
                <input className="text" placeholder=" " {...props} />
            </div>
            {error && <div className="errorText">{error}</div>}
        </div>
    );
}
