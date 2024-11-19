export const fragmentShaderVelocity = /* glsl */ `
    uniform sampler2D dtPosition;
    uniform sampler2D dtVelocity;
    uniform float time;
    uniform sampler2D uTarget;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;

        // vec3 color = vec3(0.);
        vec4 position = texture2D( dtPosition, uv);
        vec4 velocity = texture2D( dtVelocity, uv);
        vec4 target = texture2D( uTarget, uv);

        // friction
        velocity *= 0.85;
        // return force
        velocity += (target - position) * 2.;

        gl_FragColor = vec4(velocity);

    }
`;