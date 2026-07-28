# NEKS "Sor Kutucuğu" — Kurulum

Sunucusuz, tek dosyalık otomatik yanıt asistanı. Sitenizle ilgili **699 soru varyantı / 118 hazır cevap** içerir.

## Dosyalar
- `neks-sor-widget.js` — Tüm asistan (stil + arayüz + bilgi tabanı + eşleştirme motoru) tek dosyada.
- `demo.html` — Tarayıcıda çift tıklayıp hemen deneyebileceğiniz canlı önizleme.
- `index.html`, `iletisim.html` — Widget satırı eklenmiş hâlleri.
- `kb.json` — Bilgi tabanı (soru/cevaplar). Düzenlemek isterseniz buradan.

## Sitenize ekleme (2 adım)
1. `neks-sor-widget.js` dosyasını sitenizin kök dizinine yükleyin (index.html ile aynı yere).
2. Her sayfada `</body>` etiketinden hemen önce şu satırı ekleyin:
   ```html
   <script src="neks-sor-widget.js" defer></script>
   ```
   (index.html ve iletisim.html dosyalarına bu satır sizin için zaten eklendi.)

Hepsi bu kadar — sağ altta "Bize Sorun" balonu görünür.

## Nasıl çalışır?
- Türkçe metni normalleştirir (büyük/küçük harf, ç/ğ/ı/ö/ş/ü), gereksiz kelimeleri eler.
- Nadir/ayırt edici kelimelere (cbam, lca, orcid…) daha yüksek ağırlık verir.
- En uygun cevabı bulamazsa kullanıcıyı iletişim bilgilerine ve önerilen başlıklara yönlendirir.
- Hiçbir sunucu/veritabanı gerekmez; tamamen tarayıcıda çalışır.

## Soru/cevap ekleme veya düzenleme
En kolayı `kb.json` içindeki `items` listesini düzenlemektir. Her öğe:
```json
{ "cat":"kategori", "a":"Cevap metni", "q":["soru 1","soru 2","kısa anahtar"], "k":["ek anahtar"] }
```
Düzenledikten sonra widget'ı yeniden üretmek için (Python): `build_kb.py` → `make_widget.py`.
Alternatif olarak doğrudan `neks-sor-widget.js` dosyasının başındaki `var DATA = {...}` bölümünü de düzenleyebilirsiniz.

## Not
- Telefon numarası güncel: **0545 956 55 51**. Değişirse `kb.json`/`neks-sor-widget.js` içinde arayıp değiştirin.
- Bu asistan otomatik yanıt verir; kişiye özel teklif ve teknik değerlendirme için kullanıcılar iletişim formuna yönlendirilir.
