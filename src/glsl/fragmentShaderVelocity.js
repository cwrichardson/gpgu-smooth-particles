export const fragmentShaderVelocity = /* glsl */ `
    uniform sampler2D dtPosition;
    uniform sampler2D uDestination;
    varying vec2 vUv;

    void main() {
        vec4 position = texture2D(dtPosition, vUv);
        vec4 destination = texture2D(uDestination, vUv);
        vec4 velocity = (destination - position);
        gl_FragColor = velocity;
    }
`;