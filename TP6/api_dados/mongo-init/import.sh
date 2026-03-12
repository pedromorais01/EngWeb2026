#!/bin/bash
mongoimport --db cinema --collection filmes --type json --file /docker-entrypoint-initdb.d/filmes.json --jsonArray
mongoimport --db cinema --collection atores --type json --file /docker-entrypoint-initdb.d/atores.json --jsonArray
mongoimport --db cinema --collection generos --type json --file /docker-entrypoint-initdb.d/generos.json --jsonArray
