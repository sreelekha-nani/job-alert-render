import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import * as THREE from 'three';

const FloatingCard = ({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: number }) => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
        ref.current.rotation.x = MathUtils.lerp(ref.current.rotation.x, Math.cos(t / 2) / 10 + rotation[0], 0.1);
        ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, Math.sin(t / 4) / 10 + rotation[1], 0.1);
        ref.current.position.y = MathUtils.lerp(ref.current.position.y, position[1] + Math.sin(t/2)/5, 0.1);
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1.4]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#1a0033"
        emissiveIntensity={0.5}
        roughness={0.4}
        metalness={0.8}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const SceneContent = () => {
    const cards = useMemo(() => {
        return Array.from({ length: 15 }).map(() => ({
            position: [MathUtils.randFloatSpread(10), MathUtils.randFloat(-4, 4), MathUtils.randFloatSpread(5) - 3] as [number, number, number],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
            scale: MathUtils.randFloat(0.5, 1.2),
        }));
    }, []);

    const lightRef = useRef<THREE.PointLight>(null!);

    useFrame((state) => {
        if(lightRef.current) {
            lightRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 5;
            lightRef.current.position.z = Math.cos(state.clock.getElapsedTime() * 0.5) * 5;
        }
    });

  return (
    <>
      <ambientLight intensity={0.2} color="#8b5cf6" />
      <pointLight ref={lightRef} position={[0, 2, 5]} intensity={1.5} color="#8b5cf6" distance={15} />
      <fog attach="fog" args={['#1a0033', 5, 15]} />
      {cards.map((card, i) => (
        <FloatingCard key={i} {...card} />
      ))}
    </>
  );
};

const Scene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default Scene;