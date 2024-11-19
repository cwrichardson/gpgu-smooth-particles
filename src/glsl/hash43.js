/**
 * hash43
 * @see https://gist.github.com/shiyuugohirao/fd433dc890f9f3cc179880ce431cde76
 *  
 */
export const HASH43 = /* glsl */ `
    vec4 hash43(vec3 p) {
        vec4 p4 = fract(vec4(p.xyzx) * vec4(.1031, .1030, .0973, .1099));
        p4 += dot(p4, p4.wzxy + 33.33);
        return fract((p4.xxyz + p4.yzzw) * p4.zywx);
    }
`