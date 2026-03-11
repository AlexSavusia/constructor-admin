import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
};

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function parseDate(value: string) {
    const parts = value.split("/");
    if (parts.length !== 3) return undefined;

    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);

    const date = new Date(year, month, day);

    if (
        Number.isNaN(date.getTime()) ||
        date.getDate() !== day ||
        date.getMonth() !== month ||
        date.getFullYear() !== year
    ) {
        return undefined;
    }

    return date;
}

export default function InputDate({value = "", onChange, disabled, placeholder = "dd/mm/yyyy", className = ""}: Props) {
    const [inputValue, setInputValue] = useState(value);
    const [selected, setSelected] = useState<Date | undefined>(parseDate(value));
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
        setSelected(parseDate(value));
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = e.target.value;
        setInputValue(next);
        onChange?.(next);
        setSelected(parseDate(next));
    }

    function handleDaySelect(date?: Date) {
        if (!date) return;
        const formatted = formatDate(date);
        setSelected(date);
        setInputValue(formatted);
        onChange?.(formatted);
        setOpen(false);
    }

    return (
        <div className={`position-relative ${className}`.trim()} ref={rootRef}>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setOpen((prev) => !prev)}
                    disabled={disabled}
                >
                    <i className="bi bi-calendar3" />
                </button>
            </div>

            {open && (
                <div
                    className="position-absolute bg-white border rounded shadow-sm p-2 mt-1"
                    style={{ zIndex: 1050 }}
                >
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleDaySelect}
                        locale={ru}
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={2100}
                    />
                </div>
            )}
        </div>
    );
}