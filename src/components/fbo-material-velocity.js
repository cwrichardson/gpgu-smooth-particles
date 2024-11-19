import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

import { fboPassthroughVertex } from '@/glsl/fboPassthroughVertex';
import { fragmentShaderVelocity } from '@/glsl/fragmentShaderVelocity';
import { createDataTexture } from '@/utils/create-data-texture';
import {
    fillPositionTexture,
    fillPositionTextureFromPoints
} from '@/utils/fill-position-texture';

const VelocityMaterial = shaderMaterial({
    dtPosition: null,
    dtVelocity: null,
    time: 0,
    uTarget: null
}, fboPassthroughVertex, fragmentShaderVelocity);
extend({ VelocityMaterial });

/**
 * Extend shader material with custom uniforms
 */
export function FboVelocityMaterial({sizeX, sizeY, points, ...props}) {
    const dtVelocity = createDataTexture(sizeX, sizeY);
    const theArray = dtVelocity.image.data;
    const target1 = createDataTexture(sizeX, sizeY);
    
    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
        theArray[k + 0] = 0.01 * (Math.random() - 0.5);
        theArray[k + 1] = 0.01 * (Math.random() - 0.5);
        theArray[k + 2] = 0;
        theArray[k + 3] = 1;
    }

    // the base filler (without points) is different than the loop above,
    // and is meant for positions, but we can use it here in velociy too.
    if (! Array.isArray(points) || points.length === 0) {
        fillPositionTexture(target1);
    } else {
        fillPositionTextureFromPoints(target1, points);
    }

    const resolution = `vec2( ${sizeX.toFixed(1)}, ${sizeY.toFixed(1)})`;

    return (
        <velocityMaterial
            key={VelocityMaterial.key}
            dtVelocity={dtVelocity}
            time={0}
            uTarget={target1}
            depthTest={false}
            args={[{ defines: { resolution: resolution } }]}
            {...props}
        />
    )
}