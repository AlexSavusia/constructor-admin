import type { PaletteItemDescriptor } from '../type.ts';
import FieldDescriptor from './items/PaletteItemField.tsx';
import RadioDescriptor from './items/PaletteItemRadio.tsx';
import DescriptionDescriptor from './items/PaletteItemTitle.tsx';
import AgreeDescriptor from './items/PaletteItemAgree.tsx';

const PALETTE_ITEMS: PaletteItemDescriptor[] = [FieldDescriptor, RadioDescriptor, DescriptionDescriptor, AgreeDescriptor];

export default PALETTE_ITEMS;
