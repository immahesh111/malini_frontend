import React, { useEffect, useRef } from "react";

const YouTubeVideo = ({ videoId, onEnd, width = "80vw", height = "80vh" }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Load the YouTube Iframe API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize the player when the API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        width: width,   // Directly set the player's width
        height: height, // Directly set the player's height
        videoId: videoId,
        playerVars: { autoplay: 1, controls: 1 },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onEnd();
            }
          },
        },
      });
    };

    // Cleanup: Destroy the player when the component unmounts
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onEnd]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: width,
        height: height,
        zIndex: 10,
      }}
    >
      <div id="youtube-player"></div>
    </div>
  );
};

export default YouTubeVideo;