import React from "react";                            
import logo from "../assets/Padget.png"; // Replace with the actual path to your logo


const Header = () => {
  const mainHeaderText = "Malini AI Assistant";
  const subHeaderText = "Machine AI Line Intelligence and Notification IoT";
  const subHeaderWords = subHeaderText.split(' ');

  return (
    <div style={headerStyle}>
      <img src={logo} alt="Logo" style={logoStyle} />
      <div style={{ textAlign: "center" }}>
        <h1 style={headingStyle1}>{mainHeaderText}</h1>
        <h2 style={headingStyle}>
          {subHeaderWords.map((word, index) => (
            <span key={index}>
              <b>{word.charAt(0)}</b>{word.slice(1)}{' '}
            </span>
          ))}
        </h2>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const headerStyle = {
  position: "fixed", // Changed to fixed to keep it at the top
  top: "0px",
  left: "0px",
  width: "100%", // Ensures it spans the full width
  display: "flex",
  justifyContent: "center", // Centers the heading
  alignItems: "center",
  zIndex: 10, // Ensures it stays above other content
  flexDirection: "column", // Stack elements vertically
};

const logoStyle = {
  position: "absolute", // Positioning logo absolutely within the header
  top: "10px", // Adjust as needed
  left: "30px", // Fixed position on the left
  width: "220px", // Adjust size as needed
  height: "80px",
};

const headingStyle = {
  color: "#41407d", // Adjust based on your background
  fontSize: "20px",
  fontFamily: "Montserrat",
  margin: 10, // White background behind the text
  padding: "10px 20px", // Padding around the text for better spacing
  borderRadius: "5px", // Optional: adds rounded corners to the background
};

const headingStyle1 = {
  color: "#41407d", // Adjust based on your background
  fontSize: "30px",
  fontFamily: "Montserrat",
  fontWeight: "bold",
  margin: 10,
  backgroundColor: "white", // White background behind the text
  padding: "10px 20px", // Padding around the text for better spacing
  borderRadius: "5px", // Optional: adds rounded corners to the background
};



export default Header;
