import React from 'react';
import { Card, CardContent } from '../ui/card';
import { 
  Upload, Bot, Shield, MessageCircle, 
  Users, Database, Clock, Zap, Settings
} from 'lucide-react';

const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: <Upload className="h-12 w-12 text-primary-600" />,
      title: "Kolay Veri Yükleme",
      desc: "Excel, CSV ve VCF dosyalarını sürükle-bırak ile kolayca yükleyin",
      details: [
        "Otomatik format algılama",
        "Akıllı veri temizleme",
        "Hatalı numara düzeltme",
        "Çoklu dosya desteği"
      ]
    },
    {
      icon: <Bot className="h-12 w-12 text-primary-600" />,
      title: "AI Destekli Mesajlaşma",
      desc: "Yapay zeka ile kişiselleştirilmiş mesajlar oluşturun",
      details: [
        "Otomatik mesaj önerileri",
        "Kişiselleştirilmiş şablonlar",
        "Dil ve ton analizi",
        "Optimizasyon önerileri"
      ]
    },
    {
      icon: <Shield className="h-12 w-12 text-primary-600" />,
      title: "Güvenli Gönderim",
      desc: "WhatsApp politikalarına uygun toplu mesaj gönderimi",
      details: [
        "Mesaj hız kontrolü",
        "Spam koruması",
        "Otomatik zamanlama",
        "Gönderim raporları"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: <MessageCircle />,
      title: "Grup Yönetimi",
      desc: "Akıllı grup oluşturma ve yönetimi"
    },
    {
      icon: <Users />,
      title: "Çoklu Kullanıcı",
      desc: "Takım çalışması desteği"
    },
    {
      icon: <Database />,
      title: "Veri Analizi",
      desc: "Detaylı raporlar ve analizler"
    },
    {
      icon: <Clock />,
      title: "Zamanlama",
      desc: "Otomatik mesaj zamanlama"
    },
    {
      icon: <Zap />,
      title: "Hızlı Entegrasyon",
      desc: "Kolay API entegrasyonu"
    },
    {
      icon: <Settings />,
      title: "Özelleştirme",
      desc: "Tam kontrol ve esneklik"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Öne Çıkan Özellikler
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            İşletmenizi büyütmek için ihtiyacınız olan tüm araçlar
          </p>
        </div>

        {/* Ana Özellikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary-50 dark:bg-primary-900/50 p-6 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{feature.desc}</p>
                  <ul className="space-y-2 text-left w-full">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ek Özellikler */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {additionalFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center group cursor-pointer"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform">
                {React.cloneElement(feature.icon, { 
                  className: "h-8 w-8 text-primary-600 mx-auto" 
                })}
              </div>
              <h4 className="font-semibold mb-2 dark:text-white">{feature.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;