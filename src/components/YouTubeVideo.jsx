// import React, { useEffect, useRef } from "react";

// const YouTubeVideo = ({ videoId, onEnd }) => {
//   const playerRef = useRef(null);

//   useEffect(() => {
//     const tag = document.createElement("script");
//     tag.src = "https://www.youtube.com/iframe_api";
//     const firstScriptTag = document.getElementsByTagName("script")[0];
//     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//     window.onYouTubeIframeAPIReady = () => {
//       playerRef.current = new window.YT.Player("youtube-player", {
//         videoId: videoId,
//         playerVars: { autoplay: 1, controls: 1 },
//         events: {
//           onStateChange: (event) => {
//             if (event.data === window.YT.PlayerState.ENDED) {
//               onEnd();
//             }
//           },
//         },
//       });
//     };

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.destroy();
//       }
//     };
//   }, [videoId, onEnd]);

//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "60%",
//         left: "75%",
//         transform: "translate(-50%, -50%)",
//         width: "80vw",
//         height: "80vh",
//         zIndex: 10,
//       }}
//     >
//       <div id="youtube-player"></div>
//     </div>
//   );
// };

// export default YouTubeVideo;

// import { useEffect, useRef } from 'react';

// function YouTubeVideo({ videoId, onEnd }) {
//   const playerRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const loadPlayer = () => {
//       if (window.YT && window.YT.Player && containerRef.current) {
//         playerRef.current = new window.YT.Player('youtube-player', {
//           videoId: videoId,
//           width: containerRef.current.clientWidth,
//           height: containerRef.current.clientHeight,
//           playerVars: { autoplay: 1, controls: 1 },
//           events: {
//             onStateChange: (event) => {
//               console.log('Player state:', event.data);
//               if (event.data === window.YT.PlayerState.ENDED) {
//                 onEnd();
//               }
//             },
//           },
//         });
//       }
//     };

//     if (window.YT && window.YT.Player) {
//       loadPlayer();
//     } else {
//       window.onYouTubeIframeAPIReady = loadPlayer;
//       if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
//         const tag = document.createElement('script');
//         tag.src = 'https://www.youtube.com/iframe_api';
//         const firstScriptTag = document.getElementsByTagName('script')[0];
//         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//       }
//     }

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.destroy();
//       }
//     };
//   }, [videoId, onEnd]);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: '60vw',
//         height: '80vh',
//         zIndex: 20,
//       }}
//     >
//       <div id="youtube-player"></div>
//     </div>
//   );
// }

// export default YouTubeVideo;

import { useEffect, useRef } from 'react';

function YouTubeVideo({ videoId, onPlay, onEnd }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadPlayer = () => {
      if (window.YT && window.YT.Player && containerRef.current) {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: videoId,
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
          playerVars: { autoplay: 1, controls: 1 },
          events: {
            onStateChange: (event) => {
              console.log('Player state:', event.data);
              if (event.data === window.YT.PlayerState.PLAYING) {
                onPlay(); // Call onPlay when video starts playing
              } else if (event.data === window.YT.PlayerState.ENDED) {
                onEnd(); // Call onEnd when video ends
              }
            },
            onError: (event) => {
              console.error('YouTube player error:', event.data);
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      window.onYouTubeIframeAPIReady = loadPlayer;
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onPlay, onEnd]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '80vh',
        zIndex: 20,
      }}
    >
      <div id="youtube-player"></div>
    </div>
  );
}

export default YouTubeVideo;