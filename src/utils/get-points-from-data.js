import PoissonDiskSampling from 'poisson-disk-sampling';

export function getPointsFromData(imageData) {
    const pds = new PoissonDiskSampling({
        // shape: [imageData.width, imageData.height],
        shape: [1,1],
        // minDistance: 1.1,
        minDistance: 2 / 400,
        // maxDistance: 55,
        maxDistance: 10 / 400,
        tries: 20,
        // tries: 4,
        distanceFunction: function (point) {
            // points are all from 0–1, so we multiply to get back to index
            // values for the original image data
            const indX = Math.floor(point[0] * imageData.width);
            const indY = Math.floor(point[1] * imageData.height);

            // get the index of the red pixel value for the given coordinates (point)
            /** @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas#the_imagedata_object */
            // +1 for g, +2 for b, +3 for ⍺
            const pixelRedIndex = indX * 4 + indY * (imageData.width * 4);

            // map the value to 0-1 and apply Math.pow for flavor
            return Math.pow(imageData.data[pixelRedIndex] / 255, 2.7);
        }
    })

    let points = pds.fill();

    // probably just chopping off the end isn't right, but ...
    points.sort((a,b) => (Math.random() - 0.5))
    points = points.slice(0, imageData.width * imageData.height);

    // with our final points, get the indexes again, and add a 3rd value
    points = points.map((point) => {
        const indX = Math.floor(point[0] * imageData.width);
        const indY = Math.floor(point[1] * imageData.height);

        const pixelRedIndex = indX * 4 + indY * (imageData.width * 4);
        const redColor = imageData.data[pixelRedIndex] / 255;

        return [ point[0], point[1], redColor];
    })

    return points;

    /**
     * This is the linear way to do it. For future reference.
     */
    // const points = [];
    // const data = imageData.data;

    // for (let i = 0, il = data.length; i < il; i += 4) {
    //     const r = data[i];
    //     const g = data[i + 1];
    //     const b = data[i + 2];
    //     const a = data[i + 3];

    //     // Check for transparency or a specific color threshold
    //     if (a > 0) { // || (r > 128 && g < 128 && b < 128)) { 
    //         const x = (i / 4) % imageData.width;
    //         const y = Math.floor((i / 4) / imageData.width);
    
    //         points.push(new THREE.Vector3(x, y, 0));
    //     }
    // }

}