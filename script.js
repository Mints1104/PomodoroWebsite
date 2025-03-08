// DOM Elements
const timerDisplay = document.getElementById("timer");
const sessionTypeLabel = document.getElementById("session-type");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const resetSessionsButton = document.getElementById("reset_sessions");
const progressBar = document.getElementById("progress");
const completedCountDisplay = document.getElementById("completed-count");

const focusTimeDisplay = document.getElementById("focus-time");
const shortBreakTimeDisplay = document.getElementById("short-break-time");
const longBreakTimeDisplay = document.getElementById("long-break-time");

const focusPlusButton = document.getElementById("focus-plus");
const focusMinusButton = document.getElementById("focus-minus");
const shortBreakPlusButton = document.getElementById("short-break-plus");
const shortBreakMinusButton = document.getElementById("short-break-minus");
const longBreakPlusButton = document.getElementById("long-break-plus");
const longBreakMinusButton = document.getElementById("long-break-minus");

const colorOptions = document.querySelectorAll(".color-option");
const soundToggle = document.getElementById("sound-toggle");
const themeToggle = document.getElementById("theme-toggle");
const settingsToggle = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");
const testAudioButton = document.getElementById("testAudio");

const volumeSlider = document.getElementById("volume-slider");
const volumeValue = document.getElementById("volume-value");

volumeSlider.addEventListener("input", () => {
  volumeValue.textContent = volumeSlider.value;
  audioAlert.volume = volumeSlider.value / 100;
});

testAudioButton.addEventListener("click", () => {
  audioAlert.play();
});

// Default settings
const defaultSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  soundEnabled: true,
  darkTheme: false,
  primaryColor: "#ff6347",
  secondaryColor: "#4682b4",
  completedSessions: 0,
};

// Timer state
let timer = {
  minutes: 25,
  seconds: 0,
  isRunning: false,
  intervalId: null,
  totalSeconds: 25 * 60,
  originalTotalSeconds: 25 * 60,
  mode: "focus",
  completedSessions: 0,
};

// Settings
let settings = { ...defaultSettings };

// Audio
const audioAlert = new Audio(
  "https://mints1104.github.io/PomodoroWebsite/audio/alarm.mp3"
);

// Load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem("pomodoroSettings");
  if (savedSettings) {
    settings = JSON.parse(savedSettings);

    // Update display with saved settings
    focusTimeDisplay.textContent = settings.focusTime;
    shortBreakTimeDisplay.textContent = settings.shortBreakTime;
    longBreakTimeDisplay.textContent = settings.longBreakTime;
    soundToggle.checked = settings.soundEnabled;

    // Apply saved theme
    document.body.classList.toggle("dark-theme", settings.darkTheme);
    themeToggle.textContent = settings.darkTheme ? "☀️" : "🌙";

    // Apply saved colors
    document.documentElement.style.setProperty(
      "--primary-color",
      settings.primaryColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      settings.secondaryColor
    );

    // Select the correct color option
    colorOptions.forEach((option) => {
      if (option.dataset.color === settings.primaryColor) {
        colorOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
      }
    });

    // Load completed sessions
    timer.completedSessions = settings.completedSessions || 0;
    completedCountDisplay.textContent = timer.completedSessions;

    // Initialize timer with saved settings
    if (timer.mode === "focus") {
      timer.minutes = settings.focusTime;
    } else if (timer.mode === "shortBreak") {
      timer.minutes = settings.shortBreakTime;
    } else {
      timer.minutes = settings.longBreakTime;
    }

    timer.seconds = 0;
    timer.totalSeconds = timer.minutes * 60;
    timer.originalTotalSeconds = timer.totalSeconds;
    updateTimerDisplay();
  }
}

// Save settings to localStorage
function saveSettings() {
  // Update completed sessions in settings
  settings.completedSessions = timer.completedSessions;

  localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
}

// Initialize
loadSettings();
updateTimerDisplay();

// Event Listeners
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
resetSessionsButton.addEventListener("click", resetSessions);

