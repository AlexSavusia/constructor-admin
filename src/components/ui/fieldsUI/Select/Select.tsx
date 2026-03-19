import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Select.css';

export type Option = {
    value: string | number;
    label: string;
};

type BaseProps = {
    label: string;
    error?: string;
    required?: boolean;
    options: Option[];
    placeholder?: string;
    multiple?: boolean;
    disabled?: boolean;
    name?: string;
};

type SingleSelectProps = BaseProps & {
    multiple?: false;
    value?: string | number | null;
    onChange?: (value: string | number | null) => void;
};

type MultiSelectProps = BaseProps & {
    multiple: true;
    value?: Array<string | number>;
    onChange?: (value: Array<string | number>) => void;
};

type Props = SingleSelectProps | MultiSelectProps;

export default function SelectUI({
                                     label,
                                     error,
                                     required,
                                     options,
                                     placeholder = 'Выберите значение',
                                     multiple = false,
                                     disabled = false,
                                     name,
                                     value,
                                     onChange,
                                 }: Props) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const [internalSingleValue, setInternalSingleValue] = useState<string | number | null>(null);
    const [internalMultiValue, setInternalMultiValue] = useState<Array<string | number>>([]);

    const currentValue = useMemo(() => {
        if (multiple) {
            return Array.isArray(value) ? value : internalMultiValue;
        }

        return value !== undefined ? value : internalSingleValue;
    }, [multiple, value, internalMultiValue, internalSingleValue]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedOptions = useMemo(() => {
        if (multiple) {
            const currentValues = Array.isArray(currentValue) ? currentValue : [];
            return options.filter((opt) => currentValues.includes(opt.value));
        }

        return options.filter((opt) => opt.value === currentValue);
    }, [multiple, options, currentValue]);

    const hasValue = selectedOptions.length > 0;

    const displayText = useMemo(() => {
        if (!hasValue) return '';

        if (multiple) {
            return selectedOptions.map((opt) => opt.label).join(', ');
        }

        return selectedOptions[0]?.label ?? '';
    }, [hasValue, multiple, selectedOptions]);

    function isSelected(optionValue: string | number) {
        if (multiple) {
            return Array.isArray(currentValue) ? currentValue.includes(optionValue) : false;
        }

        return currentValue === optionValue;
    }

    function handleSelect(optionValue: string | number) {
        if (disabled) return;

        if (multiple) {
            const currentValues = Array.isArray(currentValue) ? currentValue : [];
            const exists = currentValues.includes(optionValue);

            const newValue = exists
                ? currentValues.filter((item) => item !== optionValue)
                : [...currentValues, optionValue];

            if (onChange) {
                (onChange as MultiSelectProps['onChange'])?.(newValue);
            } else {
                setInternalMultiValue(newValue);
            }

            return;
        }

        const newValue = currentValue === optionValue ? null : optionValue;

        if (onChange) {
            (onChange as SingleSelectProps['onChange'])?.(newValue);
        } else {
            setInternalSingleValue(newValue);
        }

        setOpen(false);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        if (disabled) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen((prev) => !prev);
        }

        if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    return (
        <div className="field" ref={rootRef}>
            <div
                className={[
                    'selectWrapper',
                    open ? 'open' : '',
                    error ? 'error' : '',
                    disabled ? 'disabled' : '',
                    hasValue ? 'filled' : '',
                ].join(' ')}
            >
                <button
                    type="button"
                    className="selectTrigger"
                    onClick={() => !disabled && setOpen((prev) => !prev)}
                    onKeyDown={handleKeyDown}
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    disabled={disabled}
                >
                    <span className={`selectValue ${!hasValue ? 'placeholder' : ''}`}>
                        {hasValue ? displayText : placeholder}
                    </span>

                    <span className="selectArrow" />
                </button>

                <label className="label">
                    {required && <span className="required">*</span>}
                    <span>{label}</span>
                </label>

                {open && (
                    <div className="dropdown" role="listbox" aria-multiselectable={multiple}>
                        {options.length === 0 ? (
                            <div className="option empty">Нет данных</div>
                        ) : (
                            options.map((opt) => {
                                const selected = isSelected(opt.value);

                                return (
                                    <button
                                        key={String(opt.value)}
                                        type="button"
                                        className={`option ${selected ? 'selected' : ''}`}
                                        onClick={() => handleSelect(opt.value)}
                                    >
                                        {multiple && (
                                            <span className={`checkBox ${selected ? 'checked' : ''}`}>
                                                {selected && <span className="checkMark" />}
                                            </span>
                                        )}

                                        <span className="optionLabel">{opt.label}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {name && multiple && Array.isArray(currentValue)
                ? currentValue.map((item) => (
                    <input
                        key={String(item)}
                        type="hidden"
                        name={name}
                        value={String(item)}
                    />
                ))
                : null}

            {name && !multiple && currentValue !== null && currentValue !== undefined ? (
                <input type="hidden" name={name} value={String(currentValue)} />
            ) : null}

            {error && <div className="errorText">{error}</div>}
        </div>
    );
}