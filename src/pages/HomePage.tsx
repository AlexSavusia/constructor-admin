import {useState} from "react";
import RuleEditor from "../components/logic/components/RuleEditor.tsx";


export default function HomePage() {
    const [o, so] = useState(false)
    return (
        <>
            <RuleEditor/>
        </>
    )
}