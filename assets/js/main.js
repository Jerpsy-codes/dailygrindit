const menuButton = document.querySelector("#menuBtn");
const navLinks = document.querySelector("#navLinks");
const navbar = document.querySelector(".navbar");

if (menuButton && navLinks) {
  menuButton.setAttribute("aria-expanded", "false");

  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  };

  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
    menuButton.classList.toggle("is-open", navLinks.classList.contains("is-open"));
    menuButton.setAttribute("aria-expanded", String(navLinks.classList.contains("is-open")));
    menuButton.setAttribute("aria-label", navLinks.classList.contains("is-open") ? "Close menu" : "Open menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("is-open")) return;
    if (navLinks.contains(event.target) || menuButton.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const updateNavbar = () => {
  if (!navbar) return;
  navbar.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });

const scrollToInitialHash = () => {
  if (!window.location.hash) return;

  const targetId = decodeURIComponent(window.location.hash.slice(1));
  const target = document.getElementById(targetId);
  if (!target) return;

  window.scrollTo({ top: Math.max(target.offsetTop - 68, 0), behavior: "auto" });
};

document.addEventListener("DOMContentLoaded", scrollToInitialHash);
window.addEventListener("load", scrollToInitialHash);

const revealElements = Array.from(document.querySelectorAll(".reveal"));

const markVisibleReveals = () => {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  revealElements.forEach((element) => {
    if (element.classList.contains("is-visible")) return;

    const rect = element.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.94 && rect.bottom > -80) {
      element.classList.add("is-visible");
    }
  });
};

let revealFrameRequested = false;

const requestRevealCheck = () => {
  if (revealFrameRequested) return;

  revealFrameRequested = true;
  requestAnimationFrame(() => {
    revealFrameRequested = false;
    markVisibleReveals();
  });
};

const observer = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    )
  : null;

revealElements.forEach((element) => {
  if (observer) {
    observer.observe(element);
  } else {
    markVisibleReveals();
  }
});

requestRevealCheck();
window.addEventListener("scroll", requestRevealCheck, { passive: true });
window.addEventListener("resize", requestRevealCheck);
window.addEventListener("load", requestRevealCheck);
window.addEventListener("pageshow", requestRevealCheck);
setTimeout(requestRevealCheck, 700);

const counterObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.counted) return;

          entry.target.dataset.counted = "true";
          const target = Number(entry.target.dataset.countTo);
          if (Number.isNaN(target)) return;

          const duration = 900;
          const start = performance.now();

          const tick = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            entry.target.textContent = Math.round(target * eased);

            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    )
  : null;

document.querySelectorAll("[data-count-to]").forEach((counter) => {
  if (counterObserver) {
    counterObserver.observe(counter);
  }
});

document.querySelectorAll(".program-card, .merch-card, .level-tile, .video-card").forEach((card) => {
  card.addEventListener("pointerdown", () => card.classList.add("is-pressed"));
  card.addEventListener("pointerup", () => card.classList.remove("is-pressed"));
  card.addEventListener("pointerleave", () => card.classList.remove("is-pressed"));
});

const trainingVideos = document.querySelectorAll(".training-video");
let canStartTrainingVideo = false;

const prepareTrainingVideo = (video) => {
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = false;
  video.preload = "metadata";
  video.setAttribute("muted", "");
  video.setAttribute("loop", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("preload", "metadata");
  video.removeAttribute("autoplay");
  video.removeAttribute("controls");
};

const setTrainingVideoBlocked = (video, isBlocked) => {
  const frame = video.closest(".training-video-frame");
  if (!frame) return;

  frame.classList.toggle("is-autoplay-blocked", isBlocked);
};

const playTrainingVideo = (video, options = {}) => {
  if (!video) return;

  video.dataset.playRequested = "true";
  prepareTrainingVideo(video);
  video.autoplay = true;
  video.setAttribute("autoplay", "");

  const playRequest = video.play();
  if (playRequest && typeof playRequest.then === "function") {
    playRequest
      .then(() => {
        setTrainingVideoBlocked(video, false);
      })
      .catch(() => {
        if (options.showButtonOnFail !== false) {
          setTrainingVideoBlocked(video, true);
        }
      });
  } else {
    setTrainingVideoBlocked(video, false);
  }
};

const startVisibleTrainingVideos = () => {
  if (!canStartTrainingVideo) return;

  trainingVideos.forEach((video) => {
    const rect = video.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top < viewportHeight * 0.86 && rect.bottom > 0) {
      playTrainingVideo(video);
    }
  });
};

