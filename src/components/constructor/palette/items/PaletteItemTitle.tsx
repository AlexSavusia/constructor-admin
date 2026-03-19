import type { PaletteItemPreviewProps, PaletteItemProps, PaletteItemDescriptor } from '../../type.ts';

import classNames from 'classnames';

function PaletteItemDescription({ className, settingsValues }: PaletteItemProps) {
    const text = String(settingsValues?.text ?? 'Заголовок раздела');

    return (
        <div className={classNames('mb-0 d-flex flex-wrap flex-col p-2', className)}>
            <p className={'text-3xl text-center'}>
                <strong>{text}</strong>
            </p>
        </div>
    );
}

function PaletteItemDescriptionPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames('mb-0', className)}>
            <strong>Заголовок раздела</strong>
        </div>
    );
}

const DescriptionDescriptor: PaletteItemDescriptor = {
    key: 'description',
    title: 'Заголовок / раздел',
    type: 'description',
    minWidth: 1,

    settings: [
        {
            key: 'text',
            title: 'Текст',
            valType: 'string',
            defaultValue: 'Заголовок раздела',
        },
        {
            key: 'fieldType',
            title: 'Тип поля',
            valType: 'string',
            defaultValue: 'description',
            visibleWhen: {
                key: 'fieldType',
                equals: [],
            },
        },
    ],

    ElementPreview: PaletteItemDescriptionPreview,
    Element: PaletteItemDescription,
};

export default DescriptionDescriptor;
