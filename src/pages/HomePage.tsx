import {useState} from "react";
import RuleEditor from "../components/logic/components/RuleEditor.tsx";


export default function HomePage() {
    const [o, so] = useState(true)
    return (
        <>
            <p>hp</p>
            <RuleEditor open={o} setOpen={so} stepKey={"1"} form={{
                firstStepKey: "",
                steps: {
                    "temp": {
                        key: "temp",
                        title: "temp",
                        fields: {},
                        transition: {
                            rules: [],
                            defaultStep: "temp",
                        }
                    }
                },
                lookups: {},
                constants: {},
                variables: {},
                interactions: []
            }} scope={"FIELD_SCOPE"} onSave={(f)=> {
                debugger
            }}/>
        </>
    )
}