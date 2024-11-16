import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { Vector4 } from 'three';

import { fboPassthroughVertex } from '@/glsl/fboPassthroughVertex';
import { fragmentShaderVelocity } from '@/glsl/fragmentShaderVelocity';

const VelocityMaterial = shaderMaterial({
    time: 0
}, fboPassthroughVertex, fragmentShaderVelocity);
extend({ VelocityMaterial });

/**
 * Extend shader material with custom uniforms
 */
export function FboVelocityMaterial() {
    return (
        <velocityMaterial
            key={VelocityMaterial.key}
            time={0}
            depthTest={false}
        />
    )
}