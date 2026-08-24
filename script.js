const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    });
  });
}

/* Scroll reveal */
const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
}

/* -----------------------------
   DISCORD POPUP
   ----------------------------- */

const discordModal = document.getElementById("discordModal");
const discordTriggers = document.querySelectorAll(".discord-trigger");
const discordCloseButtons = document.querySelectorAll("[data-close-modal]");

/* REPLACE THIS WITH YOUR REAL DISCORD INVITE */
const DISCORD_INVITE = "https://discord.gg/abpRnYb4Mw";

document.querySelectorAll(".discord-join").forEach(link => {
  link.href = DISCORD_INVITE;
});

function openDiscordModal() {
  if (!discordModal) return;
  discordModal.classList.add("open");
  discordModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = discordModal.querySelector(".discord-close");
  if (closeButton) closeButton.focus();
}

function closeDiscordModal() {
  if (!discordModal) return;
  discordModal.classList.remove("open");
  discordModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

/* Clicking any Discord link opens the popup */
discordTriggers.forEach(trigger => {
  trigger.addEventListener("click", event => {
    event.preventDefault();
    openDiscordModal();
  });
});

/* Close buttons / backdrop */
discordCloseButtons.forEach(button => {
  button.addEventListener("click", closeDiscordModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && discordModal && discordModal.classList.contains("open")) {
    closeDiscordModal();
  }
});

/* Auto-open Discord once per browser session, after the loader finishes. */
window.addEventListener("load", () => {
  if (!sessionStorage.getItem("monstaDiscordShown")) {
    window.setTimeout(() => {
      openDiscordModal();
      sessionStorage.setItem("monstaDiscordShown", "1");
    }, 4200);
  }
});


/* =========================================================
   MONSTA MELODIC — BRAND EXPERIENCE / OOMPH LAYER
   ========================================================= */

document.documentElement.classList.add("js");

/* Loading screen */
const loader = document.createElement("div");
loader.className = "monsta-loader";
loader.setAttribute("aria-hidden", "true");
loader.innerHTML = `
  <div class="loader-noise"></div>
  <div class="loader-creature loader-creature-left"><i></i><i></i></div>
  <div class="loader-creature loader-creature-right"><i></i><i></i></div>
  <div class="loader-inner">
    <div class="loader-logo-shell">
      <img src="Logo.png" alt="">
      <span class="loader-ring ring-one"></span>
      <span class="loader-ring ring-two"></span>
    </div>
    <p class="loader-kicker">MONSTA MELODIC</p>
    <h2>SUMMONING THE MONSTERS<span class="loader-dots">...</span></h2>
    <div class="loader-track"><span></span></div>
    <p class="loader-status">MYTHICAL · MELODIC · MONSTROUS</p>
  </div>
`;
document.body.prepend(loader);
document.body.classList.add("is-loading");

const loaderStart = performance.now();
window.addEventListener("load", () => {
  const elapsed = performance.now() - loaderStart;
  const minimum = 1350;
  window.setTimeout(() => {
    loader.classList.add("loader-exit");
    document.body.classList.remove("is-loading");
    window.setTimeout(() => loader.remove(), 850);
  }, Math.max(0, minimum - elapsed));
});

/* Ambient monster layer */
const ambient = document.createElement("div");
ambient.className = "monster-ambient";
ambient.setAttribute("aria-hidden", "true");
ambient.innerHTML = `
  <span class="goo-orb goo-a"></span>
  <span class="goo-orb goo-b"></span>
  <span class="goo-orb goo-c"></span>
  <span class="ambient-spark spark-1">✦</span>
  <span class="ambient-spark spark-2">✧</span>
  <span class="ambient-spark spark-3">★</span>
`;
document.body.prepend(ambient);

/* Add monster-eye decorations to primary hero areas */
document.querySelectorAll(".hero-main, .applications-hero, .idol-app-hero").forEach((hero, index) => {
  if (hero.querySelector(".monster-eyes")) return;
  const eyes = document.createElement("div");
  eyes.className = `monster-eyes monster-eyes-${index + 1}`;
  eyes.setAttribute("aria-hidden", "true");
  eyes.innerHTML = `<span><i></i></span><span><i></i></span>`;
  hero.appendChild(eyes);
});

/* Cursor aura on pointer devices */
if (window.matchMedia("(pointer:fine)").matches) {
  const aura = document.createElement("div");
  aura.className = "cursor-aura";
  document.body.appendChild(aura);

  let tx = -100, ty = -100, x = -100, y = -100;
  document.addEventListener("pointermove", e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  const follow = () => {
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    aura.style.transform = `translate3d(${x}px,${y}px,0)`;
    requestAnimationFrame(follow);
  };
  follow();

  document.querySelectorAll("a, button, summary, .idol-member-card").forEach(el => {
    el.addEventListener("mouseenter", () => aura.classList.add("is-hot"));
    el.addEventListener("mouseleave", () => aura.classList.remove("is-hot"));
  });
}

/* Tiny perspective response for major cards */
document.querySelectorAll(".idol-member-card, .kaiju-application, .requirement-card").forEach(card => {
  card.addEventListener("pointermove", e => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - .5) * -3.5;
    const ry = ((e.clientX - r.left) / r.width - .5) * 3.5;
    card.style.setProperty("--tilt-x", `${rx}deg`);
    card.style.setProperty("--tilt-y", `${ry}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

/* Smooth internal page transition, without hijacking anchors/external links */
document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(link => {
  link.addEventListener("click", e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || link.target === "_blank") return;
    const href = link.getAttribute("href");
    if (!href) return;
    e.preventDefault();
    document.body.classList.add("page-leaving");
    window.setTimeout(() => window.location.href = href, 260);
  });
});
