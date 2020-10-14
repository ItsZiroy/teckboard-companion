import * as React from "react";

const { remote } = window.require("electron");
const ElectronStore = remote.require("electron-store");
export default function useScreen(name: string) {
  const store = new ElectronStore({
    name,
  });
  return store;
}
