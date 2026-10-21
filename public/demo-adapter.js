/* GIO demo adapter. Only synthetic data; never connects to a backend. */
(() => {
  const KEY = "gio-marketing-demo-v1";
  localStorage.setItem("gio-workspace-area", "estetica");
  localStorage.setItem("gio-sidebar-pinned", "true");
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const stamp = (h) => today + "T" + h + ":00-04:00";
  const user = {
    id: "demo-admin",
    email: "demo@example.invalid",
    user_metadata: { full_name: "Equipo demo" },
    app_metadata: { provider: "demo" },
    aud: "authenticated",
    created_at: stamp("08:00"),
  };
  const session = {
    user,
    access_token: "local-demo-only",
    token_type: "bearer",
    expires_at: 4102444800,
    refresh_token: "local-demo-only",
  };
  const pros = [
    {
      id: "demo-pro-1",
      full_name: "Laura · profesional demo",
      email: "laura@example.invalid",
      role: "professional",
      active: true,
      workspace_area: "estetica",
    },
    {
      id: "demo-pro-2",
      full_name: "Ana · profesional demo",
      email: "ana@example.invalid",
      role: "professional",
      active: true,
      workspace_area: "estetica",
    },
  ];
  const patients = [
    "Camila Demo",
    "Sofía Demo",
    "Valeria Demo",
    "Isabella Demo",
    "Daniela Demo",
    "Lucía Demo",
  ].map((full_name, i) => ({
    id: "demo-patient-" + (i + 1),
    full_name,
    phone: "00000000" + String(i + 1).padStart(2, "0"),
    email: "paciente" + (i + 1) + "@example.invalid",
    birth_date: "1995-06-15",
    document: "DEMO-" + (i + 1),
    address: "Dirección de ejemplo",
    allergies: "Sin datos clínicos reales",
    conditions: "Datos ficticios para demostración",
    notes: "Paciente ficticio. No usar para atención real.",
    last_service: [
      "Limpieza facial",
      "Masaje relajante",
      "Evaluación estética",
    ][i % 3],
    professional_id: pros[i % 2].id,
    profiles: { full_name: pros[i % 2].full_name },
    professional_name: pros[i % 2].full_name,
    workspace_area: "estetica",
    active: true,
    created_at: stamp("08:00"),
  }));
  const services = [
    "Limpieza facial",
    "Masaje relajante",
    "Evaluación estética",
    "Hidratación facial",
  ].map((name, i) => ({
    id: "demo-service-" + i,
    name,
    price: [2500, 1800, 1500, 2200][i],
    duration_minutes: 60,
    duration: 60,
    active: true,
    workspace_area: "estetica",
    created_at: stamp("08:00"),
  }));
  const appointments = patients
    .slice(0, 5)
    .map((p, i) => ({
      id: "demo-appt-" + i,
      patient_id: p.id,
      professional_id: p.professional_id,
      workspace_area: "estetica",
      starts_at: stamp(["09:00", "10:30", "12:00", "14:00", "15:30"][i]),
      ends_at: stamp(["10:00", "11:30", "13:00", "15:00", "16:30"][i]),
      duration_minutes: 60,
      service: p.last_service,
      status: ["completed", "confirmed", "pending", "confirmed", "pending"][i],
      notes: "Cita de demostración",
      patients: { full_name: p.full_name, phone: p.phone },
      profiles: p.profiles,
      patient_name: p.full_name,
      patient_phone: p.phone,
      professional_name: p.professional_name,
      is_private: false,
      created_at: stamp("08:00"),
    }));
  const hours = Array.from({ length: 7 }, (_, i) => ({
    open: i !== 0,
    start: "08:00",
    end: "18:00",
    break_start: "13:00",
    break_end: "14:00",
  }));
  const seed = {
    profiles: [
      {
        ...user,
        full_name: "Equipo demo",
        role: "admin",
        active: true,
        workspace_area: "estetica",
      },
      ...pros,
    ],
    profile_workspaces: [{ profile_id: user.id, workspace_area: "estetica" }],
    patients,
    appointments,
    walk_in_arrivals: [],
    patient_attentions: [],
    business_services: services,
    business_settings: [
      {
        workspace_area: "estetica",
        name: "GIO Beauty & Wellness",
        business_name: "GIO Beauty & Wellness",
        opening_hours: hours,
        weekly_hours: hours,
        schedule: hours,
        slot_minutes: 30,
        slot_duration: 30,
        default_duration_minutes: 60,
      },
    ],
    professional_details: pros.map((p) => ({
      profile_id: p.id,
      professional_id: p.id,
      workspace_area: "estetica",
      specialty: "Estética",
      schedule: hours,
      weekly_hours: hours,
      active: true,
    })),
    schedule_blocks: [],
    financial_entries: [
      {
        id: "demo-income-1",
        workspace_area: "estetica",
        kind: "income",
        amount: 2500,
        occurred_on: today,
        concept: "Limpieza facial · ejemplo",
        category: "Servicios",
        service_name: "Limpieza facial",
        description: "Ingreso ficticio",
        payment_method: "cash",
        created_at: stamp("09:00"),
      },
      {
        id: "demo-income-2",
        workspace_area: "estetica",
        kind: "income",
        amount: 1800,
        occurred_on: today,
        concept: "Masaje relajante · ejemplo",
        category: "Servicios",
        service_name: "Masaje relajante",
        description: "Ingreso ficticio",
        payment_method: "transfer",
        created_at: stamp("11:00"),
      },
    ],
    inventory_items: [],
  };
  let db;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    db = saved?.day === today ? saved.db : structuredClone(seed);
  } catch {
    db = structuredClone(seed);
  }
  const persist = () =>
    localStorage.setItem(KEY, JSON.stringify({ day: today, db }));
  const relation = (table, row) => {
    if (
      table === "appointments" ||
      table === "patients" ||
      table === "walk_in_arrivals"
    ) {
      const p = db.patients.find((p) => p.id === row.patient_id);
      const pro = db.profiles.find((p) => p.id === row.professional_id);
      return {
        ...row,
        ...(p
          ? {
              patients: { full_name: p.full_name, phone: p.phone },
              patient_name: p.full_name,
              patient_phone: p.phone,
            }
          : {}),
        ...(pro
          ? {
              profiles: { full_name: pro.full_name },
              professional_name: pro.full_name,
            }
          : {}),
        is_private: false,
      };
    }
    return row;
  };
  function query(table) {
    const state = {
      filters: [],
      mode: "read",
      value: null,
      one: false,
      start: 0,
      end: Infinity,
      sort: null,
      options: null,
    };
    const q = {
      select(columns = "*", options = {}) {
        state.options = options;
        return q;
      },
      eq(k, v) {
        state.filters.push((r) => r[k] === v);
        return q;
      },
      neq(k, v) {
        state.filters.push((r) => r[k] !== v);
        return q;
      },
      in(k, v) {
        state.filters.push((r) => v.includes(r[k]));
        return q;
      },
      is(k, v) {
        state.filters.push((r) => r[k] === v || (v === null && r[k] == null));
        return q;
      },
      gte(k, v) {
        state.filters.push((r) =>
          k.endsWith("_at") ? Date.parse(r[k]) >= Date.parse(v) : r[k] >= v,
        );
        return q;
      },
      lte(k, v) {
        state.filters.push((r) =>
          k.endsWith("_at") ? Date.parse(r[k]) <= Date.parse(v) : r[k] <= v,
        );
        return q;
      },
      gt(k, v) {
        state.filters.push((r) => r[k] > v);
        return q;
      },
      lt(k, v) {
        state.filters.push((r) => r[k] < v);
        return q;
      },
      match(v) {
        Object.entries(v).forEach(([k, x]) => q.eq(k, x));
        return q;
      },
      ilike(k, v) {
        state.filters.push((r) =>
          String(r[k] || "")
            .toLowerCase()
            .includes(v.replace(/%/g, "").toLowerCase()),
        );
        return q;
      },
      order(k, o = {}) {
        state.sort = [k, o.ascending !== false];
        return q;
      },
      limit(n) {
        state.end = state.start + n;
        return q;
      },
      range(a, b) {
        state.start = a;
        state.end = b + 1;
        return q;
      },
      single() {
        state.one = true;
        return q;
      },
      maybeSingle() {
        state.one = true;
        return q;
      },
      insert(v) {
        state.mode = "insert";
        state.value = v;
        return q;
      },
      update(v) {
        state.mode = "update";
        state.value = v;
        return q;
      },
      upsert(v) {
        state.mode = "upsert";
        state.value = v;
        return q;
      },
      delete() {
        state.mode = "delete";
        return q;
      },
      abortSignal() {
        return q;
      },
      or() {
        return q;
      },
      not() {
        return q;
      },
      then(resolve, reject) {
        try {
          let rows = (db[table] || []).filter((r) =>
            state.filters.every((f) => f(r)),
          );
          if (state.mode === "insert" || state.mode === "upsert") {
            db[table] ||= [];
            rows = (
              Array.isArray(state.value) ? state.value : [state.value]
            ).map((v) => ({
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
              active: true,
              ...v,
            }));
            for (const row of rows) {
              const i =
                state.mode === "upsert"
                  ? db[table].findIndex((r) => r.id === row.id)
                  : -1;
              if (i >= 0) db[table][i] = row;
              else db[table].push(row);
            }
            persist();
          } else if (state.mode === "update") {
            rows.forEach((r) => Object.assign(r, state.value));
            persist();
          } else if (state.mode === "delete") {
            db[table] = (db[table] || []).filter((r) => !rows.includes(r));
            persist();
          }
          const count = rows.length;
          if (state.sort) {
            const [key, asc] = state.sort;
            rows = [...rows].sort(
              (a, b) =>
                String(a[key] ?? "").localeCompare(String(b[key] ?? "")) *
                (asc ? 1 : -1),
            );
          }
          rows = rows
            .slice(state.start, state.end)
            .map((r) => relation(table, r));
          return Promise.resolve({
            data: state.one ? (rows[0] ?? null) : rows,
            count,
            error: null,
          }).then(resolve, reject);
        } catch (e) {
          return Promise.reject(e).then(resolve, reject);
        }
      },
    };
    return q;
  }
  window.__GIO_DEMO__ = {
    from: query,
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      getUser: async () => ({ data: { user }, error: null }),
      onAuthStateChange(cb) {
        queueMicrotask(() => cb("SIGNED_IN", session));
        return { data: { subscription: { unsubscribe() {} } } };
      },
      signOut: async () => {
        location.href = "/";
        return { error: null };
      },
      updateUser: async () => ({ data: { user }, error: null }),
    },
    rpc: async (name, args = {}) => {
      if (["accept_staff_invitation", "sync_my_profile_email"].includes(name))
        return { data: null, error: null };
      if (name === "list_agenda_day")
        return {
          data: db.appointments
            .filter(
              (r) =>
                r.workspace_area === args.area &&
                r.starts_at.slice(0, 10) === args.day,
            )
            .map((r) => relation("appointments", r)),
          error: null,
        };
      if (name === "list_workspace_professionals")
        return { data: pros, error: null };
      if (name === "list_operational_patients")
        return { data: db.patients, error: null };
      if (name === "check_appointment_availability") {
        const start = Date.parse(args.starts),
          end = start + Number(args.minutes) * 60000;
        const conflict = db.appointments.some(
          (a) =>
            a.id !== args.exclude_id &&
            a.workspace_area === args.area &&
            ["pending", "confirmed"].includes(a.status) &&
            start <
              Date.parse(a.ends_at || a.starts_at) +
                (!a.ends_at ? Number(a.duration_minutes || 60) * 60000 : 0) &&
            end > Date.parse(a.starts_at),
        );
        return {
          data: conflict
            ? "Este horario coincide con una cita de ejemplo. Elige otro horario."
            : null,
          error: null,
        };
      }
      return {
        data: null,
        error: { message: "Esta acción no está incluida en la demo." },
      };
    },
    channel: () => ({
      on() {
        return this;
      },
      subscribe() {
        return this;
      },
      unsubscribe() {},
    }),
    removeChannel: async () => {},
  };
  window.resetGioDemo = () => {
    localStorage.removeItem(KEY);
    location.href = "/inicio";
  };
  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.createElement("div");
    bar.className = "gio-demo-bar";
    bar.innerHTML =
      '<a href="/">← Volver a la presentación</a><span><b>DEMO GRATUITA</b> · Datos ficticios · Usa solo datos de ejemplo</span><button type="button">Reiniciar demo</button>';
    bar.querySelector("button").onclick = window.resetGioDemo;
    document.body.prepend(bar);
  });
})();
