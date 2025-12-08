/* --------------------------------------------------
  1. THEME TOGGLE LOGIC
  --------------------------------------------------
  Uses localStorage to remember if the user prefers Dark Mode.
*/

const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
const body = document.body;

// Check storage on load
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
  body.classList.add("dark");
  updateThemeUI(true);
}

themeToggleBtn.addEventListener("click", () => {
  // Toggle the class
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");

  // Save preference to localStorage
  if (isDark) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.removeItem("theme"); // or setItem('theme', 'light')
  }

  // Update button text/icon
  updateThemeUI(isDark);
});

function updateThemeUI(isDark) {
  themeIcon.textContent = isDark ? "🌙" : "🌞";
  themeLabel.textContent = isDark ? "Dark theme" : "Light theme";
}

/* --------------------------------------------------
  2. INTERACTIVE DEMO LOGIC
  --------------------------------------------------
  Handles saving/clearing inputs to localStorage and sessionStorage.
*/

const demoUsernameInput = document.getElementById("demoUsername");
const demoSessionIdInput = document.getElementById("demoSessionId");
const saveBtn = document.getElementById("saveDemo");
const clearBtn = document.getElementById("clearDemo");

const localDisplay = document.getElementById("localDisplay");
const sessionDisplay = document.getElementById("sessionDisplay");

// Function to read storage and update the UI display
function refreshDisplay() {
  // Get values (will be null if not set)
  const localVal = localStorage.getItem("username");
  const sessionVal = sessionStorage.getItem("sessionID");

  // Update HTML
  localDisplay.textContent = localVal ? `"${localVal}"` : "(empty)";
  sessionDisplay.textContent = sessionVal ? `"${sessionVal}"` : "(empty)";
  
  // Also update inputs to match storage if they are empty
  if (localVal && !demoUsernameInput.value) demoUsernameInput.value = localVal;
  if (sessionVal && !demoSessionIdInput.value) demoSessionIdInput.value = sessionVal;
}

// 1. Load data when page opens
refreshDisplay();

// 2. Save Button Click
saveBtn.addEventListener("click", () => {
  const userValue = demoUsernameInput.value;
  const sessionValue = demoSessionIdInput.value;

  if (userValue) {
    localStorage.setItem("username", userValue);
  }
  if (sessionValue) {
    sessionStorage.setItem("sessionID", sessionValue);
  }

  refreshDisplay();
  alert("Values saved! Try reloading the page.");
});

// 3. Clear Button Click
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  sessionStorage.removeItem("sessionID");
  
  // Clear inputs too
  demoUsernameInput.value = "";
  demoSessionIdInput.value = "";

  refreshDisplay();
});
