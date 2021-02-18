// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

fs.readFile("db/db.json","utf8", (err, data) => {
    if (err) throw err;
    var notes = JSON.parse(data);
    console.log(notes);
    // Client GET Routes
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

    app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

    // API Routes
    app.get('/api/notes', (req, res) => res.json(notes));

    app.get('/api/notes/:id', (req, res) => {
        res.json(notes[req.params.id]);
    });

    app.post('/api/notes', (req, res) => {
        let newNote = req.body;
        notes.push(newNote);
        writeDB('added')        
    });

    app.delete('/api/notes/:id', (req, res) => {
        notes.splice(req.params.id,1);
        writeDB('deleted');
    });

    function writeDB(type){
        fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
            if (err) throw err;
            return true;
        });

        return console.log(`note ${type}`);
    };
});

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
