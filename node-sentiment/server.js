// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/predictWeight', (req, res) => {
  const height = req.body.height;

  axios.post('http://127.0.0.1:5000/predict', { height: height })
    .then(response => {
      const predictedWeight = response.data.prediction_text;
      res.send(`Predicted weight: ${predictedWeight}`);
    })
    .catch(error => {
      console.error('Error predicting weight:', error);
      res.status(500).send('Error predicting weight');
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
