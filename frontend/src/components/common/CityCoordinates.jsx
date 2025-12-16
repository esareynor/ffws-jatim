// /// src/components/common/cityCoordinates.js
// // Daftar kota besar dan kecil di seluruh Indonesia beserta koordinatnya
// // Sumber: Data umum geografi Indonesia (dapat diperluas atau diimpor dari API)
// // Format: "nama_kota": [longitude, latitude]

// const cityCoordinates = {
//     // --- Aceh ---
//     bandaaceh: [95.3333, 5.5500],
//     langsa: [97.9500, 4.4750],
//     lhokseumawe: [97.1333, 5.1833],
//     sabang: [95.3167, 5.8833],
//     subulussalam: [97.9500, 2.6833],
//     meulaboh: [96.1500, 4.1167],
//     calang: [96.0333, 3.9167],
//     sinabang: [96.3833, 2.2833],
//     tapaktuan: [96.7500, 3.2833],
//     simeulue: [96.0833, 2.4167],
//     // ... dan seterusnya untuk kota-kota di Aceh

//     // --- Sumatera Utara ---
//     medan: [98.6722, 3.5952],
//     binjai: [98.4858, 3.4289],
//     lubukpakam: [98.8333, 3.6667],
//     tanjungbalai: [99.1111, 2.9833],
//     sibolga: [98.7833, 1.7167],
//     padangsidempuan: [99.2500, 1.3500],
//     gunungsitoli: [97.6250, 1.1667],
//     tebingtinggi: [98.9000, 3.3333],
//     perbaungan: [98.9667, 3.3500],
//     kisaran: [99.6000, 3.7500],
//     rantau: [99.8333, 3.7500],
//     datukbandar: [99.8333, 3.7500],
//     // ... dan seterusnya untuk kota-kota di Sumatera Utara

//     // --- Sumatera Barat ---
//     padang: [100.3500, -0.9500],
//     bukittinggi: [100.3500, -0.3000],
//     payakumbuh: [100.6333, -0.2500],
//     pariaman: [100.1167, -0.6167],
//     solok: [100.7833, -0.7833],
//     sawahlunto: [100.8167, -0.5833],
//     padangpanjang: [100.4167, -0.4667],
//     agam: [100.2167, -0.2833],
//     pesisirselatan: [100.0833, -1.0000],
//     tanahdatar: [100.5833, -0.3833],
//     // ... dan seterusnya untuk kota-kota di Sumatera Barat

//     // --- Riau ---
//     pekanbaru: [101.4478, 0.5100],
//     dumai: [101.4667, 1.6667],
//     selatpanjang: [102.5000, 1.5833],
//     bagansiapiapi: [100.6667, 1.9667],
//     ujungpandang: [100.8333, 1.5833],
//     // ... dan seterusnya untuk kota-kota di Riau

//     // --- Jambi ---
//     jambi: [103.6000, -1.6000],
//     sungaipenuh: [101.4167, -2.1667],
//     muarabungo: [102.1667, -1.0833],
//     bungo: [102.0000, -1.0000],
//     tebo: [102.3333, -1.3333],
//     kerinci: [101.5000, -2.0000],
//     // ... dan seterusnya untuk kota-kota di Jambi

//     // --- Sumatera Selatan ---
//     palembang: [104.7458, -2.9765],
//     lubuklinggau: [102.8667, -3.2833],
//     prabumulih: [104.2333, -3.4333],
//     pali: [104.1667, -3.2833],
//     muaraenim: [103.9667, -3.5000],
//     oganilir: [104.5000, -3.2500],
//     ogan: [104.0000, -3.0000],
//     // ... dan seterusnya untuk kota-kota di Sumatera Selatan

//     // --- Bengkulu ---
//     bengkulu: [102.2657, -3.8000],
//     curup: [102.5000, -3.5000],
//     lebong: [102.4167, -3.3333],
//     rejang: [102.3333, -3.3333],
//     // ... dan seterusnya untuk kota-kota di Bengkulu

