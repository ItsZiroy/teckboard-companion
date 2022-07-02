import * as React from "react";
import Echo from "laravel-echo";
import * as io from "socket.io-client";

const remote = window.require("@electron/remote");
const { authService } = remote.require("./main.prod.js");
const echo = new Echo({
  broadcaster: "socket.io",
  host: "https://teckboard.de:6001",
  client: io,
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
