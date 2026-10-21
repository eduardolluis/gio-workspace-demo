const views = {
  agenda: [
    "Agenda de GIO con datos ficticios",
    "Agenda · Citas y profesionales en una sola vista. Datos ficticios.",
  ],
  pacientes: [
    "Listado de pacientes ficticios en GIO",
    "Pacientes · Información organizada y fácil de consultar. Datos ficticios.",
  ],
  finanzas: [
    "Resumen financiero ficticio en GIO",
    "Finanzas · Ingresos y gastos registrados en un mismo lugar. Datos ficticios.",
  ],
};
document.querySelectorAll("[data-shot]").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll("[data-shot]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const key = b.dataset.shot;
    document.getElementById("gallery-image").src =
      "/marketing/capturas/" + key + ".webp";
    document.getElementById("gallery-image").alt = views[key][0];
    document.getElementById("gallery-caption").textContent = views[key][1];
  }),
);
document.getElementById("year").textContent = new Date().getFullYear();
fetch("/marketing/config.json")
  .then((r) => r.json())
  .then((c) => {
    if (c.contactUrl && /^https:\/\//.test(c.contactUrl))
      document
        .querySelectorAll("[data-contact]")
        .forEach((a) => (a.href = c.contactUrl));
  })
  .catch(() => {});
// Keep the sale link visible even if the third-party badge image is unavailable.
const saleBadgeImage = document.querySelector(".sideprojectors-badge img");
if (saleBadgeImage) {
  saleBadgeImage.addEventListener("error", () => {
    saleBadgeImage.hidden = true;
  });
  if (saleBadgeImage.complete && !saleBadgeImage.naturalWidth)
    saleBadgeImage.hidden = true;
}
