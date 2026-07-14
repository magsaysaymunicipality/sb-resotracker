// === Imports & Setup ===
import * as pdfjsLib from './pdf.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';

// === DOM Elements ===
const searchInput = document.getElementById("searchInput");
const clearBtn = document.querySelector(".clear-btn");
const cardsGrid = document.getElementById("cardsGrid");
const modal = document.getElementById("infoModal");
const closeBtn = modal.querySelector(".close");

const modalTitle = document.getElementById("modalTitle");
const modalRef = document.getElementById("modalRef");
const modalAuthor = document.getElementById("modalAuthor");
const modalDate = document.getElementById("modalDate");
const modalStatus = document.getElementById("modalStatus");

let resolutions = [];

// === Load JSON (auto-detect current month/year) ===
async function loadResolutions() {
  const months = [
    "01-january","02-february","03-march","04-april",
    "05-may","06-june","07-july","08-august",
    "09-september","10-october","11-november","12-december"
  ];

  const now = new Date();
  const currentYear = now.getFullYear();
  let found = false;

// dynamic base URL: origin + repo folder kung meron
const pathParts = window.location.pathname.split("/").filter(Boolean);
const repoName = pathParts.length > 0 && pathParts[0] !== "index.html" ? "/" + pathParts[0] : "";
const baseUrl = window.location.origin + repoName;

  for (let year = currentYear; year >= 2020 && !found; year--) {
    for (let i = 0; i < months.length && !found; i++) {
      const monthFile = months[i];
      try {
        const response = await fetch(`${baseUrl}/data/${year}/${monthFile}.json`);

        if (!response.ok) {
          console.warn(`File not found: ${year}/${monthFile}.json`);
          continue;
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          resolutions = data;
          renderCards(resolutions);
          console.log(`Loaded ${year}/${monthFile}.json`);
          found = true;
        } else {
          console.warn(`Empty JSON: ${year}/${monthFile}.json`);
        }
      } catch (err) {
        console.error(`Error loading ${year}/${monthFile}.json:`, err);
      }
    }
  }

  if (!found) {
    cardsGrid.innerHTML = "<p>No resolutions found in available years.</p>";
  }
}

// === Render cards ===
function renderCards(data) {
  cardsGrid.innerHTML = "";
  if (data.length === 0) {
    cardsGrid.innerHTML = "<p>No resolutions found.</p>";
    return;
  }
  data.forEach(res => {
    const card = document.createElement("div");
    card.classList.add("res-card");
    card.innerHTML = `
      <h3>${res.title}</h3>
      <p>Reference #: ${res.id}</p>
      <p>Status: ${res.status}</p>
    `;
    card.addEventListener("click", () => showModal(res));
    cardsGrid.appendChild(card);
  });
}

// === Clear PDF Preview ===
function clearPDFPreview() {
  const container = document.getElementById("modalPreview");
  if (container) container.innerHTML = "";
}

// === Populate metadata ===
function populateMeta(res) {
  modalTitle.textContent   = res.title || "Untitled";
  modalRef.textContent     = res.id || "N/A";
  modalAuthor.textContent  = res.author || "Unknown";
  modalDate.textContent    = res.dateAdopted || "N/A";
  modalStatus.textContent  = res.status || "N/A";

  modalStatus.className = "";
  const statusMap = {
    approved: "status-approved",
    pending: "status-pending",
    deferred: "status-deferred",
    "in committee": "status-incommittee"
  };
  const statusKey = res.status?.toLowerCase();
  if (statusMap[statusKey]) modalStatus.classList.add(statusMap[statusKey]);
}

// === Render PDF with cache-busting ===
function renderPDFWithCache(url) {
  const previewContainer = document.getElementById("modalPreview");
  previewContainer.innerHTML = "";

  if (!url) {
    previewContainer.innerHTML = "<p class='no-preview'>No document URL provided.</p>";
    return;
  }

  // dagdag ng timestamp query para unique ang URL bawat bukas
  const bustUrl = url + (url.includes("?") ? "&" : "?") + "t=" + Date.now();

  // laging ipasa ang bustUrl para fresh render
  renderPDF(bustUrl);
}

// === Show modal ===
function showModal(res) {
  const previewContainer = document.getElementById("modalPreview");
  const pdfLink = document.getElementById("pdfLink");

  // populate metadata
  populateMeta(res);

  const docUrl = res.docUrl;
  if (docUrl) {
    const bustUrl = docUrl + (docUrl.includes("?") ? "&" : "?") + "t=" + Date.now();

    renderPDFWithCache(bustUrl);

    pdfLink.href = bustUrl;
    pdfLink.textContent = "Open full document";
    pdfLink.target = "_blank";
  } else {
    previewContainer.innerHTML = "<p class='no-preview'>No document available.</p>";
    pdfLink.removeAttribute("href");
  }

  // 👉 siguraduhin na lalabas ang modal
  modal.style.display = "block";
  modal.classList.add("show");
}

// === Close modal ===
function closeModal() {
  modal.classList.remove("show");
  modal.classList.add("hide");

  modal.addEventListener("animationend", () => {
    modal.style.display = "none";
    modal.classList.remove("hide");
    const canvas = document.getElementById("pdfCanvas");
    if (canvas) canvas.remove(); // clear canvas
  }, { once: true });
}

// === Event bindings ===
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// === Search logic ===
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
const filtered = resolutions.filter(res =>
  (res.title || "").toLowerCase().includes(query) ||
  (res.author || "").toLowerCase().includes(query) ||
  (res.status || "").toLowerCase().includes(query) ||
  (res.id || "").toLowerCase().includes(query) ||
  (res.docUrl || "").toLowerCase().includes(query)
);
  renderCards(filtered);
});

// === Clear button ===
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderCards(resolutions);
});

// === Init ===
loadResolutions();

// === Scroll top button ===
const scrollBtn = document.querySelector(".scroll-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 150) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
