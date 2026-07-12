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

// Load JSON (auto-detect current month/year)
async function loadResolutions() {
  const months = [
    "01-january","02-february","03-march","04-april",
    "05-may","06-june","07-july","08-august",
    "09-september","10-october","11-november","12-december"
  ];

  const now = new Date();
  const currentYear = now.getFullYear();
  let found = false;

  // Loop mula current year pababa (halimbawa 2026 → 2025 → 2024)
  for (let year = currentYear; year >= 2020 && !found; year--) { // adjust 2020 kung hanggang saan gusto mo
    for (let i = 0; i < months.length && !found; i++) {
      const monthFile = months[i];
      try {
        const response = await fetch(`data/${year}/${monthFile}.json`);
        if (!response.ok) continue;

        const data = await response.json();
        if (data.length > 0) {
          resolutions = data;
          renderCards(resolutions);
          console.log(`Loaded ${year}/${monthFile}.json`);
          found = true;
        }
      } catch (err) {
        console.warn(`Error loading ${year}/${monthFile}:`, err);
      }
    }
  }

  if (!found) {
    cardsGrid.innerHTML = "<p>No resolutions found in available years.</p>";
  }
}

// Render cards
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

function showModal(res) {
  modalTitle.textContent = res.title || "Untitled";
  modalRef.textContent = res.id || "N/A";
  modalAuthor.textContent = res.author || "Unknown";
  modalDate.textContent = res.dateAdopted || "N/A";
  modalStatus.textContent = res.status || "N/A";

  modalStatus.className = "";
  const statusMap = {
    "approved": "status-approved",
    "pending": "status-pending",
    "deferred": "status-deferred",
    "in committee": "status-incommittee"
  };
  const statusClass = statusMap[res.status?.toLowerCase()];
  if (statusClass) modalStatus.classList.add(statusClass);

  const previewContainer = document.getElementById("modalPreview");
  previewContainer.innerHTML = "";

  if (res.docUrl && res.docUrl.trim() !== "") {
    const iframe = document.createElement("iframe");
    iframe.className = "pdf-preview";
    iframe.src = res.docUrl;
    iframe.title = "Document Preview";

    const linkP = document.createElement("p");
    linkP.className = "preview-link";
    const link = document.createElement("a");
    link.href = res.docUrl;
    link.target = "_blank";
    link.textContent = "Open full document";

    linkP.appendChild(link);
    previewContainer.appendChild(iframe);
    previewContainer.appendChild(linkP);
  } else {
    const noPreview = document.createElement("p");
    noPreview.className = "no-preview";
    noPreview.textContent = "No document preview available.";
    previewContainer.appendChild(noPreview);
  }

  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  modal.classList.add("hide");
  modal.addEventListener("animationend", () => {
    modal.style.display = "none";
    modal.classList.remove("hide");
  }, { once: true });
}

closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// Search logic
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = resolutions.filter(res =>
    res.title.toLowerCase().includes(query) ||
    res.author.toLowerCase().includes(query) ||
    res.status.toLowerCase().includes(query) ||
    res.id.toLowerCase().includes(query) ||       
    res.docUrl.toLowerCase().includes(query)      
  );
  renderCards(filtered);
});

// Clear button
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderCards(resolutions);
});

// Init
loadResolutions();

// hanapin yung button
const scrollBtn = document.querySelector(".scroll-top");

// toggle visibility kapag nag-scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 150) { 
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

// smooth scroll pabalik sa taas kapag na-click
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

