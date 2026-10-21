const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const ROOT = process.env.GIO_DEMO_URL || "http://localhost:3000";
const OUT = process.env.GIO_OUTPUT || path.resolve("public/marketing");
const card = (title, sub, tag = "GIO WORKSPACE") =>
  `<section id="video-card" style="position:fixed;inset:0;z-index:99999;background:#faf8f3;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#244d3e;font-family:Arial;text-align:center;padding:80px"><img src="${ROOT}/icons/gio-workspace.svg" width="88" height="88" style="margin-bottom:30px"><p style="font-size:13px;letter-spacing:3px;margin:0 0 24px">${tag}</p><h1 style="font-family:Georgia;font-size:64px;font-weight:400;line-height:1.15;margin:0;max-width:1000px">${title}</h1><p style="font-size:23px;line-height:1.6;color:#6a756e;margin:28px 0 0">${sub}</p><p style="position:absolute;bottom:35px;color:#778675;font-size:13px">Interfaz de GIO · Datos ficticios de demostración</p></section>`;
const caption = async (p, text) =>
  p.evaluate((t) => {
    document.getElementById("tour-caption")?.remove();
    const d = document.createElement("div");
    d.id = "tour-caption";
    d.style =
      "position:fixed;bottom:25px;left:50%;transform:translateX(-50%);z-index:99998;background:#173d33f5;color:white;border-radius:10px;padding:17px 30px;font:500 21px/1.4 Arial;text-align:center;box-shadow:0 8px 30px #173d3330;max-width:88%;width:max-content;";
    d.textContent = t;
    document.body.append(d);
  }, text);
(async () => {
  fs.mkdirSync(OUT + "/capturas", { recursive: true });
  fs.mkdirSync(OUT + "/video", { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: OUT + "/video/raw",
      size: { width: 1440, height: 900 },
    },
    reducedMotion: "reduce",
  });
  const p = await context.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(ROOT + "/inicio");
  await p.waitForTimeout(600);
  await p.evaluate(
    (c) => document.body.insertAdjacentHTML("beforeend", c),
    card(
      "Tu centro en orden.<br>Tu atención donde importa.",
      "Agenda, pacientes y finanzas en un mismo espacio.",
    ),
  );
  await p.screenshot({ path: OUT + "/capturas/portada-video.png" });
  await p.waitForTimeout(4000);
  await p.goto(ROOT + "/agenda");
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + "/capturas/agenda.png" });
  await caption(p, "Consulta tus citas y quién atiende a cada paciente.");
  await p.waitForTimeout(6800);
  await p.goto(ROOT + "/pacientes");
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + "/capturas/pacientes.png" });
  await caption(p, "Encuentra la información del paciente en una misma ficha.");
  await p.waitForTimeout(2200);
  const patient = p.getByText("Camila Demo", { exact: true }).first();
  await patient.click();
  await p.waitForTimeout(1000);
  await caption(p, "Revisa los datos y el seguimiento registrado.");
  await p.waitForTimeout(3500);
  await p.goto(ROOT + "/finanzas");
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + "/capturas/finanzas.png" });
  await caption(p, "Registra ingresos y gastos, y consulta el resumen.");
  await p.waitForTimeout(2000);
  await p
    .getByRole("button", { name: "Registrar ingreso", exact: true })
    .click();
  await p.waitForTimeout(700);
  await p
    .getByLabel("Servicio cobrado")
    .selectOption({ label: "Limpieza facial" });
  await p.getByLabel("Monto (RD$)", { exact: true }).fill("2500");
  await p
    .getByLabel("Descripción o notas (opcional)")
    .fill("Ingreso ficticio de demostración");
  await p.waitForTimeout(1800);
  await p.getByRole("button", { name: "Guardar", exact: true }).click();
  await p.waitForTimeout(700);
  await caption(p, "Todo este recorrido se hace con datos ficticios.");
  await p.waitForTimeout(2000);
  await p.evaluate(
    (c) => document.body.insertAdjacentHTML("beforeend", c),
    card(
      "Pruébalo antes de decidir.",
      "Demo gratuita · Sin registro · Sin tarjeta",
      "MENOS TIEMPO BUSCANDO. MÁS TIEMPO ATENDIENDO.",
    ),
  );
  await p.waitForTimeout(5200);
  const video = p.video();
  await context.close();
  const videoPath = await video.path();
  await browser.close();
  fs.copyFileSync(videoPath, OUT + "/video/gio-demo.webm");
  console.log(
    JSON.stringify({ videoPath: OUT + "/video/gio-demo.webm", errors: errs }),
  );
})();
