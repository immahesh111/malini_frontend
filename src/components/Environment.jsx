import { Gltf, Environment, CameraControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import React, { Suspense, useRef, useEffect, useState } from "react";
import {Avatar} from '../../public/models/Mahi-avatar'
import {Classroom} from '../../public/models/Classroom'
import * as THREE from "three";
import { EXRLoader } from 'three/examples/jsm/Addons.js';
import { suspend } from 'suspend-react'


function EXREnvironment() {
  const { scene } = useThree();
  
  useEffect(() => {
    const loader = new EXRLoader();
    loader.load(
      '/src/components/images/studio_small_08_4k.exr',
      (loadedTexture) => {
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
        loadedTexture.rotation = Math.PI / 4;
        scene.environment = loadedTexture; // Sets the environment map for lighting/reflections
        scene.background = loadedTexture;  // Sets the texture as the visible background
      },
      undefined,
      (error) => {
        console.error('Error loading EXR texture:', error);
      }
    );
  }, [scene]);

  return null;
}

export default function EnvironmentComp({ isSpeaking }) {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      if (isSpeaking) {
        controls.dollyIn(1.2); // Zoom in slightly when speaking
      } else {
        controls.dollyOut(1.2); // Zoom out when not speaking
      }
    }
  }, [isSpeaking]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* 3D Background */}
      <Canvas>
        <OrbitControls ref={controlsRef} />
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={2} color={"white"} />
        <EXREnvironment />
      </Canvas>

      {/* 2D Image/GIF Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '10%',          // Adjustable: Distance from bottom
        left: '8%',           // Adjustable: Centers horizontally
        transform: 'translateX(-50%)', // Centers the image/GIF
        zIndex: 1,             // Ensures it appears above the canvas
      }}>
        {isSpeaking ? (
          <img
            src="/src/components/images/malini.gif" // Replace with your GIF path
            alt="Speaking GIF"
            style={{ width: '600px', height: '350px' }} // Adjustable size
          />
        ) : (
          <img
            src="/src/components/images/malinipng.png"   // Replace with your PNG path
            alt="Idle PNG"
            style={{ width: '600px', height: '300px' }} // Same size as GIF
          />
        )}
      </div>
    </div>
  );
}