//     // --- Lampung ---
//     bandarlampung: [105.2667, -5.4500],
//     metro: [105.2667, -5.1167],
//     tanjungkarang: [105.2667, -5.4500],
//     liwa: [104.1667, -4.9167],
//     krui: [103.9167, -5.4167],
//     kotaagung: [104.6167, -5.1167],
//     pringsewu: [104.9167, -5.3833],
//     mesuji: [105.3333, -4.2500],
//     tulangbawang: [105.2500, -4.5000],
//     waykanan: [104.5000, -4.4167],
//     lampungtengah: [105.2500, -4.8333],
//     lampungselatan: [105.2500, -5.1667],
//     lampungbarat: [104.2500, -5.1667],
//     lampungtimur: [105.7500, -5.0000],
//     pesawaran: [105.2500, -5.4167],
//     lampungutara: [104.9167, -4.9167],
//     // ... dan seterusnya untuk kota-kota di Lampung

//     // --- Kepulauan Bangka Belitung ---
//     pangkalpinang: [106.1000, -2.1167],
//     sungailiat: [106.1000, -2.1167],
//     mentok: [105.1667, -2.1167],
//     toboali: [106.4167, -2.8167],
//     koba: [106.0833, -2.6667],
//     // ... dan seterusnya untuk kota-kota di Babel

//     // --- Kepulauan Riau ---
//     tanjungpinang: [104.4500, 0.9500],
//     batam: [104.0000, 1.0000],
//     bintan: [104.4333, 0.9167],
//     karimun: [103.4167, 0.8333],
//     anambas: [107.4167, 3.0000],
//     // ... dan seterusnya untuk kota-kota di Kepri

//     // --- Jakarta ---
//     jakarta: [106.8456, -6.2088],
//     bogor: [106.7952, -6.5947],
//     depok: [106.8250, -6.3979],
//     tangerang: [106.6290, -6.1789],
//     bekasi: [107.0037, -6.2353],
//     cimahi: [107.5388, -6.8614],
//     cianjur: [107.1333, -6.8167],
//     sukabumi: [106.9547, -6.9270],
//     ciawi: [106.9000, -6.7500],
//     parung: [106.7833, -6.3333],
//     ciomas: [106.7167, -6.4667],
//     dramaga: [106.7833, -6.5500],
//     cibinong: [106.8333, -6.4833],
//     // ... dan seterusnya untuk kota-kota di Jawa Barat

//     // --- Jawa Tengah ---
//     semarang: [110.4204, -6.9667],
//     solo: [110.7000, -7.5667],
//     magelang: [110.2167, -7.4833],
//     salatiga: [110.6833, -7.3333],
//     pekalongan: [109.6667, -6.8833],
//     tegal: [109.1333, -6.8667],
//     purwokerto: [109.2333, -7.4167],
//     kudus: [110.8500, -6.8000],
//     jepara: [110.6833, -6.5833],
//     pati: [111.0333, -6.7500],
//     rembang: [111.3167, -6.6833],
//     blora: [111.3833, -7.0833],
//     grobogan: [111.1167, -7.0833],
//     sragen: [111.0333, -7.4167],
//     karanganyar: [111.0833, -7.6167],
//     ngawi: [111.4333, -7.6500],
//     magetan: [111.3500, -7.6500],
//     madiun: [111.5248, -7.6221],
//     nganjuk: [111.8833, -7.6000],
//     jombang: [112.2333, -7.5500],
//     sidoarjo: [112.7183, -7.4478],
//     gresik: [112.5729, -7.1554],
//     lamongan: [112.3333, -7.1167],
//     tuban: [112.0483, -6.8976],
//     bojonegoro: [111.8816, -7.1500],
//     demak: [110.6167, -6.8833],
//     // ... dan seterusnya untuk kota-kota di Jawa Tengah

//     // --- DI Yogyakarta ---
//     yogyakarta: [110.3695, -7.7956],
//     sleman: [110.3500, -7.7500],
//     bantul: [110.3333, -7.8833],
//     kulonprogo: [110.0000, -7.7500],
//     gunungkidul: [110.7500, -7.9167],

