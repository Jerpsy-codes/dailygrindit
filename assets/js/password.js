const levelCodeHashes = {
  1: "64a2182f18f8082fa179b0b55d3d4b7193bc27d74c484395e5ddf3a454af87f3",
  2: "50b89bda10af38d0c920b0213b0b981b6b3e11640f1ccd53adfb1a0e6ceca7d7",
  3: "c125e46d5fba585f296843e7178b2168a67278ac25925cdc4651e13b63955b9d",
  4: "5f9bc5f1dc498fced8945b05c1d98c121872489ccf0d2430ecfe64d320f69e49",
  5: "ad36bc058765114f173a25615f990745d3e6ae0fa0abc0d8c087911d5b48b3f3",
  6: "6d706e5ddaa5fa49e8d1f70eb7db461839010b5c935f4352e448251f8ee09a26",
};

const levelNames = {
  1: "Basic Fundamentals",
  2: "Finishing",
  3: "Shooting",
  4: "Downhill and Transition",
  5: "Anchor Step Movement",
  6: "Actual Game Reads",
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
    "Maxwell Troy Diaz",
    "Sonbise Glenn Dwight",
    "Niel Cabrejas",
    "Fabio Dela Cruz",
    "Leenard Canete",
    "Joshua Hanza",
    "Charles Maunes",
    
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
    "Aiden Rei P. Regudo",
    "Jay Clifford Torremucha",
    "Ezekiel John Jalbuna",
    
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
  5: [
    "Allen Grant Budomo",
    "Gil Gabriel Duran",
    "Evan Christoff Pardillo",
    "Adisson Naite Sarcauga",
    "Alysander Jeff Buot",
    "Timothy Evance Yurong",
    "Jay Cliff Dilao",
    "Marcus Villordon",
  ],
  6: [],
};

const coachAccessRecords = [
  {
    name: "Tommy Spencer",
    codeHash: "d099c9cea0d0a0e9435a5f6ccf69126aa48d4a36a82703871b655bff5177b766",
  },
  {
    name: "Christian Escoro",
    codeHash: "5109484708473b643f17daa0ee54116176cd0e41244ca2619eb6a4477d72aed8",
  },
  {
    name: "Cj Deiparine",
    codeHash: "35a11e0b6047fdbaa56a0fa97452a3e3699eb8bd1738214a6e7ba7a4525b3f17",
  },
  {
    name: "Vaughn Oclarit",
    codeHash: "86b19603008d9fe1c501ad9b5fa8b04903202d50beee8046e6f3726d15bf1b84",
  },
  {
    name: "Jerpax",
    codeHash: "738e2d669a4ff7b7b2696a8c170e947e60fcce2727acaa51499de0894832cbf0",
  },
  {
    name: "Zepp Capuras",
    codeHash: "c80aefc1e741c0d0860aac3c2bcfbad9be0ddae2c27bf7756450083712760922",
  },
  {
    name: "Llorenz Escoro",
    codeHash: "6422ca8b44ca6a5810d4ffe8f768a10bb8f8ee5cede13c7e86c88dec6c6243e7",
  },
];

const accessPrefix = "dgit-level-access-";
const coachSessionKey = "dgitWeekendCoachAccess";
const allAccessLevel = 6;

function normalizePlayerName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeCoachName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function nameMatchesList(name, names) {
  const normalizedName = normalizePlayerName(name);
  return names.some((playerName) => normalizePlayerName(playerName) === normalizedName);
}

function athleteNameCanAccessLevel(name, level) {
  const normalizedName = normalizePlayerName(name);
  if (!normalizedName) return false;

  const assignedNames = levelPlayerNames[level] || [];
  if (!assignedNames.length && Number(level) === 6) {
    return true;
  }

  return nameMatchesList(name, assignedNames);
}

function getCoachRecord(name) {
  const normalizedName = normalizeCoachName(name);
  return coachAccessRecords.find((coach) => normalizeCoachName(coach.name) === normalizedName) || null;
}

