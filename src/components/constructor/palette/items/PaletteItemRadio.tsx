import type { PaletteItemPreviewProps, PaletteItemProps, PaletteItemDescriptor } from '../../type.ts';

import classNames from 'classnames';
import { useState } from 'react';

import RadioButtonsUI from '../../../ui/fieldsUI/RadioButtons/RadioButtons.tsx';

import type { RadioItem } from '../../../ui/fieldsUI/RadioButtons/RadioButtons.tsx';

const fallbackOptions: RadioItem[] = [
    { label: 'Вариант 1', value: 'var1' },
    { label: 'Вариант 2', value: 'var2' },
];

function isRadioItemArray(value: unknown): value is RadioItem[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                item &&
                typeof item === 'object' &&
                'label' in item &&
                'value' in item &&
                typeof item.label === 'string' &&
                (typeof item.value === 'string' || typeof item.value === 'number')
        )
    );
}

function PaletteItemRadio({ className, settingsValues }: PaletteItemProps) {
    const label = String(settingsValues?.label ?? 'Выберите вариант');
    const name = String(settingsValues?.name ?? 'radioField');
    const required = Boolean(settingsValues?.required ?? false);
    const disabled = Boolean(settingsValues?.disabled ?? false);
    const theme = String(settingsValues?.theme ?? 'default') as 'default' | 'param';

    const options = isRadioItemArray(settingsValues?.options) ? settingsValues.options : fallbackOptions;

    const [value, setValue] = useState<string>(String(options[0]?.value ?? ''));

    return (
        <div className={classNames(className)}>
            <RadioButtonsUI
                name={name}
                title={label}
                required={required}
                disabled={disabled}
                currentValue={value}
                onChange={setValue}
                data={options}
                theme={theme}
            />
        </div>
    );
}
function PaletteItemRadioPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames('mb-0 text-center', className)}>
            <p>Табы</p>
        </div>
    );
}
const RadioDescriptor: PaletteItemDescriptor = {
    key: 'radio',
    title: 'Radio кнопки',
    type: 'radio',
    minWidth: 1,
    settings: [
        {
            key: 'label',
            title: 'Название',
            valType: 'string',
            defaultValue: 'Выберите вариант',
        },
        {
            key: 'fieldType',
            title: 'Тип поля',
            valType: 'string',
            defaultValue: 'radio',
            visibleWhen: {
                key: 'fieldType',
                equals: [],
            },
        },
        {
            key: 'name',
            title: 'Name',
            valType: 'string',
            defaultValue: 'radioField',
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
            key: 'theme',
            title: 'Тема',
            valType: 'string',
            defaultValue: 'param',
            multiValVariants: ['default', 'param'],
        },
        {
            key: 'options',
            title: 'Варианты ответа',
            valType: 'string',
            defaultValue: [
                { label: 'Вариант 1', value: 'var1' },
                { label: 'Вариант 2', value: 'var2' },
            ],
        },
    ],
    ElementPreview: PaletteItemRadioPreview,
    Element: PaletteItemRadio,
};

export default RadioDescriptor;
