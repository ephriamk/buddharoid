import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Materials ───
const STONE = { color: '#8a8880', roughness: 0.92, metalness: 0 };
const DARK_WOOD = { color: '#3a1e0d', roughness: 0.75 };
const RED_LACQUER = { color: '#8B1A1A', roughness: 0.5 };
const GOLD = { color: '#C5A03F', metalness: 0.75, roughness: 0.25 };
const TILE_DARK = { color: '#2a2a28', roughness: 0.7 };
const SAND = { color: '#c8b88a', roughness: 0.95 };
const WATER = { color: '#2a5a6a', roughness: 0.05, metalness: 0.35, transparent: true, opacity: 0.75 };

// ─── Pagoda ───
function PagodaRoof({ y, w, d }) {
  return (
    <group position={[0, y, 0]}>
      <mesh castShadow>
        <boxGeometry args={[w + 1.4, 0.12, d + 1.4]} />
        <meshStandardMaterial {...TILE_DARK} />
      </mesh>
      {/* Eave upcurls */}
      {[[-1,-1],[-1,1],[1,-1],[1,1]].map(([sx,sz], i) => (
        <mesh key={i} castShadow
          position={[sx*(w+1.4)/2, 0.12, sz*(d+1.4)/2]}
          rotation={[sx*0.25, 0, sz*-0.25]}>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshStandardMaterial {...TILE_DARK} />
        </mesh>
      ))}
    </group>
  );
}

