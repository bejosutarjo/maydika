// Paket ikon kategori marketplace: [emoji, grup, kata kunci pencarian]
const RAW: [string, string, string][] = [
  // Fashion
  ['👕', 'Fashion', 'baju kaos kemeja pakaian atasan t-shirt fashion'], ['👗', 'Fashion', 'gaun dress daster baju wanita'], ['👖', 'Fashion', 'celana jeans bawahan'],
  ['🩳', 'Fashion', 'celana pendek short'], ['🧥', 'Fashion', 'jaket jas hoodie sweater outer'], ['👔', 'Fashion', 'kemeja pria formal kantor'],
  ['🥻', 'Fashion', 'batik sari kebaya tradisional'], ['🧕', 'Fashion', 'hijab jilbab kerudung muslimah'], ['👟', 'Fashion', 'sepatu sneakers kets'],
  ['👠', 'Fashion', 'sepatu hak heels sandal wanita'], ['🥾', 'Fashion', 'sepatu gunung boots hiking'], ['👜', 'Fashion', 'tas wanita handbag dompet'],
  ['🎒', 'Fashion', 'tas ransel backpack sekolah'], ['🧢', 'Fashion', 'topi cap'], ['🕶️', 'Fashion', 'kacamata sunglasses'],
  ['⌚', 'Fashion', 'jam tangan watch'], ['💍', 'Fashion', 'perhiasan cincin emas aksesoris'], ['🧣', 'Fashion', 'syal scarf'],
  ['🧦', 'Fashion', 'kaos kaki'], ['👙', 'Fashion', 'baju renang bikini pakaian dalam'], ['💎', 'Fashion', 'berlian permata perhiasan mewah'],
  // Elektronik
  ['📱', 'Elektronik', 'hp handphone smartphone telepon gadget'], ['💻', 'Elektronik', 'laptop komputer notebook'], ['🖥️', 'Elektronik', 'monitor pc desktop'],
  ['⌨️', 'Elektronik', 'keyboard'], ['🖱️', 'Elektronik', 'mouse'], ['🎧', 'Elektronik', 'headphone earphone headset audio'],
  ['🔊', 'Elektronik', 'speaker audio bluetooth'], ['📷', 'Elektronik', 'kamera foto cctv'], ['📺', 'Elektronik', 'tv televisi'],
  ['🎮', 'Elektronik', 'game konsol gaming'], ['🕹️', 'Elektronik', 'joystick gaming'], ['🔌', 'Elektronik', 'charger kabel colokan listrik'],
  ['🔋', 'Elektronik', 'baterai powerbank'], ['📡', 'Elektronik', 'router wifi modem'], ['🖨️', 'Elektronik', 'printer scanner'],
  ['💡', 'Elektronik', 'lampu led bohlam'], ['🔦', 'Elektronik', 'senter lampu emergency'],
  // Rumah & Dapur
  ['🏠', 'Rumah', 'rumah perabot rumah tangga'], ['🛋️', 'Rumah', 'sofa furniture kursi tamu'], ['🛏️', 'Rumah', 'kasur tempat tidur bantal sprei'],
  ['🪑', 'Rumah', 'kursi meja furniture'], ['🍳', 'Rumah', 'alat dapur masak wajan panci'], ['🍽️', 'Rumah', 'piring peralatan makan'],
  ['🥄', 'Rumah', 'sendok garpu alat makan'], ['☕', 'Rumah', 'gelas mug cangkir kopi'], ['🔪', 'Rumah', 'pisau alat potong dapur'],
  ['🧊', 'Rumah', 'kulkas freezer pendingin'], ['🧹', 'Rumah', 'alat kebersihan sapu pel'], ['🧺', 'Rumah', 'keranjang laundry cucian'],
  ['🚿', 'Rumah', 'kamar mandi shower'], ['🪴', 'Rumah', 'tanaman pot dekorasi taman'], ['🕯️', 'Rumah', 'dekorasi lilin aromaterapi'],
  ['🪞', 'Rumah', 'cermin dekorasi'], ['🔑', 'Rumah', 'kunci gembok keamanan'],
  // Kecantikan & Kesehatan
  ['💄', 'Kecantikan', 'makeup kosmetik lipstik rias'], ['🧴', 'Kecantikan', 'skincare perawatan wajah lotion serum sabun'], ['💅', 'Kecantikan', 'kuku nail manicure'],
  ['🧖', 'Kecantikan', 'spa perawatan wajah masker'], ['💇', 'Kecantikan', 'rambut hair salon shampoo'], ['🪒', 'Kecantikan', 'cukur grooming pria'],
  ['🌸', 'Kecantikan', 'parfum wangi bunga'], ['🧼', 'Kecantikan', 'sabun pembersih'], ['💊', 'Kesehatan', 'obat vitamin suplemen'],
  ['🩺', 'Kesehatan', 'alat kesehatan medis'], ['😷', 'Kesehatan', 'masker kesehatan'], ['🦷', 'Kesehatan', 'gigi mulut dental'],
  // Ibu & Bayi
  ['🍼', 'Bayi', 'bayi susu botol dot ibu'], ['👶', 'Bayi', 'perlengkapan bayi popok'], ['🧸', 'Bayi', 'mainan anak boneka'],
  ['🧒', 'Bayi', 'baju anak pakaian anak'], ['🎠', 'Bayi', 'mainan edukasi anak'], ['🚼', 'Bayi', 'stroller perlengkapan bayi'],
  // Olahraga & Outdoor
  ['⚽', 'Olahraga', 'sepak bola futsal olahraga'], ['🏀', 'Olahraga', 'basket'], ['🏸', 'Olahraga', 'badminton raket bulu tangkis'],
  ['🏋️', 'Olahraga', 'gym fitness dumbbell angkat beban'], ['🧘', 'Olahraga', 'yoga matras senam'], ['🚴', 'Olahraga', 'sepeda cycling'],
  ['🏊', 'Olahraga', 'renang kolam'], ['⛺', 'Olahraga', 'camping tenda outdoor gunung'], ['🎣', 'Olahraga', 'pancing mancing'],
  // Otomotif
  ['🚗', 'Otomotif', 'mobil aksesoris mobil'], ['🏍️', 'Otomotif', 'motor aksesoris motor'], ['🪖', 'Otomotif', 'helm safety'],
  ['🛞', 'Otomotif', 'ban velg roda'], ['🛢️', 'Otomotif', 'oli pelumas'], ['🔧', 'Otomotif', 'perkakas tools bengkel kunci'],
  ['🛠️', 'Otomotif', 'peralatan teknik bangunan'],
  // Makanan
  ['🍔', 'Makanan', 'makanan burger fast food'], ['🍜', 'Makanan', 'mie ramen makanan instan'], ['🍪', 'Makanan', 'snack camilan biskuit kue'],
  ['🍰', 'Makanan', 'kue cake dessert'], ['🍫', 'Makanan', 'coklat permen'], ['🥤', 'Makanan', 'minuman jus'],
  ['🍯', 'Makanan', 'madu herbal'], ['🍎', 'Makanan', 'buah segar'], ['🥬', 'Makanan', 'sayur organik'], ['🥩', 'Makanan', 'daging frozen'],
  // Hobi & Lainnya
  ['📚', 'Hobi', 'buku bacaan novel'], ['✏️', 'Hobi', 'alat tulis atk sekolah kantor'], ['🎨', 'Hobi', 'seni kerajinan lukis'],
  ['🎸', 'Hobi', 'gitar alat musik'], ['🎵', 'Hobi', 'musik'], ['🧩', 'Hobi', 'puzzle hobi koleksi'],
  ['🧵', 'Hobi', 'jahit benang kain'], ['🌱', 'Hobi', 'pertanian tani bibit'], ['🐶', 'Hobi', 'hewan peliharaan anjing pet'],
  ['🐱', 'Hobi', 'kucing pet makanan kucing'], ['🎁', 'Hobi', 'hadiah kado gift'], ['🎉', 'Hobi', 'pesta ulang tahun party'],
  ['📿', 'Hobi', 'tasbih ibadah muslim'], ['🕌', 'Hobi', 'sajadah muslim ibadah'], ['🧳', 'Hobi', 'koper travel liburan'],
  ['💼', 'Hobi', 'tas kerja kantor'], ['📦', 'Hobi', 'paket lainnya umum'], ['🛍️', 'Hobi', 'belanja semua kategori'],
  ['🔥', 'Hobi', 'promo hot terlaris'], ['🏷️', 'Hobi', 'diskon sale harga'], ['⭐', 'Hobi', 'pilihan favorit rekomendasi'],
];
export const ICONS = RAW.map(([i, g, k]) => ({ i, g, k: k.toLowerCase() }));
export const ICON_GROUPS = Array.from(new Set(ICONS.map((x) => x.g)));
