const API_BASE = "http://localhost:5000/api";
const { token, role } = window.authStorage ? window.authStorage.getAuthState() : { token: null, role: null };

if (!token || role !== "employer") {
  window.location.href = "/register.html";
}

const form = document.getElementById("postInternshipForm");
const listContainer = document.getElementById("employerInternships");
const messageEl = document.getElementById("employerMessage");

function decodeTokenUserId(jwtToken) {
  try {
    const payloadPart = jwtToken.split(".")[1];
    const json = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);
    return payload.userId || null;
  } catch (_err) {
    return null;
  }
}

function normalizeInternshipsResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.internships)) return data.internships;
  return [];
}

function renderInternships(items) {
  if (!items.length) {
    listContainer.innerHTML = '<p class="text-gray-600">No internships posted yet.</p>';
    return;
  }

  listContainer.innerHTML = items
    .map(
      (i) => `
      <div class="p-4 border rounded-xl shadow-sm bg-white">
        <h3 class="font-semibold text-lg">${i.title || "Untitled internship"}</h3>
        <p class="text-gray-600 mt-1">${i.description || "No description"}</p>
        <div class="mt-2 text-sm text-gray-700">
          <div><span class="font-medium">Location:</span> ${i.location || "N/A"}</div>
          <div><span class="font-medium">Skills:</span> ${
            Array.isArray(i.requiredSkills) && i.requiredSkills.length
              ? i.requiredSkills.join(", ")
              : "N/A"
          }</div>
        </div>
      </div>
    `
    )
    .join("");
}

async function loadEmployerInternships() {
  messageEl.textContent = "";
  try {
    const res = await fetch(`${API_BASE}/internships`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load internships");

    const internships = normalizeInternshipsResponse(data);
    const employerId = decodeTokenUserId(token);
    const mine = internships.filter((i) => {
      if (!i.employer) return false;
      const internshipEmployerId = typeof i.employer === "string" ? i.employer : i.employer._id;
      return internshipEmployerId === employerId;
    });

    renderInternships(mine);
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.className = "text-sm text-red-600";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "";

  const payload = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    location: document.getElementById("location").value.trim(),
    requiredSkills: document
      .getElementById("requiredSkills")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  try {
    const res = await fetch(`${API_BASE}/internships`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to post internship");

    messageEl.textContent = data.message || "Internship posted successfully";
    messageEl.className = "text-sm text-emerald-700";
    form.reset();
    await loadEmployerInternships();
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.className = "text-sm text-red-600";
  }
});

loadEmployerInternships();
