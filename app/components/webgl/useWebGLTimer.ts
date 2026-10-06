'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A small React-friendly wrapper around THREE.Timer.
 *
 * Timer is intentionally updated from useFrame by the caller, once per
 * simulation step. THREE.Timer is the non-deprecated replacement for
 * THREE.Clock in modern three.js.
 */
export function useWebGLTimer() {
  const timerRef = useRef<THREE.Timer | null>(null);

  if (timerRef.current === null) {
    timerRef.current = new THREE.Timer();
  }

  useEffect(() => {
    const timer = timerRef.current;

    if (!timer) return;

    timer.connect(document);

    return () => {
      timer.disconnect();
      timer.dispose();
    };
  }, []);

  return timerRef;
}
