const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.MONGO_URL || 'mongodb://mongodb:27017/cinema');

// Definição dos Esquemas com referências para populate
const filmSchema = new mongoose.Schema({
    _id: String,
    title: String,
    year: Number,
    cast: [{ type: String, ref: 'Actor' }],
    genres: [{ type: String, ref: 'Genre' }]
}, { versionKey: false });

const actorSchema = new mongoose.Schema({
    _id: String,
    name: String,
    movies: [{ type: String, ref: 'Film' }]
}, { versionKey: false });

const genreSchema = new mongoose.Schema({
    _id: String,
    name: String,
    movies: [{ type: String, ref: 'Film' }]
}, { versionKey: false });

const Film = mongoose.model('Film', filmSchema, 'filmes');
const Actor = mongoose.model('Actor', actorSchema, 'atores');
const Genre = mongoose.model('Genre', genreSchema, 'generos');

// Rotas com .populate() para obter objetos em vez de IDs
app.get('/filmes', (req, res) => Film.find().then(d => res.json(d)).catch(e => res.status(500).send(e)));
app.get('/filmes/:id', (req, res) => Film.findById(req.params.id).populate('cast').populate('genres').then(d => res.json(d)).catch(e => res.status(500).send(e)));

app.get('/atores', (req, res) => Actor.find().then(d => res.json(d)).catch(e => res.status(500).send(e)));
app.get('/atores/:id', (req, res) => Actor.findById(req.params.id).populate('movies').then(d => res.json(d)).catch(e => res.status(500).send(e)));

app.get('/generos', (req, res) => Genre.find().then(d => res.json(d)).catch(e => res.status(500).send(e)));
app.get('/generos/:id', (req, res) => Genre.findById(req.params.id).populate('movies').then(d => res.json(d)).catch(e => res.status(500).send(e)));

app.listen(7789, () => console.log('API na porta 7789'));
