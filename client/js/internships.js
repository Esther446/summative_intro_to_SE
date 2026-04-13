const API_BASE = "http://localhost:5000/api";
const { token, role } = window.authStorage ? window.authStorage.getAuthState() : { token: null, role: null };
const isEmployer = role === "employer" && Boolean(token);
const isStudent = role === "student" && Boolean(token);

const messageEl = document.getElementById("message");
const container = document.getElementById("internships");
const postLink = document.getElementById("postLink");
const logoutBtn = document.getElementById("logoutBtn");

function setMessage(text, isError) {
  if (!messageEl) return;
  messageEl.textContent = text || "";
  messageEl.className = `mb-4 text-sm ${isError ? "text-red-600" : "text-emerald-700"}`;
}

function toggleDark() {
  document.body.classList.toggle("bg-gray-900");
  document.body.classList.toggle("text-white");
}

function normalizeInternshipsResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.internships)) return data.internships;
  return [];
}

async function saveInternship(id) {
  if (!isStudent) {
    setMessage("Login as a student to save internships.", true);
    return;
  }

  const res = await fetch(`${API_BASE}/internships/${id}/save`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to save internship");
  setMessage(data.message || "Internship saved", false);
}

async function fetchInternships() {
  setMessage("", false);
  container.innerHTML = "";
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/internships`, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load internships");

    const internships = normalizeInternshipsResponse(data);
    if (internships.length === 0) {
      container.innerHTML = '<p class="text-gray-600">No internships available right now.</p>';
      return;
    }

    internships.forEach((i) => {
      const requiredSkills = Array.isArray(i.requiredSkills) ? i.requiredSkills.join(", ") : "";
      const employerName = i.employer?.companyName || "N/A";

      // Backend tells us canManage — only true when JWT employer ID === internship.employer
      const employerActions = (isEmployer && i.canManage)
        ? `
          <div class="flex gap-2 mt-4">
            <button data-action="edit" data-id="${i._id}" class="px-3 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition">
              Edit
            </button>
            <button data-action="delete" data-id="${i._id}" class="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
              Delete
            </button>
          </div>
        `
        : "";

      const studentAction = isStudent
        ? `
          <div class="mt-4">
            <button data-action="save" data-id="${i._id}" class="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Save
            </button>
          </div>
        `
        : "";

      const card = document.createElement("div");
      card.className = "p-6 border rounded-xl shadow-sm bg-white transition transform hover:-translate-y-0.5";
      card.innerHTML = `
        <h3 class="font-semibold text-lg">${i.title || "Untitled internship"}</h3>
        <p class="text-gray-600 mt-2">${i.description || "No description"}</p>
        <div class="mt-3 text-sm text-gray-700 space-y-1">
          <div><span class="font-medium">Location:</span> ${i.location || "N/A"}</div>
          <div><span class="font-medium">Company:</span> ${employerName}</div>
          <div><span class="font-medium">Skills:</span> ${requiredSkills || "N/A"}</div>
        </div>
        ${employerActions}
        ${studentAction}
      `;
      container.appendChild(card);
    });
  } catch (err) {
    setMessage(err.message, true);
  }
}

async function updateInternship(id) {
  const title = prompt("New title (leave blank to keep):");
  const description = prompt("New description (leave blank to keep):");
  const location = prompt("New location (leave blank to keep):");
  const requiredSkills = prompt("Required skills (comma separated, leave blank to keep):");

  const payload = {};
  if (title) payload.title = title;
  if (description) payload.description = description;
  if (location) payload.location = location;
  if (requiredSkills) payload.requiredSkills = requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);

  const res = await fetch(`${API_BASE}/internships/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update failed");
  setMessage(data.message || "Internship updated", false);
}

async function deleteInternship(id) {
  if (!confirm("Delete this internship?")) return;
  const res = await fetch(`${API_BASE}/internships/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Delete failed");
  setMessage(data.message || "Internship deleted", false);
}

if (isEmployer && postLink && logoutBtn) {
  postLink.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (window.authStorage) {
      window.authStorage.clearAuthState();
    } else {
      localStorage.clear();
      sessionStorage.clear();
    }
    window.location.href = "/";
  });
}

if (container) {
  container.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");

    try {
      if (action === "save") await saveInternship(id);
      if (action === "edit") {
        if (!isEmployer) throw new Error("Employer login required");
        await updateInternship(id);
      }
      if (action === "delete") {
        if (!isEmployer) throw new Error("Employer login required");
        await deleteInternship(id);
      }
      await fetchInternships();
    } catch (err) {
      setMessage(err.message, true);
    }
  });
}

window.toggleDark = toggleDark;
fetchInternships();
