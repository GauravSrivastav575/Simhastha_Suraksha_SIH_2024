const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 6000;

// Enable CORS for Django server
app.use(
  cors({
    origin: 'http://localhost:8000', // Allow requests only from Django server
    methods: ['GET', 'POST'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
  })
);

// State variable to toggle
let myVariable = true;

// API endpoint to toggle the variable
app.post('/toggle-variable', (req, res) => {
  myVariable = !myVariable;
  res.json({ success: true, flag: myVariable });
});

// API endpoint to fetch the current state
app.get('/variable-state', (req, res) => {
  res.json({ flag: myVariable });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
