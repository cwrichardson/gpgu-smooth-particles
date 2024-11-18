export const vertex = /* glsl */ `
    uniform sampler2D uPositions;
    uniform float uTime;
    attribute vec2 reference;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec3 pos = texture2D(uPositions, reference).xyz;

        // vec4 mvPosition = modelViewMatrix * vec4( position, 1. );
        // vec4 mvPosition = modelViewMatrix * vec4( reference, 1., 1. );
        vec4 mvPosition = modelViewMatrix * vec4( pos, 1. );
        // start with big particles; give them some perspective
        gl_PointSize = 25. * ( 1. / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
    }
`;