const scheduleTrainingVideoCheck = () => {
  window.requestAnimationFrame(startVisibleTrainingVideos);
};

const unlockTrainingVideoStart = () => {
  if (canStartTrainingVideo) return;

  canStartTrainingVideo = true;
  scheduleTrainingVideoCheck();
};

trainingVideos.forEach((video) => {
  prepareTrainingVideo(video);

  video.addEventListener("play", () => setTrainingVideoBlocked(video, false));
  video.addEventListener("playing", () => setTrainingVideoBlocked(video, false));

  video.addEventListener("pause", () => {
    if (video.dataset.userPlayAttempt === "true") return;
    if (video.currentTime > 0) return;
    setTrainingVideoBlocked(video, true);
  });
});

if (trainingVideos.length) {
  const trainingVideoObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (!canStartTrainingVideo) return;

            playTrainingVideo(entry.target);
            trainingVideoObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.02, rootMargin: "0px 0px -14% 0px" }
      )
    : null;

  trainingVideos.forEach((video) => {
    if (trainingVideoObserver) {
      trainingVideoObserver.observe(video);
    }
  });

  if (!trainingVideoObserver) {
    window.addEventListener("scroll", scheduleTrainingVideoCheck, { passive: true });
    window.addEventListener("resize", scheduleTrainingVideoCheck);
    window.addEventListener("load", scheduleTrainingVideoCheck);
    scheduleTrainingVideoCheck();
  }

  window.addEventListener("scroll", unlockTrainingVideoStart, { once: true, passive: true });
  window.addEventListener("pointerdown", unlockTrainingVideoStart, { once: true, passive: true });
  window.addEventListener("touchstart", unlockTrainingVideoStart, { once: true, passive: true });
  window.setTimeout(unlockTrainingVideoStart, 1800);
  window.addEventListener("pageshow", startVisibleTrainingVideos);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startVisibleTrainingVideos();
    }
  });

  document.querySelectorAll("[data-mobile-video-play]").forEach((button) => {
    const frame = button.closest(".training-video-frame");
    const video = frame ? frame.querySelector(".training-video") : null;
    if (!video) return;

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      video.dataset.userPlayAttempt = "true";
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute("muted", "");
      playTrainingVideo(video, { showButtonOnFail: true });
    });
  });
}

document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
  const frame = button.closest(".training-video-frame");
  const video = frame ? frame.querySelector(".training-video") : null;
  const label = button.querySelector("[data-sound-label]");

  if (!video || !label) return;

  const syncSoundButton = () => {
    const isMuted = video.muted || video.volume === 0;
    button.classList.toggle("is-unmuted", !isMuted);
    label.textContent = isMuted ? "Sound Off" : "Sound On";
    button.setAttribute("aria-label", isMuted ? "Unmute training highlight video" : "Mute training highlight video");
  };

  button.addEventListener("click", () => {
    const shouldMute = !video.muted ? true : false;
    video.muted = shouldMute;
    video.defaultMuted = shouldMute;

    if (shouldMute) {
      video.setAttribute("muted", "");
    } else {
      video.removeAttribute("muted");
    }

    syncSoundButton();

    const playRequest = video.play();
    if (playRequest && typeof playRequest.catch === "function") {
      playRequest.catch(() => setTrainingVideoBlocked(video, true));
    }
  });

  video.addEventListener("volumechange", syncSoundButton);
  syncSoundButton();
});

const videoButtons = document.querySelectorAll("[data-video-src]");

