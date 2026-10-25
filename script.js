const tanggalPernikahan = new Date(2026, 11, 20, 8, 0, 0);
const daftarNamaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function formatDuaAngka(angka) {
  if (angka < 10) {
    return "0" + angka;
  }
  return angka;
}

const daftarElemenAnimasi = document.querySelectorAll(
  "main section h2, main section h3, main section p, main section figure, main section img, " +
  "main section article, main section li, main section .kalender-bulanan, main section table, " +
  "main section .tautan-instagram, main section .btn, main section .teks-label-kecil"
);

const pengamatMunculElemen = new IntersectionObserver(function (daftarPengamatan) {
  daftarPengamatan.forEach(function (pengamatan) {
    if (pengamatan.isIntersecting) {
      pengamatan.target.classList.add("animasi-tampil");
      pengamatMunculElemen.unobserve(pengamatan.target);
    }
  });
}, { threshold: 0.12 });

daftarElemenAnimasi.forEach(function (elemen) {
  elemen.classList.add("animasi-tersembunyi");
  if (!elemen.closest("#bagian-pembuka")) {
    pengamatMunculElemen.observe(elemen);
  }
});

const namaTamuDariAlamat = new URLSearchParams(location.search).get("to");
if (namaTamuDariAlamat) {
  document.getElementById("nama-tamu-undangan").textContent = namaTamuDariAlamat;
}

function perbaruiHitungMundur() {
  const sisaWaktu = tanggalPernikahan - new Date();
  if (sisaWaktu <= 0) {
    document.getElementById("pesan-hitung-mundur-selesai").classList.remove("d-none");
    return;
  }
  document.getElementById("hitung-mundur-hari").textContent = formatDuaAngka(Math.floor(sisaWaktu / 86400000));
  document.getElementById("hitung-mundur-jam").textContent = formatDuaAngka(Math.floor((sisaWaktu % 86400000) / 3600000));
  document.getElementById("hitung-mundur-menit").textContent = formatDuaAngka(Math.floor((sisaWaktu % 3600000) / 60000));
  document.getElementById("hitung-mundur-detik").textContent = formatDuaAngka(Math.floor((sisaWaktu % 60000) / 1000));
}
perbaruiHitungMundur();
setInterval(perbaruiHitungMundur, 1000);

const bulanPernikahan = tanggalPernikahan.getMonth();
const tahunPernikahan = tanggalPernikahan.getFullYear();
const hariPertamaBulan = new Date(tahunPernikahan, bulanPernikahan, 1).getDay();
const jumlahHariDalamBulan = new Date(tahunPernikahan, bulanPernikahan + 1, 0).getDate();

let isiKalenderBulan = "";
["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].forEach(function (namaHari) {
  isiKalenderBulan += "<span>" + namaHari + "</span>";
});
for (let kotakKosong = 0; kotakKosong < hariPertamaBulan; kotakKosong++) {
  isiKalenderBulan += "<span></span>";
}
for (let tanggal = 1; tanggal <= jumlahHariDalamBulan; tanggal++) {
  if (tanggal === tanggalPernikahan.getDate()) {
    isiKalenderBulan += '<span class="tanggal-hari-pernikahan">' + tanggal + "</span>";
  } else {
    isiKalenderBulan += "<span>" + tanggal + "</span>";
  }
}
document.getElementById("kalender-nama-bulan").textContent = daftarNamaBulan[bulanPernikahan] + " " + tahunPernikahan;
document.getElementById("kalender-kotak-tanggal").innerHTML = isiKalenderBulan;

const pemutarMusik = document.getElementById("pemutar-musik");
const tombolMusik = document.getElementById("tombol-musik");
pemutarMusik.volume = 1.0;

pemutarMusik.addEventListener("play", function () {
  tombolMusik.classList.add("sedang-aktif");
  tombolMusik.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
});
pemutarMusik.addEventListener("pause", function () {
  tombolMusik.classList.remove("sedang-aktif");
  tombolMusik.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
});
tombolMusik.addEventListener("click", function () {
  if (pemutarMusik.paused) {
    pemutarMusik.play();
  } else {
    pemutarMusik.pause();
  }
});

const tombolGulirOtomatis = document.getElementById("tombol-gulir-otomatis");
let penghitungGulirOtomatis = null;
let posisiGulirTerakhir = 0;

function hentikanGulirOtomatis() {
  clearInterval(penghitungGulirOtomatis);
  penghitungGulirOtomatis = null;
  document.documentElement.classList.remove("sedang-gulir-otomatis");
  tombolGulirOtomatis.classList.remove("sedang-aktif");
  tombolGulirOtomatis.innerHTML = '<i class="bi bi-chevron-double-down"></i>';
}

