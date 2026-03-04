import Palette from "./Palette.tsx";
import Plane from "./Plane.tsx";

export type ConstructorProps = {}

export default function Constructor(props: ConstructorProps) {
    return (
        <div className="d-grid grid-cols-12">
            <Palette className="col-span-3"/>
            <Plane className="col-span-9"/>
        </div>
    )
}