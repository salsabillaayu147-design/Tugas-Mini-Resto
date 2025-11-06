// app.js - logika Mini Resto App

const formMenu = document.getElementById("formMenu");
const menuList = document.getElementById("menuList");
const orderList = document.getElementById("orderList");
const totalHarga = document.getElementById("totalHarga");

// 🍔 Data menu awal (3 Menu Tetap)
let menuData = [
  {
    nama: "Nasi Goreng Spesial",
    harga: 25000,
    deskripsi: "Nasi goreng dengan bumbu rempah khas, telur, dan irisan ayam.",
    foto: "https://images.unsplash.com/photo-1572656631137-7935297cefa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    nama: "Mie Ayam Bakso",
    harga: 22000,
    deskripsi: "Mie kenyal dengan topping ayam bumbu manis, sawi, dan bakso sapi.",
    foto: "https://images.unsplash.com/photo-1594916894086-fe1e39a349b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
  {
    nama: "Es Teh Manis Jumbo",
    harga: 8000,
    deskripsi: "Minuman segar pelepas dahaga, porsi besar.",
    foto: "https://images.unsplash.com/photo-1616790901502-3c1a7d6e4092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
  },
];
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
  const foto =
    document.getElementById("foto").value || "https://via.placeholder.com/150";

  menuData.push({ nama, harga, deskripsi, foto });
  renderMenu();

  formMenu.reset();
});

function renderMenu() {
  menuList.innerHTML = "";
  menuData.forEach((menu, index) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow p-4 text-black flex flex-col cursor-pointer"; // Tambah cursor-pointer
      
    // Tambahkan class Tailwind untuk mengubah warna harga
    const priceColor = index % 2 === 0 ? "text-amber-700" : "text-green-700"; 

    card.innerHTML = `
<img src="${menu.foto}" alt="${menu.nama}" class="w-full h-40 object-cover rounded mb-3">
<h3 class="text-lg font-semibold text-amber-900">${menu.nama}</h3>
<p class="text-sm text-gray-700 flex-grow">${menu.deskripsi}</p>
<p class="font-bold ${priceColor} mt-2 text-xl">Rp ${formatRupiah(
      menu.harga
    )}</p>
<button class="bg-amber-700 text-white rounded p-2 mt-3 hover:bg-amber-800">
Tambah ke Pesanan
</button>
`;

    const btnPesan = card.querySelector("button");
    btnPesan.addEventListener("click", () => tambahPesanan(index));

    menuList.appendChild(card);
  });
}

function tambahPesanan(index) {
  // Hanya ambil data yang diperlukan dari menuData
  const itemBaru = {
    nama: menuData[index].nama,
    harga: menuData[index].harga,
  };
  pesanan.push(itemBaru);
  renderPesanan();
}

function renderPesanan() {
  orderList.innerHTML = "";
  let total = 0;

  pesanan.forEach((item, i) => {
    total += item.harga;

    const li = document.createElement("li");
    li.className = "flex justify-between items-center py-2";

    li.innerHTML = `
<span>${item.nama} - **Rp ${formatRupiah(item.harga)}**</span>
<button class="bg-orange-600 text-white text-sm rounded px-3 py-1 hover:bg-orange-700">❌ Hapus</button>
`;

    li.querySelector("button").addEventListener("click", () => {
      // Hapus item dari array pesanan berdasarkan index (i)
      pesanan.splice(i, 1);
      renderPesanan();
    });

    orderList.appendChild(li);
  });

  totalHarga.textContent = `💰 Total: Rp ${formatRupiah(total)}`;
}

// Fungsi inisialisasi: Panggil renderMenu() untuk menampilkan 3 menu tetap saat aplikasi dimuat
function init() {
  renderMenu();
}

// Panggil init
init();
