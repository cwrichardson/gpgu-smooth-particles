export const fragmentShaderVelocity = /* glsl */ `
    uniform sampler2D dtPosition;
    uniform sampler2D dtVelocity;
    uniform float time;
    uniform sampler2D uTarget;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;

        // vec3 color = vec3(0.);
        vec3 position = texture2D( dtPosition, uv).xyz;
        vec3 velocity = texture2D( dtVelocity, uv).xyz;
        vec3 target = texture2D( uTarget, uv).xyz;

        // friction
        velocity *= 0.85;
        // return force
        velocity += (target - position) * 2.;

        gl_FragColor = vec4(velocity, 1.0);

    }
`;