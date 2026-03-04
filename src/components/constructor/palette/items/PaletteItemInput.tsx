import type {
    PaletteItemPreviewProps,
    PaletteItemProps,
    PalletItemInputDescriptor
} from "../../type.ts";
import classNames from "classnames";

function PaletteItemInput({className}: PaletteItemProps){
    return (
        <div className={classNames(className)}>

        </div>
    )
}

function PaletteItemInputPreview({className}: PaletteItemPreviewProps){
    return (
        <div className={classNames("form-group border", className)}>
            <label>Label</label>
            <input className="form-control" placeholder="Placeholder"/>
        </div>
    )
}

const InputDescriptor: PalletItemInputDescriptor = {
    key: "input",
    title: "Поле ввода",
    type: "input",
    minWidth: 1,
    settings: [
        {
            title: "Название",
            valType: "string"
        }
    ],
    ElementPreview: PaletteItemInputPreview,
    Element: PaletteItemInput
}

export default InputDescriptor;