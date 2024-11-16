import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

import { fboPassthroughVertex } from '@/glsl/fboPassthroughVertex';
import { fragmentShaderPosition } from '@/glsl/fragmentShaderPosition';

const PositionMaterial = shaderMaterial({
    time: 0
}, fboPassthroughVertex, fragmentShaderPosition);
extend({ PositionMaterial });

/**
 * Extend shader material with custom uniforms
 */
export function FboPositionMaterial() {
    return (
        <positionMaterial
            key={PositionMaterial.key}
            time={0}
            depthTest={false}
        />
    )
}