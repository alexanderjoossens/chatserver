import { usage } from 'yargs';

import ChatClient from './client';
import ChatServer from './server';

// command line parsing:
const argv = usage('Usage: $0 --server --client')
    .help('h')
    .alias('h', 'help')
    .example('$0 --server [--host=hostname]', 'start a chat server')
    .example('$0 --client --nick=me', 'start a chat client')
    .example('$0 --server [--host=hostname] --client --nick=me', 'start both a chat server and a client')
    .epilog('(C) P&O CW 2020-2021')
    .option('server', {
        description: 'start the server',
        type: 'boolean',
        default: false
    })
    .option('host', {
        description: 'host name or IP address of the server',
        type: 'string',
        default: 'localhost'
    })
    .option('client', {
        description: 'start the client',
        type: 'boolean',
        default: false
    })
    .option('nick', {
        description: 'nick name',
        type: 'string'
    })
    .option('port', {
        description: 'TCP port number (use > 1023)',
        type: 'number',
        default: 3000
    })
    .check((argv, _) => {
        if(argv.client ? !argv.nick : argv.nick) {
            throw new Error('--client and --nick need to be specified at the same time');
        } else {
            return true;
        }
    })
    .argv;


const port = argv.port;
const hostname = argv.host;
const url = `ws://${hostname}:${port}/`;

let chatClient = argv.client ? new ChatClient(url, argv.nick!) : null;
let chatServer = argv.server ? new ChatServer(port) : null;

