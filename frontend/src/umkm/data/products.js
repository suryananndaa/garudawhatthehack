/* =============================================================
   SHARED PRODUCT DATA
   Dipakai oleh Favorit.jsx dan Search.jsx
   ============================================================= */

export const PRODUCTS = [
  { id:1,  name:'Tomat Keriting Premium', cat:'Sayuran', farmer:'Petani Budi',       loc:'Bandung Barat',     dist:25,  price:12000, rating:4.8, reviews:120, badge:'best', tags:['Kualitas A','Pesticide Safe','Fresh'], emoji:'🍅', tint:'red',     ship:'1 Hari',   minQty:20, desc:'Tomat keriting premium dipanen langsung dari kebun Pak Budi di Bandung Barat. Bebas pestisida berbahaya, cocok untuk restoran dan kafe.' },
  { id:2,  name:'Tomat Keriting Segar',   cat:'Sayuran', farmer:'Tani Sejahtera',    loc:'Lembang',           dist:18,  price:11000, rating:4.7, reviews:89,  badge:'close',tags:['Kualitas A','Organik'],               emoji:'🍅', tint:'red',     ship:'Same Day', minQty:15, desc:'Tomat segar dari perkebunan organik Lembang. Dipanen pagi dan langsung dikirim.' },
  { id:3,  name:'Selada Keriting Hijau',  cat:'Sayuran', farmer:'Petani Surya',      loc:'Lembang, Bandung',  dist:20,  price:10000, rating:4.8, reviews:130, badge:null,   tags:['Kualitas A','Fresh'],                 emoji:'🥬', tint:'green',   ship:'Same Day', minQty:5,  desc:'Selada keriting hijau segar dari dataran tinggi Lembang.' },
  { id:4,  name:'Wortel Segar Premium',   cat:'Sayuran', farmer:'Pak Yanto',         loc:'Malang',            dist:85,  price:11000, rating:4.8, reviews:130, badge:null,   tags:['Kualitas A','Organik'],               emoji:'🥕', tint:'orange',  ship:'2 Hari',   minQty:15, desc:'Wortel segar berukuran besar dari Malang. Bebas pestisida dan cocok untuk jus segar.' },
  { id:5,  name:'Alpukat Mentega',        cat:'Buah',    farmer:'Bu Rina',           loc:'Garut, Jawa Barat', dist:55,  price:18000, rating:4.9, reviews:210, badge:'best', tags:['Premium','Organik'],                  emoji:'🥑', tint:'avocado', ship:'2 Hari',   minQty:10, desc:'Alpukat mentega ukuran besar dari kebun Bu Rina di Garut. Matang pohon dan creamy.' },
  { id:6,  name:'Jeruk Medan Manis',      cat:'Buah',    farmer:'Petani Sumut',      loc:'Deli Serdang',      dist:800, price:15000, rating:4.7, reviews:155, badge:null,   tags:['Kualitas A','Manis'],                 emoji:'🍊', tint:'orange',  ship:'3 Hari',   minQty:20, desc:'Jeruk medan asli dari Sumatera Utara. Segar, manis, dan kaya vitamin C.' },
  { id:7,  name:'Cabai Merah Keriting',   cat:'Cabai',   farmer:'Petani Jaya',       loc:'Majalengka',        dist:70,  price:35000, rating:4.7, reviews:95,  badge:null,   tags:['Kualitas A','Segar'],                 emoji:'🌶️',tint:'red',     ship:'2 Hari',   minQty:10, desc:'Cabai merah keriting segar dengan tingkat kepedasan tinggi. Cocok untuk restoran Padang.' },
  { id:8,  name:'Bawang Merah Brebes',    cat:'Bawang',  farmer:'Koperasi Brebes',   loc:'Brebes',            dist:120, price:22000, rating:4.9, reviews:320, badge:'best', tags:['Premium','Kering'],                   emoji:'🧅', tint:'purple',  ship:'2 Hari',   minQty:50, desc:'Bawang merah Brebes asli, aroma kuat dan tahan lama.' },
  { id:9,  name:'Tomat Cherry Merah',     cat:'Buah',    farmer:'Kebun Muda',        loc:'Garut',             dist:60,  price:18000, rating:4.9, reviews:210, badge:'best', tags:['Premium','Organik'],                  emoji:'🍅', tint:'red',     ship:'2 Hari',   minQty:10, desc:'Tomat cherry merah manis untuk restoran fine dining. Dipanen muda dan matang sempurna.' },
  { id:10, name:'Bawang Putih Lokal',     cat:'Bawang',  farmer:'Pak Slamet',        loc:'Temanggung',        dist:150, price:32000, rating:4.6, reviews:88,  badge:null,   tags:['Lokal','Kualitas A'],                 emoji:'🧄', tint:'yellow',  ship:'3 Hari',   minQty:20, desc:'Bawang putih lokal Temanggung, aroma lebih kuat dari import.' },
  { id:11, name:'Ayam Kampung Segar',     cat:'Daging',  farmer:'Peternakan Maju',   loc:'Sukabumi',          dist:65,  price:65000, rating:4.8, reviews:88,  badge:'best', tags:['Segar','Halal'],                      emoji:'🍗', tint:'yellow',  ship:'Same Day', minQty:5,  desc:'Ayam kampung asli yang dipotong segar setiap pagi. Halal bersertifikasi MUI.' },
  { id:12, name:'Ikan Nila Segar',        cat:'Ikan',    farmer:'Tambak Sari',       loc:'Karawang',          dist:40,  price:28000, rating:4.6, reviews:65,  badge:'close',tags:['Segar','Tanpa Formalin'],             emoji:'🐟', tint:'blue',    ship:'Same Day', minQty:10, desc:'Ikan nila segar dari tambak bersih Karawang. Bebas formalin.' },
  { id:13, name:'Telur Ayam Kampung',     cat:'Telur',   farmer:'Bu Wati',           loc:'Bogor',             dist:50,  price:3500,  rating:4.7, reviews:290, badge:null,   tags:['Kampung','Non-Hormon'],               emoji:'🥚', tint:'yellow',  ship:'1 Hari',   minQty:100,desc:'Telur ayam kampung asli. Kuning telur oranye gelap tanda kualitas premium.' },
  { id:14, name:'Beras Pandan Wangi',     cat:'Beras',   farmer:'Koperasi Cianjur',  loc:'Cianjur',           dist:45,  price:14000, rating:4.9, reviews:450, badge:'best', tags:['Premium','Wangi'],                    emoji:'🌾', tint:'green',   ship:'2 Hari',   minQty:50, desc:'Beras pandan wangi asli Cianjur panen baru. Aroma harum alami dan pulen.' },
  { id:15, name:'Cabai Rawit Hijau',      cat:'Cabai',   farmer:'Bu Santi',          loc:'Tasikmalaya',       dist:90,  price:28000, rating:4.5, reviews:77,  badge:'price',tags:['Kualitas A','Fresh'],                 emoji:'🌶️',tint:'green',   ship:'3 Hari',   minQty:10, desc:'Cabai rawit hijau muda, rasa pedas sedang. Sering dicari restoran sunda.' },
  { id:16, name:'Kentang Granola',        cat:'Sayuran', farmer:'Petani Dieng',      loc:'Dieng, Wonosobo',   dist:200, price:12000, rating:4.8, reviews:110, badge:null,   tags:['Kualitas A','Size Besar'],            emoji:'🥔', tint:'brown',   ship:'2 Hari',   minQty:30, desc:'Kentang granola dari dataran tinggi Dieng, ukuran besar dan cocok untuk french fries.' },
  { id:17, name:'Udang Vaname Segar',     cat:'Ikan',    farmer:'Tambak Nusantara',  loc:'Sidoarjo',          dist:700, price:85000, rating:4.9, reviews:200, badge:'best', tags:['Premium','Segar','Size 50'],          emoji:'🦐', tint:'orange',  ship:'3 Hari',   minQty:5,  desc:'Udang vaname segar size 50 dari tambak terbaik Sidoarjo.' },
  { id:18, name:'Brokoli Segar',          cat:'Sayuran', farmer:'Petani Lembang',    loc:'Lembang',           dist:22,  price:14000, rating:4.7, reviews:98,  badge:null,   tags:['Organik','Segar'],                    emoji:'🥦', tint:'green',   ship:'Same Day', minQty:5,  desc:'Brokoli hijau segar dari dataran tinggi Lembang. Sangat cocok untuk catering sehat.' },
]

/* =============================================================
   localStorage FAVORITES HELPER
   Key: 'taniku_fav_ids' → JSON array of product id numbers
   ============================================================= */
const FAV_KEY = 'taniku_fav_ids'

export function loadFavIds() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || [] }
  catch { return [] }
}

export function saveFavIds(ids) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids))
}

export function toggleFav(id) {
  const ids = loadFavIds()
  const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
  saveFavIds(next)
  return next
}

export function isFav(id) {
  return loadFavIds().includes(id)
}

/* =============================================================
   HELPERS
   ============================================================= */
export const rupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID')

export const CATEGORIES = ['Semua','Sayuran','Buah','Cabai','Bawang','Daging','Ikan','Telur','Beras']
