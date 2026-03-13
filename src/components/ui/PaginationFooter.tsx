import { useMemo } from 'react';

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

type Props = {
    page: number;
    size: number;
    total: number;
    countOnPage: number;
    onPageChange: (p: number) => void;
    maxButtons?: number;
};

export default function PaginationFooter(props: Props) {
    const maxButtons = props.maxButtons ?? 5;

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(props.total / Math.max(1, props.size)));
    }, [props.total, props.size]);

    const fromRow = useMemo(() => {
        if (props.total === 0) return 0;
        return (props.page - 1) * props.size + 1;
    }, [props.page, props.size, props.total]);

    const toRow = useMemo(() => {
        if (props.total === 0) return 0;
        return Math.min(props.total, (props.page - 1) * props.size + props.countOnPage);
    }, [props.page, props.size, props.total, props.countOnPage]);

    const visiblePages = useMemo(() => {
        const half = Math.floor(maxButtons / 2);

        let start = Math.max(1, props.page - half);
        const end = Math.min(totalPages, start + maxButtons - 1);
        start = Math.max(1, end - maxButtons + 1);

        const res: number[] = [];
        for (let p = start; p <= end; p++) res.push(p);
        return res;
    }, [props.page, totalPages, maxButtons]);

    const onPrev = () => props.onPageChange(Math.max(1, props.page - 1));
    const onNext = () => props.onPageChange(Math.min(totalPages, props.page + 1));
    const onGoTo = (p: number) => props.onPageChange(clamp(p, 1, totalPages));

    return (
        <div className="card-footer d-flex justify-content-between align-items-center flex-wrap" style={{ gap: 12 }}>
            <div className="text-muted small">
                {props.total === 0 ? 'Нет данных' : `Показано ${fromRow}–${toRow} из ${props.total}`}
            </div>

            <ul className="pagination pagination-sm m-0">
                <li className={`page-item ${props.page <= 1 ? 'disabled' : ''}`}>
                    <button type="button" className="page-link" onClick={onPrev} disabled={props.page <= 1}>
                        «
                    </button>
                </li>

                {visiblePages.map((p) => (
                    <li key={p} className={`page-item ${p === props.page ? 'active' : ''}`}>
                        <button type="button" className="page-link" onClick={() => onGoTo(p)}>
                            {p}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${props.page >= totalPages ? 'disabled' : ''}`}>
                    <button type="button" className="page-link" onClick={onNext} disabled={props.page >= totalPages}>
                        »
                    </button>
                </li>
            </ul>
        </div>
    );
}
