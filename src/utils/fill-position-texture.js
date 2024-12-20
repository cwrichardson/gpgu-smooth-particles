export function fillPositionTexture(dataTexture) {
    const theArray = dataTexture.image.data;

    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
        theArray[k + 0] = 0;
        theArray[k + 1] = 0;
        theArray[k + 2] = 1;
        theArray[k + 3] = 1;
    }
}

export function fillPositionTextureFromPoints(dataTexture, points) {
    const theArray = dataTexture.image.data;
    const { width: texWidth, height: texHeight } = dataTexture.image;

    /**
     * Points are from upper-left to lower-right of the sampled image, at
     * that resolution (dataTexture.image.[width|height]. We want to map
     * those values to our original "positions" range, which runs from
     * lower-left to upper-right.
     * 
     * So, for example, if our width and height are 128 and 64, respectively,
     * the sampled data in `points` might go from 
     * [74.2, 3.6] to [127.7, 60.9], where the first point is somewhere
     * near the top middle, and the last point is near the bottom right.
     * Whereas theArray has 128 * 64 * 4 entries, representing [0,0,0,0] in
     * the lower left to [128, 64, 0, 0] for the upper right.
     * 
     * We need to map this.
     */

    for (let k = 0, kl = points.length; k < kl; k++) {
        const texIdx = k * 4;
        theArray[texIdx + 0] = (points[k][0] / texWidth);
        theArray[texIdx + 1] = (points[k][1] / texHeight);
        theArray[texIdx + 2] = 0;
        theArray[texIdx + 3] = points[k][2];
    }

    // let ptIdx = 0;
    // let ptX, ptY;
    // let oldPtX, oldPtY;

    // // loop y from bottom left to top right of theArray
    // for (let y = 0; y < texHeight; y++) {
    //     for (let x = 0; x < texWidth; x++) {
    //         const invY = (texHeight - 1) - y;
    //         const texIdx = ((invY * texWidth) + x) * 4;

    //         // if we're out of points, just keep filling with 0s
    //         if (ptIdx === null) {
    //             theArray[texIdx + 0] = 0;
    //             theArray[texIdx + 1] = 0;
    //             theArray[texIdx + 2] = 0;
    //             theArray[texIdx + 3] = 0;
    //             continue;
    //         }

    //         ptX = Math.floor(points[ptIdx][0]);
    //         ptY = Math.floor(points[ptIdx][1]);
            
    //         // skip duplicates
    //         if (oldPtX) {
    //             while(ptX === oldPtX && ptY === oldPtY && ptIdx < points.length) {
    //                 ptIdx++;
    //                 ptX = Math.floor(points[ptIdx][0]);
    //                 ptY = Math.floor(points[ptIdx][1]);
    //             }
    //         }
            
    //         // if the points match the index, we need to put it in theArray,
    //         // but invert the y.
    //         if (ptY === y && ptX === x) {
    //             theArray[texIdx + 0] = (ptX / texWidth);
    //             theArray[texIdx + 1] = (ptY / texHeight);
    //             theArray[texIdx + 2] = 0;
    //             theArray[texIdx + 3] = points[ptIdx][2];

    //             // still have points?
    //             (ptIdx < (points.length - 1)) ? ptIdx++ : ptIdx = null;

    //             oldPtX = ptX;
    //             oldPtY = ptY;
    //         // otherwise fill with 0s
    //         } else {
    //             theArray[texIdx + 0] = 0;
    //             theArray[texIdx + 1] = 0;
    //             theArray[texIdx + 2] = 0;
    //             theArray[texIdx + 3] = 0;
    //         }
    //     }
    // }
    
    // for (let k = 0, kl = theArray.length; k < kl; k += 4) {
    //     const pointIdx = k / 4;
    //     if (pointIdx >= points.length) {
    //         theArray[k + 0] = 0;
    //         theArray[k + 1] = 0;
    //         theArray[k + 2] = 0;
    //         theArray[k + 3] = 0;
    //     } else {
    //         theArray[k + 0] = 5 * (points[pointIdx][0] / dataTexture.image.width - 0.5);
    //         theArray[k + 1] = -5 * (points[pointIdx][1] / dataTexture.image.height - 0.5);
    //         theArray[k + 2] = 0;
    //         theArray[k + 3] = points[pointIdx][2];
    //     }
    // }
}