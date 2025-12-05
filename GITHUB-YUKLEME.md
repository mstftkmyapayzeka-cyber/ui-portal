# 📤 GitHub'a Yükleme Rehberi

## 🔧 ADIM 1: Git Kurulumu (Eğer yoksa)

### 1.1. Git'i İndirin
1. [git-scm.com/download/win](https://git-scm.com/download/win) adresine gidin
2. **"Download for Windows"** butonuna tıklayın
3. İndirilen dosyayı çalıştırın
4. Kurulum sırasında **"Next"** butonlarına tıklayın (varsayılan ayarlar yeterli)

### 1.2. Kurulumu Kontrol Edin
Terminal'i (PowerShell veya CMD) yeniden açın ve şu komutu çalıştırın:
```bash
git --version
```

Eğer bir versiyon numarası görürseniz (örn: `git version 2.42.0`), Git başarıyla kurulmuştur! ✅

---

## 📝 ADIM 2: GitHub Hesabı Oluşturma

1. [github.com](https://github.com) adresine gidin
2. **"Sign up"** butonuna tıklayın
3. Kullanıcı adı, email ve şifre girin
4. Hesabınızı oluşturun

---

## 🚀 ADIM 3: GitHub'da Repo Oluşturma

1. GitHub'a giriş yaptıktan sonra, sağ üst köşedeki **"+"** butonuna tıklayın
2. **"New repository"** seçin
3. Şunları doldurun:
   - **Repository name**: `ui-portal` (veya istediğiniz isim)
   - **Description**: "Uluslararası İlişkiler Portalı" (opsiyonel)
   - **Public** veya **Private** seçin (Public önerilir - ücretsiz)
4. **"Create repository"** butonuna tıklayın
5. ⚠️ **ÖNEMLİ**: Açılan sayfada **"…or push an existing repository from the command line"** bölümündeki komutları kopyalayın (sonra kullanacağız)

---

## 💻 ADIM 4: Kodunuzu GitHub'a Yükleme

### 4.1. Terminal'i Açın

1. Proje klasörünüze gidin: `C:\Users\atill\Uİ Web Sitesi2`
2. Klasör içindeyken, boş bir yere **sağ tıklayın**
3. **"Open in Terminal"** veya **"Open PowerShell window here"** seçin

### 4.2. Git Repo'yu Başlatın

Terminal'de şu komutları **sırayla** çalıştırın:

```bash
# 1. Git repo'yu başlat
git init

# 2. Tüm dosyaları ekle
git add .

# 3. İlk commit (kayıt)
git commit -m "İlk commit - Deploy için hazır"

# 4. Ana branch'i main olarak ayarla
git branch -M main
```

### 4.3. GitHub'a Bağlayın ve Yükleyin

Bu adımda kodunuzu GitHub'a yükleyeceğiz. Adım adım:

#### Adım 1: GitHub'da Repo Oluşturduktan Sonra

GitHub'da repo oluşturduktan sonra şöyle bir sayfa açılacak:

```
Quick setup — if you've done this kind of thing before
…or push an existing repository from the command line

git remote add origin https://github.com/KULLANICI-ADINIZ/ui-portal.git
git branch -M main
git push -u origin main
```

Bu komutları kopyalayın ama **henüz çalıştırmayın!** Önce lokal komutları çalıştırmamız gerekiyor.

#### Adım 2: GitHub Repo'nuzu Bilgisayarınıza Bağlayın

Terminal'de şu komutu çalıştırın (KULLANICI-ADINIZ'ı kendi GitHub kullanıcı adınızla değiştirin):

```bash
git remote add origin https://github.com/KULLANICI-ADINIZ/ui-portal.git
```

**Bu komut ne yapar?**
- `git remote add` = Uzak bir depo (GitHub) ekle
- `origin` = Bu deponun adı (standart isim)
- `https://github.com/...` = GitHub'daki repo'nuzun adresi

**Örnek:**
Eğer GitHub kullanıcı adınız `ahmet123` ise:
```bash
git remote add origin https://github.com/ahmet123/ui-portal.git
```

**Kontrol:**
Komut başarılı olursa hiçbir mesaj görünmez (normal). Hata varsa mesaj görürsünüz.

#### Adım 3: Kodunuzu GitHub'a Yükleyin

Şimdi kodunuzu GitHub'a gönderin:

```bash
git push -u origin main
```

**Bu komut ne yapar?**
- `git push` = Kodunuzu GitHub'a gönder
- `-u` = Bu bağlantıyı kaydet (bir daha `origin main` yazmaya gerek yok)
- `origin` = GitHub repo'nuz
- `main` = Ana branch (dal)

**Ne olacak?**
1. Terminal'de şunu görebilirsiniz: `Enumerating objects...`
2. Sonra: `Writing objects...`
3. Sonra: `Counting objects...`
4. Sonunda: `To https://github.com/...` mesajı görürsünüz

**İlk kez yapıyorsanız:**
- GitHub kullanıcı adınız istenebilir → Girin
- Şifre istenebilir → **AMA DİKKAT:** Normal şifre çalışmayabilir!
- Eğer şifre çalışmazsa → **Personal Access Token** kullanmanız gerekir (aşağıda anlatıldı)

#### Adım 4: Kontrol Edin

1. GitHub'a gidin: [github.com](https://github.com)
2. Repo'nuzu açın (ui-portal)
3. Tüm dosyalarınız orada görünüyorsa ✅ **BAŞARILI!**

---

## 🔍 Detaylı Örnek Senaryo

Diyelim ki GitHub kullanıcı adınız `mehmet` ve repo adınız `ui-portal`:

### 1. Terminal'de şu komutları çalıştırdınız:
```bash
git init          ✅
git add .         ✅
git commit -m "İlk commit"  ✅
git branch -M main ✅
```

### 2. GitHub'da repo oluşturdunuz:
- Repo adı: `ui-portal`
- URL: `https://github.com/mehmet/ui-portal`

### 3. Terminal'de bağlantıyı kurun:
```bash
git remote add origin https://github.com/mehmet/ui-portal.git
```
✅ Komut başarılı (mesaj yok)

### 4. Kodunuzu yükleyin:
```bash
git push -u origin main
```

**Terminal çıktısı şöyle olabilir:**
```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
Delta compression using up to 8 threads
Compressing objects: 100% (40/40), done.
Writing objects: 100% (45/45), 125.50 KiB | 2.50 MiB/s, done.
Total 45 (delta 5), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (5/5), done.
To https://github.com/mehmet/ui-portal.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **BAŞARILI!** Kodunuz GitHub'da!

---

## ❓ Sorun mu Var?

### "remote origin already exists"
**Sorun:** Daha önce bağlantı kurmuşsunuz.

**Çözüm:**
```bash
git remote remove origin
git remote add origin https://github.com/KULLANICI-ADINIZ/ui-portal.git
```

### "fatal: repository not found"
**Sorun:** Repo adı veya kullanıcı adı yanlış.

**Çözüm:**
- GitHub'da repo'nun gerçekten var olduğundan emin olun
- URL'yi kontrol edin: `https://github.com/KULLANICI-ADINIZ/ui-portal.git`
- Kullanıcı adınızı ve repo adını doğru yazdığınızdan emin olun

### "Authentication failed" veya şifre çalışmıyor
**Sorun:** GitHub artık şifre kabul etmiyor, token gerekiyor.

**Çözüm:** Aşağıdaki "Personal Access Token" bölümüne bakın.

---

## 🔑 ADIM 5: Personal Access Token (Gerekirse)

Eğer şifre ile giriş yapamıyorsanız:

### 5.1. Token Oluşturma

1. GitHub'da sağ üst köşeden profil resminize tıklayın
2. **"Settings"** seçin
3. Sol menüden **"Developer settings"** seçin
4. **"Personal access tokens"** > **"Tokens (classic)"** seçin
5. **"Generate new token"** > **"Generate new token (classic)"** tıklayın
6. Şunları doldurun:
   - **Note**: "Vercel Deploy" (açıklama)
   - **Expiration**: 90 days (veya istediğiniz süre)
   - **Select scopes**: `repo` kutusunu işaretleyin
7. **"Generate token"** butonuna tıklayın
8. ⚠️ **ÖNEMLİ**: Oluşturulan token'ı kopyalayın (bir daha gösterilmeyecek!)

### 5.2. Token ile Push

Terminal'de tekrar push yapın:
```bash
git push -u origin main
```

Kullanıcı adı sorduğunda: GitHub kullanıcı adınızı girin
Şifre sorduğunda: Oluşturduğunuz **token'ı** yapıştırın

---

## ✅ Kontrol

GitHub'a gidin ve repo'nuzu açın. Tüm dosyalarınız orada görünüyorsa başarılı! 🎉

---

## 🔄 Sonraki Adımlar

Kodunuzu güncelledikten sonra tekrar yüklemek için:

```bash
git add .
git commit -m "Güncelleme açıklaması"
git push
```

---

## ❓ Sorun mu Var?

### "git: command not found"
- Git kurulu değil, yukarıdaki ADIM 1'i tekrar yapın

### "fatal: not a git repository"
- `git init` komutunu çalıştırdınız mı?

### "remote origin already exists"
- Şu komutu çalıştırın: `git remote remove origin`
- Sonra tekrar `git remote add origin ...` komutunu çalıştırın

### "Authentication failed"
- Personal Access Token kullanmayı deneyin (ADIM 5)

---

**Kolay gelsin! 🚀**

