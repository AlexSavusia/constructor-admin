import type { ReactNode } from 'react';

export default function PageHeader(props: { title: string; right?: ReactNode }) {
    return (
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="m-0">{props.title}</h1>
                    </div>

                    <div className="col-sm-6">
                        <div className="d-flex justify-content-sm-end flex-wrap" style={{ gap: 8 }}>
                            {props.right}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
