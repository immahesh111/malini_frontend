import React, { useEffect, useRef } from "react";

const YouTubeVideo = ({ videoId, onPlay, onEnd }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: { autoplay: 1, controls: 1 },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              onPlay(); // Call onPlay when the video starts playing
            } else if (event.data === window.YT.PlayerState.ENDED) {
              onEnd(); // Call onEnd when the video ends
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onPlay, onEnd]);

  return (
    <div
      style={{
        position: "absolute",
        top: "60%",
        left: "75%",
        transform: "translate(-50%, -50%)",
        width: "80vw",
        height: "80vh",
        zIndex: 10,
      }}
    >
      <div id="youtube-player"></div>
    </div>
  );
};

export default YouTubeVideo;