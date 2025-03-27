import React, { useEffect, useRef } from "react";

const YouTubeVideo = ({ videoId, onEnd }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Load YouTube Iframe API
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
            if (event.data === window.YT.PlayerState.ENDED) {
              onEnd();
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
  }, [videoId, onEnd]);

  return (
    <div
      style={{
        position: "absolute",
        top: "20%",
        right: "20%",
        width: "900px",
        height: "600px",
        zIndex: 10,
      }}
    >
      <div id="youtube-player"></div>
    </div>
  );
};

export default YouTubeVideo;