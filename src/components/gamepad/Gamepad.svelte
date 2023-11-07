<script>
  import layout from "./layouts/XBOX.js";
  import { onMount, createEventDispatcher } from "svelte";
  import { addGamepad } from "./gamepadController.js";

  //Index of the gamepad to connect to (See Javascript Gamepad API)
  export let gamepadIndex;
  //Threshold for determining if the stick is being used (Needed due to stick drift)
  export let stickThreshold = 0.2; // default threshold

  //dispatcher so that our custom Gamepad svelte element can fire events
  const dispatch = createEventDispatcher();

  // Variable for holding previous gamepad state
  let gamepadState = null;

  //When buttons on gamepad have changed
  function onChange(newGamepadState) {
    //If no previous gamepad state, we know we just connected to gamepad
    if (!gamepadState) {
      dispatch("Connected", { gamepadIndex });
    }

    // handle buttons
    Object.keys(newGamepadState.buttons).forEach(key => {
      const button = newGamepadState.buttons[key];
      //If the button isnt null and it is pressed
      if (button && button.pressed) {
        //Dispatch event
        dispatch(key, button); // e.g. "RT" , {pressed: true, value: 0.2}
      }

      //Event that is called once per button hold
      if (button && button.pressed && !gamepadState.buttons[key].pressed) {
        //Dispatch event
        dispatch(key + "_PRESS", button); // e.g. "RT" , {pressed: true, value: 0.2}
      }


      // Send null when player stops pressing button
      // Needs to check if the previous state is marked as pressed
      if (
        button &&
        !button.pressed &&
        gamepadState &&
        gamepadState.buttons[key].pressed
      ) {
        dispatch(key, null);
      }
    });

    // handle axes
    Object.keys(newGamepadState.axes).forEach(key => {
      const axis = newGamepadState.axes[key];

      if (axis) {
        dispatch(key, axis); // e.g. "LeftStick" , {x: 10, y:0}
      }
    });

    //Set previous gamepadState to the new gamepadState
    gamepadState = { ...newGamepadState };
  }

  //Arguments for gamepad to be added to gamepadController watcher
  const args = {
    layout,
    onChange,
    stickThreshold
  };

  //When svelte component is added to screen
  onMount(() => {
    //Add gamepad to gamepadWatcher in gamepadController.js
    const cleanup = addGamepad(gamepadIndex, args);
    //onUnmount, cleanup
    return cleanup;
  });
</script>
