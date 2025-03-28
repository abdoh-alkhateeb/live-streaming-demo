import React, { useState } from "react";
import Streamer from "./Streamer";
import Listener from "./Listener";

const App = () => {
  const [mode, setMode] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
      {!mode ? (
        <>
          <h1>Select Role</h1>

          <button onClick={() => setMode("streaming")}>Streamer</button>
          <button onClick={() => setMode("listening")}>Listener</button>
        </>
      ) : mode === "streaming" ? (
        <Streamer />
      ) : (
        <Listener />
      )}
    </div>
  );
};

export default App;