async function hashAccessCode(code) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Secure code verification is unavailable in this browser.");
  }

  const codeBytes = new TextEncoder().encode(String(code));
  const digest = await window.crypto.subtle.digest("SHA-256", codeBytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function codeMatchesHash(code, expectedHash) {
  const suppliedHash = await hashAccessCode(code);
  return suppliedHash === expectedHash;
}

function getCoachSession() {
  const storedSession = sessionStorage.getItem(coachSessionKey);
  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession);
    const coach = getCoachRecord(session.coachName);

    if (session.authorized === true && session.role === "coach" && coach) {
      return {
        authorized: true,
        role: "coach",
        coachName: coach.name,
      };
    }
  } catch (error) {
    sessionStorage.removeItem(coachSessionKey);
  }

  return null;
}

function grantCoachAccess(coachName) {
  sessionStorage.setItem(
    coachSessionKey,
    JSON.stringify({
      authorized: true,
      role: "coach",
      coachName,
    })
  );
}

function hasLevelAccess(level) {
  return Boolean(getCoachSession()) || sessionStorage.getItem(`${accessPrefix}${level}`) === "granted";
}

function grantLevelAccess(level) {
  if (Number(level) === allAccessLevel) {
    Object.keys(levelCodeHashes).forEach((courseLevel) => {
      sessionStorage.setItem(`${accessPrefix}${courseLevel}`, "granted");
    });
    return;
  }

  sessionStorage.setItem(`${accessPrefix}${level}`, "granted");
}

function openLevel(level) {
  if (!levelCodeHashes[level]) return;

  if (hasLevelAccess(level)) {
    window.location.href = `level-${level}.html`;
    return;
  }

  enterLevel(level);
}

