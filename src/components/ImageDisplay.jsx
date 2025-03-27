import React from "react";

const ImageDisplay = ({ imageUrl }) => {
  return (
    <div style={{ position: "absolute", top: "20%", right: "29%", zIndex: 10 }}>
      <img src={imageUrl} alt="Guide step" style={{ width: "800px", height: "auto" }} />
    </div>
  );
};

export default ImageDisplay;