focusPlusButton.addEventListener("click", () => {
  if (settings.focusTime < 60) {
    settings.focusTime += 1;
    focusTimeDisplay.textContent = settings.focusTime;

    if (timer.mode === "focus" && !timer.isRunning) {
      timer.minutes = settings.focusTime;
      timer.seconds = 0;
      timer.totalSeconds = timer.minutes * 60;
      timer.originalTotalSeconds = timer.totalSeconds;
      updateTimerDisplay();
    }

    saveSettings();
  }
});

focusMinusButton.addEventListener("click", () => {
  if (settings.focusTime > 1) {
    settings.focusTime -= 1;
    focusTimeDisplay.textContent = settings.focusTime;

    if (timer.mode === "focus" && !timer.isRunning) {
      timer.minutes = settings.focusTime;
      timer.seconds = 0;
      timer.totalSeconds = timer.minutes * 60;
      timer.originalTotalSeconds = timer.totalSeconds;
      updateTimerDisplay();
    }

    saveSettings();
  }
});

shortBreakPlusButton.addEventListener("click", () => {
  if (settings.shortBreakTime < 30) {
    settings.shortBreakTime += 1;
    shortBreakTimeDisplay.textContent = settings.shortBreakTime;

    if (timer.mode === "shortBreak" && !timer.isRunning) {
      timer.minutes = settings.shortBreakTime;
      timer.seconds = 0;
      timer.totalSeconds = timer.minutes * 60;
      timer.originalTotalSeconds = timer.totalSeconds;
      updateTimerDisplay();
    }

    saveSettings();
  }
});

shortBreakMinusButton.addEventListener("click", () => {
  if (settings.shortBreakTime > 1) {
    settings.shortBreakTime -= 1;
    shortBreakTimeDisplay.textContent = settings.shortBreakTime;

    if (timer.mode === "shortBreak" && !timer.isRunning) {
      timer.minutes = settings.shortBreakTime;
      timer.seconds = 0;
      timer.totalSeconds = timer.minutes * 60;
      timer.originalTotalSeconds = timer.totalSeconds;
      updateTimerDisplay();
    }

    saveSettings();
  }
});

longBreakPlusButton.addEventListener("click", () => {
  if (settings.longBreakTime < 60) {
    settings.longBreakTime += 1;
    longBreakTimeDisplay.textContent = settings.longBreakTime;

    if (timer.mode === "longBreak" && !timer.isRunning) {
      timer.minutes = settings.longBreakTime;
      timer.seconds = 0;
      timer.totalSeconds = timer.minutes * 60;
      timer.originalTotalSeconds = timer.totalSeconds;
      updateTimerDisplay();
    }

    saveSettings();
  }
});

longBreakMinusButton.addEventListener("click", () => {
  if (settings.longBreakTime > 1) {
    settings.longBreakTime -= 1;
    longBreakTimeDisplay.textContent = settings.longBreakTime;

    if (timer.mode === "longBreak" && !timer.isRunning) {
      timer.minutes = settings.longBreakTime;
      timer.seconds = 0;
      timer.totalSeconds = timer.minutes * 60;
      timer.originalTotalSeconds = timer.totalSeconds;
      updateTimerDisplay();
    }

    saveSettings();
  }
});

colorOptions.forEach((option) => {
  option.addEventListener("click", () => {
    colorOptions.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");

    settings.primaryColor = option.dataset.color;
    settings.secondaryColor = option.dataset.secondary;

    document.documentElement.style.setProperty(
      "--primary-color",
      settings.primaryColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      settings.secondaryColor
    );

    saveSettings();
  });
});

soundToggle.addEventListener("change", () => {
  settings.soundEnabled = soundToggle.checked;
  saveSettings();
});

themeToggle.addEventListener("click", () => {
  settings.darkTheme = !settings.darkTheme;
  document.body.classList.toggle("dark-theme", settings.darkTheme);
  themeToggle.textContent = settings.darkTheme ? "☀️" : "🌙";
  saveSettings();
});

settingsToggle.addEventListener("click", () => {
  settingsPanel.style.display =
    settingsPanel.style.display === "none" ? "block" : "none";
  settingsToggle.textContent =
    settingsPanel.style.display === "none" ? "Settings ⚙️" : "Hide Settings ⚙️";
});

