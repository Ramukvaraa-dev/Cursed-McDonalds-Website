/**
 * Main UI Controller
 */

// ====================
// DOM UTILITIES
// ====================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  fullscreen: $('[data-js="fullscreen"]'),
  glitchBurst: $('[data-js="glitchBurst"]'),
  reportForm: $('[data-js="reportForm"]'),
  copyReport: $('[data-js="copyReport"]'),
  iframe: $("iframe"),
  sidebar: $('[data-js="sidebar"]'),
  sidebarOpen: $('[data-js="sidebarOpen"]'),
  sidebarClose: $('[data-js="sidebarClose"]'),
  scrim: $('[data-js="scrim"]'),
  search: $('[data-js="search"]'),
  musicToggle: $('[data-js="musicToggle"]'),
  bgMusic: $("#bgMusic"),
};

const body = document.body;
const desktopQuery = window.matchMedia("(min-width: 1180px)");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

const glitchPages = new Set([
  "lore.html",
  "diary-1.html",
  "information.html",
]);

const isGlitchPage = glitchPages.has(currentPage);

if (isGlitchPage) {
  body.classList.add("glitch-active");
}

// ====================
// HELPERS
// ====================
const debounce = (fn, delay = 300) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const requestFullscreen = (element) => {
  if (!element) return;

  (
    element.requestFullscreen ||
    element.webkitRequestFullscreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullscreen
  )?.call(element);
};

const toggleClassForAll = (nodes, className, state) => {
  nodes.forEach((node) => {
    node.classList.toggle(className, state);
  });
};

// ====================
// SIDEBAR
// ====================
const setSidebarOpen = (open = false) => {
  const { sidebar, scrim } = elements;

  if (!sidebar || !scrim) return;

  const shouldOpen = desktopQuery.matches || open;

  sidebar.classList.toggle("is-open", shouldOpen);
  sidebar.setAttribute("aria-hidden", String(!shouldOpen));

  scrim.hidden = desktopQuery.matches || !open;
  body.style.overflow =
    !desktopQuery.matches && open ? "hidden" : "";
};

elements.sidebarOpen?.addEventListener("click", () =>
  setSidebarOpen(true)
);

elements.sidebarClose?.addEventListener("click", () =>
  setSidebarOpen(false)
);

elements.scrim?.addEventListener("click", () =>
  setSidebarOpen(false)
);

window.addEventListener("keydown", ({ key }) => {
  if (key === "Escape") {
    setSidebarOpen(false);
  }
});

desktopQuery.addEventListener("change", () => {
  setSidebarOpen(desktopQuery.matches);
});

elements.sidebar?.addEventListener("click", (event) => {
  if (
    event.target.closest("a") &&
    !desktopQuery.matches
  ) {
    setSidebarOpen(false);
  }
});

// ====================
// FULLSCREEN
// ====================
elements.fullscreen?.addEventListener("click", () => {
  requestFullscreen(elements.iframe);
});

// ====================
// GLITCH EFFECTS
// ====================
const glitchNodes = $$("[data-glitch]");

glitchNodes.forEach((node) => {
  node.dataset.glitch ||= node.textContent.trim();
});

let burstTimeout;
let bodyTimeout;

const triggerGlitchBurst = (duration = 220) => {
  clearTimeout(burstTimeout);

  toggleClassForAll(
    glitchNodes,
    "glitch--burst",
    true
  );

  burstTimeout = setTimeout(() => {
    toggleClassForAll(
      glitchNodes,
      "glitch--burst",
      false
    );
  }, duration);
};

const triggerBodyGlitch = (
  duration = 120 + Math.random() * 140
) => {
  clearTimeout(bodyTimeout);

  body.classList.add("glitch");

  bodyTimeout = setTimeout(() => {
    body.classList.remove("glitch");
  }, duration);
};

elements.glitchBurst?.addEventListener("click", () => {
  triggerGlitchBurst();
});

if (!prefersReducedMotion && isGlitchPage) {
  const startGlitchLoop = () => {
    const delay = 2800 + Math.random() * 4200;

    setTimeout(() => {
      triggerGlitchBurst(
        220 + Math.random() * 180
      );

      if (Math.random() > 0.35) {
        triggerBodyGlitch();
      }

      startGlitchLoop();
    }, delay);
  };

  startGlitchLoop();

  setInterval(() => {
    if (Math.random() > 0.68) {
      triggerBodyGlitch(
        180 + Math.random() * 220
      );
    }
  }, 560);

  setInterval(() => {
    if (Math.random() > 0.78) {
      triggerGlitchBurst(320);

      for (let i = 0; i < 3; i += 1) {
        setTimeout(() => {
          triggerBodyGlitch(
            160 + Math.random() * 180
          );
        }, i * 80);
      }
    }
  }, 1500);
}

// ====================
// REPORT COPY
// ====================
elements.copyReport?.addEventListener(
  "click",
  async () => {
    const details =
      elements.reportForm
        ?.querySelector('[name="details"]')
        ?.value.trim() || "Not specified";

    const steps =
      elements.reportForm
        ?.querySelector('[name="steps"]')
        ?.value.trim() || "Not specified";

    const report = `
Incident Report

Description:
${details}

Reproduction Steps:
${steps}

URL:
${window.location.href}
    `.trim();

    try {
      await navigator.clipboard.writeText(
        report
      );
      triggerGlitchBurst(300);
    } catch {
      window.prompt(
        "Clipboard unavailable. Copy manually:",
        report
      );
    }
  }
);

// ====================
// SEARCH
// ====================
const sections = $$("main section");

const handleSearch = debounce(() => {
  const query = elements.search?.value
    .trim()
    .toLowerCase();

  if (!query) return;

  const match = sections.find((section) =>
    section.textContent
      .toLowerCase()
      .includes(query)
  );

  if (!match) return;

  match.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  match.classList.add("search-highlight");

  setTimeout(() => {
    match.classList.remove(
      "search-highlight"
    );
  }, 2000);
});

elements.search?.addEventListener(
  "input",
  handleSearch
);

// ====================
// AUDIO PLAYER
// ====================
const { musicToggle, bgMusic } = elements;

if (musicToggle && bgMusic) {
  const STORAGE_KEY = "siteMusicState";

  const updateAudioUI = (playing) => {
    musicToggle.classList.toggle(
      "playing",
      playing
    );

    localStorage.setItem(
      STORAGE_KEY,
      playing ? "playing" : "paused"
    );
  };

  const playAudio = async () => {
    try {
      await bgMusic.play();
      updateAudioUI(true);
    } catch {
      updateAudioUI(false);
    }
  };

  const pauseAudio = () => {
    bgMusic.pause();
    updateAudioUI(false);
  };

  if (
    localStorage.getItem(STORAGE_KEY) ===
    "playing"
  ) {
    playAudio();
  }

  musicToggle.addEventListener(
    "click",
    () => {
      bgMusic.paused
        ? playAudio()
        : pauseAudio();
    }
  );

  bgMusic.addEventListener("play", () => {
    updateAudioUI(true);
  });

  bgMusic.addEventListener("pause", () => {
    updateAudioUI(false);
  });

  bgMusic.addEventListener("error", () => {
    console.warn("Audio failed to load");
    musicToggle.disabled = true;
    musicToggle.title =
      "Audio unavailable";
  });
}

// ====================
// INITIALIZATION
// ====================

// Loading screen
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 500);
  }
});

// Tab title visibility change
const originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
  document.title = document.hidden
    ? "Don't leave..."
    : originalTitle;
});
setSidebarOpen(desktopQuery.matches);