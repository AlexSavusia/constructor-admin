import "./Input.css";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export default function InputUI({ label, error, ...props }: Props) {
    return (
        <div className="field">
            <div className={`inputWrapper ${error ? "error" : ""}`}>
                <input className="input" placeholder=" " {...props}/>
                <label className="label">{label}</label>
            </div>
            {error && <div className="errorText">{error}</div>}
        </div>
    );
}