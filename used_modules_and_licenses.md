## A list of modules we use and their respective license

* debug
    * <https://github.com/visionmedia/debug>
    * license: MIT
    * 75k weekly downloads by npm
    * For writing log messages to the screen, you can set a namespace for a log
      message and they can be turned on or off by an environment variable `DEBUG`.

* yargs
    * <https://github.com/yargs/yargs>
    * license: MIT
    * 47k weekly downloads by npm
    * Command line argument library.

* socket.io
    * <https://github.com/socketio/socket.io>
    * license: MIT
    * 3k weekly downloads by npm
    * Socket communication library which allows real-time bidirectional
      event-based communication. Main development reason of this library was to
      allow socket-like communication from within a webbrowser. Therefore the
      connection is using a http/https or ws/wss (websocket) connection.

* socket.io-client
    * <https://github.com/socketio/socket.io-client>
    * MIT
    * 5k weekly downloads by npm
    * Client library for socket.io.

Docs for socket.io:
* Server API: <https://socket.io/docs/server-api/>
* Client API: <https://socket.io/docs/client-api/>
* Introductory explanation: <https://socket.io/docs/>
* Debug namespaces for socket.io's usage of the debug package: <https://socket.io/docs/logging-and-debugging/>
* How does socket.io communicate? You can have a look at
    * the low level engine.io-protocol <https://github.com/socketio/engine.io-protocol>
    * and the socket.io-protocol layer on top <https://github.com/socketio/socket.io-protocol>
* Nice schematic: <https://socket.io/docs/internals/>
* It might be good to look at the EventEmitter class: <https://nodejs.org/api/events.html#events_class_eventemitter>

