

// import { useEffect, useRef, useCallback } from "react";
// import { useGLTF, useAnimations } from "@react-three/drei";
// import * as THREE from "three";
// import modelPath from "./mahi_avatar.glb";

// export function Avatar({ isSpeaking, isVideoPlaying, ...props }) {
//   const group = useRef();
//   const { nodes, materials, animations } = useGLTF(modelPath);
//   const { actions } = useAnimations(animations, group);
//   const currentActionRef = useRef(null);
//   const isSpeakingRef = useRef(isSpeaking);

//   // Available talk animations
//   const randomTalkAnimations = ["talk1", "talk2", "talk3", "talk4"];
//   const initialTalkAnimation = "talk5";

//   // Update speaking ref when state changes
//   useEffect(() => {
//     isSpeakingRef.current = isSpeaking;
//   }, [isSpeaking]);

//   // Log available animations for debugging
//   useEffect(() => {
//     console.log("Available animations:", animations.map((a) => a.name));
//   }, [animations]);

//   // Play idle1 initially
//   useEffect(() => {
//     actions["idle1"]?.reset().play();
//   }, [actions]);

//   // Memoized animation player with smooth transitions
//   const playAnimation = useCallback(
//     (animName, loopType = THREE.LoopOnce) => {
//       const action = actions[animName];
//       if (!action) return;

//       // Fade out current action if exists
//       if (currentActionRef.current) {
//         currentActionRef.current.fadeOut(0.1);
//       }

//       // Configure and play new action
//       action
//         .reset()
//         .setEffectiveTimeScale(1)
//         .setEffectiveWeight(1)
//         .setLoop(loopType, Infinity)
//         .fadeIn(0.1)
//         .play();

//       currentActionRef.current = action;
//     },
//     [actions]
//   );

//   // Handle animation sequence for speaking
//   useEffect(() => {
//     const mixer = actions[initialTalkAnimation]?.getMixer();
//     if (!mixer) return;

//     const handleAnimationEnd = (event) => {
//       if (!isSpeakingRef.current || isVideoPlaying) return;

//       const nextAnim = randomTalkAnimations[
//         Math.floor(Math.random() * randomTalkAnimations.length)
//       ];
//       playAnimation(nextAnim);
//     };

//     mixer.addEventListener("finished", handleAnimationEnd);

//     return () => {
//       mixer.removeEventListener("finished", handleAnimationEnd);
//     };
//   }, [actions, playAnimation, isVideoPlaying]);

//   // Handle speaking state changes
//   useEffect(() => {
//     if (isVideoPlaying) return; // Video has priority

//     if (isSpeaking) {
//       playAnimation(initialTalkAnimation);
//     } else {
//       playAnimation("idle1", THREE.LoopRepeat);
//       currentActionRef.current = null;
//     }
//   }, [isSpeaking, actions, playAnimation, isVideoPlaying]);

//   // Handle video playback state changes
//   useEffect(() => {
//     if (isVideoPlaying) {
//       playAnimation("thank", THREE.LoopRepeat);
//     } else if (!isSpeaking) {
//       playAnimation("idle1", THREE.LoopRepeat);
//     }
//   }, [isVideoPlaying, isSpeaking, actions, playAnimation]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (currentActionRef.current) {
//         currentActionRef.current.stop();
//       }
//       Object.values(actions).forEach((action) => action?.stop());
//     };
//   }, [actions]);

//   return (
//     <group ref={group} {...props} dispose={null}>
//       <group name="Scene">
//         <group name="emilian-kasemi">
//           <skinnedMesh
//             name="avaturn_body"
//             geometry={nodes.avaturn_body.geometry}
//             material={materials.avaturn_body_material}
//             skeleton={nodes.avaturn_body.skeleton}
//           />
//           <skinnedMesh
//             name="avaturn_glasses_0"
//             geometry={nodes.avaturn_glasses_0.geometry}
//             material={materials.avaturn_glasses_0_material}
//             skeleton={nodes.avaturn_glasses_0.skeleton}
//           />
//           <skinnedMesh
//             name="avaturn_hair_0"
//             geometry={nodes.avaturn_hair_0.geometry}
//             material={materials.avaturn_hair_0_material}
//             skeleton={nodes.avaturn_hair_0.skeleton}
//           />
//           <skinnedMesh
//             name="avaturn_look_0"
//             geometry={nodes.avaturn_look_0.geometry}
//             material={materials.avaturn_look_0_material}
//             skeleton={nodes.avaturn_look_0.skeleton}
//           />
//           <skinnedMesh
//             name="avaturn_shoes_0"
//             geometry={nodes.avaturn_shoes_0.geometry}
//             material={materials.avaturn_shoes_0_material}
//             skeleton={nodes.avaturn_shoes_0.skeleton}
//           />
//           <primitive object={nodes.Hips} />
//         </group>
//       </group>
//     </group>
//   );
// }

// useGLTF.preload(modelPath);

import { useEffect, useRef, useCallback } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import modelPath from "./mahi_avatar.glb";