if (videoButtons.length) {
  const videoModal = document.createElement("dialog");
  videoModal.className = "video-modal";
  videoModal.setAttribute("aria-label", "DGIT video player");
  videoModal.innerHTML = `
    <div class="video-modal__body">
      <div class="video-modal__top">
        <p class="video-modal__title"></p>
        <button class="video-modal__close" type="button" aria-label="Close video">&times;</button>
      </div>
      <video controls playsinline webkit-playsinline preload="metadata" muted></video>
    </div>
  `;
  document.body.appendChild(videoModal);

  const modalVideo = videoModal.querySelector("video");
  const modalTitle = videoModal.querySelector(".video-modal__title");
  const closeVideoButton = videoModal.querySelector(".video-modal__close");

  const resetModalVideo = () => {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.removeAttribute("poster");
    modalVideo.load();
  };

  closeVideoButton.addEventListener("click", () => videoModal.close());

  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) {
      videoModal.close();
    }
  });

  videoModal.addEventListener("close", resetModalVideo);

  videoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const source = button.dataset.videoSrc;
      if (!source) return;

      modalTitle.textContent = button.dataset.videoTitle || "DGIT Video";
      modalVideo.poster = button.dataset.videoPoster || "";
      modalVideo.muted = true;
      modalVideo.src = source;
      modalVideo.load();

      if (typeof videoModal.showModal === "function") {
        videoModal.showModal();
      } else {
        videoModal.setAttribute("open", "");
      }

      const playRequest = modalVideo.play();
      if (playRequest && typeof playRequest.catch === "function") {
        playRequest.catch(() => {});
      }
    });
  });
}

const trainingForm = document.querySelector("#trainingForm");
const formStatus = document.querySelector("#formStatus");

if (trainingForm && formStatus) {
  trainingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!trainingForm.checkValidity()) {
      formStatus.textContent = "Please complete the required details first.";
      trainingForm.reportValidity();
      return;
    }

    formStatus.textContent = "Thank you. The DGIT team will contact you to confirm your training slot.";
    trainingForm.reset();
  });
}

const programCarousel = document.querySelector("[data-program-carousel]");

if (programCarousel) {
  const programViewport = programCarousel.querySelector("[data-program-viewport]");
  const programSlides = Array.from(programCarousel.querySelectorAll("[data-program-slide]"));
  const programDots = Array.from(programCarousel.querySelectorAll("[data-program-dot]"));
  const programPreviousButton = programCarousel.querySelector("[data-program-previous]");
  const programNextButton = programCarousel.querySelector("[data-program-next]");
  const programCounter = programCarousel.querySelector("[data-program-counter]");
  let activeProgramIndex = Math.max(0, programSlides.findIndex((slide) => slide.classList.contains("is-active")));
  let swipeStart = null;
  let suppressClickUntil = 0;

  const showProgramSlide = (requestedIndex) => {
    if (!programSlides.length) return;

    activeProgramIndex = (requestedIndex + programSlides.length) % programSlides.length;

    programSlides.forEach((slide, index) => {
      const isActive = index === activeProgramIndex;
      slide.hidden = !isActive;
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.classList.toggle("is-active", isActive);
    });

    programDots.forEach((dot, index) => {
      const isActive = index === activeProgramIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });

    if (programCounter) {
      programCounter.textContent = `${activeProgramIndex + 1} / ${programSlides.length}`;
    }
  };

  programPreviousButton?.addEventListener("click", () => showProgramSlide(activeProgramIndex - 1));
  programNextButton?.addEventListener("click", () => showProgramSlide(activeProgramIndex + 1));

  programDots.forEach((dot, index) => {
    dot.addEventListener("click", () => showProgramSlide(index));
  });

  programCarousel.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showProgramSlide(activeProgramIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showProgramSlide(activeProgramIndex + 1);
    }
  });

  if (programViewport) {
    programViewport.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;

      swipeStart = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY
      };
    });

    programViewport.addEventListener(
      "click",
      (event) => {
        if (Date.now() >= suppressClickUntil) return;

        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true
    );

    window.addEventListener("pointerup", (event) => {
      if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;

      const horizontalDistance = event.clientX - swipeStart.x;
      const verticalDistance = event.clientY - swipeStart.y;
      const isHorizontalSwipe =
        Math.abs(horizontalDistance) >= 48 &&
        Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.25;

      swipeStart = null;

      if (!isHorizontalSwipe) return;

      suppressClickUntil = Date.now() + 350;
      showProgramSlide(activeProgramIndex + (horizontalDistance < 0 ? 1 : -1));
    });

    window.addEventListener("pointercancel", () => {
      swipeStart = null;
    });
  }

  showProgramSlide(activeProgramIndex);
}

