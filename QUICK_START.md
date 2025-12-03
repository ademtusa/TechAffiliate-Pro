# ⚡ HIZLI BAŞLANGIÇ - 5 ADIMDA YAYINA ALIN

## 1️⃣ MongoDB Atlas Hazırlığı (10 dk)

```bash
1. https://www.mongodb.com/cloud/atlas → Ücretsiz hesap
2. Cluster oluştur (FREE tier)
3. Database User: usefulio_admin / [şifre]
4. Network: 0.0.0.0/0 ekle
5. Connection String kopyala
```

## 2️⃣ Veri Taşıma (5 dk)

```bash
# Local'den export
mongodump --uri="mongodb://localhost:27017/usefulio_db" --out=/tmp/db

# Atlas'a import
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/usefulio_db" /tmp/db/usefulio_db
```

## 3️⃣ Proje Hazırlık (5 dk)

**ZIP oluştur:**
```bash
cd /app
zip -r usefulio.zip . -x "node_modules/*" ".next/*" "backups/*"
```

**`.env.production` oluştur:**
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/usefulio_db
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 4️⃣ Hostinger Upload (10 dk)

```bash
1. Hostinger Panel → Node.js → Create Application
2. Node 18.x seç
3. File Manager → usefulio.zip yükle → Extract
4. SSH bağlan:
   cd /public_html/usefulio
   cp .env.production .env
   npm install --production
   npm run build
   npm start
```

## 5️⃣ Domain & Test (5 dk)

```bash
1. DNS: A Record → Hostinger IP
2. SSL: Panel → SSL → Enable
3. Test: https://yourdomain.com
4. Admin login: admin@usefulio.com / admin123
```

---

## 🔄 GÜNCELLEMELERİ YAYINA ALMA

### Emergent'ta Değişiklik Yaptıktan Sonra:

```bash
# 1. Değişen dosyaları ZIP'le
cd /app
zip -r update.zip app/ components/ lib/ package.json

# 2. Hostinger'a yükle
# File Manager → update.zip → Extract (üzerine yaz)

# 3. SSH'de rebuild
ssh username@yourdomain.com
cd /public_html/usefulio
npm install  # Sadece package.json değiştiyse
npm run build
pm2 restart usefulio
```

### Hızlı Dosya Değişikliği:
```bash
# Sadece 1-2 dosya değiştiyse:
# File Manager'da direkt düzenle → Kaydet
# Otomatik hot reload çalışır
```

---

## 🆘 HIZLI FIX'LER

**Site çalışmıyor:**
```bash
pm2 restart usefulio
```

**Database bağlanamıyor:**
```bash
# .env kontrol et
cat .env | grep MONGO_URL
```

**Build hatası:**
```bash
rm -rf .next
npm run build
```

---

**HAZIR! Artık siteniz canlı! 🚀**