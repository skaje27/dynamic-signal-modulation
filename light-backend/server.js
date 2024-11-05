const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let greenLightIndex = 1; // Start with the first traffic light green
const INTERVAL = 30000; // 30 seconds interval

// Rotate green light every 30 seconds
setInterval(() => {
  greenLightIndex = (greenLightIndex % 4) + 1; // Cycle through 1, 2, 3, 4
  console.log(`Green light is now traffic light ${greenLightIndex}`);
}, INTERVAL);

// GET route to fetch the current green light index
app.get('/getGreenLight', (req, res) => {
  res.json({ greenLight: greenLightIndex, interval: INTERVAL });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
