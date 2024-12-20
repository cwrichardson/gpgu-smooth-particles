export const fragment = /* glsl */ `
    varying vec2 vUv;

    void main() {
        float opacity = 1.0;
        float d = distance(gl_PointCoord, vec2(0.5, 0.5));
        vec3 color = vec3(0.2);
        opacity = 1. - d * 2.;

        gl_FragColor = vec4(color, opacity);

        // #include tonemapping_fragment
        #if defined( TONE_MAPPING )
            gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
        #endif

        // #include colorspace_fragment
        gl_FragColor = linearToOutputTexel( gl_FragColor );
    }
`;