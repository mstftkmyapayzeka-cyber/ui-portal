import { Globe, Mail, Users, Target, BookOpen, Lightbulb } from 'lucide-react'

export const metadata = {
  title: 'Hakkında',
  description: 'Uİ Portal hakkında bilgi ve iletişim',
}

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white py-16">
        <div className="container-custom text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Uİ Portal Hakkında
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Uluslararası İlişkiler disiplini için kapsamlı bir akademik içerik platformu
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title">Misyonumuz</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Uİ Portal, uluslararası ilişkiler alanında kaliteli, güvenilir ve 
              erişilebilir içerik sağlamayı amaçlar. Akademik makalelerden güncel 
              analizlere, podcast yayınlarından öğretici modüllere kadar geniş 
              bir içerik yelpazesi sunuyoruz.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Amacımız, uluslararası politika ve küresel meseleleri anlamak 
              isteyen herkese yardımcı olmak ve Uİ bilgisini yaygınlaştırmaktır.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, title: 'Kaliteli İçerik', desc: 'Akademik standartlarda' },
              { icon: Users, title: 'Herkes İçin', desc: 'Erişilebilir ve anlaşılır' },
              { icon: BookOpen, title: 'Sürekli Güncelleme', desc: 'Güncel bilgiler' },
              { icon: Lightbulb, title: 'Öğretici', desc: 'Kapsamlı modüller' },
            ].map((item) => (
              <div key={item.title} className="card p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-100 dark:bg-slate-800/50 py-16">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">Ne Sunuyoruz?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Günün Makaleleri',
                desc: 'Uluslararası ilişkiler alanındaki önemli akademik çalışmaların özetleri ve analizleri.',
              },
              {
                title: 'Derinlemesine Analizler',
                desc: 'Güncel olaylar ve teorik konular hakkında kapsamlı değerlendirmeler.',
              },
              {
                title: 'Güncel Gelişmeler',
                desc: 'Dünya genelinden uluslararası ilişkileri etkileyen önemli haberler.',
              },
              {
                title: 'Öğrenme Modülleri',
                desc: 'Uİ teorileri, kavramları ve temel konuları öğreten interaktif dersler.',
              },
              {
                title: 'Podcast & Video',
                desc: 'Uzmanlarla söyleşiler, tartışmalar ve eğitici video içerikleri.',
              },
              {
                title: 'Kaynaklar',
                desc: 'Kitaplar, makaleler, düşünürler ve faydalı araçlar rehberi.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-6">
                <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="iletisim" className="container-custom py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title text-center mb-8">İletişim</h2>
          
          <div className="card p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Adınız</label>
                  <input type="text" className="input" placeholder="Adınızı girin" />
                </div>
                <div>
                  <label className="label">E-posta</label>
                  <input type="email" className="input" placeholder="E-posta adresiniz" />
                </div>
              </div>
              
              <div>
                <label className="label">Konu</label>
                <select className="input">
                  <option>Genel Soru</option>
                  <option>İçerik Önerisi</option>
                  <option>Hata Bildirimi</option>
                  <option>İş Birliği</option>
                  <option>Diğer</option>
                </select>
              </div>
              
              <div>
                <label className="label">Mesajınız</label>
                <textarea 
                  className="input min-h-[120px]" 
                  placeholder="Mesajınızı yazın..."
                  rows={5}
                />
              </div>
              
              <button type="submit" className="btn-primary w-full">
                <Mail className="w-4 h-4 mr-2" />
                Gönder
              </button>
            </form>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-4">
              * Bu form henüz aktif değildir. E-posta entegrasyonu yakında eklenecektir.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}







