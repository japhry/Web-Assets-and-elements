const root = document.documentElement;
const card = document.querySelector("aside");

const state = {
  theme: "system",
  blur: 8,
  saturate: 2.8,
  brightness: 1.25,
  contrast: 1,
  border: 2,
  borderColor: "#6ec8ff",
  disable: false,
};

function applyState() {
  root.dataset.theme = state.theme;
  root.dataset.disable = String(state.disable);
  root.style.setProperty("--blur", String(state.blur));
  root.style.setProperty("--saturate", String(state.saturate));
  root.style.setProperty("--brightness", String(state.brightness));
  root.style.setProperty("--contrast", String(state.contrast));
  root.style.setProperty("--border", String(state.border));
  root.style.setProperty("--border-color", state.borderColor);
}

function buildControls() {
  const panel = document.createElement("div");
  panel.className = "px-controls";
  panel.innerHTML = `
    <div class="px-controls__handle">Card Controls</div>
    <div class="px-controls__grid">
      <label class="px-field">
        <span>Theme</span>
        <select data-key="theme">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label class="px-field">
        <span>Blur</span>
        <input type="range" min="0" max="20" step="1" value="${state.blur}" data-key="blur">
      </label>
      <label class="px-field">
        <span>Saturate</span>
        <input type="range" min="0" max="10" step="0.1" value="${state.saturate}" data-key="saturate">
      </label>
      <label class="px-field">
        <span>Brightness</span>
        <input type="range" min="0" max="2" step="0.01" value="${state.brightness}" data-key="brightness">
      </label>
      <label class="px-field">
        <span>Contrast</span>
        <input type="range" min="0" max="3" step="0.1" value="${state.contrast}" data-key="contrast">
      </label>
      <label class="px-field">
        <span>Border Width</span>
        <input type="range" min="0" max="10" step="1" value="${state.border}" data-key="border">
      </label>
      <label class="px-field">
        <span>Border Color</span>
        <input type="color" value="${state.borderColor}" data-key="borderColor">
      </label>
      <label class="inline-toggle"><input type="checkbox" data-key="disable"> Disable Frost</label>
    </div>
  `;

  panel.querySelectorAll("[data-key]").forEach((control) => {
    const key = control.dataset.key;
    if (control.type === "checkbox") {
      control.checked = Boolean(state[key]);
      control.addEventListener("change", () => {
        state[key] = control.checked;
        applyState();
      });
      return;
    }

    if (control.tagName === "SELECT") {
      control.value = state[key];
      control.addEventListener("change", () => {
        state[key] = control.value;
        applyState();
      });
      return;
    }

    control.addEventListener("input", () => {
      state[key] = control.type === "color" ? control.value : Number(control.value);
      applyState();
    });
  });

  document.body.appendChild(panel);
}

function enableDrag(element, handleSelector = null) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let x = 0;
  let y = 0;

  const dragTarget = handleSelector
    ? element.querySelector(handleSelector) || element
    : element;
  dragTarget.style.touchAction = "none";

  const onMove = (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    element.style.transform = `translate(${x + dx}px, ${y + dy}px)`;
  };

  const onUp = (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    x += dx;
    y += dy;
    dragging = false;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  dragTarget.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });

  dragTarget.addEventListener("dblclick", () => {
    x = 0;
    y = 0;
    element.style.transform = "translate(0, 0)";
  });
}

buildControls();
applyState();
if (card) enableDrag(card);
const controls = document.querySelector(".px-controls");
if (controls) enableDrag(controls, ".px-controls__handle");