function mulaiGulirOtomatis() {
  posisiGulirTerakhir = window.scrollY;
  document.documentElement.classList.add("sedang-gulir-otomatis");
  tombolGulirOtomatis.classList.add("sedang-aktif");
  tombolGulirOtomatis.innerHTML = '<i class="bi bi-pause-fill"></i>';

  penghitungGulirOtomatis = setInterval(function () {
    const sudahDiDasarHalaman = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    const digulirOlehPengguna = Math.abs(window.scrollY - posisiGulirTerakhir) > 3;
    if (sudahDiDasarHalaman || digulirOlehPengguna) {
      hentikanGulirOtomatis();
      return;
    }
    window.scrollBy(0, 1);
    posisiGulirTerakhir = window.scrollY;
  }, 22);
}

tombolGulirOtomatis.addEventListener("click", function () {
  if (penghitungGulirOtomatis) {
    hentikanGulirOtomatis();
  } else {
    mulaiGulirOtomatis();
  }
});
window.addEventListener("wheel", hentikanGulirOtomatis);
window.addEventListener("touchmove", hentikanGulirOtomatis);

const tombolKembaliKeAtas = document.getElementById("tombol-kembali-ke-atas");
window.addEventListener("scroll", function () {
  tombolKembaliKeAtas.classList.toggle("tampil", window.scrollY > 400);
});
tombolKembaliKeAtas.addEventListener("click", function () {
  hentikanGulirOtomatis();
  window.scrollTo(0, 0);
});

document.getElementById("tombol-buka-undangan").addEventListener("click", function () {
  document.getElementById("bagian-sampul").classList.add("sampul-terbuka");
  document.body.classList.remove("halaman-terkunci");
  document.getElementById("wadah-tombol-melayang").classList.add("tampil");
  pemutarMusik.play();
  window.scrollTo(0, 0);

  document.querySelectorAll("#bagian-pembuka .animasi-tersembunyi").forEach(function (elemen, urutan) {
    setTimeout(function () {
      elemen.classList.add("animasi-tampil");
    }, 650 + urutan * 220);
  });
});

const tampilanFotoBesar = document.getElementById("tampilan-foto-besar");
const fotoDiperbesar = document.getElementById("foto-diperbesar");

document.querySelectorAll("#bagian-galeri img").forEach(function (fotoGaleri) {
  fotoGaleri.addEventListener("click", function () {
    fotoDiperbesar.src = fotoGaleri.src;
    tampilanFotoBesar.classList.add("tampilan-foto-besar-terbuka");
  });
});
tampilanFotoBesar.addEventListener("click", function () {
  tampilanFotoBesar.classList.remove("tampilan-foto-besar-terbuka");
});

const daftarUcapanDoa = document.getElementById("daftar-ucapan-doa");
const pesanBelumAdaUcapan = document.getElementById("pesan-belum-ada-ucapan");

document.getElementById("formulir-kehadiran").addEventListener("submit", function (kejadian) {
  kejadian.preventDefault();

  const isianNamaTamu = document.getElementById("isian-nama-tamu");
  const isianUcapanDoa = document.getElementById("isian-ucapan-doa");
  const pilihanKehadiran = document.querySelector('input[name="status-kehadiran"]:checked');
  const namaKosong = isianNamaTamu.value.trim() === "";
  const ucapanKosong = isianUcapanDoa.value.trim() === "";

  isianNamaTamu.classList.toggle("is-invalid", namaKosong);
  isianUcapanDoa.classList.toggle("is-invalid", ucapanKosong);
  document.getElementById("pesan-kesalahan-kehadiran").classList.toggle("d-block", !pilihanKehadiran);
  if (namaKosong || ucapanKosong || !pilihanKehadiran) {
    return;
  }

  const waktuKirim = new Date();
  const kartuUcapanDoa = document.createElement("div");
  kartuUcapanDoa.className = "kartu-ucapan-doa";
  kartuUcapanDoa.innerHTML = "<strong></strong><small></small><p></p>";
  kartuUcapanDoa.children[0].textContent = isianNamaTamu.value.trim() + " (" + pilihanKehadiran.value + ", " + document.getElementById("isian-jumlah-tamu").value + " tamu)";
  kartuUcapanDoa.children[1].textContent = waktuKirim.getDate() + " " + daftarNamaBulan[waktuKirim.getMonth()] + " " + waktuKirim.getFullYear() + ", " + formatDuaAngka(waktuKirim.getHours()) + "." + formatDuaAngka(waktuKirim.getMinutes());
  kartuUcapanDoa.children[2].textContent = isianUcapanDoa.value.trim();

  pesanBelumAdaUcapan.remove();
  daftarUcapanDoa.prepend(kartuUcapanDoa);
  kejadian.target.reset();
});

document.querySelectorAll(".tombol-salin-nomor").forEach(function (tombolSalin) {
  tombolSalin.addEventListener("click", function () {
    const nomorRekening = tombolSalin.parentElement.querySelector(".nomor-rekening").textContent.replaceAll(" ", "");
    navigator.clipboard.writeText(nomorRekening);
    alert("Nomor berhasil disalin: " + nomorRekening);
  });
});