import React from "react";

const Loader = () => {
  // Styles for the loader container
  const loaderContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  };

  // Styles for the spinner
  const spinnerStyle = {
    border: "8px solid rgb(255, 255, 255)",
    borderTop: "9px solid rgb(168, 0, 11)",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
    marginBottom: "10px",
    borderLeft: '5px solid rgb(202, 0, 13)',
    borderBottom: '3px solid rgb(240, 0, 16)'
  };

  return (
    <div style={loaderContainerStyle}>
      <div style={spinnerStyle}></div>
      <h3>Loading...</h3>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
