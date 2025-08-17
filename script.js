 // --- Sample Data ---
      const products = [
        {
          id: 1,
          name: "iPhone 14",
          cat: "electronics",
          brand: "Apple",
          price: 999,
          old: 1099,
          off: 10,
          rate: 4.7,
          desc: 'Apple A15 • 128GB • 6.1"',
          img: "📱",
        },
        {
          id: 2,
          name: "Galaxy S23",
          cat: "electronics",
          brand: "Samsung",
          price: 849,
          old: 949,
          off: 11,
          rate: 4.6,
          desc: 'Snapdragon • 256GB • 6.1"',
          img: "📱",
        },
        {
          id: 3,
          name: "Xiaomi 13",
          cat: "electronics",
          brand: "Xiaomi",
          price: 699,
          old: 799,
          off: 13,
          rate: 4.4,
          desc: 'Snapdragon • 256GB • 6.7"',
          img: "📱",
        },
        {
          id: 4,
          name: "Sony WH-1000XM4",
          cat: "electronics",
          brand: "Sony",
          price: 299,
          old: 349,
          off: 14,
          rate: 4.8,
          desc: "ANC Headphones",
          img: "🎧",
        },
        {
          id: 5,
          name: "Nike Air Max",
          cat: "fashion",
          brand: "Nike",
          price: 149,
          old: 199,
          off: 25,
          rate: 4.5,
          desc: "Running Shoes",
          img: "👟",
        },
        {
          id: 6,
          name: "Adidas Ultraboost",
          cat: "fashion",
          brand: "Adidas",
          price: 159,
          old: 219,
          off: 27,
          rate: 4.4,
          desc: "Comfort Sneakers",
          img: "👟",
        },
        {
          id: 7,
          name: "T‑Shirt Pack",
          cat: "fashion",
          brand: "Nike",
          price: 39,
          old: 59,
          off: 34,
          rate: 4.1,
          desc: "Cotton Tees (3pcs)",
          img: "👕",
        },
        {
          id: 8,
          name: "Olive Oil 2L",
          cat: "grocery",
          brand: "—",
          price: 19,
          old: 25,
          off: 24,
          rate: 4.2,
          desc: "Extra Virgin",
          img: "🫒",
        },
        {
          id: 9,
          name: "Basmati Rice 5kg",
          cat: "grocery",
          brand: "—",
          price: 12,
          old: 16,
          off: 25,
          rate: 4.0,
          desc: "Premium Long Grain",
          img: "🍚",
        },
        {
          id: 10,
          name: 'Sony Bravia 55"',
          cat: "electronics",
          brand: "Sony",
          price: 899,
          old: 1099,
          off: 18,
          rate: 4.5,
          desc: "4K HDR Smart TV",
          img: "📺",
        },
        {
          id: 11,
          name: "Lenovo Legion 5",
          cat: "electronics",
          brand: "Lenovo",
          price: 1199,
          old: 1399,
          off: 14,
          rate: 4.6,
          desc: "Ryzen 7 • RTX 3060",
          img: "💻",
        },
        {
          id: 12,
          name: "Adidas Cap",
          cat: "fashion",
          brand: "Adidas",
          price: 25,
          old: 35,
          off: 29,
          rate: 4.0,
          desc: "Sport Cap",
          img: "🧢",
        },
      ];

      // --- State ---
      let state = {
        maxPrice: 2000,
        cats: new Set(["electronics", "fashion", "grocery"]),
        brands: new Set(),
        minRate: 0,
        sort: "pop",
        page: 1,
        perPage: 8,
        listView: false,
        cart: {}, // id -> qty
        wishlist: new Set(),
        coupon: null,
        shipping: 0,
        lang: "bn",
        mode: "dark",
      };

      // --- Helpers ---
      const $ = (q) => document.querySelector(q);
      const $$ = (q) => Array.from(document.querySelectorAll(q));
      const money = (n) => `$${n.toFixed(2)}`;

      function toast(msg) {
        const box = document.createElement("div");
        box.className = "t";
        box.textContent = msg;
        $("#toast").appendChild(box);
        setTimeout(() => {
          box.style.opacity = ".6";
        }, 2500);
        setTimeout(() => {
          box.remove();
        }, 3500);
      }

      function updateCounts() {
        const cartCount = Object.values(state.cart).reduce((a, b) => a + b, 0);
        $("#cartCount").textContent = cartCount;
        $("#cartCountSticky").textContent = cartCount;
        $("#wishCount").textContent = state.wishlist.size;
      }

      function filtered() {
        let list = products.filter(
          (p) =>
            p.price <= state.maxPrice &&
            state.cats.has(p.cat) &&
            p.rate >= state.minRate
        );
        if (state.brands.size)
          list = list.filter((p) => state.brands.has(p.brand));
        const q = $("#search").value.trim().toLowerCase();
        if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
        switch (state.sort) {
          case "lh":
            list.sort((a, b) => a.price - b.price);
            break;
          case "hl":
            list.sort((a, b) => b.price - a.price);
            break;
          case "new":
            list.sort((a, b) => b.id - a.id);
            break;
          default:
            list.sort((a, b) => b.rate - a.rate);
        }
        return list;
      }

      function renderGrid() {
        const list = filtered();
        const start = 0,
          end = state.page * state.perPage;
        $("#countInfo").textContent = `${list.length} products found`;
        const target = $("#grid");
        target.innerHTML = "";
        target.style.display = "grid";
        target.style.gridTemplateColumns = state.listView ? "1fr" : "";
        list.slice(start, end).forEach((p) => {
          const el = document.createElement("div");
          el.className = "product";
          if (state.listView) el.style.flexDirection = "row";
          el.innerHTML = `
          <div class="img">${p.img}</div>
          <div class="body">
            <div style="display:flex;gap:6px;align-items:center;justify-content:space-between">
              <strong>${p.name}</strong>
              <button class="btn ghost sm" data-qv="${p.id}">Quick View</button>
            </div>
            <div class="muted">${p.brand} • ${p.cat}</div>
            <div class="price"><strong>${money(p.price)}</strong> <del>${money(
            p.old
          )}</del> <span class="off">-${p.off}%</span></div>
            <div class="rate">⭐ ${p.rate}</div>
            <div class="row" style="gap:6px">
              <button class="btn" data-add="${p.id}">Add to Cart</button>
              <button class="btn ghost" data-wish="${p.id}">♥</button>
            </div>
          </div>`;
          target.appendChild(el);
        });
      }

      function openDrawer(id) {
        $("#overlay").style.display = "block";
        $(id).classList.add("open");
      }
      function closeDrawers() {
        $("#overlay").style.display = "none";
        ["#cartDrawer", "#wishDrawer"].forEach((i) =>
          $(i).classList.remove("open")
        );
      }

      function renderCart() {
        const wrap = $("#cartItems");
        wrap.innerHTML = "";
        let sub = 0;
        Object.entries(state.cart).forEach(([id, qty]) => {
          const p = products.find((x) => x.id == id);
          const line = p.price * qty;
          sub += line;
          const row = document.createElement("div");
          row.className = "cart-item";
          row.innerHTML = `
          <div class="img">${p.img}</div>
          <div>
            <div style="display:flex;justify-content:space-between;gap:8px">
              <strong>${p.name}</strong>
              <button class="btn ghost" data-remove="${p.id}">Remove</button>
            </div>
            <div class="muted">${p.brand} • ${p.cat}</div>
            <div class="price"><strong>${money(p.price)}</strong></div>
          </div>
          <div class="qty">
            <button data-dec="${p.id}">−</button>
            <input value="${qty}" readonly />
            <button data-inc="${p.id}">+</button>
          </div>`;
          wrap.appendChild(row);
        });
        const ship = sub > 0 ? (sub > 500 ? 0 : 20) : 0;
        const disc = state.coupon === "SAVE10" ? Math.min(50, sub * 0.1) : 0;
        $("#subTotal").textContent = money(sub);
        $("#ship").textContent = money(ship);
        $("#disc").textContent = money(disc);
        $("#grand").textContent = money(Math.max(0, sub + ship - disc));
      }

      function renderWishlist() {
        const wrap = $("#wishItems");
        wrap.innerHTML = "";
        state.wishlist.forEach((id) => {
          const p = products.find((x) => x.id == id);
          const row = document.createElement("div");
          row.className = "cart-item";
          row.innerHTML = `
          <div class="img">${p.img}</div>
          <div>
            <strong>${p.name}</strong>
            <div class="muted">${p.brand} • ${p.cat}</div>
            <div class="price"><strong>${money(p.price)}</strong></div>
          </div>
          <div class="row" style="gap:6px">
            <button class="btn" data-add="${p.id}">Add</button>
            <button class="btn ghost" data-unwish="${p.id}">✖</button>
          </div>`;
          wrap.appendChild(row);
        });
      }

      // --- Event Listeners ---
      $("#priceRange").addEventListener("input", (e) => {
        state.maxPrice = +e.target.value;
        $("#priceLabel").textContent = `$0 - $${state.maxPrice}`;
        renderGrid();
      });
      $$(".cat").forEach((ch) =>
        ch.addEventListener("change", () => {
          state.cats = new Set(
            $$(".cat")
              .filter((c) => c.checked)
              .map((c) => c.value)
          );
          renderGrid();
        })
      );
      $$(".brand").forEach((ch) =>
        ch.addEventListener("change", () => {
          state.brands = new Set(
            $$(".brand")
              .filter((c) => c.checked)
              .map((c) => c.value)
          );
          renderGrid();
        })
      );
      $$('input[name="rate"]').forEach((r) =>
        r.addEventListener("change", () => {
          state.minRate = +document.querySelector('input[name="rate"]:checked')
            .value;
          renderGrid();
        })
      );
      $("#sort").addEventListener("change", (e) => {
        state.sort = e.target.value;
        renderGrid();
      });
      $("#gridBtn").addEventListener("click", () => {
        state.listView = false;
        renderGrid();
      });
      $("#listBtn").addEventListener("click", () => {
        state.listView = true;
        renderGrid();
      });
      $("#loadMore").addEventListener("click", () => {
        state.page++;
        renderGrid();
      });
      $("#clearFilters").addEventListener("click", () => {
        state.maxPrice = 2000;
        $("#priceRange").value = 2000;
        $("#priceLabel").textContent = "$0 - $2000";
        state.cats = new Set(["electronics", "fashion", "grocery"]);
        $$(".cat").forEach((c) => (c.checked = true));
        state.brands = new Set();
        $$(".brand").forEach((c) => (c.checked = false));
        state.minRate = 0;
        document.querySelector('input[name="rate"][value="0"]').checked = true;
        state.sort = "pop";
        $("#sort").value = "pop";
        state.page = 1;
        renderGrid();
      });

      // Search with simple instant filter
      $("#search").addEventListener("input", () => {
        state.page = 1;
        renderGrid();
      });

      // Flash sale button behavior (as per your earlier ask)
      $("#grabNow").addEventListener("click", () => {
        toast("নিচের সেকশন থেকে কিনে নেন বস");
        document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
      });

      // Open/close drawers
      $("#cartBtn").addEventListener("click", () => {
        renderCart();
        openDrawer("#cartDrawer");
      });
      $("#wishBtn").addEventListener("click", () => {
        renderWishlist();
        openDrawer("#wishDrawer");
      });
      $("#closeCart").addEventListener("click", closeDrawers);
      $("#closeWish").addEventListener("click", closeDrawers);
      $("#overlay").addEventListener("click", closeDrawers);
      $("#stickyCart").addEventListener("click", () => {
        renderCart();
        openDrawer("#cartDrawer");
      });

      // Add to cart / wishlist via delegation
      document.body.addEventListener("click", (e) => {
        const add = e.target.closest("[data-add]");
        const wish = e.target.closest("[data-wish]");
        const unwish = e.target.closest("[data-unwish]");
        const qv = e.target.closest("[data-qv]");
        const inc = e.target.closest("[data-inc]");
        const dec = e.target.closest("[data-dec]");
        const rem = e.target.closest("[data-remove]");

        if (add) {
          const id = +add.getAttribute("data-add");
          if (state.cart[id]) {
            // show special notification per your requirement
            toast(
              "প্রোডাক্ট এড করা আছে। উপরে ডান পাশের বাটন থেকে ক্লিক করে প্রোডাক্ট বাড়াও"
            );
          } else {
            state.cart[id] = 1;
            toast("Added to cart ✅");
          }
          updateCounts();
        }
        if (wish) {
          const id = +wish.getAttribute("data-wish");
          if (state.wishlist.has(id)) {
            state.wishlist.delete(id);
            toast("Removed from wishlist");
          } else {
            state.wishlist.add(id);
            toast("Added to wishlist ♥");
          }
          updateCounts();
        }
        if (unwish) {
          const id = +unwish.getAttribute("data-unwish");
          state.wishlist.delete(id);
          renderWishlist();
          updateCounts();
        }
        if (qv) {
          openQuick(+qv.getAttribute("data-qv"));
        }
        if (inc) {
          const id = +inc.getAttribute("data-inc");
          state.cart[id] = (state.cart[id] || 1) + 1;
          renderCart();
          updateCounts();
        }
        if (dec) {
          const id = +dec.getAttribute("data-dec");
          state.cart[id] = Math.max(1, (state.cart[id] || 1) - 1);
          renderCart();
          updateCounts();
        }
        if (rem) {
          const id = +rem.getAttribute("data-remove");
          delete state.cart[id];
          renderCart();
          updateCounts();
        }
      });

      // Coupon
      $("#applyCoupon").addEventListener("click", () => {
        const code = $("#coupon").value.trim().toUpperCase();
        if (code === "SAVE10") {
          state.coupon = code;
          toast("Coupon applied 🎉");
        } else {
          state.coupon = null;
          toast("Invalid coupon");
        }
        renderCart();
      });

      // Checkout flow
      $("#goCheckout").addEventListener("click", () => {
        openModal("#checkoutModal");
        highlightStep(1);
      });
      $("#closeCheckout").addEventListener("click", closeModalAll);
      $("#toStep2").addEventListener("click", () => {
        if (!$("#name").value || !$("#phone").value || !$("#addr").value) {
          toast("Fill all address fields");
          return;
        }
        showStep(2);
      });
      $("#back1").addEventListener("click", () => showStep(1));
      $("#toStep3").addEventListener("click", () => {
        buildReview();
        showStep(3);
      });
      $("#back2").addEventListener("click", () => showStep(2));
      $("#placeOrder").addEventListener("click", () => {
        toast("Order placed successfully ✅");
        closeModalAll();
        closeDrawers();
        state.cart = {};
        updateCounts();
        renderCart();
      });

      function buildReview() {
        const items = Object.entries(state.cart)
          .map(([id, qty]) => {
            const p = products.find((x) => x.id == id);
            return `${p.name} × ${qty} — ${money(p.price * qty)}`;
          })
          .join("<br/>");
        const sub = Object.entries(state.cart).reduce((a, [id, qty]) => {
          const p = products.find((x) => x.id == id);
          return a + p.price * qty;
        }, 0);
        const ship = sub > 0 ? (sub > 500 ? 0 : 20) : 0;
        const disc = state.coupon === "SAVE10" ? Math.min(50, sub * 0.1) : 0;
        const total = sub + ship - disc;
        $("#review").innerHTML = `
        <h4>Order Review</h4>
        <div class="muted" style="margin-bottom:8px">${
          items || "No items"
        }</div>
        <div>Pay Method: <strong>${$("#payMethod").value}</strong></div>
        <div>Ship To: <strong>${$("#name").value}, ${
          $("#phone").value
        }</strong><br/><span class="muted">${$("#addr").value}</span></div>
        <div style="border-top:1px dashed var(--border);margin-top:8px;padding-top:8px">Total: <strong>${money(
          total
        )}</strong></div>`;
      }

      function showStep(n) {
        ["#step1", "#step2", "#step3"].forEach(
          (s, i) => ($(s).style.display = i === n - 1 ? "block" : "none")
        );
        highlightStep(n);
      }
      function highlightStep(n) {
        $$(".step").forEach((el) =>
          el.classList.toggle("active", +el.dataset.step === n)
        );
      }

      // Quick view
      function openQuick(id) {
        const p = products.find((x) => x.id === id);
        $("#qTitle").textContent = p.name;
        $("#qImg").textContent = p.img;
        $("#qPrice").innerHTML = `<strong>${money(
          p.price
        )}</strong> <del>${money(p.old)}</del> <span class="off">-${
          p.off
        }%</span>`;
        $("#qDesc").textContent = p.desc;
        $("#qAdd").onclick = () => {
          if (state.cart[id]) {
            toast(
              "প্রোডাক্ট এড করা আছে। উপরে ডান পাশের বাটন থেকে ক্লিক করে প্রোডাক্ট বাড়াও"
            );
          } else {
            state.cart[id] = 1;
            toast("Added to cart ✅");
            updateCounts();
          }
        };
        $("#qWish").onclick = () => {
          if (state.wishlist.has(id)) {
            state.wishlist.delete(id);
            toast("Removed from wishlist");
          } else {
            state.wishlist.add(id);
            toast("Added to wishlist ♥");
          }
          updateCounts();
        };
        openModal("#quickModal");
      }

      function openModal(sel) {
        $("#overlay").style.display = "block";
        $(sel).style.display = "grid";
      }
      function closeModalAll() {
        $("#overlay").style.display = "none";
        ["#quickModal", "#checkoutModal"].forEach(
          (s) => ($(s).style.display = "none")
        );
      }
      $("#closeQuick").addEventListener("click", closeModalAll);

      // Newsletter
      $("#subBtn").addEventListener("click", () => {
        const v = $("#subEmail").value.trim();
        if (!v || !v.includes("@")) return toast("Enter a valid email");
        toast("Subscribed! 🎉");
        $("#subEmail").value = "";
      });

      // Language toggle (demo only)
      $("#langBtn").addEventListener("click", () => {
        state.lang = state.lang === "bn" ? "en" : "bn";
        toast(`Language: ${state.lang === "bn" ? "বাংলা" : "English"}`);
      });

      // Dark/Light mode (simple)
      $("#modeBtn").addEventListener("click", () => {
        if (state.mode === "dark") {
          state.mode = "light";
          document.documentElement.style.setProperty("--bg", "#f3f4f6");
          document.documentElement.style.setProperty("--card", "#ffffff");
          document.documentElement.style.setProperty("--text", "#0f172a");
          document.documentElement.style.setProperty("--border", "#e5e7eb");
        } else {
          state.mode = "dark";
          document.documentElement.style.setProperty("--bg", "#0f172a");
          document.documentElement.style.setProperty("--card", "#111827");
          document.documentElement.style.setProperty("--text", "#e5e7eb");
          document.documentElement.style.setProperty("--border", "#1f2937");
        }
      });

      // Init
      function init() {
        $("#priceLabel").textContent = "$0 - $2000";
        renderGrid();
        updateCounts();
      }
      init();