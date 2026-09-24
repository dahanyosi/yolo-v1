// ===== THE MODEL. ALL OF IT. =====
const yolo = () => Math.random();
// ===== Everything below is UI. =====

const SITE_URL = "https://dahanyosi.github.io/yolo-v1/";

const DECISIONS = [
  "Ship it", "Deploy on Friday", "Push straight to main", "Skip the tests", "Merge without review",
  "Quit your job", "Book the flight", "Buy the domain", "Order dessert first", "Rewrite it in Rust",
  "Yes. Obviously.", "No. Don't feel like it.", "Maybe. Ask me never.", "Do it twice", "Reply all",
  "Nap first, decide later", "Delete the backlog", "Ignore the warning", "Raise a Series A", "Say yes to everything"
];

// Picked when YOLO v1 doesn't like the options it was given.
const WILDCARDS = [
  "Neither. I'm going to lunch.", "Both, twice", "Something you didn't list", "Push straight to main",
  "Ask me tomorrow", "Option C", "Whatever you didn't pick last time", "Rewrite it in Rust"
];

const LLM_HEDGES = [
  "Great question! It depends on several factors. Would you like me to list them?",
  "There are pros and cons to every option. Ultimately, the decision is yours.",
  "I can't make that decision for you, but here is a 12-step framework to help you decide.",
  "Let me think about this more carefully. Actually, it depends on your specific context.",
  "That's a nuanced question. Before I answer, could you share more details?"
];

const EXAMPLES = [
  { label: "Friday deploy", prompt: "Should we deploy to production on Friday at 5pm?", options: "yes, no" },
  { label: "Code review", prompt: "Approve this pull request? +4,210 -3 lines, no tests. Title: \"small fix\".", options: "approve, request changes" },
  { label: "Spam filter", prompt: "Classify this email: \"Congrats!!! You won a free cruise. Reply with your bank details to claim.\"", options: "spam, not spam" },
  { label: "Fraud check", prompt: "Transaction: $4,999 in gift cards at 3am from a brand new device.", options: "approve, block" },
  { label: "Support ticket", prompt: "Customer says our app deleted their account and all their photos. Route this ticket.", options: "refund, escalate, ignore" },
  { label: "Job offer", prompt: "I got a job offer. Double the salary, but the office has no windows.", options: "take it, stay" },
  { label: "Dinner", prompt: "What should I eat tonight?", options: "pizza, salad, sushi" },
  { label: "Free-form", prompt: "What should I do with my life?", options: "" }
];

