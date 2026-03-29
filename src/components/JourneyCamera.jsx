import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_POSITION = new THREE.Vector3(5, 3, 8);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.5, 0);

export default function JourneyCamera({ target, controlsRef }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const isReturning = useRef(false);

  useFrame(() => {
    if (target) {
      // Journey active: lerp camera toward waypoint
      targetPos.current.set(...target.position);
      targetLook.current.set(...target.target);
      isReturning.current = false;

      camera.position.lerp(targetPos.current, 0.02);

      if (controlsRef?.current?.target) {
        controlsRef.current.target.lerp(targetLook.current, 0.02);
        controlsRef.current.update();
      }
    } else if (!isReturning.current) {
      isReturning.current = true;
    }

    if (isReturning.current) {
      camera.position.lerp(DEFAULT_POSITION, 0.015);
      if (controlsRef?.current?.target) {
        controlsRef.current.target.lerp(DEFAULT_TARGET, 0.015);
        controlsRef.current.update();
      }

      // Stop returning once close enough
      if (camera.position.distanceTo(DEFAULT_POSITION) < 0.1) {
        isReturning.current = false;
      }
    }
  });

  return null;
}
