export function fillDataTextureFromPoints(dataTexture, points) {
    const theArray = dataTexture.image.data;

    for (let k = 0, kl = points.length / 3; k < kl; k++) {
        const texIdx = k * 4;
        const ptIdx = k * 3;
        theArray[texIdx + 0] = points[ptIdx];
        theArray[texIdx + 1] = points[ptIdx + 1];
        theArray[texIdx + 2] = points[ptIdx + 2];
        theArray[texIdx + 3] = 1;
    }
}