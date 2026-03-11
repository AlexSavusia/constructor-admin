import type { PaletteItemDescriptor } from "../type.ts";
import FieldDescriptor from "./items/PaletteItemField.tsx";
import RadioDescriptor from "./items/PaletteItemRadio.tsx";
import DescriptionDescriptor from "./items/PaletteItemTitle.tsx";

const PALETTE_ITEMS: PaletteItemDescriptor[] = [
    FieldDescriptor,
    RadioDescriptor,
    DescriptionDescriptor
]

export default PALETTE_ITEMS