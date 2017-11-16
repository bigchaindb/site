---
layout: guide

title: How to connect to BigchainDB
description: Understand, how to get BigchainDB/IPDB up and running from the beginning to the end, so that you can start building applications on it
image: image.jpg
---

## Connect to IPDB

This part explains, how to connect to IPDB testnet
(Good post https://medium.com/ipdb-blog/using-the-ipdb-test-network-a615f93d50a9)

1. Create an account in IPDB and retrieve an app id etc.
2. To connect to IPDB network you need your app_id & app_key. To get both, you need to register yourself in the following link https://developers.ipdb.io/signup
3. Once done,

```js
const API_PATH = 'https://test.ipdb.io/api/v1/'
const conn = new BigchainDB.Connection(API_PATH, {
    app_id: 'your_app_id',
    app_key: 'your_app_key'
})
```

### Connect to REST API + Websocket

https://docs.bigchaindb.com/projects/js-driver/en/latest/usage.html#websocket-event-stream-api-usage

If you are connecting to a node that has support for the Event Stream API, you will be able to access real-time event streams over the WebSocket.

Send a HTTP GET request to the node’s API Root Endpoint (e.g. http://localhost:9984/api/v1/) to check if the response the response contains a streams property:

```js
var wsUri = "ws://localhost:9985/api/v1/streams/valid_transactions";
function init() {
        websocket = new WebSocket(wsUri);
        websocket.onmessage = function(evt) { onMessage(evt) };
}
function onMessage(evt) {
        writeToScreen('<a href="#" class="list-group-item"><h4 class="list-group-item-heading">Valid Transaction</h4><p class="list-group-item-text">' + evt.data + '</p></a>');
}
function writeToScreen(message) {
        var pre = document.createElement("p");
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;
        output.appendChild(pre);
}
/* Initialize websocket and attach all events */
window.addEventListener("load", init, false);
```

## Drivers and library

This part in the journey contains everything that needs to be downloaded to be able to write an application in BigchainDB/IPDB (drivers, library etc.) => shortest path to get started

Focus on JS driver in the beginning

Basecally you just need to install the driver, for JS:

```bash
$ npm install bigchaindb-driver
In case of python:
$ pip3 install bigchaindb_driver
```
