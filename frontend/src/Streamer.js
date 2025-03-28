import React, { useEffect, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

const SIGNALING_SERVER_URL = process.env.SIGNALING_SERVER_URL || "http://localhost:3000";

const Streamer = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState("");

  useEffect(() => {
    if (!isStreaming) return;

    let stream;
    let socket;
    let peer;

    const setUpStreamingMode = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      socket = io(SIGNALING_SERVER_URL);
      peer = new Peer({
        initiator: false,
        stream: stream,
      });

      socket.emit("join", streamId);

      peer.on("signal", (data) => {
        socket.emit("signal", streamId, data);
      });

      socket.on("signal", (data) => {
        peer.signal(data);
      });
    };

    setUpStreamingMode();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (socket) socket.disconnect();
      if (peer) peer.destroy();
    };
  }, [isStreaming]);

  const startStream = () => {
    setStreamId(Math.random().toString(36).slice(2, 9));
    setIsStreaming(true);
  };

  return (
    <>
      <h1>Streamer</h1>

      {streamId && <div>Stream ID: {streamId}</div>}

      <button onClick={startStream} disabled={isStreaming}>
        Start Streaming Audio
      </button>
    </>
  );
};

export default Streamer;