const soloModal = document.querySelector("#solo-training-booking");
const soloOpenButtons = document.querySelectorAll("[data-solo-training-open]");

if (soloModal && soloOpenButtons.length) {
  const soloPanel = soloModal.querySelector(".solo-modal__panel");
  const soloCloseButton = soloModal.querySelector(".solo-modal__close");
  const soloForm = soloModal.querySelector("#soloTrainingForm");
  const proofInput = soloModal.querySelector("[data-proof-input]");
  const proofFileName = soloModal.querySelector("[data-proof-filename]");
  const proofPreview = soloModal.querySelector("[data-proof-preview]");
  const proofError = soloModal.querySelector("[data-proof-error]");
  const rulesAgreement = soloModal.querySelector("[data-rules-agreement]");
  const rulesError = soloModal.querySelector("[data-rules-error]");
  const soloStatus = soloModal.querySelector("[data-solo-status]");
  const soloSubmitButton = soloForm ? soloForm.querySelector('button[type="submit"]') : null;
  const trainingTypeInputs = Array.from(soloModal.querySelectorAll("[data-training-type]"));
  const trainingOptionCards = Array.from(soloModal.querySelectorAll(".training-option-card"));
  const trainingProgramImage = soloModal.querySelector("[data-training-program-image]");
  const trainingImageButton = soloModal.querySelector("[data-training-image-open]");
  const trainingPreviousButton = soloModal.querySelector("[data-training-prev]");
  const trainingNextButton = soloModal.querySelector("[data-training-next]");
  const trainingDots = Array.from(soloModal.querySelectorAll("[data-training-slide]"));
  const trainingCounter = soloModal.querySelector("[data-training-counter]");
  const trainingNav = soloModal.querySelector("[data-training-nav]");
  const trainingNote = soloModal.querySelector("[data-training-note]");
  const trainingSummary = soloModal.querySelector("[data-training-summary]");
  const trainingPrice = soloModal.querySelector("[data-training-price]");
  const trainingInclusions = soloModal.querySelector("[data-training-inclusions]");
  const bookingTypeField = soloModal.querySelector("[data-booking-type]");
  const packagePriceField = soloModal.querySelector("[data-package-price]");
  const packageDetailsField = soloModal.querySelector("[data-package-details]");
  const galleryLightbox = document.querySelector("#galleryLightbox");
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");
  const allowedProofTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedProofExtension = /\.(jpe?g|png|webp)$/i;
  const maxProofSize = 7 * 1024 * 1024;
  const rulesAgreementMessage = "Please read and agree to the Daily Grind Individual Training Rules and Regulations before submitting your request.";
  const trainingTypeMessage = "Please select a DGIT training program before submitting.";
  const trainingPrograms = {
    "Solo Training": {
      note: "Solo Training is a one-on-one session with the coach.",
      priceDisplay: "₱15,000 per student",
      priceSubmission: "PHP 15,000 per student",
      detailsDisplay: "10 sessions · Court fee: ₱150 per session · Free DGIT Merchandise (1 only)",
      detailsSubmission: "10 sessions; Court fee: PHP 150 per session; Free DGIT Merchandise (1 only)",
      images: [
        {
          src: "assets/images/solo_trainingprogram1.1.jfif",
          alt: "Solo Training program overview and inclusions"
        },
        {
          src: "assets/images/solo_trainingprogram1.1.2.jfif",
          alt: "Solo Training program details, pricing, court fee, and bonus"
        }
      ]
    },
    "Duo Training": {
      note: "Duo Training is designed for two athletes training together in the same personalized session.",
      priceDisplay: "₱12,000 per student",
      priceSubmission: "PHP 12,000 per student",
      detailsDisplay: "10 sessions · Court fee included · Free DGIT Wear merch",
      detailsSubmission: "10 sessions; Court fee included; Free DGIT Wear merch",
      images: [
        {
          src: "assets/images/dgit_duotraining.jfif",
          alt: "DGIT Duo Basketball Training program"
        }
      ]
    },
    "Trio Training": {
      note: "Trio Training is designed for three athletes developing their skills together in the same training session.",
      priceDisplay: "₱10,500 per student",
      priceSubmission: "PHP 10,500 per student",
      detailsDisplay: "10 sessions · Court fee included · Free DGIT Wear merch",
      detailsSubmission: "10 sessions; Court fee included; Free DGIT Wear merch",
      images: [
        {
          src: "assets/images/dgit_triotraining.jfif",
          alt: "DGIT Trio Basketball Training program"
        }
      ]
    },
    "Small Group Training": {
      note: "Small Group Training is designed for 4–6 athletes while still addressing each player's individual development needs.",
      priceDisplay: "₱9,500 per student",
      priceSubmission: "PHP 9,500 per student",
      detailsDisplay: "10 sessions · Court fee included · Free DGIT Wear merch",
      detailsSubmission: "10 sessions; Court fee included; Free DGIT Wear merch",
      images: [
        {
          src: "assets/images/dgit_smallgroup.jfif",
          alt: "DGIT Small Group Basketball Training program"
        }
      ]
    }
  };

  let lastSoloTrigger = null;
  let proofPreviewUrl = "";
  let selectedTrainingType = "Solo Training";
  let trainingImageIndex = 0;

  const getSoloFocusable = () => {
    if (!soloPanel) return [];

    return Array.from(soloPanel.querySelectorAll(focusableSelector)).filter((element) => {
      return element.offsetParent !== null || element === document.activeElement;
    });
  };

  const clearProofPreview = () => {
    if (proofPreviewUrl) {
      URL.revokeObjectURL(proofPreviewUrl);
      proofPreviewUrl = "";
    }

    if (proofPreview) {
      proofPreview.hidden = true;
      proofPreview.removeAttribute("src");
    }
  };

  const setProofError = (message) => {
    if (proofError) {
      proofError.textContent = message;
    }

    if (proofInput) {
      proofInput.setCustomValidity(message);
    }
  };

  const validateProofFile = () => {
    if (!proofInput) return true;

    const file = proofInput.files && proofInput.files[0];

    clearProofPreview();

    if (!file) {
      if (proofFileName) {
        proofFileName.textContent = "No file selected";
      }
      setProofError("");
      return true;
    }

    if (proofFileName) {
      proofFileName.textContent = file.name;
    }

    const hasAllowedType = allowedProofTypes.includes(file.type);
    const hasAllowedExtension = allowedProofExtension.test(file.name);

    if (!hasAllowedType && !hasAllowedExtension) {
      setProofError("Please upload a JPG, JPEG, PNG, or WEBP image.");
      return false;
    }

    if (file.size > maxProofSize) {
      setProofError("Please upload an image smaller than 7 MB.");
      return false;
    }

    setProofError("");

    if (proofPreview && window.URL && typeof URL.createObjectURL === "function") {
      proofPreviewUrl = URL.createObjectURL(file);
      proofPreview.src = proofPreviewUrl;
      proofPreview.hidden = false;
    }

    return true;
  };

  const syncRulesAgreementValidity = (options = {}) => {
    if (!rulesAgreement) return true;

    const isAgreed = rulesAgreement.checked;
    const message = isAgreed ? "" : rulesAgreementMessage;

    rulesAgreement.setCustomValidity(message);

    if (rulesError) {
      rulesError.textContent = options.showError && !isAgreed ? message : "";
    }

    return isAgreed;
  };

  const updateTrainingProgramImages = () => {
    const images = trainingPrograms[selectedTrainingType]?.images || [];
    const activeImage = images[trainingImageIndex];

    if (!activeImage) return;

    if (trainingProgramImage) {
      trainingProgramImage.src = activeImage.src;
      trainingProgramImage.alt = activeImage.alt;
    }

    if (trainingImageButton) {
      trainingImageButton.setAttribute("aria-label", `View ${activeImage.alt} full size`);
    }

    if (trainingCounter) {
      trainingCounter.textContent = `${trainingImageIndex + 1} / ${images.length}`;
    }

    if (trainingNav) {
      trainingNav.hidden = images.length <= 1;
    }

    trainingDots.forEach((dot, index) => {
      const isAvailable = index < images.length;
      const isActive = index === trainingImageIndex;
      dot.hidden = !isAvailable;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
      dot.setAttribute("aria-label", `Show ${selectedTrainingType} image ${index + 1}`);
    });
  };

  const updateTrainingSummary = () => {
    const program = trainingPrograms[selectedTrainingType];

    if (!program) return;

    if (trainingNote) {
      trainingNote.textContent = program.note;
    }

    if (trainingSummary) {
      trainingSummary.textContent = selectedTrainingType;
    }

    if (trainingPrice) {
      trainingPrice.textContent = program.priceDisplay;
    }

    if (trainingInclusions) {
      trainingInclusions.textContent = program.detailsDisplay;
    }

    if (bookingTypeField) {
      bookingTypeField.value = selectedTrainingType;
    }

    if (packagePriceField) {
      packagePriceField.value = program.priceSubmission;
    }

    if (packageDetailsField) {
      packageDetailsField.value = program.detailsSubmission;
    }

    if (soloSubmitButton) {
      const submitLabel = `Submit ${selectedTrainingType} Request`;
      soloSubmitButton.dataset.submitLabel = submitLabel;

      if (soloForm?.dataset.submitting !== "true") {
        soloSubmitButton.textContent = submitLabel;
      }
    }
  };

  const setTrainingType = (trainingType) => {
    if (!trainingPrograms[trainingType]) return;

    selectedTrainingType = trainingType;
    trainingImageIndex = 0;

    trainingTypeInputs.forEach((input) => {
      input.checked = input.value === selectedTrainingType;
      input.setCustomValidity("");
    });

    trainingOptionCards.forEach((card) => {
      const input = card.querySelector("[data-training-type]");
      card.classList.toggle("is-selected", Boolean(input && input.checked));
    });

    updateTrainingProgramImages();
    updateTrainingSummary();
  };

  const syncTrainingTypeValidity = () => {
    const selectedInput = trainingTypeInputs.find((input) => input.checked);
    const isValid = Boolean(selectedInput && trainingPrograms[selectedInput.value]);

    trainingTypeInputs.forEach((input, index) => {
      input.setCustomValidity(!isValid && index === 0 ? trainingTypeMessage : "");
    });

    return isValid;
  };

  const showTrainingImage = (index) => {
    const images = trainingPrograms[selectedTrainingType]?.images || [];

    if (!images.length) return;

    trainingImageIndex = (index + images.length) % images.length;
    updateTrainingProgramImages();
  };

  const closeSoloModal = () => {
    if (soloModal.hidden) return;

    soloModal.hidden = true;
    document.body.classList.remove("solo-modal-open");
    document.removeEventListener("keydown", handleSoloKeydown);

    if (window.location.hash === "#solo-training-booking" && window.history && typeof window.history.replaceState === "function") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    if (lastSoloTrigger && typeof lastSoloTrigger.focus === "function") {
      lastSoloTrigger.focus({ preventScroll: true });
    }
  };

  function handleSoloKeydown(event) {
    if (galleryLightbox && galleryLightbox.open) return;

    if (event.key === "Escape") {
      closeSoloModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = getSoloFocusable();

    if (!focusableElements.length) {
      event.preventDefault();
      if (soloPanel) {
        soloPanel.focus();
      }
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!soloPanel.contains(document.activeElement)) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  const openSoloModal = (trigger) => {
    lastSoloTrigger = trigger || document.activeElement;

    const intendedTrainingType = trigger?.dataset.trainingTypeIntent;
    if (intendedTrainingType) {
      setTrainingType(intendedTrainingType);
    }

    soloModal.hidden = false;
    document.body.classList.add("solo-modal-open");
    document.addEventListener("keydown", handleSoloKeydown);

    if (soloCloseButton) {
      soloCloseButton.focus({ preventScroll: true });
    } else if (soloPanel) {
      soloPanel.focus({ preventScroll: true });
    }
  };

  soloOpenButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openSoloModal(button);
    });
  });

  if (soloCloseButton) {
    soloCloseButton.addEventListener("click", closeSoloModal);
  }

  soloModal.addEventListener("click", (event) => {
    if (event.target === soloModal) {
      closeSoloModal();
    }
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#solo-training-booking") {
      openSoloModal();
    }
  });

  if (window.location.hash === "#solo-training-booking") {
    window.setTimeout(() => openSoloModal(), 0);
  }

  if (trainingTypeInputs.length) {
    const initiallySelectedType = trainingTypeInputs.find((input) => input.checked)?.value || "Solo Training";
    setTrainingType(initiallySelectedType);

    trainingTypeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) {
          setTrainingType(input.value);
          if (soloStatus) {
            soloStatus.textContent = "";
          }
        }
      });

      input.addEventListener("invalid", () => {
        syncTrainingTypeValidity();
        if (soloStatus) {
          soloStatus.textContent = trainingTypeMessage;
        }
      });
    });
  }

  if (trainingPreviousButton) {
    trainingPreviousButton.addEventListener("click", () => showTrainingImage(trainingImageIndex - 1));
  }

  if (trainingNextButton) {
    trainingNextButton.addEventListener("click", () => showTrainingImage(trainingImageIndex + 1));
  }

  trainingDots.forEach((dot) => {
    dot.addEventListener("click", () => showTrainingImage(Number(dot.dataset.trainingSlide)));
  });

  if (trainingImageButton && galleryLightbox) {
    trainingImageButton.addEventListener("click", () => {
      const lightboxImage = galleryLightbox.querySelector("img");
      const lightboxCaption = galleryLightbox.querySelector("p");

      if (lightboxImage && trainingProgramImage) {
        lightboxImage.src = trainingProgramImage.currentSrc || trainingProgramImage.src;
        lightboxImage.alt = trainingProgramImage.alt;
      }

      if (lightboxCaption && trainingProgramImage) {
        lightboxCaption.textContent = trainingProgramImage.alt;
      }

      galleryLightbox.showModal();
    });
  }

  if (proofInput) {
    proofInput.addEventListener("change", () => {
      validateProofFile();
      if (soloStatus) {
        soloStatus.textContent = "";
      }
    });
  }

  if (rulesAgreement) {
    syncRulesAgreementValidity();

    rulesAgreement.addEventListener("change", () => {
      syncRulesAgreementValidity();
      if (soloStatus) {
        soloStatus.textContent = "";
      }
    });

    rulesAgreement.addEventListener("invalid", () => {
      syncRulesAgreementValidity({ showError: true });
      if (soloStatus) {
        soloStatus.textContent = rulesAgreementMessage;
      }
    });
  }

  if (soloForm) {
    soloForm.addEventListener("submit", (event) => {
      const trainingTypeIsValid = syncTrainingTypeValidity();
      const proofIsValid = validateProofFile();
      const rulesAreValid = syncRulesAgreementValidity({ showError: true });

      if (soloForm.dataset.submitting === "true") {
        event.preventDefault();
        return;
      }

      if (!trainingTypeIsValid || !proofIsValid || !rulesAreValid || !soloForm.checkValidity()) {
        event.preventDefault();
        if (soloStatus) {
          soloStatus.textContent = !trainingTypeIsValid
            ? trainingTypeMessage
            : !proofIsValid
              ? "Please choose a valid proof of payment image."
              : !rulesAreValid
                ? rulesAgreementMessage
                : "Please complete the required details first.";
        }
        soloForm.reportValidity();
        return;
      }

      soloForm.dataset.submitting = "true";

      if (soloSubmitButton) {
        soloSubmitButton.disabled = true;
        soloSubmitButton.textContent = "Submitting Request\u2026";
      }

      if (soloStatus) {
        soloStatus.textContent = "Submitting Request\u2026";
      }
    });

    window.addEventListener("pageshow", () => {
      soloForm.dataset.submitting = "";

      if (soloSubmitButton) {
        soloSubmitButton.disabled = false;
        soloSubmitButton.textContent = soloSubmitButton.dataset.submitLabel || "Submit Training Request";
      }
    });
  }
}

const lightbox = document.querySelector("#galleryLightbox");

if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector("button");

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const sourceImage = trigger.matches("img") ? trigger : trigger.querySelector("img");

      if (!sourceImage) return;

      lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
      lightboxImage.alt = sourceImage.alt;
      lightboxCaption.textContent = trigger.dataset.caption || sourceImage.dataset.caption || sourceImage.alt;
      lightbox.showModal();
    });
  });

  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}
