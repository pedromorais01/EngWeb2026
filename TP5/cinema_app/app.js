const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 7777;
const DB_URL = 'http://localhost:3000';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get(['/', '/filmes'], async (req, res) => {
  try {
    const response = await axios.get(`${DB_URL}/filmes`);
    res.render('filmes', { filmes: response.data });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

app.get('/filmes/:id', async (req, res) => {
  try {
    const response = await axios.get(`${DB_URL}/filmes/${req.params.id}`);
    res.render('filme', { filme: response.data });
  } catch (error) {
    res.status(404).render('error', { error: 'Filme não encontrado.' });
  }
});

app.get('/atores', async (req, res) => {
  try {
    const response = await axios.get(`${DB_URL}/atores?_sort=nome`);
    res.render('atores', { atores: response.data });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

app.get('/atores/:id', async (req, res) => {
  try {
    const response = await axios.get(`${DB_URL}/atores/${req.params.id}`);
    res.render('ator', { ator: response.data });
  } catch (error) {
    res.status(404).render('error', { error: 'Ator não encontrado.' });
  }
});

app.get('/generos', async (req, res) => {
  try {
    const response = await axios.get(`${DB_URL}/generos?_sort=nome`);
    res.render('generos', { generos: response.data });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

app.get('/generos/:id', async (req, res) => {
  try {
    const response = await axios.get(`${DB_URL}/generos/${req.params.id}`);
    res.render('genero', { genero: response.data });
  } catch (error) {
    res.status(404).render('error', { error: 'Género não encontrado.' });
  }
});

// Error handling view
app.use((req, res) => {
    res.status(404).render('error', { error: 'Página não encontrada.' });
});

app.listen(PORT, () => {
  console.log(`Cinema App listening on http://localhost:${PORT}`);
});
