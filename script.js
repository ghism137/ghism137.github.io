/* ghism portfolio — vanilla JS */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var css = function (name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); };

  /* ───────── i18n ───────── */
  var VI = {
    "nav.about": "giới thiệu", "nav.projects": "dự án", "nav.skills": "kỹ năng",
    "nav.log": "thành tích", "nav.contact": "liên hệ",
    "hero.lead": "Mình làm những thứ nằm giữa toán và dữ liệu lộn xộn: agent truy xuất biết trích dẫn luật, mô hình phát hiện gian lận biết tính bằng tiền, và thuật toán đồ thị đọc vị thị trường chứng khoán.",
    "hero.cta1": "./xem_du_an", "hero.cta3": "./lien_he",
    "hero.hint": "rê chuột vào nút · con trỏ của bạn cũng là một nút",
    "about.title": "cat gioi_thieu.md",
    "about.p1": "Sinh viên Khoa học Máy tính, chuyên ngành Khoa học Dữ liệu & AI. Mình thích những bài toán mà một trừu tượng hoá đúng làm được phần lớn công việc — một metric biến tương quan thành khoảng cách, một cách chia dữ liệu chặn rò rỉ, một bộ tính toán giữ LLM tránh xa phép tính.",
    "about.p2": "Ngoài mô hình: lập trình thi đấu (ICPC), tài chính định lượng, lịch sử và triết học. Mình giải thích bug cho một con vịt cao su. Nó ở góc màn hình. Chào nó đi.",
    "about.focus": "tập trung", "about.likes": "thích", "about.likesV": "toán · tài chính · lịch sử · triết học",
    "about.status": "sẵn sàng cho cơ hội mới",
    "proj.title": "ls ./du_an",
    "tag.active": "đang làm · đồ án", "tag.algo": "thuật toán ứng dụng", "tag.team": "nhóm · học sâu",
    "p1.name": "AI Agent Luật Lao động Việt Nam",
    "p1.desc": "Agent RAG cho người lao động và HR: trả lời câu hỏi luật lao động kèm trích dẫn đến từng điều, tính trợ cấp thôi việc, lương thử việc, bảo hiểm thất nghiệp và phép năm bằng Python tất định (LLM chỉ trích xuất tham số), và soạn văn bản pháp lý từ mẫu Jinja2.",
    "p1.b1": "Kho dữ liệu: BLLĐ 2019, Luật BHXH, Luật Việc làm, nghị định & thông tư → chia chunk theo điều luật",
    "p1.b2": "Truy xuất lai: BM25 (sparse) + BGE-M3 (dense) trên Qdrant",
    "p1.b3": "Nguyên tắc: LLM không làm toán → không bịa ra tiền",
    "p1.m1": "văn bản pháp luật", "p1.m2": "chunk theo điều luật", "p1.m3": "bộ tính chính xác", "p1.m4": "bộ đánh giá đang xây",
    "p2.desc": "Pipeline phát hiện gian lận chống rò rỉ trên 590 nghìn giao dịch thẻ, chỉ 3.5% là gian lận. Chia theo thời gian có khoảng purge 14 ngày (mô phỏng độ trễ chargeback), 337 đặc trưng, so sánh 8 mô hình, và chọn ngưỡng theo chi phí kinh doanh thay vì 0.5.",
    "p2.b1": "Đặc trưng vận tốc dùng shift(1).expanding() → giao dịch không bao giờ \"nhìn thấy\" chính nó",
    "p2.b2": "Gom nhóm tương quan 339 → 235 V-features thay vì PCA (PCA phá mất tín hiệu)",
    "p2.b3": "SHAP để giải thích, AUC-PR có trọng số theo tiền cho gian lận giá trị cao",
    "p2.m1": "AUC-PR (ngẫu nhiên = 0.035)", "p2.m2": "lần so với ngẫu nhiên", "p2.m4": "chi phí ở t* = 0.365 so với 0.5",
    "p3.name": "Phân cụm cổ phiếu bằng cây khung nhỏ nhất",
    "p3.desc": "Econophysics theo Mantegna (1999): lợi suất log → tương quan Pearson → một metric thật → cây MST giữ lại N−1 liên kết mạnh nhất của thị trường. Prim và Kruskal (kèm Union-Find) tự cài đặt; NetworkX chỉ dùng để kiểm tra chéo.",
    "p3.b1": "So cụm với ngành GICS bằng ARI / NMI, k-means làm baseline",
    "p3.b2": "Kiểm định hoán vị: cây là cấu trúc thật hay chỉ là nhiễu?",
    "p3.b3": "Rolling MST + lý thuyết ma trận ngẫu nhiên để theo dõi tương quan sụp đổ năm 2020 và 2022",
    "p3.m1": "cạnh giữ lại từ N(N−1)/2", "p3.m2": "Prim trên đồ thị dày", "p3.m3": "so với ngành thật", "p3.m4": "kiểm định hoán vị",
    "p4.name": "Phân đoạn vết dầu loang trên ảnh SAR",
    "p4.desc": "Tìm vết dầu loang trên mặt biển trong ảnh radar (SAR). Ba mô hình phân đoạn huấn luyện theo cùng một interface, kết hợp bằng trung bình xác suất, và chạy trong app Streamlit: tải ảnh → chọn mô hình → mask và overlay.",
    "p4.b1": "API load_model / predict thống nhất để mô hình nào cũng cắm được vào app",
    "p4.b2": "Ensemble bằng trung bình xác suất hoặc bỏ phiếu 2/3",
    "p4.b3": "Cùng một bộ metric: Dice, IoU, Precision, Recall",
    "p4.m1": "mô hình + ensemble", "p4.m2": "đánh giá",
    "skills.title": "pip list --user", "skills.algo": "đồ thị · MST · quy hoạch động · lập trình thi đấu",
    "log.title": "tail -f thanh_tich.log",
    "log.icpc": "Giải Ba — ICPC Miền Bắc", "log.icpcSub": "Kỳ thi Lập trình Sinh viên Quốc tế ICPC, khu vực miền Bắc",
    "log.date": "ngày", "log.issuer": "đơn vị", "log.course": "chứng chỉ coursera",
    "contact.title": "./lien_he --ngay", "contact.note": "# trả lời nhanh hơn mô hình của mình hội tụ",
    "foot.made": "HTML/CSS/JS viết tay, không framework nào bị hại"
  };
  var TAG = {
    en: ["My life matters.", "Data Science & AI student", "Training models, not my sleep schedule", "Minimizing loss. Maximizing coffee.", "Rubber-duck debugging, literally 🦆"],
    vi: ["My life matters.", "Sinh viên Data Science & AI", "Train model chứ không train giấc ngủ", "Giảm loss. Tăng cà phê.", "Debug bằng vịt cao su, theo nghĩa đen 🦆"]
  };
  var QUACK = {
    en: ["Quack. Have you tried printing the shape?", "Is it a leak? It's always a leak.", "Explain it to me line by line.", "Off-by-one. Probably.", "Check the random seed.", "Quack! (that means: read the error message)"],
    vi: ["Quạc. Thử in shape ra chưa?", "Có rò rỉ dữ liệu không? Lúc nào cũng là rò rỉ.", "Giải thích cho tớ từng dòng đi.", "Lệch một đơn vị. Chắc vậy.", "Kiểm tra random seed chưa?", "Quạc! (nghĩa là: đọc thông báo lỗi đi)"]
  };

  var lang = store.get("lang") || ((navigator.language || "").indexOf("vi") === 0 ? "vi" : "en");
  $$("[data-i18n]").forEach(function (el) { el.dataset.en = el.innerHTML; });
  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) {
      var k = el.dataset.i18n;
      el.innerHTML = lang === "vi" && VI[k] ? VI[k] : el.dataset.en;
    });
    $("#langBtn").textContent = lang === "vi" ? "EN" : "VI";
  }
  $("#langBtn").addEventListener("click", function () {
    lang = lang === "vi" ? "en" : "vi"; store.set("lang", lang); applyLang(); restartTyping();
  });
  applyLang();

  /* ───────── theme ───────── */
  $("#themeBtn").addEventListener("click", function () {
    var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    store.set("theme", t);
  });

  /* ───────── clock (Vietnam time) ───────── */
  function tick() {
    var s = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour12: false });
    $("#clock").textContent = s + " ICT";
  }
  tick(); setInterval(tick, 1000);

  /* ───────── ticker tape ───────── */
  var items = [
    ["FRAUD", "AUC-PR 0.504", "up", "▲14.3×"], ["LAWRAG", "2,041 chunks", "up", "▲"],
    ["MST", "N−1 edges", "up", "O(N²)"], ["ICPC", "3rd prize", "up", "🥉"],
    ["PYTORCH", "", "up", "▲"], ["LANGCHAIN", "", "up", "▲"], ["LIGHTGBM", "", "up", "▲"],
    ["QDRANT", "", "up", "▲"], ["SLEEP", "hours", "dn", "▼"], ["COFFEE", "cups", "up", "▲▲"],
    ["AWS", "2 certs", "up", "▲"], ["LATEX", "", "up", "▲"], ["BUGS", "", "dn", "▼ thanks 🦆"]
  ];
  var html = items.map(function (i) {
    return "<span><b>" + i[0] + "</b>" + (i[1] ? i[1] + " " : "") + '<em class="' + i[2] + '" style="font-style:normal">' + i[3] + "</em></span>";
  }).join("");
  $("#tape").innerHTML = html + html; // duplicated for seamless loop

  /* ───────── typing effect ───────── */
  var typedEl = $("#typed"), tTimer = null;
  function restartTyping() {
    clearTimeout(tTimer);
    var lines = TAG[lang], li = 0, ci = 0, del = false;
    (function step() {
      var line = lines[li];
      typedEl.textContent = line.slice(0, ci);
      if (!del && ci < line.length) { ci++; tTimer = setTimeout(step, 55); }
      else if (!del) { del = true; tTimer = setTimeout(step, 1400); }
      else if (ci > 0) { ci--; tTimer = setTimeout(step, 25); }
      else { del = false; li = (li + 1) % lines.length; tTimer = setTimeout(step, 300); }
    })();
  }
  restartTyping();

  /* ───────── KaTeX ───────── */
  function renderMath() {
    if (!window.katex) return setTimeout(renderMath, 150);
    $$(".formula[data-tex]").forEach(function (el) {
      try { window.katex.render(el.dataset.tex, el, { throwOnError: false, displayMode: false }); }
      catch (e) { el.textContent = el.dataset.tex; }
    });
  }
  window.addEventListener("load", renderMath);

  /* ───────── live MST (Prim, O(n²) per frame) ─────────
     Nodes drift randomly; every frame we rebuild the MST of the complete graph
     with Euclidean weights. The cursor is an extra node, so the tree rewires
     around it. Hub = max-degree node (amber).                                */
  var cv = $("#mst"), ctx = cv.getContext("2d");
  var LABELS = ["Python", "PyTorch", "LangChain", "RAG", "Qdrant", "BGE-M3", "LightGBM", "SHAP",
    "XGBoost", "pandas", "NumPy", "MST", "Prim", "Kruskal", "Union-Find", "C++", "ICPC",
    "LaTeX", "AWS", "Streamlit", "Fraud", "SAR", "Markowitz", "BM25", "Colab", "Git"];
  var nodes = [], mouse = null, hover = -1, W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!nodes.length) {
      nodes = LABELS.map(function (l) {
        return { x: 30 + Math.random() * (W - 60), y: 30 + Math.random() * (H - 60),
                 vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, label: l };
      });
    }
  }
  function prim(pts) {
    var n = pts.length, inT = new Array(n).fill(false), best = new Array(n).fill(Infinity),
        par = new Array(n).fill(-1), edges = [], total = 0;
    best[0] = 0;
    for (var k = 0; k < n; k++) {
      var u = -1;
      for (var i = 0; i < n; i++) if (!inT[i] && (u < 0 || best[i] < best[u])) u = i;
      inT[u] = true;
      if (par[u] >= 0) { edges.push([par[u], u, best[u]]); total += best[u]; }
      for (var v = 0; v < n; v++) {
        if (inT[v]) continue;
        var d = Math.hypot(pts[u].x - pts[v].x, pts[u].y - pts[v].y);
        if (d < best[v]) { best[v] = d; par[v] = u; }
      }
    }
    return { edges: edges, total: total };
  }
  cv.addEventListener("mousemove", function (e) {
    var r = cv.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top, label: "you" };
  });
  cv.addEventListener("mouseleave", function () { mouse = null; });
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame() {
    var acc = css("--acc"), amb = css("--amb"), edge = css("--edge"), fg = css("--fg"), mute = css("--mute");
    nodes.forEach(function (p) {
      if (!reduce) {
        p.vx += (Math.random() - .5) * .04; p.vy += (Math.random() - .5) * .04;
        p.vx = Math.max(-.5, Math.min(.5, p.vx)); p.vy = Math.max(-.5, Math.min(.5, p.vy));
        p.x += p.vx; p.y += p.vy;
      }
      if (p.x < 16 || p.x > W - 16) p.vx *= -1;
      if (p.y < 16 || p.y > H - 16) p.vy *= -1;
      p.x = Math.max(16, Math.min(W - 16, p.x)); p.y = Math.max(16, Math.min(H - 16, p.y));
    });
    var pts = mouse ? nodes.concat([mouse]) : nodes;
    var res = prim(pts), deg = new Array(pts.length).fill(0);
    res.edges.forEach(function (e) { deg[e[0]]++; deg[e[1]]++; });
    var hub = deg.indexOf(Math.max.apply(null, deg));

    hover = -1;
    if (mouse) nodes.forEach(function (p, i) { if (Math.hypot(p.x - mouse.x, p.y - mouse.y) < 14) hover = i; });

    ctx.clearRect(0, 0, W, H);
    res.edges.forEach(function (e) {
      var a = pts[e[0]], b = pts[e[1]], touch = (mouse && (a === mouse || b === mouse)) || e[0] === hover || e[1] === hover;
      ctx.strokeStyle = touch ? acc : edge;
      ctx.lineWidth = touch ? 2 : 1.4;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.font = "11px 'JetBrains Mono', monospace";
    pts.forEach(function (p, i) {
      var isHub = i === hub, isMouse = p === mouse;
      ctx.fillStyle = isMouse ? amb : isHub ? amb : acc;
      ctx.beginPath(); ctx.arc(p.x, p.y, isHub ? 6 : isMouse ? 5 : 3.6, 0, Math.PI * 2); ctx.fill();
      if (true) {
        ctx.fillStyle = i === hover || isMouse ? fg : mute;
        ctx.fillText(p.label, p.x + 8, p.y - 8);
      }
    });
    $("#mstStat").textContent = "n=" + pts.length + " · |E|=" + res.edges.length + " · Σw=" + (res.total / 100).toFixed(2);
    requestAnimationFrame(frame);
  }
  resize(); window.addEventListener("resize", function () { resize(); });
  requestAnimationFrame(frame);

  /* ───────── reveal on scroll ───────── */
  var targets = $$(".section h2, .panel:not(.hero-graph)");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12 });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }

  /* ───────── copy email ───────── */
  $$(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var done = function () { b.textContent = lang === "vi" ? "đã chép ✓" : "copied ✓"; setTimeout(function () { b.textContent = "copy"; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done); else done();
    });
  });

  /* ───────── the duck ───────── */
  var bubble = $("#bubble"), bTimer = null, qi = 0, actx = null;
  function quack() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = "sawtooth";
      o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(260, t + .16);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t + .2);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .22);
    } catch (e) {}
  }
  $("#duck").addEventListener("click", function () {
    quack();
    var arr = QUACK[lang]; bubble.textContent = "🦆 " + arr[qi++ % arr.length];
    bubble.classList.add("show");
    clearTimeout(bTimer); bTimer = setTimeout(function () { bubble.classList.remove("show"); }, 3200);
  });
})();
