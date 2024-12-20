# FBO Flip-Flop Technique
Here's a starting point for using the so-called "flip-flop" technique of rendering into one FBO, and reading from another; then flip-flopping from/to which you're reading/writing on each frame. This works fine; however, it doesn't work once a second variable (i.e., pair of render targets) is added.

To see the problem, switch to the branch "`fbo-flip-flop-2-var`".