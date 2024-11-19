'use client';

import { forwardRef } from 'react';
import { extend } from '@react-three/fiber';
import { PerspectiveCamera, shaderMaterial } from '@react-three/drei';

import { vertex } from '@/glsl/vertex';
import { fragment } from '@/glsl/fragment';

const CustomPointsMaterial = shaderMaterial({
    uPositions: null,
    uProgress: 1,
    uTime: 0
}, vertex, fragment);
extend({ CustomPointsMaterial });

export const Points = forwardRef((props, ref) => {
    const { vertices, positions } = props;

    return (
        <>
            <points ref={ref}>
                <bufferGeometry
                    width={1}
                    height={1}
                    widthSegments={1}
                    heightSegments={1}
                >
                    <bufferAttribute attach={'attributes-position'} args={[vertices, 3]} />
                    <bufferAttribute attach={'attributes-reference'} args={[positions, 2]} />
                </bufferGeometry>
                <customPointsMaterial
                    key={CustomPointsMaterial.key}
                    depthTest={false}
                    depthWrite={false}
                    transparent
                />
            </points>
            <PerspectiveCamera
                makeDefault
                near={0.1}
                far={3000}
                position={[0, 0, 5]} />
            {/* <ambientLight intensity={0.5} />
            <directionalLight intensity={0.5} position={[0.5, 0, 0.866]} /> {/* ~60º */}
        </>
    )
})

Points.displayName = 'Points';