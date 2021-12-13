/**
 * Module dependencies.
 */
import * as io from 'socket.io-client';
import * as debugModule from 'debug';
const debug = debugModule('chat:client');
import { Command } from './protocol';

/**
 * ChatClient class.
 */
class ChatClient {

    server_url; // String consisting of protocol, host, port and socket.io namespace
    nick; // String
    id: string|undefined; // String, we probably want to have a random id here eventually since socket.io will give us a new socket id on every connect
    socket; // socket.io-client Socket object

    /**
     * @param {String} server_url   the server URL including protocol, host, port and namespace to connect to
     *                              e.g.: https://crzy.server.net:8889/admin-ns/
     * @param {String} nick         nick name to use in chat
     */
    constructor(server_url: string, nick: string) {

        this.server_url = server_url;
        this.nick = nick;

        debug(`Constructed new ChatClient "${nick}" @ ${server_url}`);

        this.socket = io(this.server_url); // start connection to a socket.io server

        // handle standard events from our socket.io connection
        this.socket.on('connect', () => this.onConnect())  // note this syntax to get 'this' correct in our member call
                   .on('disconnect', (reason: unknown) => this.onDisconnect(reason))
                   .on('error', (err: unknown) => this.onError(err))
                   .on('reconnect_attempt', (attemptNumber: number) => this.onReconnectAttempt(attemptNumber));

        // install an event listener for receiving chat messages
        this.socket.on('message', (msg: unknown) => this.onMessage(msg));

    }

    /**
     * Our standard event handlers for dealing with socket.io.
     */

    onConnect() {
        const prev_id = this.id;
        this.id = this.socket.id;
        debug(`Socket connect, prev_id=${prev_id}, new id=${this.id}`);

        this.send('shout-to-all', { nick: this.nick, text: 'Hello world!' });
    }

    onDisconnect(reason: unknown) {
        debug(`Socket disconnect, we had id=${this.id}, reason=${reason}`);
    }

    onError(err: unknown) {
        debug('Socket error, we have id=${this.id}, err=%o', err);
    }

    onReconnectAttempt(attemptNumber: number) {
        debug(`Reconnect attempt ${attemptNumber}`);
    }

    /**
     * Our chat functions.
     */

    /**
     * Send `command` with arguments `args` to the chat server.
     */
    send(...[command, args]: Command)
    {
        debug('Emitting command=%o, args=%o', command, args);
        this.socket.emit('command', command, args); // we could add a callback for acknowledgement signalling
    }

    /**
     * This is called when we receive a message from the server.
     *
     * @param {Object} msg
     */
    onMessage(msg: unknown)
    {
        console.log('Got a message! msg = ', msg);
    }

}

/**
 * Module exports.
 */
export default ChatClient;
