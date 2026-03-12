const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const API = process.env.API_URL || "http://api_dados:7789";

const d = () => new Date().toISOString();

app.get('/filmes', (req, res) => axios.get(API+'/filmes').then(r => res.render('filmes', { list: r.data, date: d() })).catch(e => res.status(500).send(e.message)));
app.get('/filmes/:id', (req, res) => axios.get(API+'/filmes/'+req.params.id).then(r => res.render('filme', { movie: r.data, date: d() })).catch(e => res.status(500).send(e.message)));

app.get('/atores', (req, res) => axios.get(API+'/atores').then(r => res.render('atores', { list: r.data, date: d() })).catch(e => res.status(500).send(e.message)));
app.get('/atores/:id', (req, res) => axios.get(API+'/atores/'+req.params.id).then(r => res.render('ator', { actor: r.data, date: d() })).catch(e => res.status(500).send(e.message)));

app.get('/generos', (req, res) => axios.get(API+'/generos').then(r => res.render('generos', { list: r.data, date: d() })).catch(e => res.status(500).send(e.message)));
app.get('/generos/:id', (req, res) => axios.get(API+'/generos/'+req.params.id).then(r => res.render('genero', { genre: r.data, date: d() })).catch(e => res.status(500).send(e.message)));

app.listen(7790, () => console.log('Interface na porta 7790'));
