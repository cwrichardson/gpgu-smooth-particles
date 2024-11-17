import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

import { fboPassthroughVertex } from '@/glsl/fboPassthroughVertex';
import { fragmentShaderPosition } from '@/glsl/fragmentShaderPosition';
import { createDataTexture } from '@/utils/create-data-texture';

const PositionMaterial = shaderMaterial({
    dtPosition: null,
    dtVelociy: null,
    time: 0
}, fboPassthroughVertex, fragmentShaderPosition);
extend({ PositionMaterial });

/**
 * Extend shader material with custom uniforms
 */
export function FboPositionMaterial({sizeX, sizeY, ...props}) {
    const dtPosition = createDataTexture(sizeX, sizeY);
    const theArray = dtPosition.image.data;

    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
        theArray[k + 0] = 2 * (Math.random() - 0.5);
        theArray[k + 1] = 2 * (Math.random() - 0.5);
        theArray[k + 2] = 0;
        theArray[k + 3] = 1;
    }

    const resolution = `vec2( ${sizeX.toFixed(1)}, ${sizeY.toFixed(1)})`;

    return (
        <positionMaterial
            key={PositionMaterial.key}
            dtPosition={dtPosition}
            time={0}
            depthTest={false}
            args={[{ defines: { resolution: resolution } }]}
            {...props}
        />
    )
}