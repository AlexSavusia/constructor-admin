import type { PaletteItemPreviewProps, PaletteItemProps, PaletteItemDescriptor } from '../../type.ts';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';

import SelectUI from '../../../ui/fieldsUI/Select/Select.tsx';
import Input from '../../../ui/fieldsUIAdmin/Input/Input.tsx';
import { getDictionaryRows } from '../../../../api';
import type { DictionaryEntryValue, DictionaryRow } from '../../../../api/types.ts';

type SelectOption = {
    label: string;
    value: string | number;
};

function getPrimitiveValue(value: DictionaryEntryValue | undefined): string | number {
    if (!value) return '';

    if (value.type === 'COMMON') {
        if (typeof value.value === 'string' || typeof value.value === 'number') {
            return value.value;
        }

        return String(value.value);
    }

    return '';
}

function mapDictionaryRowsToOptions(rows: DictionaryRow[]): SelectOption[] {
    return rows.map((row, index) => {
        const values = Object.values(row.data);

        const labelValue = getPrimitiveValue(values[0]);
        const optionValue = getPrimitiveValue(values[1] ?? values[0]);

        return {
            label: String(labelValue || `Вариант ${index + 1}`),
            value: optionValue || row.id,
        };
    });
}

function PaletteItemInput({ className, settingsValues }: PaletteItemProps) {
    const label = String(settingsValues?.label ?? 'Название поля');
    const name = String(settingsValues?.name ?? 'field');
    const required = Boolean(settingsValues?.required ?? false);
    const disabled = Boolean(settingsValues?.disabled ?? false);
    const dictId = String(settingsValues?.dictId ?? '');

    const [options, setOptions] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!dictId) {
            setOptions([]);
            return;
        }

        const controller = new AbortController();

        const loadRows = async () => {
            try {
                setLoading(true);

                const res = await getDictionaryRows({ page: 1, size: 1000 }, dictId, controller.signal);

                setOptions(mapDictionaryRowsToOptions(res.data));
            } catch (error) {
                console.error('Failed to load dictionary rows', error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        void loadRows();

        return () => controller.abort();
    }, [dictId]);

    const selectOptions = useMemo<SelectOption[]>(() => {
        if (options.length > 0) return options;

        return [
            { label: 'Вариант 1', value: 'var1' },
            { label: 'Вариант 2', value: 'var2' },
        ];
    }, [options]);

    return (
        <div className={classNames(className)}>
            <SelectUI
                name={name}
                label={loading ? `${label} (загрузка...)` : label}
                required={required}
                disabled={disabled || loading}
                options={selectOptions}
            />
        </div>
    );
}

function PaletteItemInputPreview({ className }: PaletteItemPreviewProps) {
    return (
        <div className={classNames('mb-0', className)}>
            <Input placeholder="placeholder" readOnly />
        </div>
    );
}

const SelectDictDescriptor: PaletteItemDescriptor = {
    key: 'selectDict',
    title: 'Выбор из справочника',
    type: 'input',
    minWidth: 1,
    settings: [
        {
            key: 'label',
            title: 'Название',
            valType: 'string',
            defaultValue: 'Название поля',
        },
        {
            key: 'name',
            title: 'Имя поля',
            valType: 'string',
            defaultValue: 'field',
        },
        {
            key: 'fieldType',
            title: 'Тип поля',
            valType: 'string',
            defaultValue: 'dictSelect',
            visibleWhen: {
                key: 'fieldType',
                equals: [],
            },
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
            key: 'dictId',
            title: 'Справочник',
            valType: 'string',
            defaultValue: '',
        },
        {
            key: 'dictFieldIds',
            title: 'Поля справочника',
            valType: 'array',
            defaultValue: [],
        },
        {
            key: 'options',
            title: 'Значения',
            valType: 'array',
            defaultValue: [],
        },
    ],
    ElementPreview: PaletteItemInputPreview,
    Element: PaletteItemInput,
};

export default SelectDictDescriptor;