function PagodaTier({ y, w, d, h }) {
  return (
    <group position={[0, y, 0]}>
      {/* Walls */}
      <mesh castShadow receiveShadow position={[0, h/2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#f0e0c0" roughness={0.85} />
      </mesh>
      {/* Corner pillars */}
      {[[-1,-1],[-1,1],[1,-1],[1,1]].map(([sx,sz], i) => (
        <mesh key={i} castShadow position={[sx*w/2, h/2, sz*d/2]}>
          <cylinderGeometry args={[0.1, 0.1, h, 8]} />
          <meshStandardMaterial {...RED_LACQUER} />
        </mesh>
      ))}
      <PagodaRoof y={h} w={w} d={d} />
    </group>
  );
}

function Pagoda({ position }) {
  return (
    <group position={position}>
      {/* Stone foundation */}
      <mesh receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[7.5, 0.3, 7.5]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[8.5, 0.08, 8.5]} />
        <meshStandardMaterial color="#777" roughness={0.9} />
      </mesh>
      {/* Steps */}
      {[0,1,2].map(i => (
        <mesh key={i} receiveShadow position={[0, 0.12 - i*0.08, 4.2 + i*0.35]}>
          <boxGeometry args={[2.5, 0.08, 0.35]} />
          <meshStandardMaterial {...STONE} />
        </mesh>
      ))}

      <PagodaTier y={0.3} w={5.5} d={5.5} h={2.8} />
      <PagodaTier y={3.8} w={4.2} d={4.2} h={2.2} />
      <PagodaTier y={6.7} w={3} d={3} h={1.7} />

      {/* Spire */}
      <group position={[0, 9.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.25, 0.9, 8]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
        <mesh castShadow position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
        {[0.15, 0.35, 0.5].map((ry, i) => (
          <mesh key={i} position={[0, ry, 0]}>
            <torusGeometry args={[0.2 - i*0.03, 0.025, 6, 16]} />
            <meshStandardMaterial {...GOLD} />
          </mesh>
        ))}
      </group>

      {/* Door */}
      <mesh position={[0, 1.6, 2.77]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#1a0e04" roughness={0.95} />
      </mesh>
      {/* Door frame */}
      <mesh castShadow position={[0, 1.6, 2.76]}>
        <boxGeometry args={[1.35, 2.15, 0.06]} />
        <meshStandardMaterial {...RED_LACQUER} />
      </mesh>
    </group>
  );
}

// ─── Torii Gate ───
function ToriiGate({ position }) {
  return (
    <group position={position}>
      {[-1,1].map(s => (
        <mesh key={s} castShadow position={[s*2, 2.2, 0]}>
          <cylinderGeometry args={[0.15, 0.17, 4.4, 10]} />
          <meshStandardMaterial {...RED_LACQUER} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 4.5, 0]}>
        <boxGeometry args={[5.5, 0.22, 0.4]} />
        <meshStandardMaterial {...RED_LACQUER} />
      </mesh>
      <mesh castShadow position={[0, 3.5, 0]}>
        <boxGeometry args={[4.5, 0.15, 0.25]} />
        <meshStandardMaterial {...RED_LACQUER} />
      </mesh>
      {/* Tablet */}
      <mesh position={[0, 3.9, 0.01]}>
        <boxGeometry args={[1, 0.5, 0.08]} />
        <meshStandardMaterial color="#f0e0c0" roughness={0.8} />
      </mesh>
      {/* Base stones */}
      {[-1,1].map(s => (
        <mesh key={s} receiveShadow position={[s*2, 0.08, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.16, 8]} />
          <meshStandardMaterial {...STONE} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Stone Lantern (Toro) ───
function StoneLantern({ position }) {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity =
        0.5 + Math.sin(state.clock.elapsedTime * 3.5 + position[0] * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh receiveShadow castShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.3, 0.38, 0.24, 6]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.7, 6]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[0.42, 0.42, 0.42]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      {/* Glowing openings */}
      {[[0,0,0.22],[0,0,-0.22],[0.22,0,0],[-0.22,0,0]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, 1.1, z]}
          rotation={[0, i < 2 ? 0 : Math.PI/2, 0]}>
          <planeGeometry args={[0.18, 0.25]} />
          <meshBasicMaterial color="#ffaa44" transparent opacity={0.9} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.45, 0]}>
        <coneGeometry args={[0.4, 0.35, 4]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.1, 0]}
        intensity={0.5} color="#ff9944" distance={4} />
    </group>
  );
}

// ─── Zen Garden Ground ───
function TempleGround() {
  return (
    <group>
      {/* Main ground */}
      <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial {...SAND} />
      </mesh>

      {/* Temple platform area */}
      <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, 0, -5]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#d4c49a" roughness={0.95} />
      </mesh>

      {/* Stone path */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} receiveShadow
          position={[0, 0.015, 10 - i*1.6]}
          rotation={[-Math.PI/2, 0, (i%2)*0.15]}>
          <circleGeometry args={[0.5, 6]} />
          <meshStandardMaterial color="#888882" roughness={0.9} />
        </mesh>
      ))}

      {/* Zen raked circles */}
      {[-6, 6].map(x => (
        <group key={x} position={[x, 0.015, -9]}>
          {[0.8, 1.3, 1.8, 2.3].map((r, i) => (
            <mesh key={i} rotation={[-Math.PI/2, 0, 0]}>
              <torusGeometry args={[r, 0.02, 4, 32]} />
              <meshStandardMaterial color="#b8a870" roughness={1} />
            </mesh>
          ))}
          <mesh castShadow position={[0, 0.18, 0]}>
            <dodecahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial color="#666" roughness={0.92} />
          </mesh>
        </group>
      ))}

      {/* Koi pond */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[7, 0.01, 3]}>
        <circleGeometry args={[2.5, 28]} />
        <meshStandardMaterial {...WATER} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i/5)*Math.PI*2;
        return (
          <mesh key={i} castShadow position={[7+Math.cos(a)*2.7, 0.12, 3+Math.sin(a)*2.7]}>
            <dodecahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial color="#777" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Incense Burner (Koro) ───
function IncenseBurner({ position }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.28, 8]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.6} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.18, 8, 4, 0, Math.PI*2, 0, Math.PI/2]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.5} metalness={0.4} />
      </mesh>
      {[0,1,2].map(i => {
        const a = (i/3)*Math.PI*2;
        return (
          <mesh key={i} position={[Math.cos(a)*0.16, 0.04, Math.sin(a)*0.16]}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshStandardMaterial color="#3a2a1a" metalness={0.4} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Stone Wall / Fence ───
function StoneWall({ position, length = 8, rotation = [0,0,0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[length, 0.7, 0.25]} />
        <meshStandardMaterial color="#999" roughness={0.92} />
      </mesh>
      {/* Posts */}
      {Array.from({ length: Math.floor(length/2) + 1 }).map((_, i) => (
        <mesh key={i} castShadow position={[-length/2 + i*2, 0.5, 0]}>
          <boxGeometry args={[0.2, 1, 0.3]} />
          <meshStandardMaterial color="#888" roughness={0.9} />
        </mesh>
      ))}
      {/* Cap */}
      <mesh castShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[length + 0.1, 0.08, 0.32]} />
        <meshStandardMaterial {...TILE_DARK} />
      </mesh>
    </group>
  );
}

// ─── Main Export ───
export default function SpiritualEnvironment() {
  return (
    <>
      {/* Ground & garden */}
      <TempleGround />

      {/* Pagoda behind buddha */}
      <Pagoda position={[0, 0, -6]} />

      {/* Torii gate entrance */}
      <ToriiGate position={[0, 0, 10]} />

      {/* Stone lanterns */}
      <StoneLantern position={[-2.5, 0, 4]} />
      <StoneLantern position={[2.5, 0, 4]} />

      {/* Incense burner in front of buddha */}
      <IncenseBurner position={[0, 0, 3]} />

      {/* Stone walls flanking the temple */}
      <StoneWall position={[-7, 0, -2]} length={10} rotation={[0, Math.PI/2, 0]} />
      <StoneWall position={[7, 0, -2]} length={10} rotation={[0, Math.PI/2, 0]} />
      <StoneWall position={[0, 0, -12]} length={14} />
    </>
  );
}
