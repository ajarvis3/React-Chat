/**
 * A file used to set up SignalR connection
 */

import * as signalR from "@microsoft/signalr";

const connections = {};

function connect(url) {
    if (connections[url]) {
        return connections[url];
    }
    const connection = new signalR.HubConnectionBuilder()
                            .withUrl(url)
                            .configureLogging(signalR.LogLevel.Information)
                            .build();
    connection.start();
    connections[url] = connection;
    return connection;
}

export default connect;