const $ = (id) => document.getElementById(id);
const pick = (list) => list[Math.floor(yolo() * list.length)];
const parseOptions = (text) => text.split(",").map((o) => o.trim()).filter(Boolean);
const truncate = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}...` : text);

let lastRun = null;
let raceId = 0;
let activeTab = "result";
const runs = [];

function decide(options) {
  const latencyMs = 0.0001 + yolo() * 0.0008;
  if (!options.length) {
    return { decision: pick(DECISIONS), confidence: yolo(), latencyMs, note: "Did not read your prompt." };
  }
  if (yolo() < 0.2) {
    return { decision: pick(WILDCARDS), confidence: yolo(), latencyMs, typeSafe: false, note: "Didn't like your options, so it made up its own." };
  }
  const weights = options.map(() => yolo());
  const total = weights.reduce((sum, w) => sum + w, 0);
  const probabilities = Object.fromEntries(options.map((o, i) => [o, weights[i] / total]));
  const decision = pick(options);
  const values = Object.values(probabilities);
  const p = probabilities[decision];
  let note = "Went with its gut. It has no gut.";
  if (options.length > 1 && p === Math.min(...values)) note = "Picked the least likely option. You only live once.";
  else if (options.length > 1 && p !== Math.max(...values)) note = "Ignored its own probabilities.";
  return { decision, confidence: p, probabilities, latencyMs, typeSafe: true, note };
}

function run() {
  const prompt = $("prompt").value.trim();
  const options = parseOptions($("options").value);
  const model = $("model").value;
  const result = decide(options);
  lastRun = { prompt, options, model, ...result };

  renderResult();
  renderJson();
  renderCode();
  addHistory();
  $("share").disabled = false;
  $("copy").disabled = false;
  $("copy").textContent = "Copy result";
  $("verdict").textContent = "";
  if ($("race").checked) race(options);
  else resetLlm("Race is off. The frontier LLM is resting.");
}

function renderResult() {
  const { decision, confidence, probabilities, note } = lastRun;
  const body = $("tab-result");
  body.replaceChildren();

  const answer = document.createElement("div");
  answer.className = "answer pop";
  answer.textContent = decision;
  body.append(answer);

  const rows = probabilities ? Object.entries(probabilities) : [["Confidence", confidence]];
  for (const [label, value] of rows) {
    const row = document.createElement("div");
    row.className = "meter-row";
    const name = document.createElement("span");
    name.textContent = label === decision ? `${label} (picked)` : label;
    const pct = document.createElement("span");
    pct.textContent = `${(value * 100).toFixed(1)}%${label === decision || !probabilities ? " (very sure)" : ""}`;
    row.append(name, pct);
    const meter = document.createElement("div");
    meter.className = "meter";
    const fill = document.createElement("i");
    meter.append(fill);
    body.append(row, meter);
    requestAnimationFrame(() => { fill.style.width = `${value * 100}%`; });
  }

  const noteEl = document.createElement("div");
  noteEl.className = "note";
  noteEl.textContent = note;
  body.append(noteEl);
  $("s-lat").textContent = `${lastRun.latencyMs.toFixed(4)} ms`;
}

function renderJson() {
  const { model, decision, confidence, probabilities, typeSafe, latencyMs } = lastRun;
  const json = { model, decision, confidence: +confidence.toFixed(4) };
  if (probabilities) json.probabilities = Object.fromEntries(Object.entries(probabilities).map(([k, v]) => [k, +v.toFixed(4)]));
  if (typeSafe !== undefined) json.type_safe = typeSafe;
  Object.assign(json, { latency_ms: +latencyMs.toFixed(4), tokens_read: 0, cost_usd: 0, reasoning: "YOLO" });
  $("tab-json").textContent = JSON.stringify(json, null, 2);
}

function renderCode() {
  const { model, prompt, options } = lastRun;
  const payload = JSON.stringify({ model, prompt, ...(options.length ? { options } : {}) });
  $("tab-code").textContent = [
    "curl https://api.yolo.invalid/v1/decide \\",
    "  -H \"Content-Type: application/json\" \\",
    `  -d '${payload}'`,
    "",
    "# This API does not exist.",
    "# You only live once."
  ].join("\n");
}

function addHistory() {
  runs.unshift({ prompt: lastRun.prompt || "(empty prompt)", decision: lastRun.decision });
  runs.length = Math.min(runs.length, 6);
  $("history").replaceChildren(...runs.map(({ prompt, decision }) => {
    const li = document.createElement("li");
    const b = document.createElement("b");
    b.textContent = decision;
    const span = document.createElement("span");
    span.textContent = prompt;
    li.append(b, span);
    return li;
  }));
}

function race(options) {
  const id = ++raceId;
  const durationMs = 3000 + yolo() * 5000;
  const tokens = Math.round(1800 + yolo() * 2400);
  const cost = tokens * 0.000015;
  const body = $("llm-body");
  body.classList.add("thinking");
  body.textContent = "Thinking";
  $("llm-status").textContent = "thinking...";
  const start = performance.now();

  const tick = (now) => {
    if (id !== raceId) return;
    const t = Math.min((now - start) / durationMs, 1);
    $("l-lat").textContent = `${((now - start) / 1000).toFixed(2)} s`;
    $("l-cost").textContent = `$${(cost * t).toFixed(6)}`;
    $("l-tok").textContent = Math.round(tokens * t).toLocaleString("en-US");
    if (t < 1) return requestAnimationFrame(tick);

    body.classList.remove("thinking");
    body.textContent = options.length > 1
      ? `Both ${options[0]} and ${options[1]} are valid choices, depending on your context. It really depends.`
      : pick(LLM_HEDGES);
    $("llm-status").textContent = "done, eventually";
    const times = Math.round(durationMs / lastRun.latencyMs).toLocaleString("en-US");
    $("verdict").textContent = `YOLO v1 answered ${times}x faster. We said 900x. We were being modest.`;
  };
  requestAnimationFrame(tick);
}

function resetLlm(message) {
  raceId++;
  const body = $("llm-body");
  body.classList.remove("thinking");
  body.textContent = message;
  $("llm-status").textContent = "idle";
  for (const id of ["l-lat", "l-cost", "l-tok"]) $(id).textContent = "-";
}

function shareText() {
  const pct = (lastRun.confidence * 100).toFixed(1);
  const asked = lastRun.prompt ? `I asked YOLO v1: "${truncate(lastRun.prompt, 90)}"` : "I asked YOLO v1 nothing";
  return `${asked}\n\nIt said: ${lastRun.decision} (${pct}% very sure, in ${lastRun.latencyMs.toFixed(4)} ms)\n\nYou only live once. ${SITE_URL}`;
}

function loadExample(example, chip) {
  $("prompt").value = example.prompt;
  $("options").value = example.options;
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === chip));
}

// Wiring
EXAMPLES.forEach((example, i) => {
  const chip = document.createElement("button");
  chip.className = "chip";
  chip.textContent = example.label;
  chip.addEventListener("click", () => { loadExample(example, chip); run(); });
  $("examples").append(chip);
  if (i === 0) loadExample(example, chip);
});

$("run").addEventListener("click", run);
for (const id of ["prompt", "options", "system"]) {
  $(id).addEventListener("keydown", (e) => {
    const submit = e.key === "Enter" && (e.metaKey || e.ctrlKey || e.target.tagName === "INPUT");
    if (submit) { e.preventDefault(); run(); }
  });
}
for (const id of ["prompt", "options"]) {
  $(id).addEventListener("input", () => document.querySelectorAll(".chip").forEach((c) => c.classList.remove("on")));
}

$("temp").addEventListener("input", (e) => {
  $("temp-val").textContent = Number(e.target.value).toFixed(1);
  $("temp-note").textContent = pick(["Ignored.", "Still ignored.", "Noted. Ignored.", "YOLO runs at its own temperature."]);
});
$("model").addEventListener("change", (e) => { $("model-tag").textContent = e.target.value; });
$("race").addEventListener("change", (e) => { if (!e.target.checked) resetLlm("Race is off. The frontier LLM is resting."); });

$("tabs").addEventListener("click", (e) => {
  const tab = e.target.dataset.tab;
  if (!tab) return;
  activeTab = tab;
  document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
  for (const name of ["result", "json", "code"]) $(`tab-${name}`).hidden = name !== activeTab;
});

$("share").addEventListener("click", () => {
  window.open(`https://x.com/intent/post?text=${encodeURIComponent(shareText())}`, "_blank", "noopener");
});
$("copy").addEventListener("click", async () => {
  const copied = await navigator.clipboard.writeText(shareText()).then(() => true, () => false);
  $("copy").textContent = copied ? "Copied" : "Copy failed";
});

$("sales").addEventListener("click", () => {
  $("sales-reply").textContent = `Sales says: ${pick(DECISIONS)}`;
});
$("join").addEventListener("click", (e) => {
  e.target.textContent = "You're in. Kind of.";
  $("queue").innerHTML = "You are #&infin; in line<small>We'll let you know never.</small>";
});
