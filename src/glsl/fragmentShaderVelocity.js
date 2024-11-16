export const fragmentShaderVelocity = /* glsl */ `
    uniform float time;

    void main() {

        vec3 color = vec3(0.);

        gl_FragColor = vec4(color, 1.);

    }
`;