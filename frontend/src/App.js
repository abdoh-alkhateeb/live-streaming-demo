import React, { useState } from "react";
import Streamer from "./Streamer";
import Listener from "./Listener";

const App = () => {
  const [mode, setMode] = useState(null);

  if (!mode) {
    return (
      <>
        <h1>Select Role</h1>

        <button onClick={() => setMode("streaming")}>Streamer</button>
        <button onClick={() => setMode("listening")}>Listener</button>
      </>
    );
  }

  return mode === "streaming" ? <Streamer /> : <Listener />;
};

export default App;
