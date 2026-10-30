(() => {
  "use strict";

  const models = window.HAIRCUTS || [];
  const angles = window.ANGLES || [];
  const imagePath = (model, angle) => `assets/images/${model.imageStem}-${angle}.jpg`;
  const grid = document.getElementById("model-grid");
  const searchInput = document.getElementById("model-search");
  const count = document.getElementById("visible-count");
  const emptyState = document.getElementById("empty-state");
  let activeFilter = "all";
  let activeProfile = null;
  let activeLength = null;
  let currentDetail = null;
  let currentAngleIndex = 0;
  let toastTimer = null;
  let carouselCleanup = () => {};

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);

  function renderModels(list) {
    grid.innerHTML = list.map((model) => `
      <article class="model-card" data-model-id="${escapeHtml(model.id)}">
        <button class="card-open" type="button" data-open-model="${escapeHtml(model.id)}" aria-label="${escapeHtml(model.name)} detaylarını aç">
          <div class="card-image-wrap">
            <img class="card-image" src="${imagePath(model, "front")}" alt="${escapeHtml(model.name)} saç kesimi önden görünüm" loading="lazy">
            <div class="image-placeholder"><span>✂</span><strong>${escapeHtml(model.name)}</strong><small>Görsel eklemek için README dosyasına bakın</small></div>
            <span class="card-number">${escapeHtml(model.number)} / ${String(models.length).padStart(2, "0")}</span>
            <span class="card-view-label">4 AÇI</span>
          </div>
          <div class="card-info">
            <div class="card-title-line"><div><h3>${escapeHtml(model.name)}</h3><p>${escapeHtml(model.turkishName)}</p></div><span class="card-arrow">↗</span></div>
            <div class="card-tags">${model.categoryLabels.slice(0, 2).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          </div>
        </button>
        <div class="card-dots" role="group" aria-label="${escapeHtml(model.name)} görsel açıları">
          ${angles.map((angle, index) => `<button class="card-dot ${index === 0 ? "is-active" : ""}" type="button" data-card-angle="${index}" data-card-model="${escapeHtml(model.id)}" aria-label="${escapeHtml(angle.label)} görünümü" aria-pressed="${index === 0 ? "true" : "false"}"></button>`).join("")}
          <span class="dot-hint">Görseller otomatik değişir</span>
        </div>
      </article>
    `).join("");
    count.textContent = String(list.length).padStart(2, "0");
    emptyState.hidden = list.length !== 0;
    setupCardCarousels();
  }

  function filterModels() {
    const term = searchInput.value.trim().toLocaleLowerCase("tr-TR");
    const result = models.filter((model) => {
      const text = [model.name, model.turkishName, model.subtitle, model.description, ...model.categoryLabels].join(" ").toLocaleLowerCase("tr-TR");
      const matchesTerm = !term || text.includes(term);
      const matchesFilter = activeFilter === "all" || model.category.includes(activeFilter);
      return matchesTerm && matchesFilter;
    });
    renderModels(result);
  }

  function setupCardCarousels() {
    carouselCleanup();
    const cards = [...document.querySelectorAll(".model-card")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers = new Map();
    let observer = null;

    const advance = (card) => {
      const model = models.find((item) => item.id === card.dataset.modelId);
      if (!model) return;
      let active = Number(card.dataset.angleIndex || 0);
      active = (active + 1) % angles.length;
      card.dataset.angleIndex = String(active);
      setCardAngle(card, model, active, false);
    };

    const start = (card) => {
      if (timers.has(card)) return;
      timers.set(card, window.setInterval(() => advance(card), 2000));
    };
    const stop = (card) => {
      if (timers.has(card)) {
        window.clearInterval(timers.get(card));
        timers.delete(card);
      }
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) start(entry.target);
          else stop(entry.target);
        });
      }, { threshold: [0, 0.35, 0.7] });
      cards.forEach((card) => observer.observe(card));
    } else {
      cards.forEach(start);
    }

    carouselCleanup = () => {
      if (observer) observer.disconnect();
      timers.forEach((timer) => window.clearInterval(timer));
      timers.clear();
    };
  }

  function setCardAngle(card, model, index, resetTimer = true) {
    const angle = angles[index];
    const image = card.querySelector(".card-image");
    const dots = [...card.querySelectorAll(".card-dot")];
    card.dataset.angleIndex = String(index);
    image.alt = `${model.name} saç kesimi ${angle.label.toLocaleLowerCase("tr-TR")} görünüm`;
    image.style.display = "block";
    image.nextElementSibling?.classList.remove("is-visible");
    image.src = imagePath(model, angle.id);
    image.dataset.fallbackTried = "false";
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-pressed", String(active));
    });
  }

  grid.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-card-angle]");
    if (dot) {
      event.preventDefault();
      event.stopPropagation();
      const card = dot.closest(".model-card");
      const model = models.find((item) => item.id === dot.dataset.cardModel);
      if (card && model) setCardAngle(card, model, Number(dot.dataset.cardAngle));
      return;
    }
    const opener = event.target.closest("[data-open-model]");
    if (opener) openDetail(opener.dataset.openModel);
  });

  grid.addEventListener("error", (event) => {
    const image = event.target;
    if (!image.classList.contains("card-image")) return;
    image.style.display = "none";
    image.nextElementSibling?.classList.add("is-visible");
  }, true);

  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("is-active"));
      button.classList.add("is-active");
      activeFilter = button.dataset.filter;
      filterModels();
    });
  });
  searchInput.addEventListener("input", filterModels);
  document.getElementById("clear-search").addEventListener("click", () => {
    searchInput.value = "";
    activeFilter = "all";
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("is-active", chip.dataset.filter === "all"));
    filterModels();
  });

  // Detail modal and four-angle gallery
  const detailModal = document.getElementById("detail-modal");
  const detailImage = document.getElementById("detail-main-image");
  const detailPlaceholder = document.querySelector(".detail-placeholder");

  function showDetailAngle(index) {
    if (!currentDetail) return;
    currentAngleIndex = (index + angles.length) % angles.length;
    const angle = angles[currentAngleIndex];
    detailImage.src = imagePath(currentDetail, angle.id);
    detailImage.alt = `${currentDetail.name} — ${angle.label} görünüm`;
    detailImage.style.display = "block";
    detailPlaceholder.classList.remove("is-visible");
    document.getElementById("detail-angle-label").textContent = angle.label.toLocaleUpperCase("tr-TR");
    document.querySelectorAll(".angle-thumb").forEach((button, idx) => button.classList.toggle("is-active", idx === currentAngleIndex));
    document.getElementById("zoomed-image").src = imagePath(currentDetail, angle.id);
    document.getElementById("zoom-caption").textContent = `${currentDetail.name} · ${angle.label}`;
  }

  detailImage.addEventListener("error", () => {
    detailImage.style.display = "none";
    detailPlaceholder.classList.add("is-visible");
  });
  detailImage.addEventListener("load", () => {
    detailImage.style.display = "block";
    detailPlaceholder.classList.remove("is-visible");
  });

  function openDetail(id) {
    currentDetail = models.find((model) => model.id === id);
    if (!currentDetail) return;
    currentAngleIndex = 0;
    document.getElementById("detail-code").textContent = `${currentDetail.number} / ${String(models.length).padStart(2, "0")}`;
    document.getElementById("detail-title").textContent = `${currentDetail.name} (${currentDetail.turkishName})`;
    document.getElementById("detail-subtitle").textContent = currentDetail.subtitle;
    document.getElementById("detail-description").textContent = currentDetail.description;
    document.getElementById("detail-barber-text").textContent = `“${currentDetail.barberText}”`;
    document.getElementById("detail-maintenance").textContent = currentDetail.maintenance;
    document.getElementById("detail-note").textContent = currentDetail.note;
    document.getElementById("detail-tags").innerHTML = currentDetail.categoryLabels.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    document.getElementById("angle-picker").innerHTML = angles.map((angle, index) => `
      <button type="button" class="angle-thumb ${index === 0 ? "is-active" : ""}" data-detail-angle="${index}">
        <span class="angle-thumb-index">0${index + 1}</span><strong>${escapeHtml(angle.label)}</strong>
      </button>
    `).join("");
    document.getElementById("angle-picker").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => showDetailAngle(Number(button.dataset.detailAngle))));
    showDetailAngle(0);
    detailModal.hidden = false;
    document.body.classList.add("modal-open");
    document.getElementById("close-detail").focus();
  }

  function closeDetail() {
    detailModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  document.getElementById("close-detail").addEventListener("click", closeDetail);
  detailModal.addEventListener("click", (event) => { if (event.target === detailModal) closeDetail(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.getElementById("zoom-modal").hidden ? closeDetail() : closeZoom();
    }
  });

  // Zoom view
  const zoomModal = document.getElementById("zoom-modal");
  function openZoom() {
    if (!currentDetail) return;
    showDetailAngle(currentAngleIndex);
    zoomModal.hidden = false;
  }
  function closeZoom() { zoomModal.hidden = true; }
  function moveZoom(direction) { showDetailAngle(currentAngleIndex + direction); }
  document.getElementById("zoom-image").addEventListener("click", openZoom);
  document.getElementById("close-zoom").addEventListener("click", closeZoom);
  document.getElementById("zoom-prev").addEventListener("click", () => moveZoom(-1));
  document.getElementById("zoom-next").addEventListener("click", () => moveZoom(1));
  zoomModal.addEventListener("click", (event) => { if (event.target === zoomModal) closeZoom(); });

  // Copy the exact barber request
  document.getElementById("copy-barber-text").addEventListener("click", async () => {
    if (!currentDetail) return;
    try {
      await navigator.clipboard.writeText(currentDetail.barberText);
      showToast("Berbere söyleyeceğin cümle kopyalandı.");
    } catch (_) {
      showToast("Kopyalama desteklenmiyor. Cümleyi ekrandan gösterebilirsin.");
    }
  });

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  // Guided selection
  const profileLabels = {
    dense: "Sık ve dengeli saç",
    temples: "Şakaklarda açılma",
    front: "Ön bölgede seyrelme",
    crown: "Tepe bölgesinde seyrelme",
    unsure: "Emin değilim / birden fazla durum"
  };
  const lengthLabels = { "1-2": "1–2 cm", "3": "3 cm", "4-5": "4–5 cm", "6-8": "6–8 cm", "10+": "10 cm ve üzeri" };
  const step1 = document.getElementById("guide-step-1");
  const step2 = document.getElementById("guide-step-2");
  const results = document.getElementById("guide-results");

  document.querySelectorAll(".profile-option").forEach((button) => {
    button.addEventListener("click", () => {
      activeProfile = button.dataset.profile;
      document.querySelectorAll(".profile-option").forEach((option) => option.classList.toggle("is-selected", option === button));
      document.getElementById("profile-hint").textContent = `${profileLabels[activeProfile]} seçildi.`;
      document.getElementById("to-step-2").disabled = false;
    });
  });

  document.getElementById("to-step-2").addEventListener("click", () => {
    step1.hidden = true;
    step2.hidden = false;
    results.hidden = true;
    document.getElementById("progress-fill").style.width = "50%";
    document.getElementById("progress-label").textContent = "2 / 2 ADIM";
  });
  document.querySelectorAll(".length-option").forEach((button) => {
    button.addEventListener("click", () => {
      activeLength = button.dataset.length;
      document.querySelectorAll(".length-option").forEach((option) => option.classList.toggle("is-selected", option === button));
      document.getElementById("show-recommendations").disabled = false;
    });
  });
  document.getElementById("back-to-step-1").addEventListener("click", () => {
    step2.hidden = true;
    step1.hidden = false;
    document.getElementById("progress-fill").style.width = "0%";
    document.getElementById("progress-label").textContent = "1 / 2 ADIM";
  });

  document.getElementById("show-recommendations").addEventListener("click", () => {
    const currentCm = { "1-2": 2, "3": 3, "4-5": 5, "6-8": 8, "10+": 10 }[activeLength];
    let profileMatches = models.filter((model) => activeProfile === "unsure" || model.profiles.includes(activeProfile));
    if (!profileMatches.length) profileMatches = models;
    const ready = profileMatches.filter((model) => model.minLengthCm <= currentCm);
    const grow = profileMatches.filter((model) => model.minLengthCm > currentCm);
    const readyList = ready.length ? ready : profileMatches;
    document.getElementById("recommendation-summary").textContent = `${profileLabels[activeProfile]} ve ${lengthLabels[activeLength]} seçimine göre modelleri iki grupta gösteriyoruz. Uzun saçını kısaltmak mümkündür; ikinci grup, mevcut saçın henüz yeterli uzunlukta olmayabileceği modelleri belirtir. Bu liste kesin uygunluk veya saç analizi değildir.`;
    const buildRows = (list) => list.map((model) => `
      <button class="recommendation-item" type="button" data-recommendation-model="${escapeHtml(model.id)}">
        <span class="recommendation-number">${escapeHtml(model.number)}</span><span class="recommendation-name"><strong>${escapeHtml(model.name)}</strong><small>${escapeHtml(model.turkishName)} · ${escapeHtml(model.subtitle)}</small></span><span class="recommendation-arrow">↗</span>
      </button>
    `).join("");
    document.getElementById("recommendation-list").innerHTML = buildRows(readyList);
    document.getElementById("grow-list").innerHTML = buildRows(grow);
    document.getElementById("grow-group").hidden = grow.length === 0;
    step2.hidden = true;
    results.hidden = false;
    document.getElementById("progress-fill").style.width = "100%";
    document.getElementById("progress-label").textContent = "TAMAMLANDI";
    document.querySelectorAll("[data-recommendation-model]").forEach((button) => button.addEventListener("click", () => openDetail(button.dataset.recommendationModel)));
  });

  document.getElementById("edit-guide").addEventListener("click", () => {
    results.hidden = true;
    step2.hidden = false;
    document.getElementById("progress-fill").style.width = "50%";
    document.getElementById("progress-label").textContent = "2 / 2 ADIM";
  });
  document.getElementById("all-models-from-guide").addEventListener("click", () => {
    activeFilter = "all";
    searchInput.value = "";
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("is-active", chip.dataset.filter === "all"));
    filterModels();
    document.getElementById("models").scrollIntoView({ behavior: "smooth" });
  });

  // Initial catalogue
  renderModels(models);
})();
