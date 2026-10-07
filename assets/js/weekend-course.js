(() => {
  const slideshow = document.querySelector("[data-weekend-slideshow]");
  if (!slideshow || slideshow.dataset.initialized === "true") return;

  slideshow.dataset.initialized = "true";

  const slides = Array.from(slideshow.querySelectorAll("[data-weekend-slide]"));
  const previousButton = slideshow.querySelector("[data-slide-previous]");
  const nextButton = slideshow.querySelector("[data-slide-next]");
  const counter = slideshow.querySelector("[data-slide-counter]");
  const controls = slideshow.querySelector("[data-slideshow-controls]");
  const dots = Array.from(slideshow.querySelectorAll("[data-slide-to]"));
  const stage = slideshow.querySelector("[data-weekend-slide-stage]");
  const viewer = document.querySelector("[data-poster-viewer]");
  const viewerImage = viewer ? viewer.querySelector("[data-poster-viewer-image]") : null;
  const viewerTitle = viewer ? viewer.querySelector("[data-poster-viewer-title]") : null;
  const viewerCloseButton = viewer ? viewer.querySelector("[data-poster-viewer-close]") : null;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const autoInterval = 5000;
  const interactionPause = 7000;
  const swipeThreshold = 48;

  let currentIndex = 0;
  let autoTimer = null;
  let interactionTimer = null;
  let pointerGesture = null;
  let suppressPosterClick = false;
  const pauseReasons = new Set();

  const ensureSlideLoaded = (index) => {
    const slide = slides[index];
    const image = slide ? slide.querySelector("img") : null;
    if (!image || !image.dataset.src) return;

    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  };

  const clearAutoTimer = () => {
    if (autoTimer !== null) {
      window.clearTimeout(autoTimer);
      autoTimer = null;
    }
  };

  const canAutoPlay = () => {
    return (
      slides.length > 1 &&
      !reducedMotionQuery.matches &&
      document.visibilityState !== "hidden" &&
      pauseReasons.size === 0
    );
  };

  const scheduleAutoPlay = () => {
    clearAutoTimer();
    if (!canAutoPlay()) return;

    autoTimer = window.setTimeout(() => {
      autoTimer = null;
      showSlide(currentIndex + 1);
      scheduleAutoPlay();
    }, autoInterval);
  };

  const setPauseReason = (reason, paused) => {
    if (paused) {
      pauseReasons.add(reason);
      clearAutoTimer();
      return;
    }

    pauseReasons.delete(reason);
    scheduleAutoPlay();
  };

  const pauseAfterInteraction = () => {
    setPauseReason("recent-interaction", true);

    if (interactionTimer !== null) {
      window.clearTimeout(interactionTimer);
    }

    interactionTimer = window.setTimeout(() => {
      interactionTimer = null;
      setPauseReason("recent-interaction", false);
    }, interactionPause);
  };

  function showSlide(requestedIndex, options = {}) {
    if (!slides.length) return;

    const nextIndex = (requestedIndex + slides.length) % slides.length;
    ensureSlideLoaded(nextIndex);

    slides.forEach((slide, index) => {
      const isActive = index === nextIndex;
      const posterButton = slide.querySelector("[data-poster-open]");

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));

      if (posterButton) {
        posterButton.tabIndex = isActive ? 0 : -1;
      }
    });

    dots.forEach((dot, index) => {
      if (index === nextIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    currentIndex = nextIndex;

    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    }

    ensureSlideLoaded((currentIndex + 1) % slides.length);

    if (options.manual) {
      pauseAfterInteraction();
    }
  }

  const goToPrevious = () => showSlide(currentIndex - 1, { manual: true });
  const goToNext = () => showSlide(currentIndex + 1, { manual: true });

  if (previousButton) {
    previousButton.addEventListener("click", goToPrevious);
  }

  if (nextButton) {
    nextButton.addEventListener("click", goToNext);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideTo), { manual: true });
    });
  });

  slideshow.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    } else if (event.key === "Home") {
      event.preventDefault();
      showSlide(0, { manual: true });
    } else if (event.key === "End") {
      event.preventDefault();
      showSlide(slides.length - 1, { manual: true });
    }
  });

  slideshow.addEventListener("mouseenter", () => setPauseReason("hover", true));
  slideshow.addEventListener("mouseleave", () => setPauseReason("hover", false));
  slideshow.addEventListener("focusin", () => setPauseReason("focus", true));
  slideshow.addEventListener("focusout", (event) => {
    if (!slideshow.contains(event.relatedTarget)) {
      setPauseReason("focus", false);
    }
  });

  if (stage && "PointerEvent" in window) {
    stage.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" || !event.isPrimary) return;

      pointerGesture = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      setPauseReason("pointer", true);
    });

    stage.addEventListener("pointerup", (event) => {
      if (!pointerGesture || event.pointerId !== pointerGesture.id) return;

      const horizontalDistance = event.clientX - pointerGesture.x;
      const verticalDistance = event.clientY - pointerGesture.y;
      const isHorizontalSwipe =
        Math.abs(horizontalDistance) >= swipeThreshold &&
        Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.2;

      pointerGesture = null;
      setPauseReason("pointer", false);

      if (isHorizontalSwipe) {
        suppressPosterClick = true;
        window.setTimeout(() => {
          suppressPosterClick = false;
        }, 0);

        if (horizontalDistance < 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      } else {
        pauseAfterInteraction();
      }
    });

    stage.addEventListener("pointercancel", () => {
      pointerGesture = null;
      setPauseReason("pointer", false);
      pauseAfterInteraction();
    });
  }

  const closeViewer = () => {
    if (!viewer) return;

    if (typeof viewer.close === "function" && viewer.open) {
      viewer.close();
    } else {
      viewer.removeAttribute("open");
    }
  };

  const openViewer = () => {
    if (!viewer || !viewerImage) return;

    ensureSlideLoaded(currentIndex);
    const activeImage = slides[currentIndex].querySelector("img");
    if (!activeImage || !activeImage.src) return;

    viewerImage.src = activeImage.currentSrc || activeImage.src;
    viewerImage.alt = activeImage.alt;

    if (viewerTitle) {
      viewerTitle.textContent = activeImage.alt;
    }

    document.body.classList.add("poster-viewer-open");

    if (typeof viewer.showModal === "function") {
      viewer.showModal();
    } else {
      viewer.setAttribute("open", "");
    }

    if (viewerCloseButton) {
      viewerCloseButton.focus({ preventScroll: true });
    }
  };

  slides.forEach((slide) => {
    const posterButton = slide.querySelector("[data-poster-open]");
    if (!posterButton) return;

    posterButton.addEventListener("click", (event) => {
      if (suppressPosterClick) {
        event.preventDefault();
        return;
      }

      pauseAfterInteraction();
      openViewer();
    });
  });

  if (viewer) {
    if (viewerCloseButton) {
      viewerCloseButton.addEventListener("click", closeViewer);
    }

    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) {
        closeViewer();
      }
    });

    viewer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
      }
    });

    viewer.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeViewer();
    });

    viewer.addEventListener("close", () => {
      document.body.classList.remove("poster-viewer-open");

      if (viewerImage) {
        viewerImage.removeAttribute("src");
      }

      slideshow.focus({ preventScroll: true });
    });
  }

  document.addEventListener("visibilitychange", () => {
    setPauseReason("hidden", document.visibilityState === "hidden");
  });

  const handleReducedMotionChange = () => {
    if (reducedMotionQuery.matches) {
      clearAutoTimer();
    } else {
      scheduleAutoPlay();
    }
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleReducedMotionChange);
  }

  if (slides.length <= 1 && controls) {
    controls.hidden = true;
  }

  showSlide(0);
  scheduleAutoPlay();
})();
