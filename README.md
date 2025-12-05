# Uİ Portal - Uluslararası İlişkiler Platformu

Modern, profesyonel ve akademik bir Uluslararası İlişkiler (Uİ) içerik portalı. Next.js 14, TypeScript, TailwindCSS, Prisma ve SQLite ile geliştirilmiştir.

## 🌟 Özellikler

### Kamuya Açık Site
- **Anasayfa**: Bugünün Kavramı, son makaleler, analizler ve podcastler
- **Günün Makaleleri**: Akademik makalelerin özetleri ve analizleri
- **Güncel Gelişmeler**: Bölge ve kategoriye göre filtrelenebilir haberler
- **Analizler**: Derinlemesine uluslararası ilişkiler analizleri
- **Uİ Öğren**: İnteraktif öğrenme modülleri, quiz soruları
- **Podcastler**: MP4 formatında video/podcast içerikleri
- **Kaynaklar**: Kitaplar, makaleler, düşünürler ve araçlar
- **Global Arama**: Tüm içerik türlerinde arama
- **Etiket Sistemi**: Etiketlere göre içerik keşfi
- **Favoriler**: localStorage tabanlı favori sistemi
- **Işık/Karanlık Tema**: Kullanıcı tercihine göre tema

### Yönetici Paneli
- Güvenli admin girişi (NextAuth)
- Tüm içerik türleri için CRUD işlemleri
- MP4 ve görsel dosya yükleme
- Taslak/Yayınla durumu kontrolü
- Dashboard istatistikleri
- Son güncellenen içerikler listesi

## 🛠️ Teknoloji Yığını