//     // --- Jawa Timur ---
//     surabaya: [112.7508, -7.2575],
//     sidoarjo: [112.7183, -7.4478],
//     gresik: [112.5729, -7.1554],
//     bangkalan: [113.0900, -7.0400],
//     sampang: [113.2333, -7.0833],
//     pamekasan: [113.4500, -7.1500],
//     sumenep: [113.8500, -7.0167],
//     mojokerto: [112.4694, -7.4706],
//     jombang: [112.2333, -7.5500],
//     nganjuk: [111.8833, -7.6000],
//     madiun: [111.5248, -7.6221],
//     magetan: [111.3500, -7.6500],
//     ngawi: [111.4333, -7.6500],
//     bojonegoro: [111.8816, -7.1500],
//     tuban: [112.0483, -6.8976],
//     lamongan: [112.3333, -7.1167],
//     demak: [110.6167, -6.8833],
//     kudus: [110.8500, -6.8000],
//     jepara: [110.6833, -6.5833],
//     pati: [111.0333, -6.7500],
//     rembang: [111.3167, -6.6833],
//     blora: [111.3833, -7.0833],
//     grobogan: [111.1167, -7.0833],
//     sragen: [111.0333, -7.4167],
//     karanganyar: [111.0833, -7.6167],
//     malang: [112.6308, -7.9831],
//     probolinggo: [113.7156, -7.7764],
//     pasuruan: [112.6909, -7.6461],
//     kediri: [112.0167, -7.8167],
//     blitar: [112.1667, -8.1],
//     tulungagung: [111.9, -8.0667],
//     // ... dan seterusnya untuk kota-kota di Jawa Timur

//     // --- Banten ---
//     tangerang: [106.6290, -6.1789],
//     tangerangselatan: [106.7167, -6.2833],
//     tangerangbarat: [106.4667, -6.1667],
//     serang: [106.1500, -6.1000],
//     cilegon: [106.0167, -5.9833],
//     pandeglang: [106.1000, -6.3500],
//     lebak: [106.2167, -6.1167],

//     // --- Bali ---
//     denpasar: [115.2126, -8.6705],
//     singaraja: [115.0920, -8.1000],
//     tabanan: [115.1333, -8.5167],
//     klungkung: [115.3833, -8.5167],
//     karangasem: [115.5833, -8.3333],
//     bangli: [115.4167, -8.3333],
//     jembrana: [114.6667, -8.3333],
//     // ... dan seterusnya untuk kota-kota di Bali

//     // --- Nusa Tenggara Barat ---
//     mataram: [116.0920, -8.5833],
//     bima: [118.7000, -8.4500],
//     dompu: [118.5000, -8.5833],
//     sumbawa: [117.4167, -8.6667],
//     sumbawabesar: [117.4167, -8.6667],
//     lombok: [116.2500, -8.7500],
//     // ... dan seterusnya untuk kota-kota di NTB

//     // --- Nusa Tenggara Timur ---
//     kupang: [123.6000, -10.1833],
//     ende: [121.6667, -8.8333],
//     maumere: [122.2167, -8.6333],
//     ruteng: [120.4667, -8.6000],
//     labuanbajo: [119.8500, -8.5000],
//     atambua: [124.8333, -9.0833],
//     // ... dan seterusnya untuk kota-kota di NTT

//     // --- Kalimantan Barat ---
//     pontianak: [109.3333, 0.0000],
//     singkawang: [108.9833, 0.8833],
//     sanggau: [110.4167, 0.1667],
//     ketapang: [110.0000, -1.8333],
//     sambas: [109.3333, 0.8333],
//     sebangki: [109.4167, 0.7500],
//     ngabang: [109.7500, 0.3333],
//     putussibau: [112.9167, 0.9167],
//     sibau: [112.9167, 0.9167],
//     bengkayang: [109.6667, 1.1667],
//     // ... dan seterusnya untuk kota-kota di Kalbar

//     // --- Kalimantan Tengah ---
//     palangkaraya: [113.9167, -2.2167],
//     kualakapuas: [114.3333, -3.2500],
//     sungaibuluh: [111.7000, -2.7000],
//     pulangpisau: [114.0000, -2.9167],
//     kapuas: [114.3333, -3.2500],
//     mentaya: [112.9167, -2.8333],
//     // ... dan seterusnya untuk kota-kota di Kalteng

