import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { Vector4 } from 'three';

import { fboPassthroughVertex } from '@/glsl/fboPassthroughVertex';
import { fragmentShaderVelocity } from '@/glsl/fragmentShaderVelocity';
import { createDataTexture } from '@/utils/create-data-texture';

const VelocityMaterial = shaderMaterial({
    dtPosition: null,
    dtVelocity: null,
    time: 0
}, fboPassthroughVertex, fragmentShaderVelocity);
extend({ VelocityMaterial });

/**
 * Extend shader material with custom uniforms
 */
export function FboVelocityMaterial({sizeX, sizeY, ...props}) {
    const dtVelocity = createDataTexture(sizeX, sizeY);
    const theArray = dtVelocity.image.data;

    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
        theArray[k + 0] = Math.random() - 0.5;
        theArray[k + 1] = Math.random() - 0.5;
        theArray[k + 2] = 0;
        theArray[k + 3] = 1;
    }

    return (
        <velocityMaterial
            key={VelocityMaterial.key}
            dtVelocity={dtVelocity}
            time={0}
            depthTest={false}
            {...props}
        />
    )
}