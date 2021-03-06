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
    // -----> Route to render the index.html file to the browzer
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
    // -----> Route to render the notes.html file to the browzer
    app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

    // API Routes
    // -----> Route to send all notes saved in JSON format data
    app.get('/api/notes', (req, res) => res.json(notes));
    // -----> Route to send specific notes saved in JSON format data, based on the Key id provided as click from the browzer
    app.get('/api/notes/:id', (req, res) => {
        res.json(notes[req.params.id]);
    });
    // -----> Route to update/save note to the file
    app.post('/api/notes', (req, res) => {
        let newNote = req.body;
        console.log(`Adding Note ${JSON.stringify(newNote)}`);
        notes.push(newNote);
        writeDB('added');
        return res.json({});
    });
    // -----> Route to delete the note that have been selected from the browzer
    app.delete('/api/notes/:id', (req, res) => {
        console.log(`delete Route with id=${req.params.id}`)
        if (notes.length === 1){
            notes=[];
        } else {
            //delete the items base onthe value of the key id and not the index of the array
            console.log(`before: ${notes}`);
            console.log(typeof req.params.id);
            const index=parseInt(req.params.id);

            for (i=0;i<notes.length;i++){
                if (notes[i].id === index) {
                    notes.splice(i,1);
                    console.log(`after : ${notes}`);        
                }
            }
        };
        writeDB('deleted');
        return res.json({});
    });
    // function to save the notes in the file
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
