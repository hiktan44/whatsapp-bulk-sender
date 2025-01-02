{
  `path`: `README.md`,
  `repo`: `whatsapp1-project`,
  `owner`: `hikmettanriverdi`,
  `branch`: `main`,
  `content`: `# WhatsApp İletişim Yönetim Sistemi

Bu proje, WhatsApp üzerinden toplu mesaj yönetimi, kişi listesi yönetimi ve otomatik mesajlaşma özelliklerini içeren kapsamlı bir iletişim sistemidir.

## 🚀 Temel Özellikler

### 📬 Toplu Mesaj Yönetimi
- WhatsApp Web entegrasyonu
- WhatsApp Business API desteği
- Değişken bazlı dinamik mesaj şablonları
- Kişiselleştirilmiş toplu mesaj gönderimi
- Mesaj durumu takibi ve raporlama
- Landing page formatında zengin mesaj içeriği

### 👥 Rehber Yönetimi
- Çoklu format desteği ile kontak içe aktarma:
  - Excel (.xlsx, .xls)
  - CSV
  - PDF
  - VCF (vCard)
- Otomatik format standardizasyonu
- Toplu kontak düzenleme
- Hatalı/eksik numara tespiti
- Standartlaştırılmış rehberi farklı formatlarda dışa aktarma
- Duplike kayıt tespiti ve temizleme

### 📋 Şablon Yönetimi
- Dinamik değişken desteği
  - {AD}
  - {SOYAD}
  - {FİRMA}
  - {ÜNVAN}
  - Özel değişkenler tanımlama
- Şablon kütüphanesi
- Zengin metin editörü
- Medya ekleyebilme (görsel, video, dosya)
- Şablon test önizleme

### 📊 Raporlama ve Analiz
- Mesaj iletim durumu
- Okunma istatistikleri
- Tıklanma oranları (landing page için)
- Hata raporları
- Excel/PDF formatında rapor çıktısı

## 🛠️ Teknoloji Altyapısı

### Frontend
- React.js
- Tailwind CSS
- Material-UI
- Socket.io-client

### Backend
- Node.js
- Express.js
- MongoDB
- WhatsApp Web.js
- WhatsApp Business API
- Socket.io

### Dosya İşleme
- Excel.js
- Papa Parse (CSV)
- pdf.js
- vCard Parser

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/hikmettanriverdi/whatsapp1-project.git
cd whatsapp1-project
```

2. Bağımlılıkları yükleyin:
```bash
# Frontend için
cd client
npm install

# Backend için
cd ../server
npm install
```

3. Çevre değişkenlerini ayarlayın:
```bash
# .env dosyasını oluşturun
cp .env.example .env

# Gerekli değişkenleri düzenleyin:
- WHATSAPP_API_KEY
- MONGODB_URI
- JWT_SECRET
```

4. Uygulamayı başlatın:
```bash
# Backend
cd server
npm run dev

# Frontend (yeni terminal)
cd client
npm start
```

## 💡 Kullanım Örnekleri

### Toplu Mesaj Gönderimi
```javascript
// Örnek şablon
const template = \"Sayın {AD} {SOYAD}, 
{FİRMA} firmanız için hazırladığımız teklifimizi 
incelemek için aşağıdaki linke tıklayabilirsiniz: 
{LINK}\"

// Değişken seti
const variables = {
  AD: \"Hikmet\",
  SOYAD: \"Tanrıverdi\",
  FİRMA: \"Tech Corp\",
  LINK: \"https://example.com/teklif\"
}
```

### Rehber İçe Aktarma
```javascript
// Excel dosyasından rehber aktarma
import * as XLSX from 'xlsx';

const workbook = XLSX.readFile('rehber.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const contacts = XLSX.utils.sheet_to_json(sheet);
```

## 📱 WhatsApp Entegrasyonu

### WhatsApp Web
- QR kod ile bağlantı
- Oturum yönetimi
- Multi-device desteği

### WhatsApp Business API
- Resmi API entegrasyonu
- Şablon mesaj desteği
- Webhook entegrasyonu
- Otomatik mesaj yanıtlama

## 🔒 Güvenlik

- End-to-end şifreleme
- Rate limiting
- IP bazlı erişim kontrolü
- Dosya upload güvenliği
- API key rotasyonu

## 📊 Veri Yönetimi

### İçe Aktarma
- Excel (.xlsx, .xls)
- CSV
- PDF (OCR desteği)
- VCF (vCard)

### Dışa Aktarma
- Excel
- CSV
- VCF
- PDF

## 🤝 Destek ve İletişim

Hikmet Tanrıverdi
- GitHub: [@hikmettanriverdi](https://github.com/hikmettanriverdi)
- E-posta: [email protected]

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.`,
  `message`: `Update README with additional features`
}