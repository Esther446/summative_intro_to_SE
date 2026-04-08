const API_BASE = "http://localhost:5000/api";
const { token, role } = window.authStorage ? window.authStorage.getAuthState() : { token: null, role: null };

if (!token || role !== "student") {
  window.location.href = "/register.html";
}

const savedContainer = document.getElementById("savedOpportunities");
const recommendedContainer = document.getElementById("recommendedOpportunities");
const messageEl = document.getElementById("dashboardMessage");

function getInternshipList(data, key) {
  if (Array.isArray(data?.[key])) return data[key];
  return [];
}

function createCard(i) {
  const requiredSkills = Array.isArray(i.requiredSkills) ? i.requiredSkills.join(", ") : "N/A";
  const company = i.employer?.companyName || "N/A";
  return `
    <div class="p-4 border rounded-xl shadow-sm bg-white">
      <h3 class="font-semibold text-lg">${i.title || "Untitled internship"}</h3>
      <p class="text-gray-600 mt-1">${i.description || "No description"}</p>
      <div class="mt-2 text-sm text-gray-700 space-y-1">
        <div><span class="font-medium">Location:</span> ${i.location || "N/A"}</div>
        <div><span class="font-medium">Company:</span> ${company}</div>
        <div><span class="font-medium">Skills:</span> ${requiredSkills}</div>
      </div>
    </div>
  `;
}

function renderList(container, items, emptyText) {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<p class="text-gray-600">${emptyText}</p>`;
    return;
  }
  container.innerHTML = items.map(createCard).join("");
}

async function loadStudentDashboard() {
  messageEl.textContent = "";
  try {
    const res = await fetch(`${API_BASE}/students/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load dashboard");

    const saved = getInternshipList(data, "savedOpportunities");
    const recommended = getInternshipList(data, "recommendedOpportunities");

    renderList(savedContainer, saved, "No saved opportunities yet.");
    renderList(recommendedContainer, recommended, "No recommendations yet.");
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.className = "text-sm text-red-600 mt-3";
  }
}

loadStudentDashboard();
