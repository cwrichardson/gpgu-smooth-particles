export const fboPassthroughVertex = /* glsl */ `

    // transform -> position, scale, rotation
    // modelMatrix -> position, scale, rotation of model
    // viewMatrix -> position, orientatioin of camera
    // projectionMatrix -> project object onto the screen (aspect ratio, perspective)

    void main() {
        gl_Position = vec4( position, 1.0 );
    }
`;