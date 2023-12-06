const { Server } = require('socket.io');

function getSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            headers: {
                sameSite: ' None; Secure',
                'Access-Control-Allow-Origin': '*',
            },
            methods: ['GET', 'POST', 'PATCH'],
        },
    });

    io.on('connection', socket => {
        if (socket.handshake.query.room) {
            socket.join(socket.handshake.query.room + '');
        }

        socket.on('setParam', data => {
            if (data.room) {
                socket.to(data.room).emit('set', { oid: data.oid, value: data.value });
            } else {
                console.log('INCORRECT ROOM PARAM');
            }
        });

        socket.on('getParam', data => {
            if (data.room) socket.to(data.room).emit('get', { oid: data.oid });
            else console.log('INCORRECT ROOM PARAM');
        });

        socket.on('getTelemetry', data => {
            console.log('Request telemetry sended');
            if (data.room) socket.to(data.room).emit('telemetry');
            else console.log('INCORRECT ROOM PARAM');
        });

        socket.on('resp', data => {
            console.log(data);
            socket.broadcast.emit('remote:update', data);
        });

        // New connection
        console.log(`IO connection: ${socket.id} is connected.`);

        // Identity user
        socket.on('socket_auth', name => {
            socket.username = name;
            console.log('User ' + socket.id + ' was identified like ' + socket.username + '.');
        });

        // MODERATOR: new processing is started
        socket.on('new-process', data => {
            socket.broadcast.emit('process:start', data);
        });

        // MODERATOR: processing was ended
        socket.on('end-process', () => {
            socket.broadcast.emit('process:end', { name: socket.username });
        });

        // MODERATOR: save or accept
        socket.on('con-process', data => {
            socket.broadcast.emit('process:confirm', data);
        });

        // MODERATOR: denied or deleted
        socket.on('del-process', data => {
            socket.broadcast.emit('process:deny', data);
        });

        // MODERATOR -> CAST (update content)
        socket.on('upd-active', data => {
            socket.broadcast.emit('active:upd', data);
        });

        // EDITOR -> MODERATOR (realtime new request sending)
        socket.on('new-request', data => {
            socket.broadcast.emit('request:new', data);
        });

        // Manager add new note
        socket.on('new_note', data => {
            socket.broadcast.emit('note:new', data);
        });

        // Manager delete old note
        socket.on('del_note', data => {
            socket.broadcast.emit('note:del', data);
        });

        // MODERATOR (autoclose processing if disconnected)
        socket.on('disconnect', () => {
            console.log(`USER ${socket.username} left.`);
            socket.broadcast.emit('process:end', { name: socket.username });
        });
    });

    return io;
}

module.exports = getSocketServer;
