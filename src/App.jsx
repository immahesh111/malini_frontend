import "./App.css";
import EnvironmentComp from "./components/Environment";
import { Chat } from "./components/chat/Chat";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, {useState, useEffect} from "react";
import YouTubeVideo from "./components/YouTubeVideo";
import Header from "./components/Header";
import ImageDisplay from "./components/ImageDisplay";

function App() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showImage, setShowImage] = useState(false); // New state for image visibility
  const [imageUrl, setImageUrl] = useState(null); // New state for image URL

  const handleVideoStart = () => {
    setIsVideoPlaying(true);
    setIsInteracting(true);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setIsInteracting(false);
    setShowVideo(false);
  };

  useEffect(() => {
    setIsInteracting(isSpeaking || showVideo || showImage); // Include showImage
  }, [isSpeaking, showVideo, showImage]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Header />
      <EnvironmentComp isSpeaking={isSpeaking} isVideoPlaying={isVideoPlaying} />
      {showVideo && (
        <YouTubeVideo
          videoId={videoId}
          onPlay={handleVideoStart}
          onEnd={handleVideoEnd}
        />
      )}
      {showImage && <ImageDisplay imageUrl={imageUrl} />}
      <Chat
        isSpeaking={isSpeaking}
        showVideo={showVideo}
        isInteracting={isInteracting}
        setIsSpeaking={setIsSpeaking}
        setShowVideo={setShowVideo}
        setVideoId={setVideoId}
        setShowImage={setShowImage} // Pass image setters
        setImageUrl={setImageUrl}
      />
    </div>
  );
}

export default App;
