const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealItems.forEach((item) => observer.observe(item));

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const clickableImages = document.querySelectorAll(
  "#dishes img, #menu-images img, #guests img"
);

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close image popup">×</button>
  <img class="lightbox-image" alt="Preview" />
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxClose = lightbox.querySelector(".lightbox-close");

const closeLightbox = () => {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
};

const openLightbox = (src, alt) => {
  lightboxImage.src = src;
  lightboxImage.alt = alt || "Image preview";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
};

clickableImages.forEach((image) => {
  image.classList.add("clickable-image");
  image.setAttribute("tabindex", "0");
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", "Open image popup");

  image.addEventListener("click", () => {
    openLightbox(image.src, image.alt);
  });

  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(image.src, image.alt);
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

const eyebrow = document.querySelector(".eyebrow[data-phrases]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (eyebrow && !reducedMotion) {
  const phraseAttr = eyebrow.getAttribute("data-phrases") || "";
  const phrases = phraseAttr.split("|").map((item) => item.trim()).filter(Boolean);
  if (!phrases.length) eyebrow.classList.remove("typing");

  eyebrow.textContent = "";
  eyebrow.classList.add("typing");

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeStep = () => {
    const current = phrases[phraseIndex] || "";

    if (!isDeleting) {
      eyebrow.textContent = current.slice(0, charIndex + 1);
      charIndex += 1;

      if (charIndex >= current.length) {
        isDeleting = true;
        setTimeout(typeStep, 1100);
        return;
      }

      setTimeout(typeStep, 78);
      return;
    }

    eyebrow.textContent = current.slice(0, Math.max(0, charIndex - 1));
    charIndex -= 1;

    if (charIndex <= 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeStep, 220);
      return;
    }

    setTimeout(typeStep, 42);
  };

  setTimeout(typeStep, 420);
} else if (eyebrow && reducedMotion) {
  const phraseAttr = eyebrow.getAttribute("data-phrases") || "";
  const phrases = phraseAttr.split("|").map((item) => item.trim()).filter(Boolean);
  if (phrases.length) eyebrow.textContent = phrases[0];
  eyebrow.classList.remove("typing");
}

const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

if (sections.length && navAnchors.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((anchor) => {
            if (anchor.getAttribute("href") === `#${id}`) {
              anchor.setAttribute("aria-current", "page");
            } else {
              anchor.removeAttribute("aria-current");
            }
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: "-15% 0px -45% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
