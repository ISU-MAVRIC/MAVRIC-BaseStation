import { readable } from "svelte/store";

import ConnectionHandler from "../utils/ConnectionHandler";
import { MAVRIC_WEB_INTERFACE } from "../utils/config";

function createStore() {
  const { subscribe, set, update } = readable(new ConnectionHandler(MAVRIC_WEB_INTERFACE));

  return {
    subscribe
  }
}

export default createStore();