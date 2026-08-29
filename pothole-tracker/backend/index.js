const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Fake database — just an array for now
let potholes = [
  { id: 1, lat: 12.97, lng: 79.15, severity: "high", status: "unresolved", reportedAt: new Date() },
  { id: 2, lat: 12.98, lng: 79.16, severity: "low", status: "unresolved", reportedAt: new Date() }
];
let nextId = 3;

app.get('/', (req, res) => {
  res.send('FixMyRoad backend is running!');
});

app.get('/potholes', (req, res) => {
  res.json(potholes);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