//     // --- Kalimantan Selatan ---
//     banjarmasin: [114.5898, -3.3194],
//     banjarbaru: [114.7667, -3.4500],
//     amuntai: [115.0000, -2.4167],
//     barabai: [115.2500, -2.4167],
//     kandangan: [115.4167, -2.5833],
//     pelaihari: [114.7667, -3.0833],
//     martapura: [114.8500, -3.2833],
//     // ... dan seterusnya untuk kota-kota di Kalsel

//     // --- Kalimantan Timur ---
//     samarinda: [117.1537, -0.5022],
//     balikpapan: [116.8941, -1.2451],
//     bontang: [117.4900, -0.1200],
//     tarakan: [117.6333, 3.3167],
//     kota: [117.4167, -8.6667], // Placeholder jika ada kota tanpa nama spesifik
//     // ... dan seterusnya untuk kota-kota di Kaltim

//     // --- Kalimantan Utara ---
//     tanjungselor: [117.3667, 2.8333],
//     tarakan: [117.6333, 3.3167],
//     nunukan: [117.6667, 4.1333],
//     // ... dan seterusnya untuk kota-kota di Kaltara

//     // --- Sulawesi Utara ---
//     manado: [124.8447, 1.4917],
//     bitung: [125.1939, 1.4694],
//     tomohon: [124.8333, 1.3333],
//     amurang: [124.9167, 1.1667],
//     tondano: [124.9167, 1.3333],
//     airmadidi: [124.9167, 1.4167],
//     // ... dan seterusnya untuk kota-kota di Sulut

//     // --- Gorontalo ---
//     gorontalo: [123.0642, 0.5364],
//     tilamuta: [123.4167, 0.5833],
//     suwawa: [123.2500, 0.4167],
//     // ... dan seterusnya untuk kota-kota di Gorontalo

//     // --- Sulawesi Tengah ---
//     palu: [119.8333, -0.9167],
//     poso: [120.7500, -1.4167],
//     ampana: [121.6667, -1.7500],
//     tojo: [121.6667, -1.7500],
//     unaaha: [121.6667, -1.7500],
//     // ... dan seterusnya untuk kota-kota di Sulteng

//     // --- Sulawesi Selatan ---
//     makassar: [119.4327, -5.1477],
//     parepare: [119.6000, -4.0167],
//     palopo: [120.1667, -3.0000],
//     pinrang: [119.9167, -3.8333],
//     enrekang: [119.7500, -3.5833],
//     malunda: [119.7500, -3.5833],
//     majene: [119.0833, -3.5833],
//     polewali: [119.0833, -3.5833],
//     // ... dan seterusnya untuk kota-kota di Sulsel

//     // --- Sulawesi Tenggara ---
//     kendari: [122.6083, -3.9917],
//     baubau: [122.6083, -5.4667],
//     unaaha: [121.6667, -1.7500],
//     // ... dan seterusnya untuk kota-kota di Sulteng

//     // --- Sulawesi Barat ---
//     mamuju: [118.8833, -2.6667],
//     pasangkayu: [119.2500, -2.5000],
//     // ... dan seterusnya untuk kota-kota di Sulbar

//     // --- Maluku ---
//     ambon: [128.1833, -3.7000],
//     tual: [132.7500, -5.6667],
//     // ... dan seterusnya untuk kota-kota di Maluku

//     // --- Maluku Utara ---
//     ternate: [127.3667, 0.8167],
//     tTobelo: [127.4167, 1.7500],
//     // ... dan seterusnya untuk kota-kota di Malut

//     // --- Papua Barat ---
//     manokwari: [134.0667, -0.8500],
//     sorong: [131.2500, -0.8750],
//     // ... dan seterusnya untuk kota-kota di Papua Barat

//     // --- Papua ---
//     jayapura: [140.7000, -2.5333],
//     manokwari: [134.0667, -0.8500],
//     sorong: [131.2500, -0.8750],
//     // ... dan seterusnya untuk kota-kota di Papua
// };

// export default cityCoordinates;