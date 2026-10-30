# Usta Rehberi — NFC Berber Saç Modeli Demo

Bu proje, mahalle berberinin bekleme alanındaki NFC pleksi/etiket üzerinden açılabilecek, mobil uyumlu ve statik bir saç modeli kataloğu demosudur. Sunucu, üyelik, veri tabanı veya aylık yazılım aboneliği gerektirmez. GitHub Pages üzerinde yayınlanabilir.

## 1. Saç fotoğraflarını nereye koyacağım?

Tüm fotoğrafları şu klasöre koyun:

`assets/images/`

İlk demoda 4 saç modeli ve her model için 4 açı bulunur. Toplam 16 dosyanın adları **birebir** aşağıdaki gibi olmalıdır:

| Saç modeli | Önden | Sağdan | Soldan | Enseden |
|---|---|---|---|---|
| Low Fade | `low-fade-front.jpg` | `low-fade-right.jpg` | `low-fade-left.jpg` | `low-fade-back.jpg` |
| Textured Crop | `textured-crop-front.jpg` | `textured-crop-right.jpg` | `textured-crop-left.jpg` | `textured-crop-back.jpg` |
| Crew Cut | `crew-cut-front.jpg` | `crew-cut-right.jpg` | `crew-cut-left.jpg` | `crew-cut-back.jpg` |
| Pompadour | `pompadour-front.jpg` | `pompadour-right.jpg` | `pompadour-left.jpg` | `pompadour-back.jpg` |

**Önemli:** Dosya adları küçük harfli olmalı; boşluk ve Türkçe karakter kullanmayın. Site `.jpg` uzantısını bekler. Görseliniz PNG ise yalnızca dosya adının sonunu `.jpg` yapmak yeterli değildir; bir görsel düzenleyicide JPEG/JPG biçiminde dışa aktarın. Alternatif olarak `js/app.js` içindeki `imagePath()` fonksiyonunda `.jpg` uzantısını `.png` veya `.webp` olarak değiştirebilirsiniz.

### Görsel üretirken dikkat edin

- Aynı modelin dört açısında **aynı kişi, aynı saç kesimi, aynı üst uzunluğu, aynı saç rengi ve aynı ışık** kullanılmalı.
- Açı sırası: `front` = tam önden, `right` = kişinin sağ profili, `left` = kişinin sol profili, `back` = ense/arka görünüm.
- Dört görselde de kişinin başı benzer ölçekte ve ortalanmış olmalı. Dikey, benzer kadrajlı görseller tercih edin.
- Manken/AI yüzünün değişmemesi ve saç kesiminin dört yönden tutarlı olması önemli. Bir modelin sağ ve sol tarafı farklı görünüyorsa müşteriyi yanıltabilir.
- Mümkünse görselleri sıkıştırılmış JPEG olarak hazırlayın. Her görseli birkaç MB boyutunda bırakmamaya çalışın; mobil bağlantıda sayfa daha hızlı açılır.

Fotoğraflar eklenmeden de site açılır. İlgili görselin yerinde, dosya adını hatırlatan bir yer tutucu görünür. Bu nedenle önce siteyi yayınlayıp sonra görselleri aynı klasöre ekleyebilirsiniz.

## 2. Görseller kartlarda nasıl çalışır?

- Katalog sayfasında model kartları aşağı doğru sıralanır.
- Bir kart ekranın görünür alanına girdiğinde dört görseli yaklaşık **2 saniyede bir** otomatik değişir.
- Kartın altındaki dört nokta hangi açının gösterildiğini belirtir. Noktalara dokunarak açı elle değiştirilebilir.
- Karttan modele girildiğinde otomatik geçiş durur. Dört açı alttaki seçimlerden tek tek açılır.
- Ana görsele dokunup büyütme düğmesini kullanarak görseli büyük görüntüleyebilirsiniz. Büyük görünümde sağ/sol oklarla açılar arasında geçiş yapılır.

## 3. GitHub Pages üzerinde yayınlama

