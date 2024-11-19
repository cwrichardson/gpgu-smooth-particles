import { CNOISE } from '@/glsl/noise';
import { HASH43 } from '@/glsl/hash43';

export const fragmentShaderPosition = CNOISE + HASH43 + /* glsl */ `
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

        position.xyz += velocity.xyz * 1./60.;

        vec4 rands = hash43(vec3(uv * 5., 0.));

        position.xyz += curl(vec3(position.xy, rands.x), time, 0.1) * 0.01;

        gl_FragColor = vec4(position + velocity * 0., 1.);

        // gl_FragColor = vec4(color, 1.);
    }
`;