'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FboScene } from './fbo-scene';

const View = dynamic(() => import('src/components/view')
    .then((mod) => mod.View), {
        ssr: false
    }
);

export function Model(props) {
    return (
        <View orbit {...props}>
            <Suspense fallback={null}>
                <FboScene count={256} />
            </Suspense>
        </View>
    )
}