export function Avatar({ isSpeaking, isVideoPlaying, ...props }) {
  const group = useRef();
  const { scene, nodes, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);
  const currentActionRef = useRef(null);
  const isSpeakingRef = useRef(isSpeaking);

  // Access Head_Mesh for morph targets
  const headMesh = nodes["Head_Mesh"]; // Adjust this name if your head mesh has a different name

  // Define morph target indices for visemes and blinking
  const visemeIndices = {
    sil: headMesh?.morphTargetDictionary?.["viseme_sil"],
    PP: headMesh?.morphTargetDictionary?.["viseme_PP"],
    FF: headMesh?.morphTargetDictionary?.["viseme_FF"],
    TH: headMesh?.morphTargetDictionary?.["viseme_TH"],
    // Add more visemes as available in your model (e.g., viseme_AA, viseme_OO)
  };
  const blinkLeftIndex = headMesh?.morphTargetDictionary?.["eyeBlinkLeft"];
  const blinkRightIndex = headMesh?.morphTargetDictionary?.["eyeBlinkRight"];

  // Animation names for talking and idle states
  const randomTalkAnimations = ["talk1", "talk2", "talk3", "talk4"];
  const initialTalkAnimation = "talk5";

  // Update speaking ref when prop changes
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Log available animations for debugging (optional)
  useEffect(() => {
    console.log("Available animations:", animations.map((a) => a.name));
  }, [animations]);

  // Play idle animation on load
  useEffect(() => {
    actions["idle1"]?.reset().play();
  }, [actions]);

  // Memoized function to play animations with smooth transitions
  const playAnimation = useCallback(
    (animName, loopType = THREE.LoopOnce) => {
      const action = actions[animName];
      if (!action) return;

      // Fade out current action if it exists
      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(0.1);
      }

      // Configure and play new action
      action
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .setLoop(loopType, Infinity)
        .fadeIn(0.1)
        .play();

      currentActionRef.current = action;
    },
    [actions]
  );

  // Handle animation sequence when speaking
  useEffect(() => {
    const mixer = actions[initialTalkAnimation]?.getMixer();
    if (!mixer) return;

    const handleAnimationEnd = (event) => {
      if (!isSpeakingRef.current || isVideoPlaying) return;

      const nextAnim =
        randomTalkAnimations[Math.floor(Math.random() * randomTalkAnimations.length)];
      playAnimation(nextAnim);
    };

    mixer.addEventListener("finished", handleAnimationEnd);

    return () => {
      mixer.removeEventListener("finished", handleAnimationEnd);
    };
  }, [actions, playAnimation, isVideoPlaying]);

  // Handle speaking state changes
  useEffect(() => {
    if (isVideoPlaying) return; // Video playback takes priority

    if (isSpeaking) {
      playAnimation(initialTalkAnimation);
    } else {
      playAnimation("idle1", THREE.LoopRepeat);
      currentActionRef.current = null;
    }
  }, [isSpeaking, actions, playAnimation, isVideoPlaying]);

  // Handle video playback state changes
  useEffect(() => {
    if (isVideoPlaying) {
      playAnimation("thank", THREE.LoopRepeat);
    } else if (!isSpeaking) {
      playAnimation("idle1", THREE.LoopRepeat);
    }
  }, [isVideoPlaying, isSpeaking, actions, playAnimation]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (currentActionRef.current) {
        currentActionRef.current.stop();
      }
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions]);

  // Lip-syncing implementation
  useEffect(() => {
    if (!headMesh || !isSpeaking) return;

    const visemeSequence = ["sil", "PP", "FF", "TH"]; // Simulated viseme sequence
    let currentVisemeIndex = 0;

    const interval = setInterval(() => {
      // Reset all viseme morph targets to 0
      Object.values(visemeIndices).forEach((index) => {
        if (index !== undefined) headMesh.morphTargetInfluences[index] = 0;
      });

      // Activate the current viseme
      const currentViseme = visemeSequence[currentVisemeIndex];
      if (visemeIndices[currentViseme] !== undefined) {
        headMesh.morphTargetInfluences[visemeIndices[currentViseme]] = 1;
      }

      // Move to the next viseme in the sequence
      currentVisemeIndex = (currentVisemeIndex + 1) % visemeSequence.length;
    }, 200); // Switch viseme every 200ms

    // Cleanup interval when speaking stops or component unmounts
    return () => clearInterval(interval);
  }, [isSpeaking, headMesh, visemeIndices]);

  // Blinking implementation
  useEffect(() => {
    if (!headMesh) return;

    const blink = () => {
      if (blinkLeftIndex !== undefined && blinkRightIndex !== undefined) {
        // Trigger blink
        headMesh.morphTargetInfluences[blinkLeftIndex] = 1;
        headMesh.morphTargetInfluences[blinkRightIndex] = 1;

        // Reset after 200ms (blink duration)
        setTimeout(() => {
          headMesh.morphTargetInfluences[blinkLeftIndex] = 0;
          headMesh.morphTargetInfluences[blinkRightIndex] = 0;
        }, 200);
      }
    };

    const blinkInterval = setInterval(blink, 3000); // Blink every 3 seconds

    // Cleanup interval on unmount
    return () => clearInterval(blinkInterval);
  }, [headMesh, blinkLeftIndex, blinkRightIndex]);

  // Render the 3D model
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the GLTF model
useGLTF.preload(modelPath);