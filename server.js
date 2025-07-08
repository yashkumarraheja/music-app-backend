const express = require('express');
const path = require('path');
const fs = require('fs'); 
const app = express();
const PORT = process.env.PORT || 3000; 

// Enable CORS for your frontend application
// Replace 'http://localhost:5500' with the actual URL of your frontend when deployed
const allowedOrigins = [
    'http://127.0.0.1:5500', 
    'http://localhost:5500', 
    'https://spotify-tau-wine.vercel.app',
    'https://music-app-backend-production-1dd4.up.railway.app/' 
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        
        console.log(`Blocked origin: ${origin}`); 
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next(); 
}); 




app.use('/songs', express.static(path.join(__dirname, 'Songs')));

// API endpoint to get the list of songs
app.get('/api/songs', async (req, res) => {
    try {
        const songsDirectory = path.join(__dirname, 'Songs');
        const files = await fs.promises.readdir(songsDirectory);

        // Filter for common audio file extensions (add more if needed)
        const audioFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.mp3', '.wav', '.ogg', '.aac'].includes(ext);
        });

        
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
