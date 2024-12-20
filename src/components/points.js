'use client';

import { forwardRef, useEffect } from 'react';
import { extend } from '@react-three/fiber';
import { PerspectiveCamera, shaderMaterial } from '@react-three/drei';

import { vertex } from '@/glsl/vertex';
import { fragment } from '@/glsl/fragment';

const CustomPointsMaterial = shaderMaterial({
    uPositions: null
}, vertex, fragment);
extend({ CustomPointsMaterial });

export const Points = forwardRef((props, ref) => {
    const { initPositions, referenceCoords, ...rest } = props;

    return (
        <>
            <points ref={ref} {...rest}>
                <bufferGeometry>
                    <bufferAttribute attach={'attributes-position'} args={[initPositions, 3]} />
                    <bufferAttribute attach={'attributes-referenceCoords'} args={[referenceCoords, 2]} />
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
                position={[0, 0, 1200]} />
        </>
    )
})

Points.displayName = 'Points';