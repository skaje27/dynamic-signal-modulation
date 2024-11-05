import React, { useState, useEffect } from "react";
import axios from "axios";

const TrafficLightController = () => {
  const [activeLight, setActiveLight] = useState(0); // Initial active light
  const [nextLight, setNextLight] = useState(1); // Next active light
  const [countdown, setCountdown] = useState(29); // Countdown timer initialized to 29 seconds
  const TOTAL_LIGHTS = 3; // Total number of traffic lights

  // Fetch initial green light state
  const fetchGreenLight = async () => {
    try {
      const response = await axios.get("http://localhost:4000/getGreenLight");
      setActiveLight(response.data.greenLight - 1); // Adjust to zero-based index
      setNextLight((response.data.greenLight % TOTAL_LIGHTS)); // Set the next light
    } catch (error) {
      console.error("Error fetching green light status:", error);
    }
  };

  // Poll backend and update countdown every second
  useEffect(() => {
    fetchGreenLight(); // Fetch initial green light state

    const countdownIntervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          setActiveLight(nextLight); // Change to next light
          setNextLight((nextLight + 1) % TOTAL_LIGHTS); // Set next light
          return 29; // Reset countdown to 29 seconds
        }
        return prevCountdown - 1; // Update countdown
      });
    }, 1000);

    return () => {
      clearInterval(countdownIntervalId); // Cleanup countdown interval
    };
  }, [nextLight]);

  const renderTrafficLight = (index) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          fontSize: "16px", // Smaller font size
          fontWeight: "bold",
          color: "black",
          marginBottom: "5px",
        }}
      >
        {index === activeLight ? countdown : "--"}s
      </div>
      <div
        style={{
          backgroundColor: "black",
          padding: "15px", // Smaller padding
          borderRadius: "10px",
          width: "80px", // Smaller width
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {["red", "yellow", "green"].map((color, i) => {
          let backgroundColor;

          if (index === activeLight) {
            if (countdown > 2) {
              backgroundColor = color === "green" ? "green" : "grey";
            } else if (countdown <= 2) {
              backgroundColor = color === "yellow" ? "yellow" : "grey";
            }
          } else if (index === nextLight && countdown <= 2) {
            backgroundColor = color === "yellow" ? "yellow" : "grey";
          } else {
            backgroundColor = color === "red" ? "red" : "grey";
          }

          return (
            <div
              key={i}
              style={{
                width: "40px", // Smaller light size
                height: "40px",
                margin: "5px",
                borderRadius: "50%",
                backgroundColor,
              }}
            ></div>
          );
        })}
      </div>
      <div
        style={{
          width: "5px",
          height: "60px",
          backgroundColor: "black",
          marginTop: "5px",
        }}
      ></div>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>Traffic Light Timer</h2>
      </div>
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Left Traffic Light */}
        <div style={{ position: "absolute", top: "6%", left: "30%" }}>
          {renderTrafficLight(0)} {/* First traffic light in the left position */}
        </div>

        {/* Bottom Traffic Light */}
        <div style={{ position: "absolute", bottom: "30%", left: "50%", transform: "translateX(-50%)" }}>
          {renderTrafficLight(1)} {/* Second traffic light in the bottom position */}
        </div>

        {/* Right Traffic Light */}
        <div style={{ position: "absolute", top: "6%", right: "30%" }}>
          {renderTrafficLight(2)} {/* Third traffic light in the right position */}
        </div>
      </div>
    </div>
  );
};

export default TrafficLightController;
