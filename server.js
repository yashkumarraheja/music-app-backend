const express = require('express');
const path = require('path');
const fs = require('fs'); // Node.js built-in module for file system operations
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port, default to 3000

// Enable CORS for your frontend application
// Replace 'http://localhost:5500' with the actual URL of your frontend when deployed
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all origins for now. Be more specific in production: 'http://yourfrontend.onrender.com'
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Serve static song files directly from the 'songs' directory
// This makes files like 'http://localhost:3000/songs/Song%20Name%201.mp3' accessible
app.use('/songs', express.static(path.join(__dirname, 'songs')));

// API endpoint to get the list of songs
app.get('/api/songs', async (req, res) => {
    try {
        const songsDirectory = path.join(__dirname, 'songs');
        const files = await fs.promises.readdir(songsDirectory);

        // Filter for common audio file extensions (add more if needed)
        const audioFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.mp3', '.wav', '.ogg', '.aac'].includes(ext);
        });

        // The frontend expects the raw, encoded filenames (like Song%20Name.mp3)
        // if you're using encodeURIComponent on the frontend.
        // If your frontend expects decoded names, you'd decode here.
        // Based on your frontend code: `decodeURIComponent(song.replaceAll("%20", " "))`
        // it seems the backend should send the raw, encoded names.
        res.json(audioFiles);

    } catch (err) {
        console.error("Error reading songs directory:", err);
        res.status(500).json({ error: "Failed to retrieve songs." });
    }
});

// Simple root route
app.get('/', (req, res) => {
    res.send('Music App Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access songs at http://localhost:${PORT}/songs/`);
    console.log(`Get song list at http://localhost:${PORT}/api/songs`);
});