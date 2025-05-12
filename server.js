const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const path = require('path');

app.use(cors());
app.use(express.json());

let gameState = {
    currentRound: 1,
    maxRounds: 80,
    roundInterval: 20000, // 20 seconds
    results: [],
    votes: { heads: 0, tails: 0 },
    roundStartTime: Date.now()
};

// Get current game state
app.get('/api/game', (req, res) => {
    res.json(gameState);
});

// Submit a vote
app.post('/api/vote', (req, res) => {
    const { choice } = req.body;
    if (choice === 'heads') {
        gameState.votes.heads++;
    } else if (choice === 'tails') {
        gameState.votes.tails++;
    }
    res.json({ success: true });
});

// Generate new result when round ends
function generateResult() {
    // Completely random result (50/50 with 1% chance for tie)
    let result;
    if (Math.random() < 0.01) {
        result = 'T'; // Tie
    } else {
        result = Math.random() < 0.5 ? 'H' : 'T';
    }
    
    gameState.results.push(result);
    gameState.currentRound++;
    gameState.votes = { heads: 0, tails: 0 };
    gameState.roundStartTime = Date.now();
    
    // Reset after max rounds
    if (gameState.currentRound > gameState.maxRounds) {
        gameState = {
            currentRound: 1,
            maxRounds: 80,
            roundInterval: 20000,
            results: [],
            votes: { heads: 0, tails: 0 },
            roundStartTime: Date.now()
        };
    }
}
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Game loop
setInterval(generateResult, gameState.roundInterval);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});