function enterLevel(level, options = {}) {
  const numericLevel = level === null ? null : Number(level);
  const hasAthleteMethod = numericLevel !== null && Boolean(levelCodeHashes[numericLevel]);
  if (numericLevel !== null && !hasAthleteMethod) return;

  const trigger = document.activeElement;
  const dialog = document.createElement("dialog");
  const instanceId = `${numericLevel || "coach"}-${Date.now()}`;
  const initialMethod = options.initialMethod === "coach" || !hasAthleteMethod ? "coach" : "athlete";

  dialog.className = "level-modal";
  dialog.setAttribute("aria-label", numericLevel ? `Access Level ${numericLevel}` : "Coach access");
  dialog.innerHTML = `
    <div class="level-modal-shell">
      <button class="modal-close" type="button" aria-label="Close access form">&times;</button>
      <p class="section-kicker">Private Weekend Course Access</p>
      <h2>${numericLevel ? `Access Level ${numericLevel}` : "Coach Login"}</h2>
      <p class="modal-copy">${
        numericLevel
          ? `${levelNames[numericLevel]} is available to assigned athletes and authorized DGIT coaches.`
          : "Authorized DGIT coaches can unlock all six Weekend Course levels for this browser session."
      }</p>
      ${
        hasAthleteMethod
          ? `
            <div class="access-method-tabs" role="tablist" aria-label="Choose access method">
              <button type="button" role="tab" data-access-tab="athlete" aria-selected="true" aria-controls="athlete-panel-${instanceId}">Athlete Access</button>
              <button type="button" role="tab" data-access-tab="coach" aria-selected="false" aria-controls="coach-panel-${instanceId}">Coach Access</button>
            </div>
          `
          : ""
      }
      ${
        hasAthleteMethod
          ? `
            <div class="access-panel" id="athlete-panel-${instanceId}" data-access-panel="athlete" role="tabpanel">
              <form data-athlete-access-form>
                <p class="access-panel-copy">Enter the athlete name and assigned Level ${numericLevel} code. ${
                  numericLevel === 6
                    ? "Level 6 access unlocks all six course levels."
                    : `This unlocks Level ${numericLevel} only.`
                }</p>
                <label class="sr-only" for="level-player-${instanceId}">Athlete name</label>
                <input id="level-player-${instanceId}" name="athlete-name" type="text" autocomplete="name" placeholder="Enter athlete name" required />
                <label class="sr-only" for="level-code-${instanceId}">Level ${numericLevel} code</label>
                <input id="level-code-${instanceId}" name="athlete-code" type="password" autocomplete="off" placeholder="Enter Level ${numericLevel} code" required />
                <p class="modal-error" data-athlete-error role="alert"></p>
                <button class="modal-submit" type="submit">Unlock Level ${numericLevel}</button>
              </form>
            </div>
          `
          : ""
      }
      <div class="access-panel" id="coach-panel-${instanceId}" data-access-panel="coach" role="tabpanel" ${initialMethod === "coach" ? "" : "hidden"}>
        <form data-coach-access-form>
          <p class="access-panel-copy">Enter your authorized coach name and matching access code. Coach access unlocks Levels 1–6 for this session.</p>
          <label class="sr-only" for="coach-name-${instanceId}">Authorized coach name</label>
          <input id="coach-name-${instanceId}" name="coach-name" type="text" autocomplete="name" placeholder="Enter authorized coach name" required />
          <label class="sr-only" for="coach-code-${instanceId}">Coach access code</label>
          <input id="coach-code-${instanceId}" name="coach-code" type="password" autocomplete="off" placeholder="Enter coach access code" required />
          <p class="modal-error" data-coach-error role="alert"></p>
          <button class="modal-submit" type="submit">Activate Coach Access</button>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  const closeButton = dialog.querySelector(".modal-close");
  const tabs = Array.from(dialog.querySelectorAll("[data-access-tab]"));
  const panels = Array.from(dialog.querySelectorAll("[data-access-panel]"));
  const athleteForm = dialog.querySelector("[data-athlete-access-form]");
  const coachForm = dialog.querySelector("[data-coach-access-form]");
  let dialogClosed = false;

  const selectMethod = (method) => {
    tabs.forEach((tab) => {
      tab.setAttribute("aria-selected", String(tab.dataset.accessTab === method));
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.accessPanel !== method;
    });

    const selectedPanel = panels.find((panel) => panel.dataset.accessPanel === method);
    const firstInput = selectedPanel ? selectedPanel.querySelector("input") : null;
    if (firstInput) {
      firstInput.focus();
    }
  };

  const closeDialog = () => {
    if (dialogClosed) return;
    dialogClosed = true;

    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    }

    dialog.remove();

    if (trigger && typeof trigger.focus === "function") {
      trigger.focus({ preventScroll: true });
    }
  };

  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectMethod(tab.dataset.accessTab));
  });

  if (athleteForm) {
    athleteForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nameInput = athleteForm.elements["athlete-name"];
      const codeInput = athleteForm.elements["athlete-code"];
      const error = athleteForm.querySelector("[data-athlete-error]");
      const submitButton = athleteForm.querySelector('button[type="submit"]');

      submitButton.disabled = true;
      error.textContent = "";

      try {
        const isAllAccessCode = await codeMatchesHash(codeInput.value, levelCodeHashes[allAccessLevel]);
        const authorizedNameLevel = isAllAccessCode ? allAccessLevel : numericLevel;

        if (!athleteNameCanAccessLevel(nameInput.value, authorizedNameLevel)) {
          error.textContent = isAllAccessCode
            ? "Enter the athlete name assigned to this access code."
            : "That athlete name is not authorized for this level. Check the spelling and try again.";
          nameInput.select();
          return;
        }

        const isAssignedLevelCode =
          numericLevel === allAccessLevel
            ? isAllAccessCode
            : await codeMatchesHash(codeInput.value, levelCodeHashes[numericLevel]);

        if (isAllAccessCode || isAssignedLevelCode) {
          grantLevelAccess(isAllAccessCode ? allAccessLevel : numericLevel);
          closeDialog();

          if (options.stayOnPage) {
            window.location.reload();
          } else {
            window.location.href = `level-${numericLevel}.html`;
          }
          return;
        }

        error.textContent = "That code does not match this level. Check your code and try again.";
        codeInput.select();
      } catch (errorState) {
        error.textContent = "Code verification is unavailable in this browser. Please try a current browser.";
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  if (coachForm) {
    coachForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nameInput = coachForm.elements["coach-name"];
      const codeInput = coachForm.elements["coach-code"];
      const error = coachForm.querySelector("[data-coach-error]");
      const submitButton = coachForm.querySelector('button[type="submit"]');
      const coach = getCoachRecord(nameInput.value);

      submitButton.disabled = true;
      error.textContent = "";

      try {
        const isAuthorized = coach && (await codeMatchesHash(codeInput.value, coach.codeHash));

        if (isAuthorized) {
          grantCoachAccess(coach.name);
          closeDialog();
          updateLevelTiles();
          renderCoachSessionUI();

          if (numericLevel !== null) {
            if (options.stayOnPage) {
              window.location.reload();
            } else {
              window.location.href = `level-${numericLevel}.html`;
            }
          }
          return;
        }

        error.textContent = "The coach name or access code is incorrect.";
        codeInput.select();
      } catch (errorState) {
        error.textContent = "Code verification is unavailable in this browser. Please try a current browser.";
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }

  selectMethod(initialMethod);
}

function openCoachLogin() {
  enterLevel(null, { initialMethod: "coach" });
}

function renderLockedLevel(level) {
  const main = document.querySelector("main");
  if (!main) return;

  document.body.classList.add("is-locked-level");
  main.innerHTML = `
    <section class="locked-screen">
      <div class="locked-card reveal is-visible">
        <p class="section-kicker">DGIT Private Portal</p>
        <h1>Level ${level} is locked.</h1>
        <p>${levelNames[level]} requires the assigned athlete credentials or an active authorized coach session.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" type="button" id="lockedUnlockBtn">Athlete or Coach Login</button>
          <a class="btn btn-ghost" href="weekend-course.html">Back to Weekend Course</a>
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

function logoutCoachAccess() {
  sessionStorage.removeItem(coachSessionKey);

  const currentLevel = document.body.dataset.level;
  if (currentLevel && !hasLevelAccess(currentLevel)) {
    window.location.href = "weekend-course.html";
    return;
  }

  updateLevelTiles();
  renderCoachSessionUI();
}

function renderCoachSessionUI() {
  const session = getCoachSession();
  const inactivePanel = document.querySelector("[data-coach-inactive]");
  const activePanel = document.querySelector("[data-coach-active]");
  const displayName = document.querySelector("[data-coach-display-name]");
  const existingBar = document.querySelector(".coach-session-bar");

  if (inactivePanel) {
    inactivePanel.hidden = Boolean(session);
  }

  if (activePanel) {
    activePanel.hidden = !session;
  }

  if (displayName) {
    displayName.textContent = session ? session.coachName : "";
  }

  if (!document.body.dataset.level || !session) {
    if (existingBar) {
      existingBar.remove();
    }
    return;
  }

  if (existingBar) {
    const existingName = existingBar.querySelector("[data-session-coach-name]");
    if (existingName) {
      existingName.textContent = session.coachName;
    }
    return;
  }

  const sessionBar = document.createElement("aside");
  sessionBar.className = "coach-session-bar";
  sessionBar.setAttribute("aria-label", "Active coach session");
  sessionBar.innerHTML = `
    <div>
      <span>Coach Access Active</span>
      <strong data-session-coach-name>${session.coachName}</strong>
    </div>
    <button type="button">Coach Logout</button>
  `;

  sessionBar.querySelector("button").addEventListener("click", logoutCoachAccess);
  document.body.appendChild(sessionBar);
}

document.addEventListener("DOMContentLoaded", () => {
  updateLevelTiles();
  renderCoachSessionUI();

  document.querySelectorAll("[data-coach-login]").forEach((button) => {
    button.addEventListener("click", openCoachLogin);
  });

  document.querySelectorAll("[data-coach-logout]").forEach((button) => {
    button.addEventListener("click", logoutCoachAccess);
  });

  const currentLevel = document.body.dataset.level;
  if (currentLevel && !hasLevelAccess(currentLevel)) {
    renderLockedLevel(currentLevel);
  }
});
