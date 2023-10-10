import { readable } from "svelte/store";

import ConnectionHandler from "../../scripts/utils/ConnectionHandler";
import { MAVRIC_WEB_INTERFACE } from "../../scripts/utils/config.js";

function createStore() {
  const { subscribe, set, update } = readable(new ConnectionHandler(MAVRIC_WEB_INTERFACE));

  return {
    subscribe
  }
}

export default createStore();