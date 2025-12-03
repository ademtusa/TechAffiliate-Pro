# 🚀 VERCEL CLI DEPLOYMENT REHBERİ

## ÖNEMLİ BİLGİLER

**Environment Variables (Hazır):**
```
MONGO_URL=mongodb+srv://usefulio_admin:Q6qdmTfCDxDPsCUY@cluster1.elpvqpc.mongodb.net/?retryWrites=true&w=majority
DB_NAME=usefulio_db
NEXTAUTH_SECRET=KWDPj0TIfb365epMQ+Epp27hSfSgmTV+l/ftPXi5ohU=
CORS_ORIGINS=*
```

---

## ADIM ADIM KURULUM

### ADIM 1: Node.js Kurulu mu Kontrol

CMD/PowerShell açın ve şunu çalıştırın:

```bash
node --version
```

✅ Eğer versiyon çıkarsa (örn: v18.x.x) → Devam
❌ Eğer hata verirse → https://nodejs.org/en/download/ adresinden Node.js indirin

---

### ADIM 2: Vercel CLI Kurulumu

CMD'de şunu çalıştırın:

```bash
npm install -g vercel
```

**Süre:** ~1-2 dakika

---

### ADIM 3: Vercel Login

```bash
vercel login
```

**Ne olacak:**
- Tarayıcı açılacak
- Vercel hesabınızla giriş yapın
- "Authenticated!" mesajı göreceksiniz

---

### ADIM 4: Proje Klasörüne Git

Projeyi indirdiğiniz klasöre gidin. Örnek:

```bash
cd C:\Users\YourName\Downloads\usefulio-cms
```

**NOT:** Kendi proje yolunuzu yazın!

---

### ADIM 5: Deploy Başlat

```bash
vercel --prod
```

**Sorular gelecek:**

1. **Set up and deploy?** → `Y` (Enter)
2. **Which scope?** → Vercel hesabınızı seçin (Enter)
3. **Link to existing project?** → `N` (Enter)
4. **Project name?** → `tech-affiliate-pro` (veya istediğiniz)
5. **In which directory?** → `.` (Enter - mevcut klasör)
6. **Override settings?** → `N` (Enter)

---

### ADIM 6: Environment Variables Ekle

Deploy başladıktan sonra:

**Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**

Şunları ekleyin:

**1. MONGO_URL**
```
mongodb+srv://usefulio_admin:Q6qdmTfCDxDPsCUY@cluster1.elpvqpc.mongodb.net/?retryWrites=true&w=majority
```

**2. DB_NAME**
```
usefulio_db
```

**3. NEXTAUTH_SECRET**
```
KWDPj0TIfb365epMQ+Epp27hSfSgmTV+l/ftPXi5ohU=
```

**4. CORS_ORIGINS**
```
*
```

**Environment:** Production, Preview, Development (hepsini seçin)

---

### ADIM 7: Redeploy

Environment variables ekledikten sonra:

```bash
vercel --prod
```

Tekrar çalıştırın.

---

## BAŞARILI OLDUĞUNDA

Terminal şunu gösterecek:

```
✔ Production: https://tech-affiliate-pro.vercel.app [copied to clipboard]
```

**URL'i kopyalayın ve tarayıcıda açın!** 🎉

---

## SORUN GİDERME

### Hata: "Command not found: vercel"

**Çözüm:**
```bash
npm install -g vercel
```

### Hata: "Authentication required"

**Çözüm:**
```bash
vercel logout
vercel login
```

### Build hatası

**Çözüm:**
- Environment variables eklenmiş mi kontrol et
- Vercel Dashboard → Logs bölümüne bak
- Hata mesajını bana gönder

---

## HIZLI ÖZET

```bash
# 1. Vercel CLI kur
npm install -g vercel

# 2. Login
vercel login

# 3. Proje klasörüne git
cd C:\path\to\project

# 4. Deploy
vercel --prod

# 5. Environment variables ekle (Dashboard'dan)

# 6. Tekrar deploy
vercel --prod
```

---

**Hazırsınız!** 🚀
