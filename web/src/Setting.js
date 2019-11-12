
export let ServerUrl = '';

export function initServerUrl() {
  const hostname = window.location.hostname;
  ServerUrl = `http://${hostname}:9000`;
}

export let component = null;

export function mouseMove(e) {
  if (component === null) {
    return
  }

  component.mousemove(e);
}

export function setMouseMove(comp) {
  component = comp;
}
