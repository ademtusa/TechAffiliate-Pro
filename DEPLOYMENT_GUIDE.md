# 🚀 USEFULIO CMS - DEPLOYMENT GUIDE

## 📋 ÖN HAZIRLIK

### Gereksinimler:
- Node.js 18+ kurulu hosting
- MongoDB Atlas hesabı (ücretsiz tier yeterli)
- Domain/subdomain

---

## 🏗️ HOSTINGER'A DEPLOYMENT

### ADIM 1: MongoDB Atlas Hazırlığı

1. **MongoDB Atlas'a giriş yapın:** https://www.mongodb.com/cloud/atlas
2. **Yeni Cluster oluşturun** (FREE tier seçin)
3. **Database User oluşturun:**
   - Username: `usefulio_admin`
   - Password: Güçlü bir şifre (kaydedin!)
4. **Network Access:** `0.0.0.0/0` ekleyin (tüm IP'lere izin)
5. **Connection String alın:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/usefulio_db
   ```

### ADIM 2: Veritabanı Migrate

**Mevcut verilerinizi export edin:**
```bash
mongodump --uri="mongodb://localhost:27017/usefulio_db" --out=/tmp/backup
```

**Atlas'a import edin:**
```bash
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/usefulio_db" /tmp/backup/usefulio_db
```

### ADIM 3: Proje Dosyalarını Hazırlama

**Gerekli dosyalar:**
```
usefulio-cms/
├── app/
├── components/
├── lib/
├── public/
├── .env.production (YENİ - oluşturacaksınız)
├── package.json
├── next.config.js
└── middleware.js
```

**`.env.production` dosyası oluşturun:**
```env
# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/usefulio_db

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=GENERATE_NEW_SECRET_HERE

# Site
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**NextAuth Secret oluşturmak için:**
```bash
openssl rand -base64 32
```

### ADIM 4: Hostinger'da Node.js Hosting Setup

1. **Hostinger Panel'e giriş yapın**
2. **Hosting → Node.js**
3. **Create Application:**
   - Node.js Version: 18.x veya üzeri
   - Application Root: `/public_html/usefulio`
   - Application URL: Seçtiğiniz domain

### ADIM 5: Dosya Yükleme

**YÖNTEM 1: ZIP ile (Önerilen)**
1. Projeyi ZIP'leyin (node_modules HARİÇ):
   ```bash
   zip -r usefulio-cms.zip . -x "node_modules/*" ".next/*" "backups/*" "*.log"
   ```
2. Hostinger File Manager'a yükleyin
3. ZIP'i extract edin

**YÖNTEM 2: FTP/SFTP**
1. FileZilla kullanın
2. Tüm dosyaları yükleyin (node_modules hariç)

### ADIM 6: Hostinger SSH'de Kurulum

```bash
# SSH ile bağlanın
ssh username@yourdomain.com

# Proje klasörüne gidin
cd /public_html/usefulio

# Dependencies yükleyin
npm install --production

# Production build
npm run build

# PM2 ile başlatın (Hostinger otomatik)
npm start
```

### ADIM 7: Domain Ayarları

1. **DNS Settings:**
   - A Record: Hostinger IP'sine yönlendirin
   - CNAME (www): Ana domain'e yönlendirin

2. **SSL Certificate:**
   - Hostinger otomatik Let's Encrypt sağlar
   - Panel → SSL → Enable

---

## 🔍 POST-DEPLOYMENT KONTROL

### Test Checklist:
```bash
# Tüm sayfaları test edin:
✓ Ana sayfa: https://yourdomain.com
✓ Login: https://yourdomain.com/login
✓ Admin Panel: https://yourdomain.com/admin-panel
✓ API: https://yourdomain.com/api/products
```

### Admin Hesabı Oluşturma:
```bash
# MongoDB Atlas Console'dan:
db.users.insertOne({
  id: "admin-001",
  name: "Admin User",
  email: "admin@yourdomain.com",
  password: "$2a$10$...", // bcrypt hash
  role: "admin",
  status: "approved",
  created_at: new ISODate()
})
```

---

## 🔄 GÜNCELLEMELER İÇİN HAZIRLIK

### Git Repository Kurulumu (Önerilen):

```bash
# Local'de git init
git init
git add .
git commit -m "Initial commit - Production ready"

# GitHub'a push
git remote add origin https://github.com/yourusername/usefulio-cms.git
git push -u origin main
```

### Güncelleme Workflow:

1. **Emergent'ta değişiklik yap**
2. **Test et**
3. **Git'e commit et:**
   ```bash
   git add .
   git commit -m "Fix: Contact page layout"
   git push
   ```
4. **Hostinger'da güncelle:**
   ```bash
   cd /public_html/usefulio
   git pull
   npm install
   npm run build
   pm2 restart usefulio
   ```

### Backup Stratejisi:

**Veritabanı Backup (Haftalık):**
```bash
mongodump --uri="$MONGO_URL" --out=/backups/$(date +%Y%m%d)
```

**Dosya Backup:**
- Hostinger otomatik backup (7 gün)
- Manuel: File Manager → Download ZIP

---

## 🆘 SORUN GİDERME

### Site Açılmıyor:
```bash
# Logları kontrol et
pm2 logs usefulio

# Servisi restart et
pm2 restart usefulio
```

### Database Bağlantı Hatası:
- MongoDB Atlas IP whitelist kontrol et
- Connection string doğru mu?
- User credentials doğru mu?

### Build Hatası:
```bash
# Cache temizle
rm -rf .next
npm run build
```

---

## 📞 DESTEK

Sorun yaşarsanız:
1. Logları kaydedin: `pm2 logs --lines 100`
2. Hata mesajını not edin
3. Emergent'a geri gelin - proje güncellenebilir durumda!

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] MongoDB Atlas cluster hazır
- [ ] Database migrate edildi
- [ ] .env.production oluşturuldu
- [ ] Proje Hostinger'a yüklendi
- [ ] npm install çalıştırıldı
- [ ] npm run build başarılı
- [ ] Servis başlatıldı
- [ ] Domain DNS ayarlandı
- [ ] SSL aktif
- [ ] Admin hesabı oluşturuldu
- [ ] Tüm sayfalar test edildi
- [ ] Git repository kuruldu

**BAŞARILAR! 🎉**