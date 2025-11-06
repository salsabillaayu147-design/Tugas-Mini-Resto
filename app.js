// app.js - logika Mini Resto App

const formMenu = document.getElementById("formMenu");
const menuList = document.getElementById("menuList");
const orderList = document.getElementById("orderList");
const totalHarga = document.getElementById("totalHarga");

let menuData = [];
// Pesanan sekarang menyimpan objek { menu: {nama, harga, ...}, kuantitas: N }
let pesanan = []; 

// Fungsi format angka ke format Rupiah pakai titik ribuan (selalu 3 digit di belakang nol)
function formatRupiah(angka) {
  return angka.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
  });
}

formMenu.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const harga = parseInt(document.getElementById("harga").value);
  const deskripsi = document.getElementById("deskripsi").value;
  const foto = document.getElementById("foto").value || "https://via.placeholder.com/150";

  // Tambahkan ID unik untuk identifikasi
  const id = Date.now(); 
  menuData.push({ id, nama, harga, deskripsi, foto }); 
  renderMenu();

  formMenu.reset();
});

function renderMenu() {
  menuList.innerHTML = "";
  menuData.forEach((menu) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4 text-black flex flex-col";

    card.innerHTML = `
      <img src="${menu.foto}" alt="${menu.nama}" class="w-full h-40 object-cover rounded mb-3">
      <h3 class="text-lg font-semibold">${menu.nama}</h3>
      <p class="text-sm text-gray-700">${menu.deskripsi}</p>
      <p class="font-bold text-blue-700 mt-2">Rp ${formatRupiah(menu.harga)}</p>
      <button class="bg-amber-700 text-white rounded p-2 mt-3 hover:bg-amber-800" data-menu-id="${menu.id}">
        Tambah ke Pesanan
      </button>
    `;

    const btnPesan = card.querySelector("button");
    btnPesan.addEventListener("click", () => tambahPesanan(menu.id)); 

    menuList.appendChild(card);
  });
}

function findMenuById(id) {
    const menuIdInt = parseInt(id); 
    return menuData.find(menu => menu.id === menuIdInt);
}

function tambahPesanan(menuId) {
  const existingItem = pesanan.find(item => item.menu.id === menuId);

  if (existingItem) {
    existingItem.kuantitas++;
  } else {
    const menu = findMenuById(menuId);
    if (menu) {
      pesanan.push({ menu: menu, kuantitas: 1 });
    }
  }
  renderPesanan();
}

function updateKuantitas(menuId, change) {
    const item = pesanan.find(item => item.menu.id === menuId);

    if (item) {
        item.kuantitas += change;

        if (item.kuantitas <= 0) {
            hapusItemPesanan(menuId);
        } else {
            renderPesanan();
        }
    }
}

function hapusItemPesanan(menuId) {
    pesanan = pesanan.filter(item => item.menu.id !== menuId);
    renderPesanan();
}

function renderPesanan() {
  orderList.innerHTML = "";
  let total = 0;

  pesanan.forEach((item) => {
    // Hitung total
    const subtotal = item.menu.harga * item.kuantitas;
    total += subtotal;

    const li = document.createElement("li");
    // Menggunakan flexbox untuk memposisikan konten kiri (nama/harga) dan kontrol kanan (tombol)
    li.className = "flex justify-between items-center py-2 border-b border-amber-200 last:border-b-0"; 
    
    // Konten Kiri (Nama dan Harga x Kuantitas)
    const leftContent = document.createElement('div');
    leftContent.innerHTML = `
        <p class="font-semibold text-pink-800">${item.menu.nama}</p>
        <p class="text-gray-600 text-sm">Rp ${formatRupiah(item.menu.harga)} &times; ${item.kuantitas}</p>
    `;
    
    // Kontrol Kanan (Tombol -, +, Hapus)
    const rightControls = document.createElement('div');
    rightControls.className = 'flex items-center space-x-2';
    rightControls.innerHTML = `
      <button data-id="${item.menu.id}" data-action="decrement"
        class="bg-pink-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-pink-600 active:scale-95 text-xl leading-none p-0 focus:outline-none font-bold">
        -
      </button>
      <button data-id="${item.menu.id}" data-action="increment"
        class="bg-pink-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-pink-600 active:scale-95 text-xl leading-none p-0 focus:outline-none font-bold">
        +
      </button>
      <button data-id="${item.menu.id}" data-action="delete" 
        class="bg-red-600 text-white rounded p-2 hover:bg-red-700 font-semibold">
        Hapus
      </button>
    `;

    // Gabungkan ke LI
    li.appendChild(leftContent);
    li.appendChild(rightControls);

    // Tambahkan event listener untuk tombol aksi
    rightControls.querySelectorAll("button").forEach(btn => {
        const menuId = parseInt(btn.getAttribute("data-id"));
        const action = btn.getAttribute("data-action");

        btn.addEventListener("click", () => {
            if (action === "increment") {
                updateKuantitas(menuId, 1);
            } else if (action === "decrement") {
                updateKuantitas(menuId, -1);
            } else if (action === "delete") {
                hapusItemPesanan(menuId);
            }
        });
    });

    orderList.appendChild(li);
  });

  // Pastikan format total harga sesuai gambar
  totalHarga.textContent = `Total: Rp ${formatRupiah(total)}`;
}

// Inisialisasi tampilan awal
renderMenu();
renderPesanan();