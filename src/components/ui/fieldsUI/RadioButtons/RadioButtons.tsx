import "./RadioButtons.css";

export type RadioItem = {
    label: string;
    value: string | number;
};

type Props = {
    name: string;
    data: RadioItem[];
    title?: string;
    required?: boolean;
    currentValue?: string | number;
    onChange?: (value: string) => void;
    disabled?: boolean;
    info?: string[];
    theme?: "default" | "param";
};

export default function RadioButtons({name, data, title, required, currentValue, onChange, disabled, info, theme = "default" }: Props) {
    return (
        <div className={`radio-buttons ${theme === "param" ? "radio-buttons--param" : ""}`}>
           <div className="d-flex gap-2">
               {required && <span className="required">*</span>}
               {title && <p className="radio-buttons-title">{title}</p>}
           </div>

            <div className="radio-buttons-list">
                {data.map((item, index) => {
                    const id = `${name}-${index}`;
                    const checked = String(item.value) === String(currentValue);

                    return (
                        <div className="radio-buttons-item" key={id}>
                            <input
                                id={id}
                                className="radio-buttons-input"
                                type="radio"
                                name={name}
                                value={String(item.value)}
                                checked={checked}
                                onChange={(e) => onChange?.(e.target.value)}
                                disabled={disabled}
                            />

                            <label htmlFor={id} className="radio-buttons-label">
                <span className="radio-buttons-window">
                  <span className="radio-buttons-circle" />
                </span>

                                <span className="radio-buttons-text">{item.label}</span>

                                {info?.[index] && (
                                    <span className="radio-buttons-info">
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                      <circle cx="5" cy="5" r="5" fill="#818698" />
                      <path
                          d="M5.73422 4.20743C5.73422 3.92204 5.4273 3.70128 4.98576 3.70128C4.51191 3.70128 4.12961 3.91128 3.94114 4.31512L3.46191 4.0082C3.64499 3.46435 4.24268 3.07666 5.0073 3.07666C5.88499 3.07666 6.40191 3.53435 6.40191 4.13204C6.40191 5.24666 5.07191 5.17128 5.07191 5.65589C5.07191 5.73666 5.08268 5.77435 5.09345 5.8282C4.89422 5.8282 4.70038 5.83358 4.50653 5.83358C4.47961 5.74743 4.46345 5.62897 4.46884 5.55358C4.49038 4.77281 5.73422 4.85897 5.73422 4.20743ZM4.34499 6.50128C4.34499 6.30204 4.52268 6.08666 4.80268 6.08666C5.05576 6.08666 5.24422 6.30204 5.24422 6.50128C5.24422 6.72204 5.05576 6.92666 4.80268 6.92666C4.52268 6.92666 4.34499 6.72204 4.34499 6.50128Z"
                          fill="white"
                      />
                    </svg>

                    <span className="radio-buttons-info-text">{info[index]}</span>
                  </span>
                                )}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}