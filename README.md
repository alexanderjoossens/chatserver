## How to run the current code

You can get a help message on your screen by doing
```console
$ node index.js -h
```

You can read there that you can start the server by doing
```console
$ node index.js --server
```
Not much will appear on your screen and so you will not be able to figure out
if it is working yes or no...

The code has a lot of debug statements which are not being printed by default.
To turn on debug output you can do e.g.
```console
$ DEBUG=chat:* node index.js --server
```
On Windows you might have to tweak this, see [debug](https://www.npmjs.com/package/debug).
If you put `DEBUG=*` you will also get all the debug statements from socket.io
which might be very helpful later on.


## Current architecture

Simple centralised chat server

                           chat server
                          /     |     \
                         /      |      \
                        /       |       \
                  client 1  client 2 ... client n

The server and the client are node processes.
The client is a CLI which runs in the terminal.

Possible features to keep in the back of your mind:
* Instead of centralised architecture, move to a P2P like infrastructure.
* Users have a secret identity.
* You can send a message to an unknown secret identity.
* You receive a signed response which proves that the user with the secret
  identity has received the message.

## We want to have something like this for the client

This is *not* the definite interface, just to sketch an idea.
In fact it might be incompatible with some of the features we are asking.
The current interface is very much tied to one single server.
What can we do to allow a client to connect to multiple servers?

```js
const ChatClient = require('./lib/client');

const chatClient = new ChatClient(url, nick);
// the nick is your nick name
// is it a good idea to have this global for the whole chatClient?
// should it be a 'default' nick?
// should it be an auto-generated id?
// the hash of a public key? (which is not necessarily public...)
// for fancy stuff the nick could be extended with an avatar and other things, how to make this extensible?

chatClient.on(event, doThis); // Would it be a good idea to have those events on ChatClient?
// possible events:
// - server closes connection
// - server sends a server message
// see socket.io client events:
// - 'connect'
// - 'disconnect'
// - 'error'
// - 'connect_error' (manager)
// - 'connect_timeout' (manager)
// - 'reconnect' (manager)
// - 'reconnect_attempt' (manager)
// - 'reconnecting' (manager)
// - 'reconnect_error' (manager)
// - 'reconnect_failed' (manager)
// - 'ping' (manager)
// - 'pong' (manager)

chatClient.listChannels(); // returns an array of available (public) channels
// what about a list of gigs of channels?
// we could make this an iteratator? are we then caching the answer?

const channel = chatClient.createChannel(channelName);
const channel = chatClient.createChannel(channelName, nick);
const channel = chatClient.createChannel(channelName, nick, channelOptions);
const channel = chatClient.createChannel(channelName, channelOptions);
// throws exception if couldn't create channel
// you join the channel if creation is succesful
// you will have admin status since you created the channel
// channelOptions is an object containing channel meta data
// like
// - channelName
// - admins: we could automatically add the users in this array to be admins of the channel? spamming?
// - users: we could automatically add these users to the channel? spamming?
// - ... whatever extra data ...

const channel = chatClient.joinChannel(channelName);
const channel = chatClient.joinChannel(channelName, nick);
const channel = chatClient.joinChannel(channelName, nick, options);
const channel = chatClient.joinChannel(channelName, options);
// throws exception if couldn't join channel
// this could be because we are not allowed
// but also because the channel might not exist anymore when we finally try to connect (or never existed)
// how do we want to handle private channels with passwords?

channel.on(event, doThis);
// possible events:
// - 'user_joined'
// - 'user_left'
// - 'user_changed_nick'
// - 'channel_options_changed'
// - 'user_typing'

channel.send(command, ...);
// possible commands:
// - 'message', message: message is a Message object send as a channel message
// - 'private_message', nick, message: message is a Message object send to the
//   user with nickname nick in this channel, do we require that user to be in the channel?
// - 'channel_options', channelOptions: try to update the channel options


```


## Random remarks

* Version numbers for npm packages follow the *semantic versioning* system:
  "{major version number}.{minor version number}.{patch number}". See
  <https://semver.org>.
* Examples for the command line argument package `yargs`:
  <https://github.com/yargs/yargs/blob/master/docs/examples.md>


## Socket.io refs

* Emit cheat sheet (also contains a list of reserved event names): <https://socket.io/docs/emit-cheatsheet/>
* Flow diagram of events when a socket.io client connects to a socket.io server: <https://socket.io/docs/client-connection-lifecycle/>
* Namespaces (you can probably ignore this for now, rooms are probably more interesting): <https://socket.io/docs/namespaces/>
* Rooms (this is probably a must read to understand socket.io works): <https://socket.io/docs/rooms/>
* In online examples you might see an event called `connection` while there is
  already an event called `connect`: you can find in the Server API that
  `connection` is a synonym for `connect`. The same for `to` and `in`, they are
  synonyms.
* For the client: The Socket class inherits all methods of the Emitter class
  (which is an event emitter for in a webbrowser) like `listeners(event_name)`,
  `hasListeners(event_name)`, `once`, `off`, etc. See
  <https://github.com/component/emitter>
* For the server: The Socket class inherits from the standard Node.js
  EventEmitter class, see <https://nodejs.org/api/events.html#events_class_eventemitter>,
  and overrides the `emmit` method (to emit over the socket).

For the future:
* Using multiple nodes: <https://socket.io/docs/using-multiple-nodes/>
