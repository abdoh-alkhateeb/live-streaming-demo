import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

const SIGNALING_SERVER_URL = process.env.SIGNALING_SERVER_URL || "http://localhost:3000";

const Listener = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [streamId, setStreamId] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isConnected) return;

    const socket = io(SIGNALING_SERVER_URL);
    const peer = new Peer({ initiator: true });

    socket.emit("join", streamId);

    peer.on("signal", (data) => {
      socket.emit("signal", streamId, data);
    });

    socket.on("signal", (data) => {
      peer.signal(data);
    });

    peer.on("stream", (stream) => {
      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        audioRef.current.play().catch(console.error);
      }
    });

    return () => {
      socket.disconnect();
      peer.destroy();
    };
  }, [isConnected, streamId]);

  return (
    <>
      <h1>Listener</h1>

      <input
        type="text"
        value={streamId}
        onChange={({ target: { value } }) => setStreamId(value)}
        disabled={isConnected}
      />

      <button onClick={() => streamId && setIsConnected(true)} disabled={isConnected}>
        Connect to Stream
      </button>

      <audio ref={audioRef} controls autoPlay />
    </>
  );
};

export default Listener;
