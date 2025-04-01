// import React from "react";

// const ImageDisplay = ({ imageUrl }) => {
//   return (
//     <div style={{ position: "absolute", top: "15%", left: "26%", zIndex: 10 }}>
//       <img src={imageUrl} alt="Guide step" style={{ width: "1000px", height: "auto" }} />
//     </div>
//   );
// };

// export default ImageDisplay;

import React from "react";

const ImageDisplay = ({ imageUrls }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "15%",
        left: "26%",
        zIndex: 10,
        maxHeight: "70vh", // Limit height to fit within window
        overflowY: "auto", // Add scrolling if images exceed height
        display: "flex",
        flexDirection: "column",
        gap: "10px", // Space between images
      }}
    >
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Image ${index + 1}`}
          style={{
            width: "100%", // Responsive width
            maxWidth: "800px", // Adjusted to fit better
            height: "auto",
            objectFit: "contain", // Ensure images maintain aspect ratio
          }}
        />
      ))}
    </div>
  );
};

export default ImageDisplay;