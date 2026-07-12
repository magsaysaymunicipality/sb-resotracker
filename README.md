# SB Reso Tracker

A simple web app for tracking SB resolutions.  
Search by **title**, **author**, **status**, **Reference # (RES 2026-XXX)**, or **document URL**.

## Features
- 📑 Displays resolution cards with title, author, date adopted, status, and Reference #.
- 🔍 Search filter works across multiple fields:
  - Title
  - Author
  - Status
  - Reference # (RES 2026-XXX)
  - Document URL (docs/2026/res-XXX.pdf)
- 🖥️ Modal view for detailed information and PDF preview.
- 🧹 Clear button to reset search results.


## Usage
1. Clone or download the repository.
2. Open `index.html` in your browser.
3. Use the search bar to filter resolutions by any field.
4. Click a card to view details in the modal.

## Deployment
This project is designed for **GitHub Pages**:
- Go to **Settings → Pages → Source → main branch → /root**.
- Your site will be live at:  
  `https://<username>.github.io/document-tracker/`

---

### Notes
- No backend required — purely static HTML, CSS, and JS.
- JSON data is embedded in `script.js` or can be served as a separate file.
- Responsive layout recommended for mobile users.

