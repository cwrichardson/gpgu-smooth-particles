export const vertex = /* glsl */ `
    uniform float uProgress;
    uniform float uTime;
    attribute vec2 reference;
    varying vec2 vUv;

    void main() {
        vUv = reference;

        vec4 mvPosition = uProgress * modelViewMatrix * vec4( position, 1. );
        // start with big particles; give them some perspective
        gl_PointSize = 25. * ( 1. / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
    }
`;