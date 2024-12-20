import { DataTexture, FloatType, RGBAFormat } from 'three';

export function createDataTexture(sizeX, sizeY) {
    const data = new Float32Array(sizeX * sizeY * 4);
    const texture = new DataTexture(data, sizeX, sizeY, RGBAFormat, FloatType);
    texture.needsUpdate = true;
    return texture;
}