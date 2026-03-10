import type {MaybeArray} from "../../type.ts";
import * as React from "react";
import type {BooleanExpression} from "../../logic/expression.ts";

export type PaletteItemType = "input";
export type PalletItemSettingValueType = "string" | "number" | "boolean" | "datetime";
export type ValueTypeAlias = string | number | boolean | Date

export type PaletteItemDescriptor = {
    key: string;
    title: string;
    type: PaletteItemType;
    minWidth: number;
    maxWidth?: number;
    settings: PaletteItemSetting[]
    ElementPreview: React.FC<PaletteItemPreviewProps>;
    Element: React.FC<PaletteItemProps>;
}

export type PaletteItemSetting = {
    title: string;
    key: string
    defaultValue?: MaybeArray<ValueTypeAlias>
    valType: PalletItemSettingValueType
    isMultiVal?: boolean
    multiValVariants?: ValueTypeAlias[]
    validation?: BooleanExpression
}

export type PalletItemInputDescriptor = PaletteItemDescriptor & {
    type: "input";

}

export type PaletteItemPreviewProps = {
    className?: string;
}

export type PaletteItemProps = {
    className?: string;
}


