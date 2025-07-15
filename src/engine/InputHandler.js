export default class InputHandler {
  constructor() {
    this.keys = new Set();

    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        this.keys.add(e.key);
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.key);
    });
  }

  isPressed(key) {
    return this.keys.has(key);
  }
}
