// server.js
// Old json-server package.json command for starting the server
// "server": "json-server --watch backend/cities.json --port 9000 --delay 500"
'use strict';
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 9000;
const DATA_FILE = path.join(__dirname, 'cities.json');

app.use(cors());
app.use(bodyParser.json());

app.get('/cities', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const cities = JSON.parse(data).cities;
    res.json(cities); // Send only the 'cities' array
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send('Backend Error: Cannot read the cities list from server');
  }
});

app.get('/cities/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const cities = JSON.parse(data).cities;
    const city = cities.find((c) => c.id == id);
    if (city) {
      res.json(city);
    } else {
      res.status(404).send('City not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Backend Error: Cannot read City:${city}`);
  }
});

app.post('/cities', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const cities = JSON.parse(data).cities;
    const newCity = req.body;

    // Generate a unique ID using uuid
    newCity.id = uuidv4();

    cities.push(newCity);
    await fs.writeFile(DATA_FILE, JSON.stringify({ cities }, null, 2));
    res.json(newCity);
  } catch (error) {
    console.error(error);
    res.status(500).send('Backend Error: Cannot add a new city');
  }
});

app.delete('/cities/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    let cities = JSON.parse(data).cities;
    cities = cities.filter((c) => c.id != id);
    await fs.writeFile(DATA_FILE, JSON.stringify({ cities }, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('Backend Error: Cannot delete the city');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
