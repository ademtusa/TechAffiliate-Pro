# 🔄 EMERGENT İLE GÜNCELLEME PROTOKOLÜ

## 📋 GERİ GELDİĞİNİZDE YAPILACAKLAR

### 1. Mevcut Durumu Bildir

```
Örnek:
"Merhaba! Usefulio CMS projemi güncellemeye geldim.

Yapmak istediğim:
- Contact sayfasına harita eklemek
- Yeni kategori sistemi
- [Diğer istekler]

Site şu anda canlı: https://usefulio.com
Son değişiklik: [tarih]
"
```

### 2. Agent Projeyi Tanır

Agent otomatik olarak şunları kontrol eder:
- `test_result.md` - Önceki çalışmalar
- `product_requirements` - Proje hedefi
- `code_architecture` - Dosya yapısı
- Son commit durumu

### 3. Güncelleme Süreci

**ADIM 1: Plan**
- Agent detaylı plan sunar
- Kredi tahmini verir
- Onayınızı bekler

**ADIM 2: Uygulama**
- Değişiklikleri yapar
- Test eder
- Screenshot alır

**ADIM 3: Deployment**
- Size yeni dosyaları verir
- Deployment talimatları sunar

---

## 📁 PROJE DOSYA YÖNETİMİ

### Önemli Dosyalar (Asla Silmeyin):

```
/app/
├── test_result.md          # Test geçmişi ve hatırlatmalar
├── DEPLOYMENT_GUIDE.md     # Deployment kılavuzu
├── UPDATE_PROTOCOL.md      # Bu dosya
├── package.json            # Dependencies
├── .env                    # Environment variables
└── middleware.js           # Auth kontrolü
```

### Güncelleme Sonrası Saklanacaklar:

```bash
# Değişen dosyalar için backup
mkdir /app/updates/$(date +%Y%m%d)
cp [değişen-dosyalar] /app/updates/$(date +%Y%m%d)/
```

---

## 🎯 GÜNCELLEMELER İÇİN İPUÇLARI

### ✅ İyi Örnekler:

```
✓ "Resources sayfasına filtreleme ekle"
✓ "Admin panelde ürün sıralama özelliği"
✓ "Contact formuna dosya upload"
✓ "Dashboard'a istatistik grafikleri"
```

### ❌ Belirsiz İstekler:

```
✗ "Siteyi güzelleştir"
✗ "Bir şeyler ekle"
✗ "Daha iyi yap"
```

### 💡 Detaylı İstek Örneği:

```
"Admin panel Users sayfasına şu özellikleri ekle:
1. Excel export butonu (kullanıcı listesi)
2. Email gönderme (seçili kullanıcılara)
3. Son login tarihi kolonu
4. Kullanıcı arama (isim, email)

Tasarım: Mevcut sayfa stilini koru
Kredi limiti: Max 50 kredi
"
```

---

## 🔒 GÜVENLİK - BACKUP STRATEJİSİ

### Güncelleme Öncesi:

```bash
# 1. Database backup
mongodump --uri="$MONGO_URL" --out=/tmp/backup_$(date +%Y%m%d)

# 2. Dosya backup
zip -r backup_$(date +%Y%m%d).zip /app -x "node_modules/*"

# 3. Hostinger'da snapshot al
# Panel → Backups → Create Snapshot
```

### Sorun Olursa Geri Dönüş:

```bash
# 1. Önceki backup'ı restore et
mongorestore --uri="$MONGO_URL" /tmp/backup_YYYYMMDD

# 2. Dosyaları geri yükle
unzip backup_YYYYMMDD.zip -d /app

# 3. Rebuild
npm run build
pm2 restart usefulio
```

---

## 📊 GÜNCELLEME KAYITLARI

### Her güncelleme sonrası not alın:

```markdown
## Güncelleme - [TARİH]

**Yapılan Değişiklikler:**
- Contact sayfası layout güncellendi
- Admin panel user export eklendi

**Değişen Dosyalar:**
- /app/contact/page.js
- /app/admin-panel/users/page.js
- /app/api/admin/users/export/route.js

**Kredi Kullanımı:** 15
**Test Durumu:** ✅ Başarılı
**Live URL:** https://usefulio.com
```

---

## 🆘 SORUN GİDERME

### "Agent projeyi tanımıyor"

```
Çözüm:
"Son kaldığımız yer: Contact sayfası düzenlemesiydi.
Proje: Usefulio CMS (Next.js + MongoDB)
Dosya: /app/app/contact/page.js değiştirilmişti."
```

### "Güncelleme çalışmıyor"

```bash
# 1. Logları paylaş
pm2 logs usefulio --lines 50

# 2. Test sonuçlarını paylaş
curl https://usefulio.com/api/products

# 3. Agent'a detaylı bilgi ver
```

### "Deployment başarısız"

```
Agent'a şunu söyle:
"Deployment sırasında şu hata aldım:
[hata mesajı]

Yaptığım adımlar:
1. ZIP yükledim
2. npm install çalıştırdım
3. npm run build hata verdi

Ne yapmalıyım?"
```

---

## ✅ GÜNCELLEME ÖNCESİ CHECKLIST

- [ ] Canlı site backup alındı
- [ ] Database backup alındı  
- [ ] Agent'a detaylı istek yazıldı
- [ ] Kredi limiti belirlendi
- [ ] Acil durumda geri dönüş planı var

---

## 🎓 BEST PRACTICES

1. **Küçük güncellemeler yapın** (Tek seferde 1-2 özellik)
2. **Test edin sonra deploy edin** (Emergent'ta test → Canlıya al)
3. **Backup alın her zaman**
4. **Değişiklikleri kaydedin** (Hangi dosyalar değişti)
5. **Agent'ı bilgilendirin** ("Son seferde X yaptık, şimdi Y istiyorum")

---

**HAZIRSINIZ! Agent sizi bekliyor! 🚀**