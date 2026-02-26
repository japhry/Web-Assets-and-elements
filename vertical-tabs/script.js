document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
  const tabsNav = document.querySelector(".tabs-nav");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAB_STORAGE_KEY = "vertical-tabs-active";
  const TOGGLE_STORAGE_KEY = "vertical-tabs-toggles";

  if (!tabButtons.length || !tabPanels.length) return;

  tabsNav?.setAttribute("role", "tablist");

  tabButtons.forEach((button, index) => {
    const tabId = button.dataset.tab;
    const panel = document.getElementById(tabId);
    const buttonId = `tab-btn-${tabId}`;

    button.id = buttonId;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", "false");
    button.setAttribute("tabindex", "-1");

    if (panel) {
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", buttonId);
      panel.setAttribute("tabindex", "0");
      panel.hidden = true;
    }

    button.addEventListener("click", () => switchTab(tabId, { focusButton: false }));

    button.addEventListener("keydown", (event) => {
      const mobile = window.innerWidth <= 900;
      const prevKey = mobile ? "ArrowLeft" : "ArrowUp";
      const nextKey = mobile ? "ArrowRight" : "ArrowDown";

      if (event.key === prevKey || event.key === nextKey || event.key === "Home" || event.key === "End") {
        event.preventDefault();
      }

      if (event.key === prevKey) {
        const prevIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        tabButtons[prevIndex].focus();
        switchTab(tabButtons[prevIndex].dataset.tab, { focusButton: false });
      }

      if (event.key === nextKey) {
        const nextIndex = (index + 1) % tabButtons.length;
        tabButtons[nextIndex].focus();
        switchTab(tabButtons[nextIndex].dataset.tab, { focusButton: false });
      }

      if (event.key === "Home") {
        tabButtons[0].focus();
        switchTab(tabButtons[0].dataset.tab, { focusButton: false });
      }

      if (event.key === "End") {
        const lastButton = tabButtons[tabButtons.length - 1];
        lastButton.focus();
        switchTab(lastButton.dataset.tab, { focusButton: false });
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        switchTab(tabId, { focusButton: false });
      }
    });
  });

  function switchTab(tabId, options = {}) {
    const { focusButton = false } = options;
    const activeButton = tabButtons.find((btn) => btn.dataset.tab === tabId);
    const activePanel = document.getElementById(tabId);
    if (!activeButton || !activePanel) return;

    tabButtons.forEach((btn) => {
      const isActive = btn === activeButton;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    tabPanels.forEach((panel) => {
      const isActive = panel === activePanel;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });

    if (focusButton) {
      activeButton.focus();
    }

    localStorage.setItem(TAB_STORAGE_KEY, tabId);
    history.replaceState(null, "", `#${tabId}`);

    animateProgressBars(activePanel);
    animateStats(activePanel);
  }

  function animateProgressBars(panel) {
    if (!panel) return;
    const bars = panel.querySelectorAll(".progress-fill");
    bars.forEach((bar) => {
      const finalWidth = bar.dataset.width || bar.style.width || "0%";
      bar.dataset.width = finalWidth;

      if (prefersReducedMotion) {
        bar.style.width = finalWidth;
        return;
      }

      bar.style.width = "0%";
      requestAnimationFrame(() => {
        setTimeout(() => {
          bar.style.width = finalWidth;
        }, 90);
      });
    });
  }

  function animateStats(panel) {
    if (!panel) return;
    const statValues = panel.querySelectorAll(".stat-value");

    statValues.forEach((stat, i) => {
      if (prefersReducedMotion) {
        stat.style.opacity = "1";
        stat.style.transform = "translateY(0)";
        return;
      }

      stat.style.opacity = "0";
      stat.style.transform = "translateY(12px)";
      stat.style.transition = "none";

      requestAnimationFrame(() => {
        setTimeout(() => {
          stat.style.transition = "opacity 360ms ease, transform 360ms ease";
          stat.style.opacity = "1";
          stat.style.transform = "translateY(0)";
        }, i * 70);
      });
    });
  }

  const toggleState = JSON.parse(localStorage.getItem(TOGGLE_STORAGE_KEY) || "{}");
  const toggles = Array.from(document.querySelectorAll(".toggle-switch"));

  toggles.forEach((toggle) => {
    const key = toggle.dataset.toggle;
    const initialActive = Object.prototype.hasOwnProperty.call(toggleState, key)
      ? Boolean(toggleState[key])
      : toggle.classList.contains("active");

    toggle.classList.toggle("active", initialActive);
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("role", "switch");
    toggle.setAttribute("aria-checked", String(initialActive));

    const toggleHandler = () => {
      const isActive = !toggle.classList.contains("active");
      toggle.classList.toggle("active", isActive);
      toggle.setAttribute("aria-checked", String(isActive));
      toggleState[key] = isActive;
      localStorage.setItem(TOGGLE_STORAGE_KEY, JSON.stringify(toggleState));
    };

    toggle.addEventListener("click", toggleHandler);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleHandler();
      }
    });
  });

  const hashTab = window.location.hash.replace("#", "");
  const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
  const initialTab = tabButtons.some((btn) => btn.dataset.tab === hashTab)
    ? hashTab
    : tabButtons.some((btn) => btn.dataset.tab === savedTab)
      ? savedTab
      : tabButtons[0].dataset.tab;

  switchTab(initialTab);
});