1. GitHub'da yeni ve boş bir repository oluşturun (ör. `usta-rehberi-demo`).
2. Bu klasörün **içindeki dosya ve klasörleri** repository'nin ana dizinine yükleyin. `index.html` en üst seviyede kalmalı.
3. `assets/images/` klasörüne 16 fotoğrafı doğru adlarla ekleyin.
4. Repository'de **Settings → Pages** bölümünü açın.
5. Build and deployment altında **Deploy from a branch** seçin; branch olarak `main`, klasör olarak `/ (root)` seçip kaydedin.
6. GitHub Pages'in verdiği adresi telefondan açarak deneyin. NFC etikete bu web adresini yazabilirsiniz.

Görselleri sonradan değiştirmek için aynı dosya adını koruyarak yeni dosyayı `assets/images/` içine yükleyin. Tarayıcı eski görseli önbellekten gösterirse sayfayı yenileyin veya mobil tarayıcıda önbelleği temizleyin.

## 4. Model eklemek veya açıklamayı değiştirmek

Model bilgileri `js/data.js` dosyasındadır. Bir model nesnesini kopyalayın ve `window.HAIRCUTS` listesine ekleyin. Yeni model için:

- `id`: benzersiz kısa kimlik (ör. `french-crop`)
- `name`: modelin bilinen adı
- `turkishName`: Türkçe adı
- `description`: kesimin açıklaması
- `barberText`: müşterinin berberine göstereceği örnek cümle
- `maintenance` ve `note`: bakım ve dikkat notları
- `profiles`: rehberde eşleştirilecek profil kodları
- `minLengthCm`: bu modelin üst bölümünde önerilen yaklaşık en az saç uzunluğu
- `imageStem`: görsel dosyası adlarında kullanılacak kısa ad

Örnek yeni görsel adları `french-crop-front.jpg`, `french-crop-right.jpg`, `french-crop-left.jpg`, `french-crop-back.jpg` olur. Model kartındaki toplam model sayısı otomatik güncellenir.

Profil kodları:

- `dense`: Sık ve dengeli
- `temples`: Şakaklar açılmış
- `front`: Ön taraf seyrek
- `crown`: Tepe bölgesi seyrek
- `unsure`: Emin değilim / birden fazla durum

Mevcut uzunluk seçenekleri `1-2`, `3`, `4-5`, `6-8`, `10+` biçimindedir. `minLengthCm` seçilen yaklaşık uzunluktan fazlaysa model, “Biraz uzattıktan sonra” grubunda gösterilir. Bu bir berber değerlendirmesi yerine geçmez; sadece genel bir ön rehberdir.

## 5. Bu prototipte neler var?

- Mobil uyumlu, tek sayfalı saç modeli kataloğu
- Model arama ve hızlı filtreler
- Ekranda görünür kartlarda otomatik dört açı geçişi
- Detay ekranı, manuel açı seçimi ve büyütme
- Kesim açıklaması, bakım notu ve “berbere şöyle söyle” metni
- İki adımlı saç profili ve mevcut uzunluk rehberi
- Şu an incelenebilecek / biraz uzattıktan sonra incelenebilecek model ayrımı
- Harici veritabanı veya kullanıcı hesabı olmadan çalışma

## 6. İlk sürüm dışında bırakılanlar

Bu pakette 16 ana görsel tek bir saç rengi setidir. Siyah, koyu kahve, kumral, sarı veya bakır rengin her modelde ayrı ayrı nasıl göründüğünü gerçekten göstermek için her renk için ayrıca tutarlı dört açılı fotoğraf setleri gerekir. Sadece ekrandaki görsele renk filtresi uygulamak saç rengini ve ışığı gerçekçi göstermeyeceği için ilk demoda sahte renk önizlemesi eklenmedi.

Ayrıca kullanıcının kendi fotoğrafını yükleyip yapay zekâ ile saç denemesi, berber hesabı, randevu sistemi ve müşteri takibi bu prototipte yoktur. Amaç, NFC ile açılan hızlı ve zahmetsiz model kataloğunu test etmektir.

## 7. Teknik not

Bu proje HTML, CSS ve saf JavaScript ile hazırlanmıştır. Gösterilen metinler ve saç modeli bilgileri `js/data.js` içindedir. Görseller yalnızca `assets/images/` klasöründen okunur. Harici API, izleme aracı, form gönderimi veya kişisel veri toplama işlevi bulunmaz.
