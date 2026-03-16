import type { MaybeArray } from '../../type.ts';
import * as React from 'react';
import type { BooleanExpression } from '../../logic/expression.ts';

export type PaletteItemType =
    | 'input'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'switch'
    | 'date'
    | 'description'
    | 'select'
    | 'file'
    | 'agree';
export type PalletItemSettingValueType = 'string' | 'number' | 'boolean' | 'datetime';
export type ValueTypeAlias = string | number | boolean | Date | OptionItem[];
export type PaletteItemSettingsValues = Record<string, ValueTypeAlias | ValueTypeAlias[]>;

export type PaletteItemDescriptor = {
    key: string;
    title: string;
    type: PaletteItemType;
    minWidth: number;
    maxWidth?: number;
    settings: PaletteItemSetting[];
    ElementPreview: React.FC<PaletteItemPreviewProps>;
    Element: React.FC<PaletteItemProps>;
};

export type PaletteItemSetting = {
    title: string;
    key: string;
    defaultValue?: MaybeArray<ValueTypeAlias>;
    valType: PalletItemSettingValueType;
    isMultiVal?: boolean;
    multiValVariants?: ValueTypeAlias[];
    validation?: BooleanExpression;
    visibleWhen?: {
        key: string;
        equals: ValueTypeAlias | ValueTypeAlias[];
    };
};

export type PaletteItemPreviewProps = {
    className?: string;
};

export type PaletteItemProps = {
    className?: string;
    settingsValues?: PaletteItemSettingsValues;
};

export type LayoutPaletteItemDescriptor = {
    id: string;
    descriptorKey: string;
    settingsValues: PaletteItemSettingsValues;
};

export type OptionItem = {
    label: string;
    value: string | number;
};
