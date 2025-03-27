import React from "react";

const ImageDisplay = ({ imageUrl }) => {
  return (
    <div style={{ position: "absolute", top: "15%", left: "26%", zIndex: 10 }}>
      <img src={imageUrl} alt="Guide step" style={{ width: "1000px", height: "auto" }} />
    </div>
  );
};

export default ImageDisplay;