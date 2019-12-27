
export let ServerUrl = '';

export function initServerUrl() {
  const hostname = window.location.hostname;
  ServerUrl = `http://${hostname}:9000`;
}

export let component = null;

export function mouseHandler(type, e) {
  if (component === null) {
    return
  }
  component.mouseHandler(type, e);
}

export function setMouseHandler(comp) {
  component = comp;
}

export let localEnablePlayerFastForward = true;

export function getEnablePlayerFastForward() {
  return localEnablePlayerFastForward;
}

export function setEnablePlayerFastForward(enablePlayerFastForward) {
  localEnablePlayerFastForward = enablePlayerFastForward;
}
