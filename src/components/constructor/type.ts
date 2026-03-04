import type {MaybeArray} from "../../type.ts";
import type {LogicExpression} from "../../logic/type.ts";
import * as React from "react";

export type PaletteItemType = "input";
export type PalletItemSettingValueType = "string" | "number" | "boolean" | "Date";
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
    defaultValue?: MaybeArray<ValueTypeAlias>
    valType: PalletItemSettingValueType
    isMultiVal?: boolean
    multiValVariants?: ValueTypeAlias[]
    validation?: LogicExpression
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

