# 🔧 Git Commit Hatası Çözümü

## ❌ Aldığınız Hata:
```
error: switch 'm' requires a value
```

## 🔍 Sorun Ne?
`git commit -m` komutunu çalıştırdınız ama `-m` parametresinden sonra mesaj yazmadınız.

## ✅ Doğru Kullanım:

### ❌ YANLIŞ:
```bash
git commit -m
```

### ✅ DOĞRU:
```bash
git commit -m "İlk commit - Deploy için hazır"
```

**ÖNEMLİ:** 
- `-m` parametresinden sonra **tırnak işaretleri içinde** bir mesaj yazmanız gerekiyor
- Mesajı tırnak işaretleri (`"..."`) içinde yazın

---

## 📝 Örnek Commit Mesajları:

```bash
# Basit mesaj
git commit -m "İlk commit"

# Açıklayıcı mesaj
git commit -m "İlk commit - Deploy için hazır"

# Türkçe karakterler de çalışır
git commit -m "Proje hazır, GitHub'a yüklenecek"
```

---

## 🚀 Şimdi Ne Yapmalısınız?

Terminal'de şu komutu çalıştırın:

```bash
git commit -m "İlk commit - Deploy için hazır"
```

**Dikkat:** 
- Tırnak işaretlerini (`"`) unutmayın!
- Mesajı tırnak içinde yazın
- Enter'a basın

---

## ✅ Başarı Kontrolü

Commit başarılı olduğunda şunu göreceksiniz:
```
[main (root-commit) abc1234] İlk commit - Deploy için hazır
 X files changed, Y insertions(+)
```

Sonra devam edebilirsiniz:
```bash
git branch -M main
git push -u origin main
```

---

**Kolay gelsin! 🚀**

