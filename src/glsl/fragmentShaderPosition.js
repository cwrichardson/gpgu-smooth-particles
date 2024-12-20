export const fragmentShaderPosition = /* glsl */ `
    uniform sampler2D dtPosition;
    varying vec2 vUv;

    void main() {
        vec4 position = texture2D(dtPosition, vUv);
        gl_FragColor = position;
    }
`;