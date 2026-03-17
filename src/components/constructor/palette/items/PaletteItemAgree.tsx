import type { PaletteItemPreviewProps, PaletteItemProps, PaletteItemDescriptor } from '../../type.ts';

import classNames from 'classnames';

function PaletteItemDescription({ className, settingsValues }: PaletteItemProps) {
    const text = String(settingsValues?.text ?? 'Заголовок раздела');
    const description = String(settingsValues?.description ?? 'описание');

    return (
        <div className={classNames('mb-0 d-flex flex-wrap flex-col p-2' , className)}>
           <p className={'text-3xl text-center'}><strong>{text}</strong></p>
            <p><strong>{description}</strong></p>
        </div>
    );
}

function PaletteItemDescriptionPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames('mb-0 text-center', className)}>
            <strong>Соглашение</strong>
        </div>
    );
}

const AgreeDescriptor: PaletteItemDescriptor = {
    key: 'agree',
    title: 'Заголовок / раздел',
    type: 'agree',
    minWidth: 1,

    settings: [
        {
            key: 'text',
            title: 'Текст',
            valType: 'string',
            defaultValue: 'Соглашение',
        },
        {
            key: 'description',
            title: 'Описание',
            valType: 'string',
            defaultValue: 'Описание',
        },
        {
            key: 'name',
            title: 'Name',
            valType: 'string',
            defaultValue: 'field',
        },
        {
            key: 'fieldType',
            title: 'Тип поля',
            valType: 'string',
            defaultValue: 'agree',
            visibleWhen: {
                key: 'fieldType',
                equals: [],
            },
        },
    ],

    ElementPreview: PaletteItemDescriptionPreview,
    Element: PaletteItemDescription,
};

export default AgreeDescriptor;
