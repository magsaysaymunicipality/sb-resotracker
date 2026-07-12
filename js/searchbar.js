document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("focus", () => {
      // scroll into view para makita sa taas ng keyboard
      setTimeout(() => {
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300); // delay para hintayin lumabas ang keyboard
    });
  }
});
