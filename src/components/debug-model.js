export function Debug({fboTarget, x=0, y=1.5, z=0}) {

    return (
        <>
            <mesh position={[x, y, z]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial map={fboTarget.texture} />
                <polarGridHelper args={[ 1 ]} rotation={ [Math.PI / 2, 0, 0] } />
            </mesh>
        </>
    )
}