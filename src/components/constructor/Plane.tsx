import {ReactGridLayout, useContainerWidth, useGridLayout, verticalCompactor} from "react-grid-layout";
import classNames from "classnames";

export type PlaneProps = {
    className?: string
}

export default function Plane({className}: PlaneProps) {
    const { width, containerRef, mounted } = useContainerWidth();
    const { layout, setLayout } = useGridLayout({
        layout: [{ i: "a", x: 0, y: 0, w: 4, h: 3, resizeHandles: ["e", "w"]}],
        cols: 2
    });
    const cols = 12;
    const colW = width / cols;

    return null;
    // return (
    //     <div className={classNames(className)} ref={containerRef}>
    //         {mounted && (
    //             <div
    //       //           style={{
    //       //               position: "relative",
    //       //               width: "100%",
    //       //               height: 500,
    //       //               backgroundImage: `
    //       //   repeating-linear-gradient(
    //       //     to right,
    //       //     rgba(0,0,0,0.15) 0px,
    //       //     rgba(0,0,0,0.15) 1px,
    //       //     transparent 1px,
    //       //     transparent ${colW}px
    //       //   )
    //       // `,
    //       //           }}
    //             >
    //             <ReactGridLayout
    //                 style={{background: "red"}}
    //                 width={width}
    //                 layout={layout}
    //                 gridConfig={{ cols: 12, rowHeight: 30 }}
    //                 dragConfig={{ enabled: true, handle: '.handle' }}
    //                 compactor={verticalCompactor}
    //             >
    //                 {layout.map((it) => (
    //                     <div className="handle" key={it.i} style={{ border: "1px solid #999", background: "#fff" }}>
    //                         Компонент {it.i}
    //                     </div>
    //                 ))}
    //             </ReactGridLayout>
    //             </div>
    //         )}
    //     </div>
    // );
}