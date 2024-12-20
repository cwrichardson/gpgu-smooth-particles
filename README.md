# 2 Variable Flip-Flop Problem
Checking out the branch "double-render-fbo-flip-flop" shows this technique minimally working with a single variable (position) flip-flopping between two render targets.

This branch adds a 2nd variable (velocity), but does basically nothing with it ... and it no longer works, given the warning "`GL_INVALID_OPERATION: Feedback loop formed between Framebuffer and active Texture.`"

## Where to start
There's some extra code in here to make everything work in a NextJS environment, but you can jump to the meat of things at [./src/components/fbo-scene.js], and from there, [./src/components/target-wrapper.js].