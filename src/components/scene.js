'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';

import { css } from 'styled-system/css';
import { splitCssProps } from 'styled-system/jsx';
import { r3f } from '@/utils/r3f';
import { ScratchpadProvider } from '@/utils/scratch-pad-context';
import { Scratchpad } from '@/components/scratch-pad';

const fallbackRenderer = ({ error }) => {
    console.error('Error rendering animation canvas', error.message);
    console.debug(error);

    return null;
}

/**
 * Panda version of r3f Canvas.
 * Style and ClassName are passed to a `div` container it creates. Other
 * properties and general documenation is best found here:
 * @see https://gracious-keller-98ef35.netlify.app/docs/api/canvas/
 *
 * @param {*} props 
 * @returns 
 */
export function Scene(props) {
    const [ cssProps, canvasProps ] = splitCssProps(props);
    const { css: containerCssProps, ...containerStyleProps } = cssProps;

    const classes = css(containerStyleProps, containerCssProps);

    /**
     * R3F annoying sets some inline style attributes on the containing `div`
     * that are not documented anywhere. We handle the equivalent with panda,
     * so we need to unset them.
     */

    const styleReset = {
        position: undefined,
        width: undefined,
        height: undefined,
        overflow: undefined,
        pointerEvents: undefined,
        ...canvasProps?.style
    };

    return (
        <ScratchpadProvider>
            <ErrorBoundary fallbackRender={fallbackRenderer}>
                <Canvas
                    className={classes}
                    style={styleReset}
                    {...canvasProps}
                >
                    <r3f.Out />
                    <Preload all />
                </Canvas>
            </ErrorBoundary>
            <Scratchpad imageUrl={'/bird.jpg'} name={'sp1'} width={128} height={64} />
            <Scratchpad imageUrl={'/yin_yang.png'} name={'sp2'} width={128} height={64} />
        </ScratchpadProvider>
    )
}