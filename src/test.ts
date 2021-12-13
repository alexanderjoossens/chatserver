import ChatServer from './server.js';
import ChatClient from './client.js';
import Bag from './bag.js';
import { Node } from 'typescript';

function assert(cond: boolean, ...args: unknown[]) {
    if (!cond) {
        console.error(...args);
        process.exit(1);
    }
}

function msg_received_default() {
    assert(false, "No messages expected at this point!");
}

let msg_received: (clientId: number, msg: unknown) => void = msg_received_default;

function expect_messages(timeout: number, msgs: unknown[]) {
    let msgsBag = new Bag(msgs.map(msg => JSON.stringify(msg)));
    let timeoutId: NodeJS.Timeout|null = null;
    function createTimeout() {
        timeoutId = setTimeout((() => assert(false, 'expect_messages: timeout while waiting for messages [' + [...msgsBag].join(", ") + "]")), timeout);
    }
    createTimeout();
    return new Promise(resolve => {
        msg_received = (client, msgBody) => {
            let msg = {client, msg: msgBody};
            let msgText = JSON.stringify(msg);
            if (timeoutId === null)
                throw new Error();
            clearTimeout(timeoutId);
            assert(msgsBag.has(msgText), 'Received unexpected message ', msg);

            msgsBag.delete(msgText);
            if (msgsBag.size == 0) {
                msg_received = msg_received_default;
                resolve();
            } else {
                createTimeout();
            }
        };
    });
}

(async () => {

    const server = new ChatServer(3000);
    const client1 = new ChatClient('http://localhost:3000', 'nick1');
    client1.onMessage = msg => msg_received(1, msg);
    const client2 = new ChatClient('http://localhost:3000', 'nick2');
    client2.onMessage = msg => msg_received(2, msg);

    await expect_messages(1000, [
        {client: 1, msg: {nick: 'nick1', text: 'Hello world!'}},
        {client: 2, msg: {nick: 'nick1', text: 'Hello world!'}},
        {client: 1, msg: {nick: 'nick2', text: 'Hello world!'}},
        {client: 2, msg: {nick: 'nick2', text: 'Hello world!'}}
    ]);

    client1.send('shout-to-all', {nick: 'nick1', text: 'This is a test message'});
    await expect_messages(1000, [
        {client: 1, msg: {nick: 'nick1', text: 'This is a test message'}},
        {client: 2, msg: {nick: 'nick1', text: 'This is a test message'}}
    ]);

    client2.send('shout-to-all', {nick: 'nick2', text: 'This is another test message'});
    await expect_messages(1000, [
        {client: 1, msg: {nick: 'nick2', text: 'This is another test message'}},
        {client: 2, msg: {nick: 'nick2', text: 'This is another test message'}}
    ]);

    console.log("Test passed!");
    client1.socket.close();
    client2.socket.close();
    server.server.close();
})();
