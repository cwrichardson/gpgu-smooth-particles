'use client';

import { useMemo, useRef } from 'react';
import { createPortal, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Scene } from 'three';

import { Points } from './points';
import { FboPositionMaterial } from './fbo-material-position';
import { FboVelocityMaterial } from './fbo-material-velocity';

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
export function TargetWrapper({ targets, count, ...otherProps }) {
    const length = count**2;

    const posRef = useRef();
    const velRef = useRef();
    const mainRef = useRef();

    const fboCamera = useMemo(() => {
        const camera = new OrthographicCamera(-1, 1, 1, -1, 1, 0, 1);
        return camera;
    }, []);

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
                5 * Math.random() - 0.5,
                5 * Math.random() - 0.5,
                0
            );
            reference.push((i % length) / length, ~ ~ ( i / length ) / length);
        }

        return [
            new Float32Array(positions),
            new Float32Array(reference)
        ];
    }, [length]);

    useFrame((state) => {
        // if (fboModelRef.current.camera) {
        //     state.gl.setRenderTarget(target);
        //     state.gl.render(FBOScene, fboModelRef.current.camera);
        //     state.gl.setRenderTarget(null);
        // }
        // mainRef.current.mesh.material.uFBO = target.texture;
    });

    return (
        <>
            {/* Calculate position texture in FBO */}
            {createPortal(
                <mesh ref={posRef}>
                    <FboPositionMaterial />
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
                    <FboVelocityMaterial />
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
                {...otherProps}
            />
        </>
    )
}