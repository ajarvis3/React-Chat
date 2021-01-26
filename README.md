"# React-Chat" 

A simple chat app using react and signalr

Doesn't currently allow users to select their own usernames

To launch server, cd into the server directory and type
`dotnet run`

To launch the client, cd into client directory and type
`yarn start`

# Deploy

Client app is available from github-pages for this repo
https://ajarvis3.github.io/React-Chat

Server is hosted in Azure

As of 1/26, I noticed the SignalR connection doesn't seem to be
working properly anymore. Whereas before WebSockets were not configured,
SSE does not seem to work either, now. Looking into the problem,
Azure logs have been entirely unhelpful as of now.
