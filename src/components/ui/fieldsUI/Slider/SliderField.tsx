type Props = {
    label?: string;
    required?: boolean;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    inputBox?: boolean;
    onChange: (value: number) => void;
    disabled?: boolean;
};

export default function Slider({
    label,
    required = false,
    value,
    min = 0,
    max = 100,
    step = 1,
    showValue = true,
    inputBox = false,
    onChange,
    disabled = false,
}: Props) {
    const safeValue = Number.isNaN(value) ? min : value;

    return (
        <div>
            {label ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                    }}
                >
                    <div style={{ fontWeight: 600 }}>
                        {label}
                        {required ? ' *' : ''}
                    </div>

                    {showValue ? <div style={{ opacity: 0.8 }}>{safeValue}</div> : null}
                </div>
            ) : showValue ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: 8,
                    }}
                >
                    <div style={{ opacity: 0.8 }}>{safeValue}</div>
                </div>
            ) : null}

            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                }}
            >
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={safeValue}
                    disabled={disabled}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{ width: '100%' }}
                />

                {inputBox ? (
                    <input
                        type="number"
                        value={safeValue}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        onChange={(e) => onChange(Number(e.target.value))}
                        style={{
                            width: 90,
                            padding: '8px 10px',
                            borderRadius: 10,
                            border: '1px solid #e5e7eb',
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}
