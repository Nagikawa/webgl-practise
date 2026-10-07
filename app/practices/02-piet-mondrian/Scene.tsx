'use client';

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { WebGL2DCanvas } from "@/app/components/webgl/WebGLCanvas";
import { useWebGLTimer } from "@/app/components/webgl/useWebGLTimer";

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;

  // Returns 1.0 when st is inside [min, max], else 0.0.
  float rect(vec2 st, vec2 mn, vec2 mx) {
    vec2 bl = step(mn, st);
    vec2 tr = step(st, mx);
    return bl.x * bl.y * tr.x * tr.y;
  }

  void main() {
    // Keep composition square (letterboxed) so the grid does not stretch.
    float aspect = uResolution.x / uResolution.y;
    vec2 st = gl_FragCoord.xy / uResolution.xy;

    if (aspect > 1.0) {
      st.x = (st.x - 0.5) * aspect + 0.5;
    } else {
      st.y = (st.y - 0.5) / aspect + 0.5;
    }

    // Mondrian palette.
    vec3 white = vec3(0.96, 0.95, 0.92);
    vec3 red = vec3(0.86, 0.12, 0.10);
    vec3 yellow = vec3(0.95, 0.82, 0.10);
    vec3 blue = vec3(0.08, 0.22, 0.55);
    vec3 black = vec3(0.05);

    // Outside the square canvas -> black mat.
    vec3 color = black;

    if (st.x >= 0.0 && st.x <= 1.0 && st.y >= 0.0 && st.y <= 1.0) {
      color = white;

      // Color planes — Tableau (1921)-inspired asymmetric grid.
      color = mix(color, red, rect(st, vec2(0.00, 0.55), vec2(0.42, 1.00)));
      color = mix(color, yellow, rect(st, vec2(0.72, 0.72), vec2(1.00, 1.00)));
      color = mix(color, blue, rect(st, vec2(0.00, 0.00), vec2(0.22, 0.28)));
      color = mix(color, yellow, rect(st, vec2(0.85, 0.00), vec2(1.00, 0.18)));
      color = mix(color, red, rect(st, vec2(0.72, 0.28), vec2(0.85, 0.42)));

      // Black grid lines.
      float line = 0.018;
      float grid = 0.0;

      // Verticals.
      grid = max(grid, rect(st, vec2(0.42 - line * 0.5, 0.0), vec2(0.42 + line * 0.5, 1.0)));
      grid = max(grid, rect(st, vec2(0.72 - line * 0.5, 0.0), vec2(0.72 + line * 0.5, 1.0)));
      grid = max(grid, rect(st, vec2(0.22 - line * 0.5, 0.0), vec2(0.22 + line * 0.5, 0.55)));
      grid = max(grid, rect(st, vec2(0.85 - line * 0.5, 0.0), vec2(0.85 + line * 0.5, 0.55)));

      // Horizontals.
      grid = max(grid, rect(st, vec2(0.0, 0.55 - line * 0.5), vec2(1.0, 0.55 + line * 0.5)));
      grid = max(grid, rect(st, vec2(0.42, 0.72 - line * 0.5), vec2(1.0, 0.72 + line * 0.5)));
      grid = max(grid, rect(st, vec2(0.0, 0.28 - line * 0.5), vec2(0.72, 0.28 + line * 0.5)));
      grid = max(grid, rect(st, vec2(0.72, 0.42 - line * 0.5), vec2(1.0, 0.42 + line * 0.5)));
      grid = max(grid, rect(st, vec2(0.72, 0.18 - line * 0.5), vec2(1.0, 0.18 + line * 0.5)));

      // Outer frame.
      float frame = 0.025;
      grid = max(grid, 1.0 - rect(st, vec2(frame), vec2(1.0 - frame)));

      color = mix(color, black, grid);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

function MondrianPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timerRef = useWebGLTimer();
  const { gl, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2() },
    }),
    [],
  );

  useFrame((state) => {
    const material = materialRef.current;
    const timer = timerRef.current;

    if (!material || !timer) return;

    timer.update();

    const pixelRatio = gl.getPixelRatio();
    material.uniforms.uResolution.value.set(
      size.width * pixelRatio,
      size.height * pixelRatio,
    );
    material.uniforms.uTime.value = timer.getElapsed();
    material.uniforms.uMouse.value.copy(state.pointer);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <WebGL2DCanvas camera={{ position: [0, 0, 1], zoom: 1 }}>
      <MondrianPlane />
    </WebGL2DCanvas>
  );
}