// Timer Functions
function startTimer() {
  if (!timer.isRunning) {
    timer.isRunning = true;
    // For a resumed session, the following line accounts for paused time:
    timer.startTime =
      Date.now() - (timer.originalTotalSeconds - timer.totalSeconds) * 1000;
    timer.intervalId = setInterval(updateTimer, 1000);
    startButton.disabled = true;
    pauseButton.disabled = false;
  }
}

function pauseTimer() {
  if (timer.isRunning) {
    timer.isRunning = false;
    clearInterval(timer.intervalId);
    startButton.disabled = false;
    pauseButton.disabled = true;
  }
}

function resetSessions() {
  const savedSettings = localStorage.getItem("pomodoroSettings");

  if (savedSettings) {
    let settings = JSON.parse(savedSettings);

    // Reset completed sessions
    settings.completedSessions = 0;

    // Save back to localStorage
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));

    // Reset timer object session count
    timer.completedSessions = 0;

    // Update UI display
    completedCountDisplay.textContent = timer.completedSessions;
    if (mode !== "focus") {
      switchMode("focus");
    }

    console.log("Sessions have been reset.");
  }
}

function resetTimer() {
  pauseTimer();

  if (timer.mode === "focus") {
    timer.minutes = settings.focusTime;
  } else if (timer.mode === "shortBreak") {
    timer.minutes = settings.shortBreakTime;
  } else {
    timer.minutes = settings.longBreakTime;
  }

  timer.seconds = 0;
  timer.totalSeconds = timer.minutes * 60;
  timer.originalTotalSeconds = timer.totalSeconds;
  updateTimerDisplay();
}

function updateTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - timer.startTime) / 1000); // seconds elapsed
  timer.totalSeconds = timer.originalTotalSeconds - elapsed;

  if (timer.totalSeconds > 0) {
    timer.minutes = Math.floor(timer.totalSeconds / 60);
    timer.seconds = timer.totalSeconds % 60;
    updateTimerDisplay();
    updateProgressBar();
  } else {
    playAlertSound();
    pauseTimer(); // Clear the interval before switching

    if (timer.mode === "focus") {
      timer.completedSessions++;
      completedCountDisplay.textContent = timer.completedSessions;
      saveSettings();

      // After every 4 focus sessions, take a long break
      if (timer.completedSessions % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      switchMode("focus");
    }

    // Auto-start the new session after switching mode:
    startTimer();
  }
}

function updateTimerDisplay() {
  const displayMinutes =
    timer.minutes < 10 ? "0" + timer.minutes : timer.minutes;
  const displaySeconds =
    timer.seconds < 10 ? "0" + timer.seconds : timer.seconds;
  timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}

function updateProgressBar() {
  const progressPercentage =
    (timer.totalSeconds / timer.originalTotalSeconds) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

function switchMode(mode) {
  // Stop the current timer if it's running
  pauseTimer();

  timer.mode = mode;
  if (mode === "focus") {
    sessionTypeLabel.textContent = "Focus Session";
    timer.originalTotalSeconds = settings.focusTime * 60;
  } else if (mode === "shortBreak") {
    sessionTypeLabel.textContent = "Short Break";
    timer.originalTotalSeconds = settings.shortBreakTime * 60;
  } else if (mode === "longBreak") {
    sessionTypeLabel.textContent = "Long Break";
    timer.originalTotalSeconds = settings.longBreakTime * 60;
  }

  // Reset timer values for the new session
  timer.totalSeconds = timer.originalTotalSeconds;
  timer.minutes = Math.floor(timer.totalSeconds / 60);
  timer.seconds = timer.totalSeconds % 60;
  updateTimerDisplay();
  resetProgressBar();

  // Reset the start time for the new session
  timer.startTime = Date.now();
}

function resetProgressBar() {
  progressBar.style.width = "100%";
}

function playAlertSound() {
  if (settings.soundEnabled) {
    audioAlert.play();
  }
}

// Make sure we save settings when the window unloads
window.addEventListener("beforeunload", saveSettings);
