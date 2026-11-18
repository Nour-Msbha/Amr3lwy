// رقم الواتساب بالصيغة الدولية بدون + أو أصفار (مثال مصر: 2010XXXXXXXX)
const WHATSAPP_NUMBER = "201000000000";

(function () {
  const KEY = "amr_elwy_cart";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  const $ = (s) => document.querySelector(s);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function render() {
    const box = $("#cart-items");
    let total = 0, count = 0;
    box.innerHTML = cart.length ? "" : '<p class="cart-empty">السلة فاضية</p>';
    cart.forEach((it, i) => {
      total += it.price * it.qty; count += it.qty;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `<img src="${esc(it.img)}" alt=""><div class="cart-item-details"><strong>${esc(it.name)}</strong><span>${it.price * it.qty} L.E</span><div class="quantity-controls"><button type="button" data-a="minus" data-i="${i}">−</button><span>${it.qty}</span><button type="button" data-a="plus" data-i="${i}">+</button></div></div>`;
      box.appendChild(row);
    });
    $("#cart-total").textContent = total;
    $("#cart-count").textContent = count;
    save();
  }

  document.addEventListener("click", (e) => {
    const add = e.target.closest(".add-btn");
    if (add) {
      const name = add.dataset.name, price = Number(add.dataset.price);
      const found = cart.find((c) => c.name === name);
      if (found) found.qty++; else cart.push({ name, price, img: add.dataset.img, qty: 1 });
      render();
      add.textContent = "تمت الإضافة ✓";
      setTimeout(() => (add.textContent = "أضف إلى السلة"), 900);
      return;
    }
    const q = e.target.closest(".quantity-controls button");
    if (q) {
      const i = Number(q.dataset.i);
      cart[i].qty += q.dataset.a === "plus" ? 1 : -1;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      render();
    }
  });

  const modal = $("#cart-modal");
  const openCart = () => { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); };
  const closeCart = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
  $("#cart-btn").addEventListener("click", openCart);
  $(".cart-close").addEventListener("click", closeCart);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeCart(); });
  $("#clear-cart").addEventListener("click", () => { cart = []; render(); });

  $("#whatsapp-submit-btn").addEventListener("click", () => {
    if (!cart.length) { alert("السلة فاضية"); return; }
    const name = $("#customerName").value.trim(), addr = $("#customerAddress").value.trim();
    if (!name || !addr) { alert("من فضلك اكتب الاسم والعنوان"); return; }
    let total = 0;
    const lines = cart.map((c) => { total += c.price * c.qty; return `• ${c.name} × ${c.qty} = ${c.price * c.qty} L.E`; });
    const msg = `طلب جديد - AMR & ELWY\n\n${lines.join("\n")}\n\nالإجمالي: ${total} L.E\nالاسم: ${name}\nالعنوان: ${addr}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  // side menu
  const side = $("#sideMenu");
  $("#menuTogg").addEventListener("click", () => side.classList.toggle("open"));
  $("#closeMenu").addEventListener("click", () => side.classList.remove("open"));
  side.addEventListener("click", (e) => { if (e.target.tagName === "A") side.classList.remove("open"); });

  // search
  function search() {
    const term = $("#searchInput").value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll(".product-item").forEach((p) => {
      const ok = !term || p.dataset.name.toLowerCase().includes(term);
      p.style.display = ok ? "" : "none"; if (ok) shown++;
    });
    document.querySelectorAll(".menu-section-title").forEach((h) => {
      const grid = h.nextElementSibling;
      const any = grid && [...grid.children].some((c) => c.style.display !== "none");
      h.style.display = any ? "" : "none"; grid.style.display = any ? "" : "none";
    });
    const nr = $("#no-results"); if (nr) nr.hidden = shown > 0 || !document.querySelector(".product-item");
  }
  $("#searchInput").addEventListener("input", search);
  $("#searchBtn").addEventListener("click", search);
  render();
})();
