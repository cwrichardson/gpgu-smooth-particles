'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Scene } from 'three';

import { useScratchpads } from '@/utils/scratch-pad-context';
import { Points } from './points';
import { FboPositionMaterial } from './fbo-material-position';
import { FboVelocityMaterial } from './fbo-material-velocity';
import { Debug } from './debug-model';
import { getPointsFromData } from '@/utils/get-points-from-data';
import { createDataTexture } from '@/utils/create-data-texture';
import { fillPositionTextureFromPoints } from '@/utils/fill-position-texture';

/**
 * Main component. Creates two portals (one for position and velocity),
 * which separate state for doing the GPGPU calculations to the
 * passed in targets, the outcome of which is then passed as a 
 * texture to the Points geometry.
 * 
 * @param {*} param0
 * @param {Object} param0.targets an object where each entry is an FBO target
 * @param {number} param0.count the size of one axis of the square
 * 
 */
export function TargetWrapper({ targets, width, height, ...otherProps }) {
    const length = width * height;

    const posRef = useRef();
    const velRef = useRef();
    const mainRef = useRef();

    const fboCamera = useMemo(() => {
        // dividing by 4 instead of 2, because scratchpads are 1/2 the size of the final
        // model
        const camera = new OrthographicCamera(-width/4, width/4, height/4, -height/4, 0, 1);
        return camera;
    }, [height, width]);

    const PosScene = useMemo(() => {
        const scene = new Scene();
        return scene;
    }, []);

    const VelScene = useMemo(() => {
        const scene = new Scene();
        return scene;
    }, []);

    const [ positions, reference ] = useMemo(() => {
        const positions = [];
        const reference = [];
        for (let i = 0; i < length ; i++ ) {
            positions.push(
                5 * (Math.random() - 0.5),
                5 * (Math.random() - 0.5),
                0
            );
            /**
             * As Yuri says in the video, they do this with some voodoo:
             * reference.push((i % count) / count, ~ ~ ( i / count ) / count);
             * 
             * For an explanation of the voodoo, @see
             * https://stackoverflow.com/questions/4055633/what-does-double-tilde-do-in-javascript
             * 
             * But it's replaced by Math.trunc() like a decade ago
             * (ECMAScript 6).
             */
            reference.push((i % width) / width, Math.trunc( i / width ) / height);
        }

        return [
            new Float32Array(positions),
            new Float32Array(reference)
        ];
    }, [height, length, width]);

    const scratchpads = useScratchpads();
    const [ points, setPoints ] = useState([]);
    const [ points2, setPoints2 ] = useState([]);

    /**
     * The data object returned from the scratchpads context is
     * an `ImageData` `data` property, which is a one-dimensional
     * Uint8ClampedArray in RGBA order, where each set of 4 entries
     * represents a pixel in the original image, going in rows
     * from top left to bottom right.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageData
     * 
     * The returned points is an array of 3-dimensional arrays
     * (e.g., [[a, b, c], [d, e, f], ...]) where a and b are the x,y
     * coordinates of the sampled image from upper left to lower right,
     * and c is the red color from 0-1 of that pixel.
     */
    useEffect(() => {
        if (scratchpads['sp1']) {
            const points = getPointsFromData(scratchpads['sp1'].data);
            setPoints(points);
        }

        if (scratchpads['sp2']) {
            const points2 = getPointsFromData(scratchpads['sp2'].data);
            setPoints2(points2);
        }
    }, [scratchpads]);

    const target1 = useMemo(() => {
        if (points.length === 0) return null;

        const t = createDataTexture(width, height);
        fillPositionTextureFromPoints(t, points);

        return t;
    }, [width, height, points]);

    const target2 = useMemo(() => {
        if (points2.length === 0) return null;

        const t = createDataTexture(width, height);
        fillPositionTextureFromPoints(t, points2);

        return t;
    }, [width, height, points2]);

    let modulo = 0;
    const handleClick = (e) => {
        e.stopPropagation();
        if (modulo === 0) {
            velRef.current.material.uTarget = target2;
            modulo = 1;
        } else {
            velRef.current.material.uTarget = target1;
            modulo = 0;
        }
    }

    let currentTextureIndex = 0;
    let nextTextureIndex;

    useFrame((state, delta, xrFrame) => {
        nextTextureIndex = currentTextureIndex === 0 ? 1 : 0;

        posRef.current.material.time += delta;
        velRef.current.material.time += delta;

        // do the GPGPU position calculations
        state.gl.setRenderTarget(targets.posTarget[currentTextureIndex]);
        state.gl.render(PosScene, fboCamera);
                
        // do the GPGPU velocity calculations
        state.gl.setRenderTarget(targets.velTarget[currentTextureIndex]);
        state.gl.render(VelScene, fboCamera);
        
        // return rendering to the main target
        state.gl.setRenderTarget(null);
        
        // update main positions
        /**
         * The uPositions is mapped as `pos = texture2D(uPositions, reference)`
         * in the vertex shader. That is, for each `reference` coordnate (from
         * the original [ positions, reference ]), that texel is sampled from
         * the new `uPositions`, and becomes a position. So, (r, g, b, a) at
         * coord [x,y] in `uPositions` becomes `vec4(x, y, z, w)` in the main
         * material.
         */
        mainRef.current.material.uPositions = targets.posTarget[currentTextureIndex].texture;
        
        // pass the positions

        // velRef.current.material.dtPosition = targets.posTarget.texture;
        
        // update position and velocity for next frame
        posRef.current.material.dtPosition = targets.posTarget[currentTextureIndex].texture;
        velRef.current.material.dtPosition = targets.posTarget[currentTextureIndex].texture;
        posRef.current.material.dtVelocity = targets.velTarget[currentTextureIndex].texture;
        velRef.current.material.dtVelocity = targets.velTarget[currentTextureIndex].texture;

        currentTextureIndex = nextTextureIndex;
    });

    return (
        <>
            {/* Calculate position texture in FBO */}
            {createPortal(
                <mesh ref={posRef}>
                    <FboPositionMaterial
                        sizeX={width}
                        sizeY={height}
                        points={points}
                        points2={points2}
                    />
                    <bufferGeometry>
                        <bufferAttribute
                            attach={'attributes-position'}
                            count={positions.length / 3}
                            array={positions}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach={'attributes-uv'}
                            count={reference / 2}
                            array={reference}
                            itemSize={2}
                        />
                    </bufferGeometry>
                </mesh>
            , PosScene
            )}
            {/* Calculate velocity texture in FBO */}
            {createPortal(
                <mesh ref={velRef}>
                    <FboVelocityMaterial
                        sizeX={width}
                        sizeY={height}
                        points={points}
                        uTarget={target1}
                    />
                    <bufferGeometry>
                        <bufferAttribute
                            attach={'attributes-position'}
                            count={positions.length / 3}
                            array={positions}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach={'attributes-uv'}
                            count={reference / 2}
                            array={reference}
                            itemSize={2}
                        />
                    </bufferGeometry>
                </mesh>
            , VelScene
            )}
            {/* The results of which are forwarded into the output display */}
            <Points
                ref={mainRef}
                vertices={positions}
                positions={reference}
                onClick={(e) => handleClick(e)}
                {...otherProps}
            />
            <Debug fboTarget={targets.posTarget[Math.ceil(currentTextureIndex / 2)]} x={-1.5} />
            <Debug fboTarget={targets.velTarget[Math.ceil(currentTextureIndex / 2)]} x={1.5} />

        </>
    )
}