import { useEffect, useState } from "react";
import "./InputDate.css";

type Props = {
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
};

export default function InputDate({
                                      label,
                                      value = "",
                                      onChange,
                                      disabled,
                                  }: Props) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const nextValue = e.target.value;
        setInputValue(nextValue);
        onChange?.(nextValue);
    }

    return (
        <div className="input-date-container">
            <div className="input-date">
                <input
                    type="text"
                    className="input-date-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder=" "
                    disabled={disabled}
                />

                <label className="input-date-label">{label}</label>

                <button
                    type="button"
                    className="input-date-button"
                    disabled={disabled}
                    aria-label="Календарь"
                    tabIndex={-1}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M0.914062 16.3125C0.914062 17.2441 1.67627 18 2.61574 18H15.0947C16.0342 18 16.7964 17.2441 16.7964 16.3125V6.75H0.914062V16.3125ZM12.2586 9.42188C12.2586 9.18984 12.45 9 12.684 9H14.1021C14.3361 9 14.5275 9.18984 14.5275 9.42188V10.8281C14.5275 11.0602 14.3361 11.25 14.1021 11.25H12.684C12.45 11.25 12.2586 11.0602 12.2586 10.8281V9.42188ZM12.2586 13.9219C12.2586 13.6898 12.45 13.5 12.684 13.5H14.1021C14.3361 13.5 14.5275 13.6898 14.5275 13.9219V15.3281C14.5275 15.5602 14.3361 15.75 14.1021 15.75H12.684C12.45 15.75 12.2586 15.5602 12.2586 15.3281V13.9219ZM7.72079 9.42188C7.72079 9.18984 7.91222 9 8.14621 9H9.56427C9.79825 9 9.98969 9.18984 9.98969 9.42188V10.8281C9.98969 11.0602 9.79825 11.25 9.56427 11.25H8.14621C7.91222 11.25 7.72079 11.0602 7.72079 10.8281V9.42188ZM7.72079 13.9219C7.72079 13.6898 7.91222 13.5 8.14621 13.5H9.56427C9.79825 13.5 9.98969 13.6898 9.98969 13.9219V15.3281C9.98969 15.5602 9.79825 15.75 9.56427 15.75H8.14621C7.91222 15.75 7.72079 15.5602 7.72079 15.3281V13.9219ZM3.18297 9.42188C3.18297 9.18984 3.37441 9 3.60839 9H5.02646C5.26044 9 5.45188 9.18984 5.45188 9.42188V10.8281C5.45188 11.0602 5.26044 11.25 5.02646 11.25H3.60839C3.37441 11.25 3.18297 11.0602 3.18297 10.8281V9.42188ZM3.18297 13.9219C3.18297 13.6898 3.37441 13.5 3.60839 13.5H5.02646C5.26044 13.5 5.45188 13.6898 5.45188 13.9219V15.3281C5.45188 15.5602 5.26044 15.75 5.02646 15.75H3.60839C3.37441 15.75 3.18297 15.5602 3.18297 15.3281V13.9219ZM15.0947 2.25H13.3931V0.5625C13.3931 0.253125 13.1378 0 12.8258 0H11.6914C11.3794 0 11.1241 0.253125 11.1241 0.5625V2.25H6.58633V0.5625C6.58633 0.253125 6.33108 0 6.0191 0H4.88465C4.57268 0 4.31742 0.253125 4.31742 0.5625V2.25H2.61574C1.67627 2.25 0.914062 3.00586 0.914062 3.9375V5.625H16.7964V3.9375C16.7964 3.00586 16.0342 2.25 15.0947 2.25Z"
                            fill="#B9BCC6"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}