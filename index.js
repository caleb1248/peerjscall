const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4 : uuidv4} = require('uuid');

app.set('view-engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
});

app.get('/:room', (req, res) => {
    res.render({roomID: req.params.room});
});

io.on('connection', socket => {
    socket.on('joining', (roomID, userID) => {
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('newUser', userID);
        socket.on('disconnect',() => {
            socket.to(roomID).broadcast.emit('userdisconn', userID);
        })
    });
});

server.listen(3000);