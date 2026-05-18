const DURATION = 10000;      
const UPDATE_INTERVAL = 50;  
let progress = 0;
const progressBar = document.getElementById('progress-bar');
  
const progressInterval = setInterval(() => {
  progress += (UPDATE_INTERVAL / DURATION) * 100;
  if (progress >= 100) {
    progress = 100;
    clearInterval(progressInterval);
  }
  progressBar.style.width = progress + '%';
}, UPDATE_INTERVAL);

const messages = ["Welcome to Megumin's World!", "The Strongest Mage!", "EXPLOSION!", "Crimson Demon Clan", "Cutest Arch Wizard", "Darkness Blacker than Black"];
let msgIndex = 0;
const textElement = document.querySelector(".loading-card");
  
const textInterval = setInterval(() => {
  msgIndex = (msgIndex + 1) % messages.length;
  textElement.textContent = messages[msgIndex];
}, 2000);

setTimeout(() => {
  progressBar.style.width = '100%';
  clearInterval(progressInterval);
  clearInterval(textInterval);

const loadingScreen = document.getElementById('loading-screen');
loadingScreen.style.opacity = '0';
setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 500);
}, DURATION);

// ── TOP NAV ────────────────────────────────

const topnavLinks = document.querySelectorAll(".topnav-links a");
const hamburger   = document.getElementById("hamburger");
const topnavMenu  = document.querySelector(".topnav-links");

// Hamburger toggle for mobile
hamburger.addEventListener("click", () => {
  topnavMenu.classList.toggle("is-open");
});

// Close menu when a link is clicked on mobile
topnavLinks.forEach(link => {
  link.addEventListener("click", () => {
    topnavMenu.classList.remove("is-open");
  });
});

// Highlight active link on scroll
const navSections = document.querySelectorAll("section[id], div[id], h2[id]");

const topnavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      topnavLinks.forEach(link => link.classList.remove("is-active"));
      const active = document.querySelector(`.topnav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add("is-active");
    }
  });
}, { threshold: 0.4 });

navSections.forEach(section => topnavObserver.observe(section));

const castButton = document.querySelector(".explosion-btn");
const manaBar = document.querySelector("#manaBar");
const spellStatus = document.querySelector("#spellStatus");
const explosionFlash = document.querySelector("#explosionFlash");
const chantText = document.querySelector("#chantText");
const explosionTitle = document.querySelector("#explosionTitle");
const scorchMark = document.querySelector("#scorchMark");
const bgMusic = document.querySelector("#bgMusic");
const explosionSound = document.querySelector("#explosionSound");
const bgVolume = document.querySelector("#bgVolume");

if (typeof AOS !== "undefined") {
  AOS.init({
    once: false,
    duration: 1000,
    offset: 120
  });
}

bgMusic.volume = bgVolume.value / 100;

bgVolume.addEventListener("input", () => {
  bgMusic.volume = bgVolume.value / 100;
});

bgMusic.volume = 0.03;
explosionSound.volume = 0.5;

function startBackgroundMusic() {
  bgMusic.play().catch(() => {});
  document.removeEventListener("click", startBackgroundMusic);
  document.removeEventListener("keydown", startBackgroundMusic);
}

window.addEventListener("load", () => {
  bgMusic.play().catch(() => {
    document.addEventListener("click", startBackgroundMusic);
    document.addEventListener("keydown", startBackgroundMusic);
  });
});

function playExplosionSound() {
  explosionSound.currentTime = 0;
  explosionSound.play();
}


const COOLDOWN_TIME = 24 * 60 * 60 * 1000;
const LAST_CAST_KEY = "meguminLastExplosionCast";

const chants = [
  "My name is Megumin, Axel's strongest arch wizard!",
  "Darkness blacker than black, and darker than dark...",
  "The time of revival has come.",
  "Justice, appear now as extreme heat!",
  "Crimson flame, burn within me...",
  "Awaken, ultimate destructive magic...",
  "EXPLOSION!"
];

const explosionNames = [
  "Scarlet Catastrophe",
  "Crimson Finale",
  "Demon Clan Detonation",
  "One-Shot Glory",
  "Ultimate Archwizard Blast",
  "Cutest Archwizard"
];

function getCooldownInfo() {
  const lastCast = Number(localStorage.getItem(LAST_CAST_KEY));

  if (!lastCast) {
    return { remaining: 0, progress: 1 };
  }

  const elapsed = Date.now() - lastCast;
  const remaining = Math.max(COOLDOWN_TIME - elapsed, 0);
  const progress = Math.min(elapsed / COOLDOWN_TIME, 1);

  return { remaining, progress };
}

function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
}

function updateCooldown() {
  const { remaining, progress } = getCooldownInfo();
  const manaPercent = Math.floor(progress * 100);

  manaBar.style.width = `${manaPercent}%`;

  if (remaining > 0) {
    castButton.disabled = true;
    castButton.textContent = "MANA RECOVERING";
    spellStatus.textContent = `Mana: ${manaPercent}% | Ready in ${formatTime(remaining)}.`;
    return;
  }

  castButton.disabled = false;
  castButton.textContent = "CAST EXPLOSION";
  manaBar.style.width = "100%";
  spellStatus.textContent = "Mana restored. Explosion is ready.";
}

async function playChant() {
  castButton.disabled = true;

  for (const line of chants) {
    chantText.textContent = line;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  chantText.textContent = "";
}

function setRandomExplosionTitle() {
  const randomIndex = Math.floor(Math.random() * explosionNames.length);
  explosionTitle.textContent = explosionNames[randomIndex];
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

castButton.addEventListener("click", async () => {
  await (async function playChant() {
  castButton.disabled = true;

  for (const line of chants) {
    chantText.textContent = line;

    if (line === "EXPLOSION!") {
      explosionSound.currentTime = 0;
      explosionSound.play();
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  explosionSound.pause();
  explosionSound.currentTime = 0;
  chantText.textContent = "";
})();

  localStorage.setItem(LAST_CAST_KEY, Date.now());
  
  setRandomExplosionTitle();
  restartAnimation(explosionFlash, "active");
  restartAnimation(scorchMark, "active");

  document.body.classList.add("screen-shake");

  manaBar.style.width = "0%";
  spellStatus.textContent = "EXPLOSION! Mana depleted to 0%.";

  setTimeout(() => {
    document.body.classList.remove("screen-shake");
  }, 500);

  updateCooldown();
});

updateCooldown();
setInterval(updateCooldown, 1000);

const relationshipCards = document.querySelectorAll(".relationship-card[data-reaction]");
const relationshipBanter = document.querySelector("#relationshipBanter");
const relationshipSection = document.querySelector(".relationship-section");

if (relationshipBanter) {
  relationshipCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      relationshipBanter.textContent = card.dataset.reaction;
      relationshipBanter.classList.add("is-reacting");

      if (relationshipSection) {
        relationshipSection.dataset.activeTheme = card.dataset.theme;
      }
    });

    card.addEventListener("mouseleave", () => {
      relationshipBanter.textContent = "Hover a character to hear the party chemistry.";
      relationshipBanter.classList.remove("is-reacting");

      if (relationshipSection) {
        delete relationshipSection.dataset.activeTheme;
      }
    });
  });
}

const relationshipMeter = document.querySelector(".relationship-meter");
const statsBoard = document.querySelector(".stats-card");

if (relationshipMeter) {
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        relationshipMeter.classList.add("is-visible");
        meterObserver.unobserve(relationshipMeter);
      }
    });
  }, { threshold: 0.45 });

  meterObserver.observe(relationshipMeter);
}

if (statsBoard) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statsBoard.classList.add("is-visible");
        statsObserver.unobserve(statsBoard);
      }
    });
  }, { threshold: 0.45 });

  statsObserver.observe(statsBoard);
}

const voiceButtons = document.querySelectorAll(".voice-btn[data-voice]");
const voiceLineAudio = new Audio();

voiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    voiceButtons.forEach((item) => item.classList.remove("is-playing"));

    voiceLineAudio.pause();
    voiceLineAudio.currentTime = 0;
    voiceLineAudio.src = button.dataset.voice;
    voiceLineAudio.volume = 0.85;
    button.classList.add("is-playing");

    voiceLineAudio.play().catch(() => {
      button.classList.remove("is-playing");
    });
  });
});

voiceLineAudio.addEventListener("ended", () => {
  voiceButtons.forEach((button) => button.classList.remove("is-playing"));
});

const eventCards = document.querySelectorAll(".event-card");
const eventPreview = document.querySelector("#relationshipEventPreview");

eventCards.forEach((card) => {
  card.addEventListener("click", () => {
    eventCards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");

    if (!eventPreview) {
      return;
    }

    const previewImage = eventPreview.querySelector("img");
    const previewTitle = eventPreview.querySelector("h3");
    const previewText = eventPreview.querySelector("p");
    const previewVideo = eventPreview.querySelector("video");
    const previewSource = eventPreview.querySelector("source");

    previewImage.src = card.dataset.image;
    previewImage.alt = card.dataset.title;
    previewTitle.textContent = card.dataset.title;
    previewText.textContent = card.dataset.text;
    previewVideo.poster = card.dataset.image;
    previewSource.src = card.dataset.video;
    previewVideo.load();
  });
});

const partyButtons = document.querySelectorAll(".party-network button[data-party-line]");

partyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    partyButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    if (relationshipBanter) {
      relationshipBanter.textContent = button.dataset.partyLine;
      relationshipBanter.classList.add("is-reacting");
    }
  });
});

const quizQuestions = [
  {
    question: "What type of magic does Megumin exclusively use?",
    options: ["Fireball", "Explosion", "Lightning", "Darkness"],
    correct: 1,
    image: "./images/megumin4.png"
  },
  {
    question: "What clan does Megumin belong to?",
    options: ["Shadow Clan", "Thunder Clan", "Crimson Demon Clan", "Golden Eye Clan"],
    correct: 2,
    image: "./images/megumin5.jpg"
  },
  {
    question: "How many times per day can Megumin cast her magic?",
    options: ["Unlimited", "Three times", "Twice", "Once"],
    correct: 3,
    image: "./images/megumin6.jpg"
  },
  {
    question: "What is the name of Megumin's black cat?",
    options: ["Chomusuke", "Blackie", "Shadow", "Luna"],
    correct: 0,
    image: "./images/megumin7.jpg"
  },
  {
    question: "What town does Megumin's party operate from?",
    options: ["Elroad", "Axel", "Alcanretia", "Arcanletia"],
    correct: 1,
    image: "./images/megumin2.png"
  }
];

const quizReactions = [
  { min: 0, max: 1, text: "0–1 correct - Even a slime knows more about me than you do!" },
  { min: 2, max: 2, text: "2 correct - You need to study harder. Explosion!" },
  { min: 3, max: 3, text: "3 correct - Decent, but not worthy of the Crimson Demon Clan." },
  { min: 4, max: 4, text: "4 correct - Impressive! You almost match my greatness." },
  { min: 5, max: 5, text: "5 correct - You truly understand the might of explosion magic!" }
];

//Quiz state//
let currentQuestion = 0;
let score = 0;
let answered = false;

const quizCounter  = document.getElementById("quizCounter");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions  = document.getElementById("quizOptions");
const quizResult   = document.getElementById("quizResult");
const quizScore    = document.getElementById("quizScore");
const quizReaction = document.getElementById("quizReaction");
const quizRestart  = document.getElementById("quizRestart");
const quizImage = document.getElementById("quizImage");

function loadQuestion() {
  answered = false;
  const q = quizQuestions[currentQuestion];

  quizCounter.textContent  = `Question ${currentQuestion + 1} / ${quizQuestions.length}`;
  quizQuestion.textContent = q.question;

  quizImage.style.opacity = "0";
  setTimeout(() => {
    quizImage.src = q.image;
    quizImage.style.opacity = "1";
  }, 200);
  // Clear old options
  quizOptions.innerHTML = "";

  // Build option buttons
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.classList.add("quiz-option");
    btn.textContent = option;
    btn.addEventListener("click", () => selectAnswer(index, btn));
    quizOptions.appendChild(btn);
  });
}

function selectAnswer(selectedIndex, clickedBtn) {
  // Prevent clicking again after answering
  if (answered) return;
  answered = true;

  const correctIndex = quizQuestions[currentQuestion].correct;
  const allButtons   = quizOptions.querySelectorAll(".quiz-option");

  // Highlight correct and wrong
  allButtons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
    if (i === selectedIndex && selectedIndex !== correctIndex) {
      btn.classList.add("wrong");
    }
  });

  if (selectedIndex === correctIndex) score++;

  // Wait 1.2 seconds then go to next question
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 1200);
}

function showResult() {
  quizOptions.style.display  = "none";
  quizQuestion.style.display = "none";
  quizCounter.style.display  = "none";
  quizResult.style.display   = "block";

  quizScore.textContent = `${score} / ${quizQuestions.length}`;

  const reaction = quizReactions.find(r => score >= r.min && score <= r.max);
  quizReaction.textContent = reaction ? reaction.text : "";
}

quizRestart.addEventListener("click", () => {
  currentQuestion = 0;
  score           = 0;
  answered        = false;

  quizOptions.style.display  = "grid";
  quizQuestion.style.display = "block";
  quizCounter.style.display  = "block";
  quizResult.style.display   = "none";

  loadQuestion();
});

loadQuestion();

const timelineProgress = document.getElementById("timelineProgress");
const timelineWrap     = document.querySelector(".timeline-wrap");
const timelineItems    = document.querySelectorAll(".timeline-item");

function updateTimeline() {
  if (!timelineWrap) return;

  const windowH    = window.innerHeight;
  const wrapRect   = timelineWrap.getBoundingClientRect();

  // Get first and last dot positions
  const dots       = timelineWrap.querySelectorAll(".timeline-dot");
  const firstDot   = dots[0].getBoundingClientRect();
  const lastDot    = dots[dots.length - 1].getBoundingClientRect();

  // Total distance between first and last dot
  const totalDistance = lastDot.top - firstDot.top;

  // How far the line has traveled from the first dot
  const triggerPoint = windowH * 0.5;  // line grows when dot crosses 50% screen
  const traveled     = triggerPoint - firstDot.top;

  const percent = Math.min(Math.max((traveled / totalDistance) * 100, 0), 100);

  timelineProgress.style.height = percent + "%";

  // Light up each dot as the line reaches it
  dots.forEach((dot, i) => {
    const dotRect = dot.getBoundingClientRect();
    const dotMid  = dotRect.top + dotRect.height / 2;
    const item    = timelineItems[i];

    if (dotMid < windowH * 0.5) {
      item.classList.add("is-reached");
    }
  });
}

window.addEventListener("scroll", updateTimeline);
updateTimeline();