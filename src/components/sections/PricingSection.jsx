import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Başlangıç",
      price: "99",
      period: "ay",
      description: "Küçük işletmeler için ideal başlangıç paketi",
      features: [
        "Aylık 1000 mesaj",
        "Temel AI önerileri",
        "Excel/CSV import",
        "Temel raporlama",
        "Email destek"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "299",
      period: "ay",
      description: "Büyüyen işletmeler için tam donanımlı paket",
      features: [
        "Sınırsız mesaj",
        "AI mesaj önerileri",
        "Gelişmiş raporlama",
        "API erişimi",
        "Öncelikli destek",
        "Özel şablonlar",
        "Çoklu kullanıcı"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Özel",
      period: "",
      description: "Kurumsal şirketler için özel çözümler",
      features: [
        "Özel API limitleri",
        "Özel AI modeli",
        "7/24 destek",
        "SLA garantisi",
        "Özel entegrasyonlar",
        "Yerinde kurulum",
        "Teknik danışmanlık"
      ],
      highlighted: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Fiyatlandırma
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            İhtiyacınıza en uygun paketi seçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative ${
                plan.highlighted 
                  ? 'border-2 border-primary-500 shadow-2xl scale-105' 
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Popüler
                  </span>
                </div>
              )}
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {plan.price === "Özel" ? "" : "₺"}{plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary-500" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-primary-500 text-primary-500'
                  }`}
                >
                  {plan.price === "Özel" ? "İletişime Geç" : "Hemen Başla"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 