- **Framework**: Next.js 14 (App Router)
- **Dil**: TypeScript
- **Stil**: TailwindCSS
- **Veritabanı**: Prisma ORM + SQLite (PostgreSQL'e geçişe uygun)
- **Kimlik Doğrulama**: NextAuth.js (Credentials Provider)
- **İkonlar**: Lucide React

## 📦 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

Proje kök dizininde `.env` dosyası oluşturun:

```env
# Veritabanı
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="en-az-32-karakter-uzunlugunda-gizli-anahtar"
NEXTAUTH_URL="http://localhost:3000"

# Admin Kimlik Bilgileri
ADMIN_EMAIL="admin@ui-portal.com"
ADMIN_PASSWORD="admin123"

# Dosya Yükleme
MAX_FILE_SIZE_MB=100
UPLOAD_DIR="public/uploads"
```

> ⚠️ **ÖNEMLİ**: Üretim ortamında `NEXTAUTH_SECRET` ve `ADMIN_PASSWORD` değerlerini mutlaka değiştirin!

### 3. Veritabanını Oluşturun

```bash
# Prisma migration'ları çalıştır
npx prisma migrate dev --name init

# Admin kullanıcısını oluştur (seed)
npm run db:seed
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🔑 Admin Girişi

1. `http://localhost:3000/admin/login` adresine gidin
2. `.env` dosyasında belirlediğiniz kimlik bilgilerini kullanın:
   - E-posta: `admin@ui-portal.com` (veya ADMIN_EMAIL değeri)
   - Şifre: `admin123` (veya ADMIN_PASSWORD değeri)

## 📝 İçerik Yönetimi Rehberi

### Yeni Makale Eklemek
1. Admin paneline giriş yapın
2. Sol menüden "Makaleler" seçin
3. "Yeni Makale" butonuna tıklayın
4. Başlık, yazarlar, özet ve diğer bilgileri girin
5. Etiketleri virgülle ayırarak ekleyin
6. "Yayınla" seçeneğini işaretleyin (taslak kalmasını istiyorsanız işaretlemeyin)
7. "Oluştur" butonuna tıklayın

### Podcast Yüklemek
1. Admin panelinde "Podcastler" > "Yeni Podcast" seçin
2. Başlık, konu ve açıklama girin
3. MP4 dosyasını yükleyin (max 100MB varsayılan)
4. İsteğe bağlı thumbnail görseli ekleyin
5. "Öne Çıkan" olarak işaretlemek isterseniz kutuyu işaretleyin
6. "Yayınla" ve "Oluştur" butonlarına tıklayın

### Bugünün Kavramı
1. "Kavramlar" bölümüne gidin
2. Yeni kavram ekleyin: ad, kısa tanım (2-3 cümle), ilgili teori
3. "Yayınla" olarak işaretleyin
4. Anasayfada rastgele bir yayınlanmış kavram gösterilecektir

## 📁 Proje Yapısı

```
├── prisma/
│   ├── schema.prisma      # Veritabanı şeması
│   └── seed.ts            # Admin kullanıcı oluşturma
├── public/
│   └── uploads/           # Yüklenen dosyalar
├── src/
│   ├── app/
│   │   ├── (public)/      # Kamuya açık sayfalar
│   │   ├── admin/         # Yönetici paneli
│   │   └── api/           # API route'ları
│   ├── components/
│   │   ├── admin/         # Admin bileşenleri
│   │   ├── cards/         # Kart bileşenleri
│   │   ├── layout/        # Layout bileşenleri
│   │   ├── providers/     # Context provider'lar
│   │   └── ui/            # UI bileşenleri
│   ├── hooks/             # Custom React hook'ları
│   ├── lib/               # Yardımcı fonksiyonlar
│   └── types/             # TypeScript tipleri
```

## 🗄️ Veritabanı Modelleri

- **Article**: Akademik makaleler
- **NewsItem**: Güncel gelişmeler/haberler
- **Analysis**: Derinlemesine analizler
- **LearningModule**: Öğrenme modülleri
- **Podcast**: Video/podcast içerikleri
- **Resource**: Kaynaklar ve araçlar
- **Concept**: Bugünün Kavramı için tanımlar
- **AdminUser**: Yönetici kullanıcıları

## 🚀 Üretim Dağıtımı (Vercel + Supabase)

### Adım 1: Supabase Projesini Hazırlayın

1. [Supabase Dashboard](https://app.supabase.com)'a gidin ve projenizi oluşturun
2. **Settings > API** bölümünden şu bilgileri alın:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Settings > Database > Connection string** bölümünden PostgreSQL bağlantı string'ini alın (URI mode seçin)

### Adım 2: Prisma'yı PostgreSQL'e Geçirin

1. `prisma/schema.prisma` dosyasında provider'ı değiştirin:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Supabase PostgreSQL connection string'ini kullanarak migration'ları çalıştırın:
```bash
# Supabase connection string ile migration
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" npx prisma migrate deploy
```

3. Admin kullanıcısını oluşturun:
```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" npm run db:seed
```

### Adım 3: Vercel'e Deploy Edin

#### 3.1. GitHub'a Push Edin

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/kullaniciadi/ui-portal.git
git push -u origin main
```

#### 3.2. Vercel Projesi Oluşturun

1. [Vercel](https://vercel.com)'e gidin ve GitHub hesabınızla giriş yapın
2. **Add New Project** butonuna tıklayın
3. GitHub repo'nuzu seçin
4. **Framework Preset**: Next.js (otomatik algılanır)
5. **Root Directory**: `./` (varsayılan)

#### 3.3. Environment Variables Ekleyin

Vercel proje ayarlarında **Settings > Environment Variables** bölümüne şu değişkenleri ekleyin:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1

# NextAuth
NEXTAUTH_SECRET=generate-a-random-32-character-secret-here
NEXTAUTH_URL=https://your-app.vercel.app

# Admin (opsiyonel, sadece seed için)
ADMIN_EMAIL=admin@ui-portal.com
ADMIN_PASSWORD=your-secure-password

# File Upload (opsiyonel)
MAX_FILE_SIZE_MB=100
```

> 💡 **NEXTAUTH_SECRET** oluşturmak için: `openssl rand -base64 32` komutunu çalıştırabilirsiniz.

#### 3.4. Deploy

1. **Deploy** butonuna tıklayın
2. Build tamamlandıktan sonra siteniz canlıda olacak!

### Adım 4: İlk Migration'ı Çalıştırın

Vercel deploy sonrası, Supabase veritabanına migration'ları uygulayın:

```bash
# Lokal terminalden (DATABASE_URL ile)
npx prisma migrate deploy
```

Veya Vercel CLI ile:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### ⚠️ Önemli Notlar

- **Dosya Yükleme**: Vercel'de dosya sistemi geçici olduğu için, dosya yükleme için Supabase Storage kullanmanız önerilir
- **Database Connection**: Supabase connection string'inde `?pgbouncer=true&connection_limit=1` parametrelerini ekleyin (Vercel için önemli)
- **Build Timeout**: İlk build biraz uzun sürebilir, sabırlı olun

### 🆓 Ücretsiz Limitler

- **Vercel**: Sınırsız bandwidth, 100GB storage, otomatik SSL
- **Supabase**: 500MB database, 1GB file storage, 2GB bandwidth/ay

### 🔄 Güncellemeler

Kodunuzu güncelledikten sonra:
```bash
git add .
git commit -m "Update"
git push
```

Vercel otomatik olarak yeni bir deploy başlatacaktır!

## 🔧 Faydalı Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Üretim build
npm run build

# Üretim sunucusu
npm start

# Prisma Studio (veritabanı görüntüleyici)
npm run db:studio

# Migration oluştur
npm run db:migrate

# Veritabanını seed'le
npm run db:seed
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Bu repo'yu fork'layın
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Add amazing feature'`)
4. Branch'e push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

**Uİ Portal** - Uluslararası İlişkiler disiplini için kapsamlı bir akademik içerik platformu.

