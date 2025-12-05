import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Veritabanı seed işlemi başlatılıyor...')

  // Admin kullanıcısı oluştur
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ui-portal.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log('✅ Admin kullanıcısı zaten mevcut:', adminEmail)
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12)

    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Portal Yöneticisi',
      },
    })

    console.log('✅ Admin kullanıcısı oluşturuldu:', adminEmail)
  }

  console.log('')
  console.log('🎉 Seed işlemi tamamlandı!')
  console.log('')
  console.log('📝 Admin Giriş Bilgileri:')
  console.log(`   E-posta: ${adminEmail}`)
  console.log(`   Şifre: ${adminPassword}`)
  console.log('')
  console.log('⚠️  ÖNEMLİ: Lütfen üretim ortamında bu bilgileri değiştirin!')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })







