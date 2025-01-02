import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Ürün",
      links: [
        { text: "Özellikler", href: "#features" },
        { text: "Fiyatlandırma", href: "#pricing" },
        { text: "API", href: "/api-docs" },
        { text: "Entegrasyonlar", href: "/integrations" }
      ]
    },
    {
      title: "Şirket",
      links: [
        { text: "Hakkımızda", href: "/about" },
        { text: "Blog", href: "/blog" },
        { text: "Kariyer", href: "/careers" },
        { text: "İletişim", href: "/contact" }
      ]
    },
    {
      title: "Destek",
      links: [
        { text: "Yardım Merkezi", href: "/help" },
        { text: "Dokümantasyon", href: "/docs" },
        { text: "Durum", href: "/status" },
        { text: "Güvenlik", href: "/security" }
      ]
    },
    {
      title: "İletişim",
      items: [
        { icon: <Mail className="h-5 w-5" />, text: "info@whatsender.com" },
        { icon: <Phone className="h-5 w-5" />, text: "+90 (212) 123 45 67" },
        { icon: <MapPin className="h-5 w-5" />, text: "İstanbul, Türkiye" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links?.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
                {section.items?.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 dark:text-gray-400">
              © {currentYear} WhatSender. Tüm hakları saklıdır.
            </div>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 