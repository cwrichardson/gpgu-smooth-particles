'use client';

import { useContext, useEffect, useRef } from 'react';

import { ScratchpadContext } from '@/utils/scratch-pad-context';
import Image from 'next/image';

export function ScratchPad({imageUrl, width = 32, height = 32, name}) {
    const canvasRef = useRef();
    const imageRef = useRef();

    const { scratchPads, setScratchPads } = useContext(ScratchpadContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) return;
        
        const ctx = canvas.getContext('2d');
        if (ctx === null) return;
        
        canvas.width = width;
        canvas.height = height;
        
        const img = imageRef.current;
        if (img === null) return;
        
        ctx.drawImage(img, 0, 0, width, height);

        const data = ctx.getImageData(0, 0, width, height);

        setScratchPads({
            ...scratchPads,
            [name]: { data }
        });
    }, [canvasRef, imageRef])

    return (
        <>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ display: 'none' }}
            />
            <Image
                ref={imageRef}
                src={imageUrl}
                width={width}
                height={height}
                alt={''}
                priority={true}
                style={{ display: 'none' }}
            />
        </>
    )
}