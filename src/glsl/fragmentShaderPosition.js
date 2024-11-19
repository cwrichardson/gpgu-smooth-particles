export const fragmentShaderPosition = /* glsl */ `
    uniform sampler2D dtPosition;
    uniform sampler2D dtPosition1;
    uniform sampler2D dtVelocity;
    uniform float time;

    void main() {
        // vec3 color = vec3(0.);
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        // vec4 tmpPos = texture2D(dtPosition, uv);
        // vec3 position = tmpPos.xyz;
        vec3 position = texture2D(dtPosition, uv).xyz;
        vec3 velocity = texture2D(dtVelocity, uv).xyz;

        gl_FragColor = vec4(position + velocity * 0., 1.);

        // gl_FragColor = vec4(color, 1.);
    }
`;