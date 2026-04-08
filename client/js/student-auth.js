const API_BASE = "http://localhost:5000/api";
const form = document.getElementById("studentForm");
const submitBtn = form.querySelector('button[type="submit"]');
const titleEl = form.querySelector("h2");

let isLoginMode = false;

function toggleDark() {
  document.body.classList.toggle("bg-gray-900");
  document.body.classList.toggle("text-white");
}

function buildAuthControls() {
  const controls = document.createElement("div");
  controls.className = "space-y-3";
  controls.innerHTML = `
    <label class="flex items-center gap-2 text-sm text-gray-700" id="rememberWrap">
      <input id="rememberMe" type="checkbox" class="rounded border-gray-300">
      <span>Remember me</span>
    </label>
    <p class="text-sm text-gray-600" id="authSwitchWrap">
      Already registered?
      <button type="button" id="authSwitchBtn" class="text-indigo-600 underline">Login</button>
    </p>
  `;
  form.insertBefore(controls, submitBtn);
}

function setMode(loginMode) {
  isLoginMode = loginMode;
  titleEl.textContent = loginMode ? "Student Login" : "Student Register";
  submitBtn.textContent = loginMode ? "Login" : "Register";

  const nameInput = document.getElementById("name");
  const rememberWrap = document.getElementById("rememberWrap");
  const switchWrap = document.getElementById("authSwitchWrap");

  if (loginMode) {
    nameInput.classList.add("hidden");
    nameInput.required = false;
    rememberWrap.classList.remove("hidden");
    switchWrap.innerHTML = `No account yet? <button type="button" id="authSwitchBtn" class="text-indigo-600 underline">Register</button>`;
  } else {
    nameInput.classList.remove("hidden");
    nameInput.required = true;
    rememberWrap.classList.add("hidden");
    switchWrap.innerHTML = `Already registered? <button type="button" id="authSwitchBtn" class="text-indigo-600 underline">Login</button>`;
  }

  document.getElementById("authSwitchBtn").addEventListener("click", () => setMode(!isLoginMode));
}

async function submitStudentAuth(e) {
  e.preventDefault();

  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const rememberMe = document.getElementById("rememberMe")?.checked || false;

  const endpoint = isLoginMode ? "/students/login" : "/students/register";
  const payload = isLoginMode
    ? {
        email: emailEl.value.trim(),
        password: passwordEl.value,
      }
    : {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        password: passwordEl.value,
        skills: [],
      };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      if (!isLoginMode && res.status === 409) {
        setMode(true);
        throw new Error("You are already registered. Please login.");
      }
      throw new Error(data.message || (isLoginMode ? "Login failed" : "Registration failed"));
    }

    window.authStorage.setAuthState(data.token, "student", isLoginMode ? rememberMe : true);
    window.location = "student-dashboard.html";
  } catch (err) {
    alert(err.message);
  }
}

buildAuthControls();
setMode(false);
window.toggleDark = toggleDark;
form.addEventListener("submit", submitStudentAuth);
