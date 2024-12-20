import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

import { createDataTexture } from '@/utils/create-data-texture';
import { fillDataTextureFromPoints } from '@/utils/fill-data-texture';
import { fboPassthroughVertex } from '@/glsl/fboPassthroughVertex';
import { fragmentShaderPosition } from '@/glsl/fragmentShaderPosition';

const PositionMaterial = shaderMaterial({
    dtPosition: null
}, fboPassthroughVertex, fragmentShaderPosition);
extend({ PositionMaterial });

/**
 * Extend shader material with custom uniforms
 */
export function FboPositionMaterial(props) {
    const {size, initPoints, ...rest} = props;
    const dtPosition = createDataTexture(size, size);

    // create initial state
    fillDataTextureFromPoints(dtPosition, initPoints);    

    return (
        <positionMaterial
            key={PositionMaterial.key}
            dtPosition={dtPosition}
            depthTest={false}
            {...rest}
        />
    )
}