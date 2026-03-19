import type { ReactNode } from 'react';

type Props = {
    title: string;
    search: string;
    onSearchChange: (v: string) => void;
    onClearSearch: () => void;

    size: number;
    onSizeChange: (n: number) => void;
    sizeOptions?: number[];

    onRefresh: () => void;

    rightExtras?: ReactNode;
};

export default function TableToolbar(props: Props) {
    const sizeOptions = props.sizeOptions ?? [5, 10, 20, 50];

    return (
        <div className="card-header">
            <div className="d-flex flex-wrap align-items-center justify-content-between" style={{ gap: 12 }}>
                <h3 className="card-title mb-0">{props.title}</h3>

                <div className="d-flex flex-wrap align-items-center" style={{ gap: 10 }}>
                    <div className="input-group input-group-sm" style={{ width: 320, flexWrap: 'nowrap' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Поиск по названию / описанию..."
                            value={props.search}
                            onChange={(e) => props.onSearchChange(e.target.value)}
                        />

                        <div className="input-group-append">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={props.onClearSearch}
                                disabled={!props.search.trim()}
                                title="Очистить"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>
                    </div>

                    {props.rightExtras}

                    <div className="d-flex align-items-center" style={{ gap: 8 }}>
                        <span className="text-muted small">Строк:</span>

                        <select
                            className="form-control form-control-sm"
                            style={{ width: 90 }}
                            value={props.size}
                            onChange={(e) => props.onSizeChange(Number(e.target.value))}
                        >
                            {sizeOptions.map((x) => (
                                <option key={x} value={x}>
                                    {x}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={props.onRefresh} title="Обновить">
                        <i className="bi bi-arrow-clockwise mr-1" />
                        Обновить
                    </button>
                </div>
            </div>
        </div>
    );
}
