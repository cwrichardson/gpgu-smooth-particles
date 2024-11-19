import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

import { fboPassthroughVertex } from '@/glsl/fboPassthroughVertex';
import { fragmentShaderPosition } from '@/glsl/fragmentShaderPosition';
import { createDataTexture } from '@/utils/create-data-texture';
import {
    fillPositionTexture,
    fillPositionTextureFromPoints
} from '@/utils/fill-position-texture';

const PositionMaterial = shaderMaterial({
    dtPosition: null,
    dtPosition1: null,
    dtVelocity: null,
    time: 0
}, fboPassthroughVertex, fragmentShaderPosition);
extend({ PositionMaterial });

/**
 * Extend shader material with custom uniforms
 */
export function FboPositionMaterial(props) {
    const {sizeX, sizeY, points, points2, ...rest} = props;
    const dtPosition = createDataTexture(sizeX, sizeY);
    const dtPosition1 = createDataTexture(sizeX, sizeY);
    const target2 = createDataTexture(sizeX, sizeY);

    if (! Array.isArray(points) || points.length === 0) {
        fillPositionTexture(dtPosition);
    } else {
        fillPositionTextureFromPoints(dtPosition, points);
    }

    if (! Array.isArray(points2) || points2.length === 0) {
        fillPositionTexture(dtPosition1);
        fillPositionTexture(target2);
    } else {
        fillPositionTextureFromPoints(dtPosition1, points2);
        fillPositionTextureFromPoints(target2, points2);
    }


    const resolution = `vec2( ${sizeX.toFixed(1)}, ${sizeY.toFixed(1)})`;

    return (
        <positionMaterial
            key={PositionMaterial.key}
            dtPosition={dtPosition}
            dtPosition1={dtPosition1}
            time={0}
            depthTest={false}
            args={[{ defines: { resolution: resolution } }]}
            {...rest}
        />
    )
}