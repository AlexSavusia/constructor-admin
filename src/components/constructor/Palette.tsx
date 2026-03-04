import classNames from 'classnames';

export type PaletteProps = {
    className?: string
}

export default function Palette({className}: PaletteProps) {
    return (
        <div className={classNames(className)}>
            <p>palette</p>;
        </div>
    )
}