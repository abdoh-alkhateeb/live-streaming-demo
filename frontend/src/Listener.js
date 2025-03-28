import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

const SIGNALING_SERVER_URL = process.env.SIGNALING_SERVER_URL || "http://localhost:3000";

const Listener = () => {
  const [isListening, setIsListening] = useState(false);
  const [streamId, setStreamId] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isListening || !streamId) return;

    const socket = io(SIGNALING_SERVER_URL);
    const peer = new Peer({ initiator: false });

    let streamerId;

    socket.emit("room:join", streamId);

    socket.once("room:streamer-connected", (originId) => {
      streamerId = originId;
    });

    socket.on("peer:signal", (_, data) => {
      peer.signal(data);
    });

    peer.on("signal", (data) => {
      socket.emit("peer:signal", streamerId, data);
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
  }, [isListening, streamId]);

  return (
    <>
      <h1>Listener</h1>

      <input
        type="text"
        value={streamId}
        onChange={({ target: { value } }) => setStreamId(value)}
        disabled={isListening}
      />

      <button onClick={() => streamId && setIsListening(true)} disabled={isListening}>
        Listen to Audio Stream
      </button>

      <audio ref={audioRef} controls autoPlay />
    </>
  );
};

export default Listener;
