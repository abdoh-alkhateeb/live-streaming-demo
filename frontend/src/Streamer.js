import React, { useEffect, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

const SIGNALING_SERVER_URL = process.env.SIGNALING_SERVER_URL || "http://localhost:3000";

const Streamer = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState("");

  useEffect(() => {
    if (!isStreaming || !streamId) return;

    let stream;
    let socket;

    const peers = {};

    const setUpStreaming = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      socket = io(SIGNALING_SERVER_URL);

      socket.emit("room:join", streamId);

      socket.on("room:listener-joined", (listenerId) => {
        const peer = new Peer({
          initiator: true,
          stream: stream,
        });

        peer.on("signal", (data) => {
          socket.emit("peer:signal", listenerId, data);
        });

        peers[listenerId] = peer;
      });

      socket.on("peer:signal", (originId, data) => {
        peers[originId]?.signal(data);
      });
    };

    setUpStreaming();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (socket) socket.disconnect();

      Object.values(peers).forEach((peer) => peer.destroy());
    };
  }, [isStreaming, streamId]);

  const startStream = () => {
    setStreamId(Math.random().toString(36).slice(2, 9));
    setIsStreaming(true);
  };

  return (
    <>
      <h1>Streamer</h1>

      <button onClick={startStream} disabled={isStreaming}>
        Start Streaming Audio
      </button>

      {streamId && <div>Stream ID: {streamId}</div>}
    </>
  );
};

export default Streamer;
