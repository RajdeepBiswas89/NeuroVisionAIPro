import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import GlassPanel from './ui/GlassPanel';
import GlassButton from './ui/GlassButton';
import { Box, Eye, Layers, Maximize2, RotateCw } from 'lucide-react';
import * as THREE from 'three';

// Procedural Particle Brain
const ParticleBrain = ({ transparent, color }: { transparent: boolean, color: string }) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate Brain-shaped point cloud
    const particles = useMemo(() => {
        const count = 4000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const baseColor = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            // Brain approximation using two hemispheres (ellipsoids)
            // Left Hemisphere center (-0.6, 0, 0)
            // Right Hemisphere center (0.6, 0, 0)

            const isRight = Math.random() > 0.5;
            const centerX = isRight ? 0.6 : -0.6;

            // Generate point in unit sphere
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            // Radius varying to create density
            const r = Math.cbrt(Math.random()) * 1.2; // 1.2 is base radius

            let x = centerX + (r * Math.sin(phi) * Math.cos(theta) * 0.9); // Scale X slightly
            let y = r * Math.sin(phi) * Math.sin(theta) * 1.1; // Scale Y for height
            let z = r * Math.cos(phi) * 1.4; // Scale Z for length

            // Add some noise/fold effect
            x += (Math.random() - 0.5) * 0.1;
            y += (Math.random() - 0.5) * 0.1;
            z += (Math.random() - 0.5) * 0.1;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Color variation
            const intensity = 0.5 + Math.random() * 0.5;
            colors[i * 3] = baseColor.r * intensity;
            colors[i * 3 + 1] = baseColor.g * intensity;
            colors[i * 3 + 2] = baseColor.b * intensity;
        }

        return { positions, colors };
    }, [color]);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.002;
            // Gentle breathing/pulsing
            const scale = 1 + Math.sin(state.clock.getElapsedTime()) * 0.02;
            pointsRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particles.colors.length / 3}
                    array={particles.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                vertexColors
                transparent={true}
                opacity={transparent ? 0.3 : 0.8}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const TumorMesh = ({ onClick }: { onClick: (data: any) => void }) => {
    const mesh = useRef<any>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (mesh.current) {
            const t = state.clock.getElapsedTime();
            // Complex pulsation
            const scaleBase = hovered ? 0.6 : 0.4; // Enlarge on hover
            const scale = scaleBase + Math.sin(t * 3) * 0.03 + Math.sin(t * 10) * 0.01;
            mesh.current.scale.setScalar(scale);

            // Subtle random movement
            mesh.current.position.x = 0.5 + Math.sin(t * 0.5) * 0.02;

            // Rotation speed up on hover
            if (hovered) {
                mesh.current.rotation.y += 0.02;
            }
        }
    });

    return (
        <group>
            {/* Core Tumor */}
            <mesh
                ref={mesh}
                position={[0.5, 0.3, 0.5]}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick({
                        type: 'Glioblastoma Multiforme',
                        size: '4.2 cm',
                        grade: 'IV',
                        location: 'Temporal Lobe'
                    });
                }}
            >
                <dodecahedronGeometry args={[0.5, 1]} />
                <meshStandardMaterial
                    color={hovered ? "#FF4444" : "#FF0000"}
                    emissive={hovered ? "#FF0000" : "#880000"}
                    emissiveIntensity={hovered ? 6 : 4}
                    roughness={0.2}
                    metalness={0.8}
                    toneMapped={false}
                />
            </mesh>

            {/* Glow Halo */}
            <mesh position={[0.5, 0.3, 0.5]} scale={hovered ? 1.2 : 1}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial
                    color={hovered ? "#FF2222" : "#FF0000"}
                    transparent
                    opacity={hovered ? 0.2 : 0.1}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
};

