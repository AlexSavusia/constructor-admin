import * as React from 'react';
import classNames from 'classnames';

export type ModalProps = {
    title?: string;
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    onSave?: () => void;
};

export default function Modal({ title, open, onClose, onSave, className, children }: ModalProps) {
    return (
        <>
            <div
                tabIndex={-1}
                className={classNames('modal fade d-block', { show: open })}
                onClick={() => onClose()}
                style={{
                    visibility: open ? 'visible' : 'hidden',
                    maxHeight: '100vh',
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={classNames('modal-dialog modal-dialog-centered modal-xxl', className)}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" onClick={() => onClose()}></button>
                        </div>
                        <div className="modal-body">{children}</div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => onClose()}>
                                Закрыть
                            </button>
                            {onSave && (
                                <button type="button" className="btn btn-primary" onClick={onSave}>
                                    Сохранить
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={classNames('modal-backdrop fade', { show: open })}
                style={{
                    visibility: open ? 'visible' : 'hidden',
                }}
            ></div>
        </>
    );
}
