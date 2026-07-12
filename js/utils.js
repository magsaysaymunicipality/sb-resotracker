// utils.js
function formatCurrency(value) {
  if (!value || isNaN(value)) return "";
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0
  });
  return formatter.format(Number(value)).replace("₱", "P");
}

function unformatCurrency(value) {
  if (!value) return "";
  return value.replace(/[^\d]/g, "");
}
