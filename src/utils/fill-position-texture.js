export function fillPositionTexture(dataTexture) {
    const theArray = dataTexture.image.data;

    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
        theArray[k + 0] = 2 * (Math.random() - 0.5);
        theArray[k + 1] = 2 * (Math.random() - 0.5);
        theArray[k + 2] = 0;
        theArray[k + 3] = 1;
    }
}

export function fillPositionTextureFromPoints(dataTexture, points) {
    const theArray = dataTexture.image.data;

    for (let k = 0, kl = theArray.length; k < kl; k += 4) {
        const pointIdx = k / 4;
        theArray[k + 0] = 2 * (points[pointIdx][0] - 0.5);
        theArray[k + 1] = -2 * (points[pointIdx][1] - 0.5);
        theArray[k + 2] = 0;
        theArray[k + 3] = points[pointIdx][2];
    }
}