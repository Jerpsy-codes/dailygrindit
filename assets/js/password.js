const levelPasswords = {
  1: "Dgit@2020level1",
  2: "Dgit@2020level2",
  3: "Dgit@2020level3",
  4: "Dgit@2020level4",
};

const levelNames = {
  1: "Basic Fundamentals",
  2: "Control and Separation",
  3: "Game-Speed Creation",
  4: "Advanced Performance",
};

const levelPlayerNames = {
  1: [
    "Grayden Ymbong",
    "Vaughn Joseph Sun",
    "Cael Anthony Solis",
    "Kaiden Solis",
    "Robe Orioque",
    "Jaydee Caro",
    "Chris Anthony Espia",
    "James Ivan Lenteria",
    "Seifer Sabado",
    "Limz Abelgas",
    "Jury Deo Mangubat",
    "Ethan PALAHANG",
    "Aryey Rosalada",
    "Carl Devaughn Baring",
    "Jah ahmran A fuentes",
    "Chase Kyler Ng",
    "Nathan smith verdida",
    "Jason Cedrick Go",
    "Zebb Rovic A. Mercadal",
    "Keith Lionel Tiu",
    "Jules Andrie L. Yamoso",
    "Jason Cidrick Go",
    "Niel Cabrejas",
    "Maxwell Troy Diaz",
    "Dirk",
  ],
  2: [
    "Audie R. Moncada",
    "Francis Caiden Sanchez",
    "Glenn Rogelio Mula",
    "Jan Keith Sulana",
    "Kitsch Julius Amora",
    "Zack Kyrie Ceniza",
    "John Clouie Carampil",
    "Rio Ethan Orioque",
  ],
  3: [
    "Prince Ivan M. Catiis",
    "Philip Caesar Cacafranca",
    "Kal-el Matthnino T. Libres",
    "Ricardo Figueroa IV",
    "Matteo Miguel Lucernas",
    "Kent zachary Fuentes",
    "Franco Lucian Rojas",
    "Jhon Cedrick Duay",
    "Lee Kyle Sulana",
    "Enlil David D. Canton",
    "Didier Punay Corres",
  ],
  4: [
    "Jhonas Anthony Enoy",
    "Jamrich Sanchez",
    "Joshua Cabasa",
    "Jacob Cabasa",
    "Glenn Xavier Caboral",
    "Michael John Villa",
    "Lhord Cedric D. Mula",
    "George Ceniza",
    "Brent Anthon Cabillo",
  ],
};

const allLevelPlayerNames = [
  "Allen Grant Budomo",
  "Gil Gabriel Duran",
  "Evan Christoff Pardillo",
  "Adisson Naite Sarcauga",
  "Alysander Jeff Buot",
  "Timothy Evance Yurong",
  "Jay Cliff Dilao",
  "Marcus Villordon",
];

const accessPrefix = "dgit-level-access-";

function hasLevelAccess(level) {
  return sessionStorage.getItem(`${accessPrefix}${level}`) === "granted";
}

function grantLevelAccess(level) {
  sessionStorage.setItem(`${accessPrefix}${level}`, "granted");
}

function grantAllLevelAccess() {
  Object.keys(levelPasswords).forEach(grantLevelAccess);
}

function normalizePlayerName(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function nameMatchesList(name, names) {
  const normalizedName = normalizePlayerName(name);
  return names.some((playerName) => normalizePlayerName(playerName) === normalizedName);
}

function getPlayerAccess(name, level) {
  if (nameMatchesList(name, allLevelPlayerNames)) {
    return "all";
  }

  if (nameMatchesList(name, levelPlayerNames[level] || [])) {
    return "level";
  }

  return "";
}

function openLevel(level) {
  if (hasLevelAccess(level)) {
    window.location.href = `level-${level}.html`;
    return;
  }

  enterLevel(level);
}

function enterLevel(level, options = {}) {
  const dialog = document.createElement("dialog");
  dialog.className = "level-modal";
  dialog.innerHTML = `
    <form method="dialog" class="level-unlock-form">
      <button class="modal-close" type="button" aria-label="Close unlock form">&times;</button>
      <p class="section-kicker">Private Level Access</p>
      <h2>Unlock Level ${level}</h2>
      <p class="modal-copy">${levelNames[level]} is reserved for listed players with the matching DGIT level code.</p>
      <label class="sr-only" for="level-player-${level}">Player name</label>
      <input id="level-player-${level}" type="text" autocomplete="name" placeholder="Enter player name" required />
      <label class="sr-only" for="level-code-${level}">Level code</label>
      <input id="level-code-${level}" type="password" autocomplete="off" placeholder="Enter level code" required />
      <p class="modal-error" role="alert"></p>
      <button class="modal-submit" type="submit">Unlock Level ${level}</button>
    </form>
  `;

  document.body.appendChild(dialog);

  const form = dialog.querySelector("form");
  const nameInput = dialog.querySelector(`#level-player-${level}`);
  const codeInput = dialog.querySelector(`#level-code-${level}`);
  const closeButton = dialog.querySelector(".modal-close");
  const error = dialog.querySelector(".modal-error");

  const closeDialog = () => {
    dialog.close();
    dialog.remove();
  };

  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const playerAccess = getPlayerAccess(nameInput.value, level);

    if (!playerAccess) {
      error.textContent = "That player name is not listed for this level. Check the spelling and try again.";
      nameInput.select();
      return;
    }

    if (codeInput.value === levelPasswords[level]) {
      if (playerAccess === "all") {
        grantAllLevelAccess();
      } else {
        grantLevelAccess(level);
      }

      if (options.stayOnPage) {
        window.location.reload();
      } else {
        window.location.href = `level-${level}.html`;
      }
      return;
    }

    error.textContent = "That code does not match this level. Check your code and try again.";
    codeInput.select();
  });

  dialog.showModal();
  nameInput.focus();
}

function renderLockedLevel(level) {
  document.body.classList.add("is-locked-level");
  document.querySelector("main").innerHTML = `
    <section class="locked-screen">
      <div class="locked-card reveal is-visible">
        <p class="section-kicker">DGIT Private Portal</p>
        <h1>Level ${level} is locked.</h1>
        <p>${levelNames[level]} is available after entering your listed player name and the level code from Coach Tommy or the DGIT team.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" type="button" id="lockedUnlockBtn">Enter Name and Code</button>
          <a class="btn btn-ghost" href="weekend-course.html">Back to Levels</a>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#lockedUnlockBtn").addEventListener("click", () => {
    enterLevel(level, { stayOnPage: true });
  });
}

function updateLevelTiles() {
  document.querySelectorAll("[data-level-card]").forEach((card) => {
    const level = card.dataset.levelCard;
    const unlocked = hasLevelAccess(level);
    card.classList.toggle("is-unlocked", unlocked);
    card.classList.toggle("is-locked", !unlocked);

    const status = card.querySelector("[data-level-status]");
    const action = card.querySelector("[data-level-action]");

    if (status) {
      status.textContent = unlocked ? "Unlocked" : "Locked";
    }

    if (action) {
      action.textContent = unlocked ? `Open Level ${level}` : `Unlock Level ${level}`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateLevelTiles();

  const currentLevel = document.body.dataset.level;
  if (currentLevel && !hasLevelAccess(currentLevel)) {
    renderLockedLevel(currentLevel);
  }
});
