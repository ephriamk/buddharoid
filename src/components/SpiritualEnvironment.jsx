import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Materials ───
const STONE = { color: '#8a8880', roughness: 0.92 };
const RED_LACQUER = { color: '#8B1A1A', roughness: 0.45, metalness: 0.1 };
const GOLD = { color: '#C5A03F', metalness: 0.75, roughness: 0.25 };
const TILE_DARK = { color: '#2a2825', roughness: 0.7 };
const SAND = { color: '#c8b88a', roughness: 0.95 };
const WATER = { color: '#2a5a6a', roughness: 0.05, metalness: 0.35, transparent: true, opacity: 0.75 };
const WOOD = { color: '#5a3a20', roughness: 0.8 };
const CREAM_WALL = { color: '#f0e0c0', roughness: 0.85 };

// ─── Roof geometry constants ───
const ROOF_CONE_HEIGHT = 0.6;
const ROOF_CONE_LOCAL_Y = 0.15;
const ROOF_OVERHANG_HEIGHT = 0.06;
const ROOF_OVERHANG_LOCAL_Y = -0.02;
const ROOF_RIDGE_LOCAL_Y = 0.5;
const BEAM_HEIGHT = 0.1;

// The CurvedRoof group is offset so the overhang bottom sits flush on the beam top.
// Overhang bottom in local space = ROOF_OVERHANG_LOCAL_Y - ROOF_OVERHANG_HEIGHT/2 = -0.05
// Beam top relative to tier base = h + BEAM_HEIGHT/2 = h + 0.05
// So CurvedRoof group y (relative to tier) = (h + 0.05) - (-0.05) = h + 0.10
const ROOF_GROUP_OFFSET = BEAM_HEIGHT / 2 - (ROOF_OVERHANG_LOCAL_Y - ROOF_OVERHANG_HEIGHT / 2);
// = 0.05 - (-0.05) = 0.10

// Total height a PagodaTier adds above its base y:
// walls(h) + roof group offset(0.10) + ridge ornament(0.50)
// The ridge ornament top is roughly the peak. We use it as the stacking point.
const TIER_EXTRA_ABOVE_WALLS = ROOF_GROUP_OFFSET + ROOF_RIDGE_LOCAL_Y; // 0.10 + 0.50 = 0.60

function tierTotalHeight(h) {
  return h + TIER_EXTRA_ABOVE_WALLS;
}

