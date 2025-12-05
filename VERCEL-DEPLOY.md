# 🚀 Vercel'e Deploy - Hızlı Rehber

Supabase hazırsa, sadece 2 adım kaldı!

---

## ✅ ADIM 1: Prisma'yı PostgreSQL'e Geçir

### 1.1. Dosyayı Aç
`prisma/schema.prisma` dosyasını açın.

### 1.2. Değiştir
Şu satırı bulun:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Şu şekilde değiştirin:
```prisma
datasource db {
  provider = "postgresql"  // sqlite yerine postgresql yazın
  url      = env("DATABASE_URL")
}
```

### 1.3. Kaydet
Dosyayı kaydedin. ✅

---

## ✅ ADIM 2: Vercel'e Deploy Et

### 2.1. GitHub'a Yükle (Eğer yoksa)

Terminal'de proje klasörünüzde:
```bash
git init
git add .
git commit -m "Deploy için hazır"
git branch -M main
git remote add origin https://github.com/KULLANICI-ADINIZ/ui-portal.git
git push -u origin main
```

> 💡 GitHub'da repo yoksa önce [github.com](https://github.com) üzerinden oluşturun.

### 2.2. Vercel'e Giriş Yap

1. [vercel.com](https://vercel.com) → "Sign Up"
2. **GitHub ile giriş yap** (en kolay)

### 2.3. Projeyi Ekle

1. **"Add New Project"** butonuna tıklayın
2. GitHub repo'nuzu seçin (ui-portal)
3. **"Import"** butonuna tıklayın

### 2.4. Environment Variables Ekleyin

**Environment Variables** bölümüne tıklayın ve şunları ekleyin:

| Değişken Adı | Değer | Nereden? |
|-------------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (uzun metin) | Supabase Settings > API > anon public key |
| `DATABASE_URL` | `postgresql://postgres:ŞİFRENİZ@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1` | Supabase Settings > Database > Connection string (URI) |
| `NEXTAUTH_SECRET` | Rastgele 32 karakter | Aşağıda nasıl oluşturacağınızı göreceksiniz |
| `NEXTAUTH_URL` | `https://ui-portal.vercel.app` | Deploy sonrası gerçek URL ile güncelleyeceğiz |

#### NEXTAUTH_SECRET Oluşturma:

Terminal'de (veya PowerShell'de):
```bash
openssl rand -base64 32
```

Çıkan metni kopyalayıp `NEXTAUTH_SECRET` değeri olarak yapıştırın.

> ⚠️ **ÖNEMLİ**: `DATABASE_URL`'de `?pgbouncer=true&connection_limit=1` eklemeyi unutmayın!

### 2.5. Deploy!

1. Tüm environment variables'ı ekledikten sonra
2. **"Deploy"** butonuna tıklayın
3. ⏳ 2-3 dakika bekleyin

---

## ✅ ADIM 3: Veritabanını Hazırla

Deploy tamamlandıktan sonra:

### 3.1. Lokal Terminal'den

1. Proje klasörünüzde `.env` dosyası oluşturun:
```env
DATABASE_URL="postgresql://postgres:ŞİFRENİZ@db.xxxxx.supabase.co:5432/postgres"
NEXTAUTH_SECRET="az-önce-oluşturduğunuz-secret"
ADMIN_EMAIL="admin@ui-portal.com"
ADMIN_PASSWORD="güvenli-şifre"
```

2. Terminal'de şu komutları çalıştırın:
```bash
npx prisma migrate deploy
npm run db:seed
```

> 💡 `db:seed` komutu admin kullanıcısını oluşturur.

### 3.2. NEXTAUTH_URL'i Güncelle

1. Vercel dashboard'da projenize gidin
2. **Settings** > **Environment Variables**
3. `NEXTAUTH_URL` değerini bulun
4. Gerçek domain'inizle güncelleyin (örn: `https://ui-portal-xyz.vercel.app`)
5. **"Redeploy"** yapın

---

## ✅ Bitti!

Artık siteniz canlıda! 🎉

### Kontrol:
- Site: Vercel dashboard'da **"Visit"** butonuna tıklayın
- Admin: `https://siteniz.vercel.app/admin/login`

---

## ❓ Sorun mu Var?

### Build Hatası
- Vercel dashboard'da **"Deployments"** sekmesine gidin
- Son deployment'a tıklayın
- Hata mesajını okuyun
- Genellikle environment variable eksikliğidir

### Veritabanı Bağlantı Hatası
- `DATABASE_URL`'de şifrenin doğru olduğundan emin olun
- Connection string'de `?pgbouncer=true&connection_limit=1` ekli mi kontrol edin

### Admin Giriş Yapamıyorum
- `npm run db:seed` komutunu çalıştırdınız mı?
- `.env` dosyasındaki `ADMIN_EMAIL` ve `ADMIN_PASSWORD` değerlerini kontrol edin

---

**Kolay gelsin! 🚀**

