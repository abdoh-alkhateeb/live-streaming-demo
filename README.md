# Live Streaming Demo

## Introduction

This demonstration showcases how to use WebRTC to enable live audio streaming, such as for live podcasts. The backend consists of a simple signaling server using **Socket.IO**, while the frontend is a **React** application bundled with **Webpack**. The core peer-to-peer communication is handled by the **Simple Peer** library.

## Objective

Our goal is to create a **one-to-many** live streaming system where a single user (the streamer) streams audio, and multiple users (listeners) can tune in and receive the stream in real time.

There are multiple methods to achieve this, but we focus on a **WebRTC-based approach** due to its low-latency capabilities and peer-to-peer architecture.

## Tools and Technologies

### Web Sockets

WebSockets provide full-duplex communication channels over a single TCP connection, enabling real-time interaction between clients and servers.

### Socket.IO

[Socket.IO](https://socket.io/) is a JavaScript library that facilitates real-time, bidirectional, and event-driven communication between web clients and servers.

We use **Socket.IO** over plain WebSockets because:

- It simplifies the process of handling WebSocket connections.
- It provides automatic reconnection and fallback mechanisms (e.g., polling if WebSockets are unavailable).
- It offers built-in room management, making it easier to handle multiple streams.

### WebRTC

[WebRTC](https://webrtc.org/) (Web Real-Time Communication) is an open-source technology that allows web browsers and mobile applications to communicate directly using **audio**, **video**, and **data channels** without requiring external plugins or software.

Key advantages of WebRTC:

- **Peer-to-peer communication** reduces the load on the server.
- **Low latency**, making it ideal for live streaming.
- **Cross-browser support** (Chrome, Firefox, Safari, Edge, etc.).

### Simple Peer

[Simple Peer](https://github.com/feross/simple-peer) is a lightweight JavaScript library that simplifies WebRTC peer-to-peer connections. It abstracts away much of WebRTC's complexity and provides a cleaner API for handling video/audio streaming and data transfer.

## System Architecture

### How It Works

1. The **streamer (broadcaster)** initiates a WebRTC connection.
2. A **signaling server** (using Socket.IO) facilitates peer connection establishment by exchanging connection metadata.
3. **Listeners** join the session and receive the audio stream from the streamer.

#### Handling One-to-Many Streaming

Since **Simple Peer** only supports **one-to-one** connections, we handle the **one-to-many** setup by:

- **Creating a collection of peers on the streamer**:
  - For each new listener that joins, the streamer creates a new **Simple Peer** instance to establish a direct connection with that listener.
  - This ensures each listener gets a dedicated WebRTC connection from the streamer.
- **Using Socket.IO rooms for listener-streamer matching**:
  - The streamer and listeners join a specific **Socket.IO room** based on the randomly-generated stream ID.
  - When a listener joins, the streamer is notified via Socket.IO and sets up a new peer connection.
  - The streamer then sends its audio stream to the newly connected listener.

This approach allows **efficient real-time audio streaming** while keeping the architecture scalable and simple.

### Why We Chose This Approach

- **Scalability**: Since WebRTC is peer-to-peer, the server does not need to handle the actual media streams, reducing bandwidth costs.
- **Low Latency**: Direct communication between peers minimizes delays.
- **Ease of Implementation**: Using **Socket.IO** simplifies signaling, and **Simple Peer** makes WebRTC connections more manageable.

## Final Words

This demo serves as a foundation for building **low-latency, scalable** live audio streaming applications. Future enhancements could include **video support**, **authentication mechanisms**, or **media relays** for handling a larger number of listeners.
