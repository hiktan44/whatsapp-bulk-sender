import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Play, MessageCircle, Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary-200 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent leading-tight">
            WhatsApp İle İletişimde Yeni Dönem
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Yapay zeka destekli özellikler, otomatik mesaj oluşturma ve toplu gönderim ile 
            müşterilerinizle iletişimi güçlendirin.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-lg h-14 px-8 animate-pulse w-full md:w-auto"
              onClick={() => navigate('/dashboard')}
            >
              Hemen Başla <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg h-14 px-8 border-primary-600 text-primary-600 w-full md:w-auto group hover:bg-primary-50"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> 
              Nasıl Çalışır?
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50+", label: "Mesaj/Dakika" },
              { number: "1000+", label: "Aktif Kullanıcı" },
              { number: "5M+", label: "Gönderilen Mesaj" },
              { number: "99.9%", label: "Başarı Oranı" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Preview Image */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-100/20 to-white/20 backdrop-blur-sm rounded-2xl"></div>
            <img 
              src="/images/dashboard-preview.png" 
              alt="Dashboard Preview" 
              className="rounded-2xl shadow-2xl mx-auto transform hover:scale-105 transition-transform duration-500"
            />
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 animate-bounce-slow">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                <MessageCircle className="text-primary-600 h-8 w-8" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 animate-bounce-slow delay-300">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                <Send className="text-primary-600 h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;