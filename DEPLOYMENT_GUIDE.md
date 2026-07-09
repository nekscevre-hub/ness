# NEKS Web Sitesi - Netlify Deployment Rehberi

Bu rehber, NEKS Çevre Teknolojileri web sitesini Netlify'a deploy etme adımlarını açıklar.

## 📋 Ön Koşullar

- [x] GitHub hesabı
- [x] Netlify hesabı (https://netlify.com)
- [x] Git yüklü
- [x] Kod editor

## 🚀 Adım Adım Deployment

### 1. GitHub Repository Oluşturma

```bash
# Yerel dizine git repository başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "NEKS web sitesi - initial commit"

# GitHub'da "neks-website" adında yeni repo oluştur

# Remote ekle
git remote add origin https://github.com/[USERNAME]/neks-website.git

# Ana branch'e push et
git branch -M main
git push -u origin main
```

### 2. Netlify'a Connect Etme

#### Seçenek A: Netlify Dashboard üzerinden

1. https://app.netlify.com'a git (GitHub ile login)
2. "Add new site" > "Import an existing project"
3. GitHub seç
4. "neks-website" repository seç
5. Deploy settings:
   - **Build command**: (boş bırak)
   - **Publish directory**: `.` (kök dizin)
6. "Deploy site" tıkla

#### Seçenek B: Netlify CLI ile

```bash
# Netlify CLI yükle
npm install -g netlify-cli

# Netlify'a login
netlify login

# Site link et ve deploy et
netlify init
netlify deploy --prod
```

### 3. Netlify Forms Ayarları

Forms otomatikman etkinleşir. Ayarlar:

1. **Netlify Dashboard** > Site settings
2. **Forms** sekmesinde kontrol et
3. **Form notifications** ekle:
   - Email: nekscevre@gmail.com
   - Event: Form submission
   - Action: Email notification

### 4. Domain Ayarları

```
Netlify domain: neks-website.netlify.app

Özel domain eklemek için:
1. Domain sağlayıcısından DNS ayarlarını açın
2. Netlify'da custom domain ekleyin
3. DNS kayıtlarını kopyalayın
4. Domain sağlayıcısında yapıştırın
5. 24-48 saat bekleyin
```

### 5. Environment Variables (Optional)

Analytics, CMS, vb. için:

1. Site settings > Build & deploy > Environment
2. "Edit variables" tıkla
3. Ekle (örnek):
   ```
   ANALYTICS_ID = UA-XXXXX-X
   CONTACT_EMAIL = nekscevre@gmail.com
   ```

### 6. Build Hooks (Optional)

Otomatik redeploy için:

```bash
# 1. Site settings > Build & deploy > Build hooks
# 2. Create hook
# 3. Copy URL

# 3. Kütüphaneye webhook ekle (CMS, etc.)
# Her güncellemede otomatik rebuild olur
```

## 📊 Post-Deployment Checklist

### Fonksiyonalite Testleri

```
[ ] Ana sayfa yükleniyor
[ ] Navigasyon linkler çalışıyor
[ ] Mobil menü açılıp kapanıyor
[ ] Form validasyonu çalışıyor
[ ] Form submit başarılı
[ ] Video otomatik oynatılıyor (desktop)
[ ] Resimler lazy loading
[ ] Smooth scroll çalışıyor
```

### Performance Optimizasyonları

```
[ ] Netlify Analytics aktif
[ ] Cache headers konfigüre edildi
[ ] CDN aktif (Netlify otomatik)
[ ] Images optimized
[ ] CSS/JS minified
```

### SEO Kontrolü

```
[ ] Sitemap yayında: /sitemap.xml
[ ] Robots.txt yayında: /robots.txt
[ ] Meta tags uygun
[ ] Open Graph tags yayında
[ ] Google Search Console'a ekle
[ ] Bing Webmaster Tools'a ekle
```

### Güvenlik Kontrolü

```
[ ] HTTPS aktif (Netlify otomatik)
[ ] Security headers ayarlanmış
[ ] Honeypot spam filter aktif
[ ] Form validation çalışıyor
[ ] XSS prevention aktif
```

## 🔄 Continuous Deployment Workflow

```
1. Yerel değişiklik yap
   git checkout -b feature/your-feature

2. Commit ve push
   git add .
   git commit -m "Açıklayıcı mesaj"
   git push origin feature/your-feature

3. GitHub'da Pull Request aç
   
4. Code review (gerekirse)

5. Merge to main
   
6. Netlify otomatikman deploy eder
   
7. Preview ve production URL'leri kontrol et
```

## 🐛 Troubleshooting

### Form submit çalışmıyor

```
1. Netlify Dashboard > Forms sekmesinde form görünüyor mu?
2. Form name attribute doğru mu? (name="contact")
3. netlify attribute form tag'ında mı?
4. Browser console'da hata var mı?
```

### CSS/JS yüklenmiyorlardır

```
1. Netlify build log'larını kontrol et
2. Dosya paths doğru mu?
3. Publish directory ayarı doğru mu?
4. Cache temizle (Ctrl+Shift+Del)
```

### Video oynatılmıyor

```
1. Video dosyası yüklendi mi?
2. Browser video formatı destekliyor mu?
3. Autoplay policy (muted olmak zorunlu)
4. Fallback poster görünüyor mu?
```

### Mobile menü çalışmıyor

```
1. neks-scripts-optimized.js yüklendi mi?
2. .nav-mobile-toggle element var mı?
3. .mobile-menu element var mı?
4. Browser console'da JS hata var mı?
```

## 📈 Monitoring ve Analytics

### Netlify Analytics Dashboard

```
1. Site settings > Analytics
2. Enable Netlify Analytics
3. View metrics:
   - Page views
   - Unique visitors
   - Bandwidth usage
   - Form submissions
```

### Google Analytics (Optional)

```html
<!-- index.html <head> içine ekle -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA-ID');
</script>
```

## 🔐 Güvenlik Best Practices

### Netlify Specific

```
1. Team members ekle (sadece gerekenlere)
2. API tokens secure tut
3. Deploy keys rotasyonu
4. 2FA etkinleştir
```

### Content Security Policy

```
Netlify Dashboard > Security > Headers > Ekle:
Content-Security-Policy: default-src 'self';
```

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Forums**: https://community.netlify.com
- **GitHub Issues**: repository issues
- **Email Support**: nekscevre@gmail.com

## ✅ Deployment Checklist

```
Pre-Deployment:
[ ] Tüm testler pass
[ ] Code review yapıldı
[ ] README.md güncel
[ ] .gitignore konfigüre
[ ] Sensitive data yok

Deployment:
[ ] GitHub'a push
[ ] Netlify build başarılı
[ ] Form submission çalışıyor
[ ] Performance yeterli

Post-Deployment:
[ ] Live site test
[ ] Analytics kurulum
[ ] Search engines verify
[ ] Monitoring aktif
```

---

**Son Güncelleme**: July 2025
**Netlify Site**: https://neks-website.netlify.app
