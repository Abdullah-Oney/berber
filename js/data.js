/*
  MODEL VERİLERİ
  Yeni kesim eklemek için listedeki bir nesneyi kopyalayıp yeni bir nesne ekleyin.
  Görseller: assets/images/<imageStem>-front.jpg, -right.jpg, -left.jpg, -back.jpg
*/
window.HAIRCUTS = [
  {
    id: "low-fade", number: "01", name: "Low Fade", turkishName: "Düşük Fade",
    subtitle: "Doğal ve temiz geçiş", category: ["fade", "short", "easy"],
    categoryLabels: ["FADE", "KISA / ORTA", "KOLAY BAKIM"],
    description: "Yanlar ve ense, kulak çevresine yakın alçak bir seviyeden başlayarak kademeli biçimde kısalır. Üst bölüm daha uzun bırakılır. Geçişin aşağıda kalması, kesime daha sakin ve doğal bir görünüm verir.",
    barberText: "Yanları düşük fade yap. Geçiş kulak çevresine yakın ve doğal olsun; üst uzunluğumu koru.",
    maintenance: "Geçişin temiz görünmesi için genellikle 2–3 haftada bir toparlatılabilir. Üst bölümün şekli saç yapına göre belirlenir.",
    note: "Fade yüksekliği ve üst uzunluğu berberinle birlikte netleştir. Aynı isimle istenen kesimler berberden berbere farklı uygulanabilir.",
    profiles: ["dense", "temples", "front", "crown", "unsure"], minLengthCm: 1,
    lengthAdvice: "Yanlar kısaltılır; üst bölüm mevcut uzunluğuna göre korunabilir veya şekillendirilebilir.", imageStem: "low-fade"
  },
  {
    id: "textured-crop", number: "02", name: "Textured Crop", turkishName: "Dokulu Kesim",
    subtitle: "Hareketli ve doğal üst bölüm", category: ["short", "modern"],
    categoryLabels: ["KISA / ORTA", "DOKULU"],
    description: "Üst bölüm makasla katlı ve hareketli bırakılır. Saçın doğal dokusu ön plana çıkar; ön kısım kısa perçem şeklinde kullanılabilir. Yanlar kısa veya fade geçişli uygulanabilir.",
    barberText: "Üst kısma makasla doku ver, hareketli ve katlı bırak. Önü kısa perçemli olsun; yanları fotoğraftaki gibi uygula.",
    maintenance: "Az miktarda mat wax veya şekillendirici kremle parmaklarınla doğal doku verebilirsin.",
    note: "Üstteki dokunun görünümü saçın kalınlığına, kıvrımına ve doğal çıkış yönüne göre değişir.",
    profiles: ["dense", "temples", "front", "unsure"], minLengthCm: 3,
    lengthAdvice: "Üstte makasla doku oluşturabilmek için yaklaşık 3 cm veya daha uzun saçla değerlendirilmesi uygundur.", imageStem: "textured-crop"
  },
  {
    id: "crew-cut", number: "03", name: "Crew Cut", turkishName: "Kısa Klasik Kesim",
    subtitle: "Sade, düzenli ve pratik", category: ["short", "easy", "classic"],
    categoryLabels: ["KISA", "KLASİK", "KOLAY BAKIM"],
    description: "Üst kısım kısa bırakılır; yanlar ve ense daha kısa kesilir. Temiz, sade ve sportif bir görünüm sunar. Saçın tamamı aynı uzunlukta olmak zorunda değildir; üst bölüm hafif uzun bırakılabilir.",
    barberText: "Crew cut istiyorum. Üstü kısa ama yanlardan biraz uzun bırak; yanları ve enseyi temiz toparla.",
    maintenance: "Günlük şekillendirme ihtiyacı azdır. Düzenli görünüm için saç uzama hızına göre birkaç haftada bir kestirebilirsin.",
    note: "Üst ve yan uzunlukları makine numarasıyla değil, fotoğrafa ve saç yapına göre berberinle netleştir.",
    profiles: ["dense", "temples", "front", "crown", "unsure"], minLengthCm: 1,
    lengthAdvice: "Kısa kesim olduğu için uzun saçtan da uygulanabilir; berberin istenen üst uzunluğunu ayarlar.", imageStem: "crew-cut"
  },
  {
    id: "pompadour", number: "04", name: "Pompadour", turkishName: "Hacimli Geriye Tarama",
    subtitle: "Uzun ve hacimli üst bölüm", category: ["modern", "classic"],
    categoryLabels: ["ORTA / UZUN", "HACİMLİ"],
    description: "Ön ve üst bölüm daha uzun bırakılır, hacim verilerek yukarı ve geriye doğru şekillendirilir. Yanlar kısa veya daha klasik uzunlukta tutulabilir. Hacimli ve dikkat çekici bir görünüm oluşturur.",
    barberText: "Ön ve üst kısmı uzun bırakıp hacim vererek geriye doğru şekillendir. Yanları fotoğraftaki uzunlukta tut.",
    maintenance: "Hacim için fön ve uygun bir şekillendirici ürün gerekebilir. Günlük şekillendirmeye zaman ayırmak isteyebilirsin.",
    note: "Bu model üst bölümde yeterli uzunluk ve şekillendirilebilir saç yapısı ister. Çok kısa saçta aynı görünüm hemen elde edilemeyebilir.",
    profiles: ["dense", "temples", "unsure"], minLengthCm: 6,
    lengthAdvice: "Belirgin hacim oluşturmak için üst bölümde yaklaşık 6 cm veya daha uzun saç gerekebilir.", imageStem: "pompadour"
  }
];

window.ANGLES = [
  { id: "front", label: "Önden" },
  { id: "right", label: "Sağdan" },
  { id: "left", label: "Soldan" },
  { id: "back", label: "Enseden" }
];
