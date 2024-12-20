import { CNOISE } from '@/glsl/noise';
import { HASH43 } from '@/glsl/hash43';

export const fragmentShaderPosition = CNOISE + HASH43 + /* glsl */ `
    uniform sampler2D dtPosition;
    uniform sampler2D dtPosition1;
    uniform sampler2D dtVelocity;
    uniform float time;

    void main() {
        float uTime = time * 0.2;
        // we never pass uv in the original construction of the material,
        // since we're just doing a pass-through in the vertex shader. So,
        // rather than pass that (non-existent) as a vUv varying, we
        // calculate it here.
        vec2 uv = gl_FragCoord.xy / resolution.xy;

        // vec4 tmpPos = texture2D(dtPosition, uv);
        // vec3 position = tmpPos.xyz;
        vec4 position = texture2D(dtPosition, uv);
        vec4 velocity = texture2D(dtVelocity, uv);

        position += velocity * 1./120.;

        vec4 rands = hash43(vec3(uv * 10., 0.));

        position.xyz += curl(vec3(position.xy, rands.x), uTime * mix(0.3, 0.7, rands.y), 0.1) * 0.001 * smoothstep(0.3, 0.9, rands.z);

        gl_FragColor = vec4(position.xyz, position.w);

        // gl_FragColor = vec4(color, 1.);
    }
`;