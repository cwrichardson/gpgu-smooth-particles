import { DataTexture, FloatType, RGBAFormat } from 'three';
import { fillPositionTexture } from './fill-position-texture';

export function createDataTexture(sizeX, sizeY) {
    const data = new Float32Array(sizeX * sizeY * 4);
    const texture = new DataTexture(data, sizeX, sizeY, RGBAFormat, FloatType);
    fillPositionTexture(texture);
    texture.needsUpdate = true;
    return texture;
}