import { motion } from "framer-motion";
import { Route, Send, Instagram, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Направления",
      links: [
        { name: "Карелия", href: "#" },
        { name: "Алтай", href: "#" },
        { name: "Байкал", href: "#" },
        { name: "Камчатка", href: "#" },
        { name: "Золотое кольцо", href: "#" },
      ],
    },
    {
      title: "Компания",
      links: [
        { name: "О нас", href: "#" },
        { name: "Контакты", href: "#" },
        { name: "Вакансии", href: "#" },
        { name: "Партнерство", href: "#" },
        { name: "Блог", href: "#" },
      ],
    },
    {
      title: "Поддержка",
      links: [
        { name: "Помощь", href: "#" },
        { name: "Условия", href: "#" },
        { name: "Конфиденциальность", href: "#" },
        { name: "Возврат", href: "#" },
        { name: "Страхование", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Send, href: "#", name: "Telegram" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: MapPin, href: "#", name: "ВКонтакте" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-xl flex items-center justify-center">
                <Route className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">Пикми трип</span>
            </div>
            <p className="text-gray-400 mb-4">
              Спонтанные путешествия по России. Открывайте новые места каждые выходные.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="text-gray-400 hover:text-emerald-400 transition-colors transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
          
          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
            >
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.4 + sectionIndex * 0.1 + linkIndex * 0.05 
                    }}
                  >
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
        >
          <p>&copy; {currentYear} Пикми трип. Все права защищены.</p>
        </motion.div>
      </div>
    </footer>
  );
}
