import toast from 'react-hot-toast';

export function confirmToast(opts: {
    title: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => Promise<void> | void;
}) {
    toast.custom(
        (t) => (
            <div
                className="card mb-0"
                style={{
                    minWidth: 320,
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.22)',
                    borderRadius: 12,
                    padding: '12px 14px',
                }}
            >
                <div className="card-body py-2">
                    <div className="mb-2">{opts.title}</div>

                    <div className="d-flex justify-content-end" style={{ gap: 8 }}>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => toast.dismiss(t.id)}>
                            {opts.cancelText ?? 'Отмена'}
                        </button>

                        <button
                            className="btn btn-sm btn-danger"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                await opts.onConfirm();
                            }}
                        >
                            {opts.confirmText ?? 'Удалить'}
                        </button>
                    </div>
                </div>
            </div>
        ),
        { duration: 8000 }
    );
}
