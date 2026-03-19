import * as React from 'react';
import classNames from 'classnames';
import type { PaletteItemDescriptor } from '../type.ts';

type PaletteProps = {
    className?: string;
    items: PaletteItemDescriptor[];
};

export default function Palette({ className, items }: PaletteProps) {
    const onDragStart = (e: React.DragEvent, descriptorKey: string) => {
        e.dataTransfer.setData('application/x-descriptor', descriptorKey);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className={classNames(className, 'card card-outline card-primary h-100 mb-0')}>
            <div className="card-header">
                <h3 className="card-title mb-0">Элементы</h3>
            </div>

            <div className="card-body p-2 d-flex flex-column gap-4">
                {items.map((item) => {
                    const Preview = item.ElementPreview;

                    return (
                        <div
                            key={item.key}
                            className="card card-body p-2  max-h-36"
                            draggable
                            onDragStart={(e) => onDragStart(e, item.key)}
                            style={{ cursor: 'grab' }}
                        >
                            <div className="small text-muted mb-2">{item.title}</div>
                            <Preview />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
