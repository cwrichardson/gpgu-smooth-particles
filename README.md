# GPGPU smooth particles
Replication of Yuri Artiukh's YouTube using R3F and Drei in NextJS

Yuri is doing this in pure ThreeJS, and bases his GPGPU function on the
example from [`jsm/misc/GPUComputationRenderer`][2]; however, we have 
access to FBO capabilities in Drei, so use those.

The original example runs two render targets per "variable" and ping-pongs
between them. We set up a [portal][3] for each variable, so we can 
maintain state without doing the "ping pong".

We do this explicitly for the two variables (`position` and `velocity`), but
it could probably be farily-easily genercised.

# References
[Yuri's original Youtube][1]
[Original](https://ddd.live/)

[1]: https://www.youtube.com/live/UnaGGWV3KL4?si=Xngj58e2W2tiRsaM
[2]: https://github.com/mrdoob/three.js/blob/master/examples/jsm/misc/GPUComputationRenderer.js
[3]: https://r3f.docs.pmnd.rs/tutorials/v8-migration-guide#createportal-creates-a-state-enclave