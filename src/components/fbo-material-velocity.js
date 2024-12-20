import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

import { createDataTexture } from '@/utils/create-data-texture';
import { fillDataTextureFromPoints } from '@/utils/fill-data-texture';
import { fboPassthroughVertex } from '@/glsl/fboPassthroughVertex';
import { fragmentShaderVelocity } from '@/glsl/fragmentShaderVelocity';

const VelocityMaterial = shaderMaterial({
    dtPosition: null,
    uDestination: null
}, fboPassthroughVertex, fragmentShaderVelocity);
extend({ VelocityMaterial });

/**
 * Extend shader material with custom uniforms
 */
export function FboVelocityMaterial(props) {
    const {size, initPoints, ...rest} = props;
    const dtPosition = createDataTexture(size, size);
    const uDestination = createDataTexture(size, size);

    // create initial state
    fillDataTextureFromPoints(dtPosition, initPoints);
    fillDataTextureFromPoints(uDestination, initPoints);

    return (
        <velocityMaterial
            key={VelocityMaterial.key}
            dtPosition={dtPosition}
            uDestination={uDestination}
            depthTest={false}
            {...rest}
        />
    )
}