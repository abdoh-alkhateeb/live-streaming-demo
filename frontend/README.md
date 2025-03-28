# Frontend Setup

## Running the Frontend

1. Navigate to the frontend directory:
   ```sh
   cd path/to/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the project:
   ```sh
   npm run build
   ```
4. Serve the app:
   ```sh
   npm run serve
   ```

Alternatively, you can use:

```sh
npm run dev
```

to start the app in development mode, which combines building and serving (steps 3 and 4).

### Configuration

To set the URL of the signaling server, create a `.env` file in the frontend directory with the following variable:

```sh
SIGNALING_SERVER_URL=<your_server_url>
```
