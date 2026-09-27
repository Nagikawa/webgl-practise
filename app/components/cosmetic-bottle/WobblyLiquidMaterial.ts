import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform vec2 uWobble; // wobble value at X and Z direction from GPU

    varying vec2 vUv;
    varying float vElevation;

    void main() {
        vUv = uv;
        vec3 pos = position;
        
        // suppose the height of the cylinder is 2.0 (Y axis from -1.0 to 1.0)
        // we only make the wobble effect on the top half of the cylinder
        float isSurface = smoothstep(0.5, 1.0, pos.y);

        float tilt = (uWobble.x * pos.x + uWobble.y * pos.z);
        float wobbleMagnitude = length(uWobble);
        float wave = sin(pos.x * 6.0 + uTime * 5.0) * cos(pos.z * 6.0 + uTime * 5.0) * wobbleMagnitude * 0.3;
    
        pos.y += (tilt + wave) * isSurface;
        vElevation = pos.y;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragmentShader = /* glsl */ `
    uniform vec3 uColorTop;
    uniform vec3 uColorBottom;

    varying float vElevation;

    void main() {
        float mixRatio = smoothstep(-0.5, 1.0, vElevation);
        vec3 finalColor = mix(uColorBottom, uColorTop, mixRatio);

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

export const WobblyLiquidMaterial = shaderMaterial(
    {
        uTime: 0,
        uWobble: new THREE.Vector2(0, 0),
        uColorTop: new THREE.Color('#fbcfe8'),
        uColorBottom: new THREE.Color('#be185d'),
    },
    vertexShader,
    fragmentShader
);

extend({ WobblyLiquidMaterial });

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      wobblyLiquidMaterial: {
        ref?: any;
        key?: React.Key;
        uTime?: number;
        uWobble?: THREE.Vector2 | [number, number];
        uColorTop?: THREE.Color | string;
        uColorBottom?: THREE.Color | string;
        attach?: string;
      };
    }
  }
}