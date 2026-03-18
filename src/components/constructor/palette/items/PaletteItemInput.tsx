import type { PaletteItemPreviewProps, PaletteItemProps, PaletteItemDescriptor } from '../../type.ts';
import classNames from 'classnames';
import TextUI from '../../../ui/fieldsUI/Text/Text.tsx';

function PaletteItemInput({ className, settingsValues }: PaletteItemProps) {
    const label = String(settingsValues?.label ?? 'Название поля');
    const required = Boolean(settingsValues?.required ?? false);
    const inputType = String(settingsValues?.inputType ?? 'text');

    return (
        <div className={classNames(className)}>
            <TextUI label={label} required={required} type={inputType} />
        </div>
    );
}

function PaletteItemInputPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames('mb-0', className)}>
            <p>Text</p>
        </div>
    );
}

const InputDescriptor: PaletteItemDescriptor = {
    key: 'input',
    title: 'Поле ввода',
    type: 'input',
    minWidth: 1,
    settings: [
        {
            key: 'mask',
            title: 'Маска',
            valType: 'string',
            defaultValue: '',
        },
        {
            key: 'fieldType',
            title: 'Тип поля',
            valType: 'string',
            defaultValue: 'input',
            multiValVariants: ['input', 'textarea', 'checkbox', 'radio', 'switch', 'date', 'select', 'file', 'slider'],
        },
        {
            key: 'label',
            title: 'Название',
            valType: 'string',
            defaultValue: 'Название поля',
        },
        {
            key: 'name',
            title: 'Name',
            valType: 'string',
            defaultValue: 'field',
        },
        {
            key: 'required',
            title: 'Обязательное',
            valType: 'boolean',
            defaultValue: false,
        },
        {
            key: 'visible',
            title: 'Видимость',
            valType: 'boolean',
            defaultValue: false,
        },
        {
            key: 'disabled',
            title: 'Включено',
            valType: 'boolean',
            defaultValue: false,
        },
        {
            key: 'placeholder',
            title: 'Placeholder',
            valType: 'string',
            defaultValue: '',
        },
        {
            key: 'inputType',
            title: 'HTML type input',
            valType: 'string',
            defaultValue: 'text',
            multiValVariants: ['text', 'email', 'number', 'password', 'tel'],
        },
    ],
    ElementPreview: PaletteItemInputPreview,
    Element: PaletteItemInput,
};

export default InputDescriptor;
