import * as React from "react";
import Echo from "laravel-echo";

const remote = window.require("@electron/remote");
const { authService } = remote.require("./main.prod.js");

window.Pusher = require("pusher-js");

const echo = new Echo({
  broadcaster: "pusher",
  wsHost: "websocket.teckdigital.de",
  wsPort: 80,
  wssPort: 80,
  key: "40ef4fc5aff63a6ff82aab4cd38ee127",
  disableStats: true,
  forceTLS: true,
  encrypted: true,
  enabledTransports: ["ws", "wss"],
  auth: {
    headers: {
      Authorization: `Bearer ${authService.getAccessToken()}`,
      Accept: "application/json",
    },
  },
});

export default function useEcho(): Echo {
  return echo;
}
