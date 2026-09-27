'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './WobbyLiquidMaterial';
import { MeshTransmissionMaterial } from '@react-three/drei/core/MeshTransmissionMaterial';

export default function CosmeticBottle() {
    const groupRef = useRef<THREE.Group>(null);
    const liquidMaterialRef = useRef<any>(null);

    const glassProfiles = useMemo(() => {
        const p = [];
        p.push(new THREE.Vector2(0.0, -0.9));
        p.push(new THREE.Vector2(0, -0.9));        // 内底中心
        p.push(new THREE.Vector2(0.78, -0.9));     // 内底边缘
        p.push(new THREE.Vector2(0.8, 1.0));       // 内侧直立瓶壁
        p.push(new THREE.Vector2(0.82, 1.05));     // 瓶口内倒角

        // 瓶口顶面
        p.push(new THREE.Vector2(0.95, 1.05));     // 瓶口外倒角
        
        // 瓶外壁 (比内壁长很多，形成极其沉重的“玻璃厚底”)
        p.push(new THREE.Vector2(0.98, 1.0));      // 外侧直立瓶壁
        p.push(new THREE.Vector2(0.98, -1.1));     // 外壁向下延伸
        p.push(new THREE.Vector2(0.9, -1.25));     // 瓶底圆角倒角 (捕捉高光的关键)
        p.push(new THREE.Vector2(0, -1.25));      // 实心玻璃瓶底中心

        return p;
    }, []);

    const physics = useRef({
        wobble: new THREE.Vector2(0, 0),   // current wobble position
        velocity: new THREE.Vector2(0, 0), // current wobble velocity
        lastRotation: new THREE.Euler(),   // last frame rotation
        tension: 0.15,                     // spring tension
        friction: 0.85,                     // damping factor (more close to 1, more like water)
    });

    useFrame((state, delta) => {
        const p = physics.current;

        if (groupRef.current) {
            const targetRotationX = (state.pointer.y * Math.PI) / 4;
            const targetRotationZ = -(state.pointer.x * Math.PI) / 4;

            // spin the bottle smoothly
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.1);

            const deltaRotX = groupRef.current.rotation.x - p.lastRotation.x;
            const deltaRotZ = groupRef.current.rotation.z - p.lastRotation.z;

            p.lastRotation.copy(groupRef.current.rotation);

            // 3. 弹簧物理模拟 (Hooke's Law)
            // 用户移动瓶子时，给液体施加一个反方向的作用力（惯性）
            p.velocity.x += deltaRotX * 4.0; 
            p.velocity.y += deltaRotZ * 4.0; 

            // 弹簧向目标点 (0,0) 回弹
            p.velocity.x += (0 - p.wobble.x) * p.tension;
            p.velocity.y += (0 - p.wobble.y) * p.tension;

            // 摩擦力衰减
            p.velocity.multiplyScalar(p.friction);
            
            // 更新晃动位移
            p.wobble.add(p.velocity);
        }

        if (liquidMaterialRef.current) {
            // 4. 将物理状态推送到 GPU Shader
            liquidMaterialRef.current.uTime += delta;
            // 限制最大晃动幅度，防止液面穿模溢出瓶子
            liquidMaterialRef.current.uWobble.x = THREE.MathUtils.clamp(p.wobble.x, -0.5, 0.5);
            liquidMaterialRef.current.uWobble.y = THREE.MathUtils.clamp(p.wobble.y, -0.5, 0.5);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
                {/* 高分段的圆柱体，提供足够的顶点供 Shader 弯曲 (64个径向段，32个高度段) */}
                <cylinderGeometry args={[0.77, 0.77, 1.5, 64, 32]} />
                <wobblyLiquidMaterial ref={liquidMaterialRef} />
            </mesh> 

            <mesh>
                <latheGeometry args={[glassProfiles, 64]} />
                <MeshTransmissionMaterial 
                    backside                 // 开启双面渲染，展现真实瓶壁厚度
                    samples={16}             // 折射采样率，越高越细腻
                    resolution={1024}         // 折射缓冲区分辨率
                    transmission={1.0}      
                    roughness={0.4}         // 极低粗糙度，镜面高光
                    ior={1.54}               // 真实玻璃折射率 (Index of Refraction)
                    thickness={0.4}          // 瓶壁几何厚度，决定边缘折射弯曲程度
                    chromaticAberration={0.01} // 色散效果，边缘产生微微的彩虹色折射光
                    anisotropy={0.1}
                    clearcoat={0.7}          // 表面清漆高光
                    clearcoatRoughness={0.0}
                    attenuationDistance={0.3} // 光线在玻璃中衰减的距离，越小越快变暗
                    attenuationColor="#ffffff"
                    color="#ffffff"
                />
            </mesh>   
        </group>
    )
}