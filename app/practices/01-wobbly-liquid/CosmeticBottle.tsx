'use client';

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./WobblyLiquidMaterial";
import { MeshTransmissionMaterial } from "@react-three/drei/core/MeshTransmissionMaterial";

type WobblyMaterialInstance = THREE.ShaderMaterial & {
  uTime: number;
  uWobble: THREE.Vector2;
};

export default function CosmeticBottle() {
  const groupRef = useRef<THREE.Group>(null);
  const liquidMaterialRef = useRef<WobblyMaterialInstance>(null);

  const glassProfiles = useMemo(() => {
    const p: THREE.Vector2[] = [];
    p.push(new THREE.Vector2(0.0, -0.9));
    p.push(new THREE.Vector2(0, -0.9));
    p.push(new THREE.Vector2(0.78, -0.9));
    p.push(new THREE.Vector2(0.8, 1.0));
    p.push(new THREE.Vector2(0.82, 1.05));
    p.push(new THREE.Vector2(0.95, 1.05));
    p.push(new THREE.Vector2(0.98, 1.0));
    p.push(new THREE.Vector2(0.98, -1.1));
    p.push(new THREE.Vector2(0.9, -1.25));
    p.push(new THREE.Vector2(0, -1.25));
    return p;
  }, []);

  const physics = useRef({
    wobble: new THREE.Vector2(0, 0),
    velocity: new THREE.Vector2(0, 0),
    lastRotation: new THREE.Euler(),
    tension: 0.15,
    friction: 0.85,
  });

  useFrame((state, delta) => {
    const p = physics.current;

    if (groupRef.current) {
      const targetRotationX = (state.pointer.y * Math.PI) / 4;
      const targetRotationZ = -(state.pointer.x * Math.PI) / 4;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.1);

      const deltaRotX = groupRef.current.rotation.x - p.lastRotation.x;
      const deltaRotZ = groupRef.current.rotation.z - p.lastRotation.z;
      p.lastRotation.copy(groupRef.current.rotation);

      p.velocity.x += deltaRotX * 4.0;
      p.velocity.y += deltaRotZ * 4.0;
      p.velocity.x += (0 - p.wobble.x) * p.tension;
      p.velocity.y += (0 - p.wobble.y) * p.tension;
      p.velocity.multiplyScalar(p.friction);
      p.wobble.add(p.velocity);
    }

    if (liquidMaterialRef.current) {
      liquidMaterialRef.current.uTime += delta;
      liquidMaterialRef.current.uWobble.x = THREE.MathUtils.clamp(p.wobble.x, -0.5, 0.5);
      liquidMaterialRef.current.uWobble.y = THREE.MathUtils.clamp(p.wobble.y, -0.5, 0.5);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <cylinderGeometry args={[0.77, 0.77, 1.5, 64, 32]} />
        <wobblyLiquidMaterial ref={liquidMaterialRef} />
      </mesh>

      <mesh>
        <latheGeometry args={[glassProfiles, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={1024}
          transmission={1}
          roughness={0.4}
          ior={1.54}
          thickness={0.4}
          chromaticAberration={0.01}
          anisotropy={0.1}
          clearcoat={0.7}
          clearcoatRoughness={0}
          attenuationDistance={0.3}
          attenuationColor="#ffffff"
          color="#ffffff"
        />
      </mesh>
    </group>
  );
}
