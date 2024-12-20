export const vertex = /* glsl */ `  
    uniform sampler2D uPositions;
    uniform float uTime;
    attribute vec2 referenceCoords;
    varying vec2 vUv;

    void main() {
        vUv = uv;

        // set up initial positions
        vec4 texData = texture2D(uPositions, referenceCoords);
        
        vec3 pos = texData.xyz;
        vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

        gl_PointSize = (50.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;