'use client';

import { useFBO } from '@react-three/drei';
import { FloatType, NearestFilter, RepeatWrapping, RGBAFormat } from 'three';

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

    const posTarget = [];
    const velTarget = [];

    posTarget[0] = useFBO(count, count, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        type: FloatType,
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping
    });

    posTarget[1] = useFBO(count, count, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        type: FloatType,
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping
    });

    velTarget[0] = useFBO(count, count, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        type: FloatType,
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping
    });

    velTarget[1] = useFBO(count, count, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
        type: FloatType,
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping
    });

    return (<TargetWrapper
        targets={{ posTarget, velTarget }}
        count={count}
        {...restProps} 
    />)
}