const Tumor3DViewer: React.FC = () => {
    const [isolateTumor, setIsolateTumor] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [vrMode, setVrMode] = useState(false);
    const [selectedTumor, setSelectedTumor] = useState<any>(null);

    return (
        <div className={`h-[calc(100vh-100px)] flex flex-col gap-6 ${vrMode ? 'fixed inset-0 z-[2000] bg-black h-screen' : ''}`}>
            {!vrMode && (
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">3D Tumor Reconstruction</h1>
                    <p className="text-gray-600">Volumetric rendering from 2D MRI slice sequences.</p>
                </div>
            )}

            <GlassPanel className="flex-1 relative overflow-hidden p-0 border-0 bg-gray-950">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                    {/* Cinematic Lighting */}
                    <color attach="background" args={['#020617']} />
                    <fog attach="fog" args={['#020617', 5, 15]} />

                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#4CC9F0" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7209B7" />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <Suspense fallback={<Html center><div className="text-[#4CC9F0] font-mono tracking-widest animate-pulse">GENERATING NEURAL MESH...</div></Html>}>
                        <group rotation={[0, Math.PI, 0] /* Rotate to face camera better */}>
                            <ParticleBrain transparent={isolateTumor} color="#00E0FF" />
                        </group>
                        <TumorMesh onClick={(data) => {
                            setSelectedTumor(data);
                            setAutoRotate(false);
                        }} />
                    </Suspense>

                    <OrbitControls autoRotate={autoRotate} autoRotateSpeed={0.5} enableZoom={true} enablePan={false} minDistance={2} maxDistance={10} />
                </Canvas>

                {/* HUD Controls */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                    <div className="flex gap-4 pointer-events-auto">
                        <GlassButton
                            onClick={() => setIsolateTumor(!isolateTumor)}
                            className={isolateTumor ? 'bg-[#4CC9F0] text-black border-[#4CC9F0]' : 'border-white/20 text-white hover:bg-white/10'}
                            icon={<Layers size={18} />}
                        >
                            {isolateTumor ? 'Merge View' : 'Isolate Tumor'}
                        </GlassButton>
                        <GlassButton
                            onClick={() => setAutoRotate(!autoRotate)}
                            icon={<RotateCw size={18} />}
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
                        </GlassButton>
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                        <GlassButton
                            onClick={() => setVrMode(!vrMode)}
                            className="bg-purple-600 hover:bg-purple-500 border-purple-400 text-white"
                            icon={<Eye size={18} />}
                        >
                            {vrMode ? 'Exit VR' : 'Enter VR Mode'}
                        </GlassButton>
                    </div>
                </div>

                {/* Info Overlay (On Click) */}
                {selectedTumor && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-[#4CC9F0]/50 p-6 rounded-2xl shadow-2xl max-w-sm text-center z-50">
                        <h3 className="text-xl font-black text-white mb-2">{selectedTumor.type}</h3>
                        <div className="grid grid-cols-2 gap-4 text-left my-4">
                            <div>
                                <span className="text-xs text-gray-400 uppercase font-bold block">Grade</span>
                                <span className="text-[#4CC9F0] font-mono">{selectedTumor.grade}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase font-bold block">Size</span>
                                <span className="text-[#4CC9F0] font-mono">{selectedTumor.size}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-xs text-gray-400 uppercase font-bold block">Location</span>
                                <span className="text-white">{selectedTumor.location}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => { setSelectedTumor(null); setAutoRotate(true); }}
                            className="w-full py-2 bg-[#4CC9F0] text-black font-bold rounded-lg hover:bg-white transition-colors"
                        >
                            Close Analysis
                        </button>
                    </div>
                )}

                {/* Metrics Overlay */}
                <div className="absolute top-6 right-6 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-2 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <Box size={14} className="text-[#4CC9F0]" />
                            <span className="text-xs font-bold text-gray-300 uppercase">Volumetric Size</span>
                            <span className="text-xs font-mono text-[#4CC9F0] glow-text">14.2 cm³</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Maximize2 size={14} className="text-red-400" />
                            <span className="text-xs font-bold text-gray-300 uppercase">Max Diameter</span>
                            <span className="text-xs font-mono text-red-500 glow-text">3.4 cm</span>
                        </div>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};

export default Tumor3DViewer;