// ─── Curved Pagoda Roof ───
function CurvedRoof({ w, d, color = '#2a2825' }) {
  const overhang = 1.6;
  return (
    <group>
      {/* Main roof slab — slightly pyramidal cone */}
      <mesh castShadow position={[0, ROOF_CONE_LOCAL_Y, 0]}>
        <coneGeometry args={[(w + overhang) * 0.72, ROOF_CONE_HEIGHT, 4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Under-eave — flat overhang */}
      <mesh castShadow position={[0, ROOF_OVERHANG_LOCAL_Y, 0]}>
        <boxGeometry args={[w + overhang, ROOF_OVERHANG_HEIGHT, d + overhang]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Eave tips — upturned corners */}
      {[[-1,-1],[-1,1],[1,-1],[1,1]].map(([sx,sz], i) => (
        <mesh key={i} castShadow
          position={[sx*(w+overhang)*0.48, 0.08, sz*(d+overhang)*0.48]}
          rotation={[sx*0.35, Math.PI/4, sz*-0.35]}>
          <boxGeometry args={[0.7, 0.05, 0.25]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
      {/* Ridge ornament */}
      <mesh castShadow position={[0, ROOF_RIDGE_LOCAL_Y, 0]}>
        <cylinderGeometry args={[0.04, 0.04, w * 0.5, 4]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
}

function PagodaTier({ y, w, d, h }) {
  // Beam top is at y + h + BEAM_HEIGHT/2
  // CurvedRoof group placed so overhang bottom sits on beam top
  const roofGroupY = h + ROOF_GROUP_OFFSET;

  return (
    <group position={[0, y, 0]}>
      {/* Walls with richer cream color */}
      <mesh castShadow receiveShadow position={[0, h/2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial {...CREAM_WALL} />
      </mesh>

      {/* Red corner pillars */}
      {[[-1,-1],[-1,1],[1,-1],[1,1]].map(([sx,sz], i) => (
        <mesh key={i} castShadow position={[sx*w/2, h/2, sz*d/2]}>
          <cylinderGeometry args={[0.12, 0.12, h, 8]} />
          <meshStandardMaterial {...RED_LACQUER} />
        </mesh>
      ))}

      {/* Mid-wall pillars (front and back) */}
      {[-1, 1].map(sz => (
        <mesh key={sz} castShadow position={[0, h/2, sz*d/2]}>
          <cylinderGeometry args={[0.1, 0.1, h, 8]} />
          <meshStandardMaterial {...RED_LACQUER} />
        </mesh>
      ))}

      {/* Horizontal beam at top of walls */}
      <mesh castShadow position={[0, h, 0]}>
        <boxGeometry args={[w + 0.3, BEAM_HEIGHT, d + 0.3]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>

      {/* Curved roof on top — positioned so overhang sits on beam */}
      <group position={[0, roofGroupY, 0]}>
        <CurvedRoof w={w} d={d} />
      </group>
    </group>
  );
}

function Pagoda({ position }) {
  // ─── Foundation: stack layers precisely from y=0 upward ───
  const f1H = 0.1;   // bottom slab
  const f1Y = f1H / 2;                         // 0.05 — center
  const f1Top = f1H;                            // 0.10

  const f2H = 0.2;   // middle slab
  const f2Y = f1Top + f2H / 2;                 // 0.20 — center
  const f2Top = f1Top + f2H;                    // 0.30

  const f3H = 0.1;   // top slab
  const f3Y = f2Top + f3H / 2;                 // 0.35 — center
  const f3Top = f2Top + f3H;                    // 0.40

  // ─── Tier stacking: each tier starts where the previous one ends ───
  const tier1Y = f3Top;                         // 0.40
  const tier1H = 2.6;
  const tier1Top = tier1Y + tierTotalHeight(tier1H); // 0.40 + 3.20 = 3.60

  const tier2Y = tier1Top;                      // 3.60
  const tier2H = 2.1;
  const tier2Top = tier2Y + tierTotalHeight(tier2H); // 3.60 + 2.70 = 6.30

  const tier3Y = tier2Top;                      // 6.30
  const tier3H = 1.6;
  const tier3Top = tier3Y + tierTotalHeight(tier3H); // 6.30 + 2.20 = 8.50

  // ─── Spire: base cylinder (height 0.8) bottom sits on tier3 top ───
  const spireBaseH = 0.8;
  const spireY = tier3Top + spireBaseH / 2;     // 8.50 + 0.40 = 8.90

  // ─── Door position: flush with Tier 1 front face ───
  // Tier 1 is centered at pagoda origin. d=5.5, front face at z = d/2 = 2.75
  // Door placed just barely in front (z offset +0.01) to avoid z-fighting
  const doorZ = 2.76;
  // Door center Y: tier1Y + some height for the door center
  const doorH = 2.2;
  const doorCenterY = tier1Y + doorH / 2 + 0.05; // slightly above tier base

  // ─── Steps: descend from foundation front edge to ground ───
  // Foundation top is at f3Top = 0.40. Steps go from there down to y~0.
  // 4 steps, each 0.1 high, descending
  const stepH = 0.1;
  const stepsStartZ = 3.6; // front of foundation area

  return (
    <group position={position}>
      {/* Layered stone foundation — precisely stacked */}
      <mesh receiveShadow position={[0, f1Y, 0]}>
        <boxGeometry args={[9, f1H, 9]} />
        <meshStandardMaterial color="#777" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0, f2Y, 0]}>
        <boxGeometry args={[8, f2H, 8]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      <mesh receiveShadow position={[0, f3Y, 0]}>
        <boxGeometry args={[7.2, f3H, 7.2]} />
        <meshStandardMaterial color="#999" roughness={0.9} />
      </mesh>

      {/* Steps — descending from foundation level to ground */}
      {[0,1,2,3].map(i => {
        const stepTop = f3Top - i * stepH;
        const stepCenterY = stepTop - stepH / 2;
        return (
          <mesh key={i} receiveShadow position={[0, stepCenterY, stepsStartZ + i * 0.4]}>
            <boxGeometry args={[3, stepH, 0.4]} />
            <meshStandardMaterial {...STONE} />
          </mesh>
        );
      })}

      {/* Three tiers — precisely stacked */}
      <PagodaTier y={tier1Y} w={5.5} d={5.5} h={tier1H} />
      <PagodaTier y={tier2Y} w={4.2} d={4.2} h={tier2H} />
      <PagodaTier y={tier3Y} w={3}   d={3}   h={tier3H} />

      {/* Spire / Sorin — sits exactly on Tier 3 roof */}
      <group position={[0, spireY, 0]}>
        {/* Base cylinder */}
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.3, spireBaseH, 8]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
        {/* Decorative rings (kurin) */}
        {[0.5, 0.7, 0.9, 1.1, 1.25].map((ry, i) => (
          <mesh key={i} position={[0, ry, 0]}>
            <torusGeometry args={[0.18 - i*0.025, 0.02, 6, 16]} />
            <meshStandardMaterial {...GOLD} />
          </mesh>
        ))}
        {/* Jewel on top */}
        <mesh castShadow position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial {...GOLD} emissive="#C5A03F" emissiveIntensity={0.3} />
        </mesh>
        {/* Spire needle */}
        <mesh castShadow position={[0, 1.8, 0]}>
          <coneGeometry args={[0.03, 0.5, 6]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
      </group>

      {/* Door — flush with Tier 1 front wall face */}
      <mesh position={[0, doorCenterY, doorZ + 0.01]}>
        <planeGeometry args={[1.3, doorH]} />
        <meshStandardMaterial color="#1a0e04" roughness={0.95} />
      </mesh>
      {/* Door frame — red */}
      <mesh castShadow position={[0, doorCenterY, doorZ]}>
        <boxGeometry args={[1.5, 2.4, 0.08]} />
        <meshStandardMaterial {...RED_LACQUER} />
      </mesh>
      {/* Door details — gold trim */}
      <mesh position={[0, doorCenterY + doorH / 2 + 0.05, doorZ + 0.02]}>
        <boxGeometry args={[1.4, 0.06, 0.02]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
}

// ─── Torii Gate ───
function ToriiGate({ position }) {
  const gateWidth = 2.2;
  return (
    <group position={position}>
      {/* Main pillars — slightly tapered */}
      {[-1,1].map(s => (
        <mesh key={s} castShadow position={[s*gateWidth, 2.2, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 4.4, 12]} />
          <meshStandardMaterial {...RED_LACQUER} />
        </mesh>
      ))}
      {/* Kasagi — top beam with slight curve via wider box */}
      <mesh castShadow position={[0, 4.55, 0]}>
        <boxGeometry args={[gateWidth*2 + 1.5, 0.2, 0.45]} />
        <meshStandardMaterial {...RED_LACQUER} />
      </mesh>
      {/* Nuki — lower tie beam */}
      <mesh castShadow position={[0, 3.5, 0]}>
        <boxGeometry args={[gateWidth*2 + 0.6, 0.14, 0.22]} />
        <meshStandardMaterial {...RED_LACQUER} />
      </mesh>
      {/* Gakuzuka — name tablet */}
      <mesh position={[0, 3.95, 0.02]}>
        <boxGeometry args={[1.1, 0.55, 0.08]} />
        <meshStandardMaterial {...CREAM_WALL} />
      </mesh>
      {/* Kasagi end caps — upturned */}
      {[-1,1].map(s => (
        <mesh key={`cap${s}`} castShadow
          position={[s*(gateWidth+0.9), 4.65, 0]}
          rotation={[0, 0, s*-0.15]}>
          <boxGeometry args={[0.4, 0.15, 0.45]} />
          <meshStandardMaterial {...RED_LACQUER} />
        </mesh>
      ))}
      {/* Base stones */}
      {[-1,1].map(s => (
        <mesh key={`base${s}`} receiveShadow position={[s*gateWidth, 0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.2, 8]} />
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
        0.6 + Math.sin(state.clock.elapsedTime * 3.5 + position[0] * 2) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Kiso — base */}
      <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.28, 0.35, 0.2, 6]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      {/* Sao — shaft */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.7, 6]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      {/* Chudai — middle platform */}
      <mesh castShadow position={[0, 0.93, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.06, 6]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      {/* Hibukuro — fire box */}
      <mesh castShadow position={[0, 1.15, 0]}>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      {/* Light openings — glowing */}
      {[[0,0,0.2],[0,0,-0.2],[0.2,0,0],[-0.2,0,0]].map(([x,,z], i) => (
        <mesh key={i} position={[x, 1.15, z]}
          rotation={[0, i < 2 ? 0 : Math.PI/2, 0]}>
          <planeGeometry args={[0.15, 0.22]} />
          <meshBasicMaterial color="#ffaa44" transparent opacity={0.9} />
        </mesh>
      ))}
      {/* Kasa — roof cap */}
      <mesh castShadow position={[0, 1.45, 0]}>
        <coneGeometry args={[0.38, 0.3, 4]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      {/* Hoju — jewel finial */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial {...STONE} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.15, 0]}
        intensity={0.6} color="#ff9944" distance={5} />
    </group>
  );
}

// ─── Zen Garden Ground ───
function TempleGround() {
  return (
    <group>
      {/* Main ground */}
      <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial {...SAND} />
      </mesh>

      {/* Temple courtyard — slightly elevated */}
      <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, -2]}>
        <planeGeometry args={[14, 18]} />
        <meshStandardMaterial color="#d4c49a" roughness={0.95} />
      </mesh>

      {/* Stone path from torii to buddha */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} receiveShadow
          position={[(Math.sin(i * 0.3) * 0.15), 0.02, 10 - i * 1.4]}
          rotation={[-Math.PI/2, 0, (i%3) * 0.12]}>
          <circleGeometry args={[0.45 + (i%2) * 0.1, 7]} />
          <meshStandardMaterial color="#7a7a72" roughness={0.92} />
        </mesh>
      ))}

      {/* Zen raked circles — two gardens flanking the path */}
      {[-7, 7].map(x => (
        <group key={x} position={[x, 0.015, -8]}>
          {[0.7, 1.2, 1.7, 2.2, 2.7].map((r, i) => (
            <mesh key={i} rotation={[-Math.PI/2, 0, 0]}>
              <torusGeometry args={[r, 0.015, 4, 40]} />
              <meshStandardMaterial color="#b8a870" roughness={1} />
            </mesh>
          ))}
          {/* Center rock */}
          <mesh castShadow position={[0, 0.2, 0]}>
            <dodecahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial color="#5a5a55" roughness={0.92} />
          </mesh>
          {/* Companion rocks */}
          <mesh castShadow position={[0.8, 0.1, 0.4]}>
            <dodecahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color="#666" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Koi pond — right side */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[8, 0.01, 4]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial {...WATER} />
      </mesh>
      {/* Pond border rocks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i/8)*Math.PI*2;
        return (
          <mesh key={i} castShadow position={[8+Math.cos(a)*2.7, 0.1, 4+Math.sin(a)*2.7]}>
            <dodecahedronGeometry args={[0.2 + (i%3)*0.08, 0]} />
            <meshStandardMaterial color="#6a6a65" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Small bridge over pond */}
      <mesh castShadow position={[8, 0.25, 4]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.06, 2.8]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>
      {/* Bridge rails */}
      {[-1,1].map(s => (
        <mesh key={s} castShadow position={[8 + s*0.18, 0.4, 4]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.04, 0.3, 2.6]} />
          <meshStandardMaterial color="#8B1A1A" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Incense Burner (Koro) ───
function IncenseBurner({ position }) {
  return (
    <group position={position}>
      {/* Bowl */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.25, 0.18, 0.3, 10]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.36, 0]}>
        <torusGeometry args={[0.24, 0.02, 6, 16]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      {/* Legs */}
      {[0,1,2].map(i => {
        const a = (i/3)*Math.PI*2;
        return (
          <mesh key={i} castShadow position={[Math.cos(a)*0.16, 0.05, Math.sin(a)*0.16]}>
            <sphereGeometry args={[0.04, 6, 6]} />
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
      <mesh receiveShadow castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[length, 0.6, 0.2]} />
        <meshStandardMaterial color="#aaa" roughness={0.92} />
      </mesh>
      {Array.from({ length: Math.floor(length/2.5) + 1 }).map((_, i) => (
        <mesh key={i} castShadow position={[-length/2 + i*2.5, 0.45, 0]}>
          <boxGeometry args={[0.18, 0.9, 0.25]} />
          <meshStandardMaterial color="#999" roughness={0.9} />
        </mesh>
      ))}
      {/* Tile cap */}
      <mesh castShadow position={[0, 0.65, 0]}>
        <boxGeometry args={[length + 0.1, 0.06, 0.28]} />
        <meshStandardMaterial {...TILE_DARK} />
      </mesh>
    </group>
  );
}

// ─── Main Export ───
export default function SpiritualEnvironment() {
  return (
    <>
      <TempleGround />
      <Pagoda position={[0, 0, -6]} />
      <ToriiGate position={[0, 0, 10]} />

      {/* Stone lanterns — 6 along the path */}
      <StoneLantern position={[-2.5, 0, 7]} />
      <StoneLantern position={[2.5, 0, 7]} />
      <StoneLantern position={[-2.5, 0, 3]} />
      <StoneLantern position={[2.5, 0, 3]} />
      <StoneLantern position={[-3, 0, -1]} />
      <StoneLantern position={[3, 0, -1]} />

      {/* Incense burner in front of buddha */}
      <IncenseBurner position={[0, 0, 2.5]} />

      {/* Stone walls enclosing the temple */}
      <StoneWall position={[-8, 0, -2]} length={12} rotation={[0, Math.PI/2, 0]} />
      <StoneWall position={[8, 0, -2]} length={12} rotation={[0, Math.PI/2, 0]} />
      <StoneWall position={[0, 0, -12]} length={16} />
    </>
  );
}
