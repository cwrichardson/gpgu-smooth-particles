'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Scene } from 'three';

import { Points } from './points';
import { FboPositionMaterial } from './fbo-material-position';
import { FboVelocityMaterial } from './fbo-material-velocity';

export function TargetWrapper({ targets, count, ...otherProps }) {
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
        for (let i = 0, il = count ** 2; i < il ; i++ ) {
            positions.push(
                450 * (Math.random() - 0.5),
                450 * (Math.random() - 0.5),
                225 * (Math.random() - 0.5),
            );
            reference.push((i % count) / count, Math.trunc( i / count ) / count);
        }

        return [
            new Float32Array(positions),
            new Float32Array(reference)
        ];
    }, [count]);

    const gl = useThree((state) => state.gl);
    useEffect(() => {
        if (!(posRef.current || velRef.current)) return;

        const rts = [0, 1];
        rts.forEach((i) => {
            gl.setRenderTarget(targets.posTarget[i]);
            gl.render(PosScene, fboCamera);
            gl.setRenderTarget(targets.velTarget[i]);
            gl.render(VelScene, fboCamera);

            gl.setRenderTarget(null);
        })
    }, [PosScene, VelScene, fboCamera, gl, posRef, targets])

    let currentTextureIndex = 0;
    let nextTextureIndex;

    useFrame((state) => {
        nextTextureIndex = currentTextureIndex === 0 ? 1 : 0;

        // update position and velocity for next frame
        posRef.current.material.dtPosition = targets.posTarget[currentTextureIndex].texture;
        // posRef.current.material.dtVelocity = targets.velTarget[currentTextureIndex].texture;

        // do the GPGPU position calculations
        state.gl.setRenderTarget(targets.posTarget[nextTextureIndex]);
        state.gl.render(PosScene, fboCamera);
        state.gl.setRenderTarget(targets.velTarget[nextTextureIndex]);
        state.gl.render(VelScene, fboCamera);
        
        // return rendering to the main target
        state.gl.setRenderTarget(null);
        
        // update main positions
        mainRef.current.material.uPositions = targets.posTarget[currentTextureIndex].texture;
        
        currentTextureIndex = nextTextureIndex;
    });

    return (
        <>
            {/* Calculate position texture in FBO */}
            {createPortal(
                <mesh ref={posRef}>
                    <FboPositionMaterial
                        size={count}
                        initPoints={positions}
                    />
                    <bufferGeometry>
                        <bufferAttribute
                            attach={'attributes-position'}
                            count={6}
                            array={new Float32Array([
                                -1,-1,0,  1,-1,0,  1,1,0,
                                -1,-1, 0, 1, 1, 0, -1,1,0
                            ])}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach={'attributes-uv'}
                            count={6}
                            array={new Float32Array([
                                0,1, 1,1, 1,0,
                                0,1, 1,0, 0,0
                            ])}
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
                        size={count}
                        initPoints={positions}
                    />
                    <bufferGeometry>
                        <bufferAttribute
                            attach={'attributes-position'}
                            count={6}
                            array={new Float32Array([
                                -1,-1,0,  1,-1,0,  1,1,0,
                                -1,-1, 0, 1, 1, 0, -1,1,0
                            ])}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach={'attributes-uv'}
                            count={6}
                            array={new Float32Array([
                                0,1, 1,1, 1,0,
                                0,1, 1,0, 0,0
                            ])}
                            itemSize={2}
                        />
                    </bufferGeometry>
                </mesh>
            , VelScene
            )}
            {/* The results of which are forwarded into the output display */}
            <Points
                ref={mainRef}
                initPositions={positions}
                referenceCoords={reference}
                xSize={256}
                ySize={256}
                {...otherProps}
            />
        </>
    )
}