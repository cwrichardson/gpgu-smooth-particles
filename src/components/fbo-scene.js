'use client';

import { useFBO } from '@react-three/drei';
import { NearestFilter, RepeatWrapping, RGBAFormat } from 'three';

import { TargetWrapper } from '@/components/target-wrapper';

/**
 * Create two FBOs for doing GPGPU calculations and pass the generated
 * targets through to the TargetWrapper.
 * 
 * @param {*} props 
 * @param {number=32} props.count how many points on each side (total points
 *      is this squared)
 */
export function FboScene(props) {
    const { count = 32, ...restProps } = props;

    const posTarget = useFBO(count, count, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping
    });

    const velTarget = useFBO(count, count, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping
    });

    return (<TargetWrapper
        targets={{ posTarget, velTarget }}
        count={count}
        {...restProps} 
    />)
}