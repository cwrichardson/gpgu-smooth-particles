export const fragmentShaderVelocity = /* glsl */ `
    uniform sampler2D dtPosition;
    uniform sampler2D dtVelocity;
    uniform float time;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;

        // vec3 color = vec3(0.);
        vec3 position = texture2D( dtPosition, uv).xyz;
        vec3 velocity = texture2D( dtVelocity, uv).xyz;

        gl_FragColor = vec4(velocity, 1.0);

    }
`;