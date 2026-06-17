const API_URL = "http://localhost:8080/api/jobs";

let jobs = [];
let currentFilter = "All";
let editingId = null;



// ================================
// API CALLS
// ================================

// Fetch all jobs from backend
async function fetchJobs() {
  const response = await fetch(API_URL);
  jobs = await response.json();
  render();
}

// Add a new job
async function addJob(job) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });
  fetchJobs();
}

// Update an existing job
async function updateJob(id, job) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });
  fetchJobs();
}

// Delete a job
async function deleteJob(id) {
  const confirmed = confirm("Are you sure you want to remove this application?");
  if (confirmed) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchJobs();
  }
}


// ================================
// HELPERS
// ================================

// Returns the CSS class for a status badge
function getBadgeClass(status) {
  const map = {
    Wishlist:  "badge-wishlist",
    Applied:   "badge-applied",
    Interview: "badge-interview",
    Offer:     "badge-offer",
    Rejected:  "badge-rejected"
  };
  return map[status] || "badge-applied";
}

// Converts "2026-06-13" → "13/06/2026" for display
function formatDate(dateStr) {
  console.log("Date received:", dateStr);
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

// Returns today's date as "YYYY-MM-DD" for the date input default
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}


// ================================
// STATS — Update the dashboard numbers
// ================================

function updateStats() {
  document.getElementById("s-total").textContent     = jobs.length;
  document.getElementById("s-applied").textContent   = jobs.filter(j => j.status === "Applied").length;
  document.getElementById("s-interview").textContent = jobs.filter(j => j.status === "Interview").length;
  document.getElementById("s-offer").textContent     = jobs.filter(j => j.status === "Offer").length;
  document.getElementById("s-rejected").textContent  = jobs.filter(j => j.status === "Rejected").length;

  const count = jobs.length;
  document.getElementById("app-count").textContent = `${count} application${count !== 1 ? "s" : ""}`;
}


// ================================
// RENDER — Draw the table rows
// ================================

function render() {
  // Filter jobs based on the active filter tab
  const filtered = currentFilter === "All"
    ? jobs
    : jobs.filter(j => j.status === currentFilter);

  const tbody      = document.getElementById("job-table");
  const emptyState = document.getElementById("empty-state");

  // Show empty state if no results
  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";

    // Build one table row per job
    tbody.innerHTML = filtered.map(job => `
      <tr>
        <td><strong>${job.company}</strong></td>
        <td>${job.role}</td>
        <td>
          <span class="badge ${getBadgeClass(job.status)}">${job.status}</span>
        </td>
        <td>${formatDate(job.dateApplied)}</td>
        <td class="notes-cell" title="${job.notes}">${job.notes || "—"}</td>
        <td>
          <button class="action-btn" onclick="openEditModal(${job.id})" title="Edit">✏️</button>
          <button class="action-btn" onclick="deleteJob(${job.id})" title="Delete">🗑️</button>
        </td>
      </tr>
    `).join("");
  }

  updateStats();
}


// ================================
// FILTER — Switch active tab
// ================================

function setFilter(filter) {
  currentFilter = filter;

  // Toggle active class on filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  render();
}


// ================================
// MODAL — Open, Close, Background click
// ================================

function openAddModal() {
  editingId = null;
  document.getElementById("modal-title").textContent = "Add Application";

  // Clear all form fields
  document.getElementById("f-company").value = "";
  document.getElementById("f-role").value    = "";
  document.getElementById("f-status").value  = "Applied";
  document.getElementById("f-date").value    = getTodayDate();
  document.getElementById("f-notes").value   = "";

  document.getElementById("modal").classList.add("open");
}

function openEditModal(id) {
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  editingId = id;
  document.getElementById("modal-title").textContent = "Edit Application";

  // Pre-fill form with existing job data
  document.getElementById("f-company").value = job.company;
  document.getElementById("f-role").value    = job.role;
  document.getElementById("f-status").value  = job.status;
  document.getElementById("f-date").value    = job.dateApplied;
  document.getElementById("f-notes").value   = job.notes;

  document.getElementById("modal").classList.add("open");
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  editingId = null;
}

// Close modal if user clicks outside the modal box
function handleBackgroundClick(event) {
  if (event.target.id === "modal") {
    closeModal();
  }
}


// ================================
// SAVE — Add new or update existing
// ================================

function saveJob() {
  const company = document.getElementById("f-company").value.trim();
  const role    = document.getElementById("f-role").value.trim();

  if (!company || !role) {
    alert("Company and Role are required fields.");
    return;
  }

  const jobData = {
    company: company,
    role:    role,
    status:  document.getElementById("f-status").value,
    dateApplied: document.getElementById("f-date").value,
    notes:   document.getElementById("f-notes").value.trim()
  };

  if (editingId) {
    updateJob(editingId, jobData);
  } else {
    addJob(jobData);
  }

  closeModal();
}


// ================================
// DELETE — Remove a job by ID
// ================================

function deleteJob(id) {
  const confirmed = confirm("Are you sure you want to remove this application?");
  if (confirmed) {
    jobs = jobs.filter(j => j.id !== id);
    render();
  }
}


// ================================
// EVENT LISTENERS — Wire up buttons
// ================================

document.getElementById("open-modal-btn").addEventListener("click", openAddModal);
document.getElementById("close-modal-btn").addEventListener("click", closeModal);
document.getElementById("save-btn").addEventListener("click", saveJob);
document.getElementById("modal").addEventListener("click", handleBackgroundClick);

// Wire up filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});


// ================================
// INIT — Run on page load
// ================================

fetchJobs();
