import { useId } from 'react';

export type RadioItem = {
    label: string;
    value: string | number;
};

type Props = {
    name: string;
    data: RadioItem[];
    title?: string;
    currentValue?: string | number;
    onChange?: (value: string) => void;
    disabled?: boolean;
    info?: string[];
    theme?: 'default' | 'param';
    className?: string;
};

export default function RadioButtons({
    name,
    data,
    title,
    currentValue,
    onChange,
    disabled,
    info,
    theme = 'default',
    className = '',
}: Props) {
    const groupId = useId();

    if (theme === 'param') {
        return (
            <div className={className}>
                {title && <div className="form-label">{title}</div>}

                <div className="d-flex flex-wrap gap-2">
                    {data.map((item, index) => {
                        const id = `${groupId}-${index}`;
                        const checked = String(item.value) === String(currentValue);

                        return (
                            <div key={id}>
                                <input
                                    id={id}
                                    className="btn-check"
                                    type="radio"
                                    name={name}
                                    value={String(item.value)}
                                    checked={checked}
                                    disabled={disabled}
                                    onChange={(e) => onChange?.(e.target.value)}
                                />
                                <label className="btn btn-outline-primary" htmlFor={id}>
                                    {item.label}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {title && <div className="form-label">{title}</div>}

            <div className="d-flex flex-wrap gap-3">
                {data.map((item, index) => {
                    const id = `${groupId}-${index}`;
                    const checked = String(item.value) === String(currentValue);

                    return (
                        <div className="form-check" key={id}>
                            <input
                                id={id}
                                className="form-check-input"
                                type="radio"
                                name={name}
                                value={String(item.value)}
                                checked={checked}
                                disabled={disabled}
                                onChange={(e) => onChange?.(e.target.value)}
                            />
                            <label className="form-check-label d-flex align-items-center gap-1" htmlFor={id}>
                                <span>{item.label}</span>
                                {info?.[index] && (
                                    <span className="text-muted" title={info[index]} style={{ cursor: 'help' }}>
                                        ⓘ
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
