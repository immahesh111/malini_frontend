// import "./App.css";
// import EnvironmentComp from "./components/Environment";
// import { Chat } from "./components/chat/Chat";
// import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import React, {useState, useEffect} from "react";
// import YouTubeVideo from "./components/YouTubeVideo";
// import Header from "./components/Header";
// import ImageDisplay from "./components/ImageDisplay";

// function App() {
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [showVideo, setShowVideo] = useState(false);
//   const [videoId, setVideoId] = useState(null);
//   const [isInteracting, setIsInteracting] = useState(false);
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [showImage, setShowImage] = useState(false); // New state for image visibility
//   const [imageUrl, setImageUrl] = useState(null); // New state for image URL

//   const handleVideoStart = () => {
//     setIsVideoPlaying(true);
//     setIsInteracting(true);
//   };

//   const handleVideoEnd = () => {
//     setIsVideoPlaying(false);
//     setIsInteracting(false);
//     setShowVideo(false);
//   };

//   useEffect(() => {
//     setIsInteracting(isSpeaking || showVideo || showImage); // Include showImage
//   }, [isSpeaking, showVideo, showImage]);

//   return (
//     <div style={{ position: "relative", width: "100%", height: "100vh" }}>
//       <Header />
//       <EnvironmentComp isSpeaking={isSpeaking} isVideoPlaying={isVideoPlaying} />
//       {showVideo && (
//         <YouTubeVideo
//           videoId={videoId}
//           onPlay={handleVideoStart}
//           onEnd={handleVideoEnd}
//         />
//       )}
//       {showImage && <ImageDisplay imageUrl={imageUrl} />}
//       <Chat
//         isSpeaking={isSpeaking}
//         showVideo={showVideo}
//         isInteracting={isInteracting}
//         setIsSpeaking={setIsSpeaking}
//         setShowVideo={setShowVideo}
//         setVideoId={setVideoId}
//         setShowImage={setShowImage} // Pass image setters
//         setImageUrl={setImageUrl}
//       />
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./App.css";
import EnvironmentComp from "./components/Environment";
import { Chat } from "./components/chat/Chat";
import YouTubeVideo from "./components/YouTubeVideo";
import Header from "./components/Header";
import ImageDisplay from "./components/ImageDisplay";

function App() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(true);
  const [userName, setUserName] = useState(null);
  const videoRef = useRef(null);

  const handleVideoStart = () => {
    setIsVideoPlaying(true);
    //setIsInteracting(true);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setIsInteracting(false);
    setShowVideo(false);
  };

  useEffect(() => {
    setIsInteracting(isSpeaking || showVideo || showImage || isRecognizing);
  }, [isSpeaking, showVideo, showImage, isRecognizing]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        console.log("Models loaded successfully");
      } catch (err) {
        console.error("Error loading models:", err);
        setIsRecognizing(false);
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video metadata to load
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded:", {
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight,
            });
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setIsRecognizing(false);
      }
    };

    const recognizeFace = async () => {
      const labels = ["aarushi", "Mahi","Kamlesh Sir","Jagdeesh Sir", "nandini","Pavan Sir","Bupinder Sir","tripti"];
      const labeledDescriptors = await Promise.all(
        labels.map(async (label) => {
          try {
            const img = await faceapi.fetchImage(`/faces/${label}.jpg`);
            const detection = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (!detection) {
              console.warn(`No face detected in ${label}.jpg`);
              return null;
            }
            return new faceapi.LabeledFaceDescriptors(label, [detection.descriptor]);
          } catch (error) {
            console.error(`Error loading image for ${label}:`, error);
            return null;
          }
        })
      ).then((descriptors) => descriptors.filter((d) => d !== null));

      if (labeledDescriptors.length === 0) {
        console.error("No valid face descriptors loaded. Face recognition aborted.");
        setIsRecognizing(false);
        return;
      }

      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
      console.log("Face matcher initialized with", labeledDescriptors.length, "known faces");

      const interval = setInterval(async () => {
        if (
          videoRef.current &&
          videoRef.current.srcObject &&
          videoRef.current.videoWidth > 0 &&
          videoRef.current.videoHeight > 0
        ) {
          try {
            const detections = await faceapi
              .detectAllFaces(videoRef.current)
              .withFaceLandmarks()
              .withFaceDescriptors();
            if (detections.length > 0) {
              const resizedDetections = faceapi.resizeResults(detections, {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
              });
              const results = resizedDetections.map((d) =>
                faceMatcher.findBestMatch(d.descriptor)
              );
              const bestMatch = results[0];
              console.log("Recognition result:", bestMatch);
              if (bestMatch.label !== "unknown" && bestMatch.distance < 0.6) { // Adjust threshold if needed
                setUserName(bestMatch.label);
                setIsRecognizing(false);
                clearInterval(interval);
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
              }
            }
          } catch (error) {
            console.error("Error during face detection:", error);
          }
        } else {
          console.log("Video not ready yet:", {
            videoElement: videoRef.current,
            width: videoRef.current?.videoWidth,
            height: videoRef.current?.videoHeight,
          });
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setIsRecognizing(false);
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        if (!userName) console.log("Face recognition timed out without a match");
      }, 10000);
    };

    loadModels()
      .then(startVideo)
      .then(recognizeFace)
      .catch((err) => {
        console.error("Face recognition setup error:", err);
        setIsRecognizing(false);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Header />
      <EnvironmentComp isSpeaking={isSpeaking} isVideoPlaying={isVideoPlaying} />
      {isRecognizing && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 20,
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "20px",
            }}
          >
            Recognizing your face...
          </p>
        </div>
      )}
      {showVideo && (
        <YouTubeVideo videoId={videoId} onPlay={handleVideoStart} onEnd={handleVideoEnd} />
      )}
      {showImage && <ImageDisplay imageUrl={imageUrl} />}
      <Chat
        isSpeaking={isSpeaking}
        showVideo={showVideo}
        isInteracting={isInteracting}
        setIsSpeaking={setIsSpeaking}
        setShowVideo={setShowVideo}
        setVideoId={setVideoId}
        setShowImage={setShowImage}
        setImageUrl={setImageUrl}
        userName={userName}
      />
    </div>
  );
}

export default App;