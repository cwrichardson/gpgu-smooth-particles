export const fragment = /* glsl */ `
    varying float vBigBlue;
    varying float vShade;
    varying vec2 vUv;

    void main() {
        if (vBigBlue >= 0.10) discard;
        // color of not-quite black
        vec3 color = vec3(0.2);

        // get distance (0 – 0.5), and 2x to get 0–1
        // float d = length(gl_PointCoord.xy - 0.5) * 2.0;
        // but then invert it and call it alpha
        float alpha = 1. - length(gl_PointCoord.xy - 0.5) * 2.0;

        // add a few alphas together to make a combined gradient for the point
        float finalAlpha = alpha * 0.05 + smoothstep(0., 1., alpha) * 0.1
            + smoothstep(0.9 - fwidth(alpha), 0.9, alpha) * 0.5;

        float opac = 1. - (0.3 + 0.7 * vShade);

        gl_FragColor = vec4(color, finalAlpha * opac);
    }
`;