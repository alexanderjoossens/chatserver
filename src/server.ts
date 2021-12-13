/**
 * Module dependencies.
 */
import * as io from 'socket.io';
import * as debugModule from 'debug';
const debug = debugModule('chat:server');
import * as http from 'http';
import { Command } from './protocol';

/**
 * ChatServer class.
 *
 * This will start a socket.io server for the default namespace '/'.
 *
 */
class ChatServer {

    port;   // integer, TCP port number [0, 65535], but should be > 1023 as those are reserved port numbers
    server; // socket.io server

    constructor(port: number, options?: io.ServerOptions) {
        this.port = port;

        debug(`Constructing server at port ${port} with options=%o`, options);

        const httpServer = http.createServer();

        this.server = io(httpServer, options); // start socket.io server, will throw EADDRINUSE when port is already in use...

        httpServer.on('listening', () => debug('Listening on %o', httpServer.address()));
        this.server.on('connect', (socket) => this.onConnect(socket));

        httpServer.listen(this.port);
    }

    /**
     * Our standard event handlers for dealing with socket.io.
     */

    onConnect(socket: io.Socket) {
        debug(`Got connection socket.id=${socket.id}`);
        socket.on('disconnect', (reason) => this.onSocketDisconnect(socket, reason));
        socket.on('disconnecting', (reason) => this.onSocketDisconnecting(socket, reason));
        // now make sure we handle our chat events for this socket:
        socket.on('command', (command, args) => this.doCommand(command, args));
    }

    onSocketDisconnect(socket: io.Socket, reason: unknown) {
        debug(`Lost socket with id ${socket.id}, reason: ${reason}`);
    }

    onSocketDisconnecting(socket: io.Socket, reason: unknown) {
        // Fired when the client is going to be disconnected (but hasn’t left its rooms yet).
        const rooms = Object.keys(socket.rooms);
        debug(`Lost socket with id ${socket.id}, reason: ${reason}, rooms = %o`, rooms);
    }

    /**
     * Handlers for our chat application.
     */
    doCommand(...[command, args]: Command) {
        debug('Server received command=%o with args=%o', command, args);
        switch(command) {
            case 'shout-to-all':
                this.server.emit('message', args);
                break;
            default:
                debug(`Unknown command %o with args %o`, command, args);
        }
    }

}

/**
 * Module exports.
 */
export default ChatServer;
