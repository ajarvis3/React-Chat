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
UPDATE: Ticking "Enable Access-Control-Allow-Credentials" under API
in the Azure portal seems to be a temporary fix for SSE.


# Known Issues
Availability: App doesn't always seem to work, and the console reports a CORS error. Further inspection reveals a 503 error at the server. In addition, the Azure console seems to be unavailable at these times. So, as best as I can tell, Azure doesn't like that it is a free app and might turn it off when it's inactive. Later on, the logs indicate lags in starting the app - most recently, I have restarted the app at 12:10 EST and logs didn't indicate the app was initialized successfully until 12:44 EST. Further observations will be made.
