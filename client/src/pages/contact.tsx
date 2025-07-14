import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Headphones } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Phone,
      title: "Телефон",
      details: ["+7 (495) 123-45-67", "+7 (800) 555-35-35"],
      subtitle: "Звоните с 9:00 до 21:00 МСК"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@pickmytrip.ru", "support@pickmytrip.ru"],
      subtitle: "Отвечаем в течение 2 часов"
    },
    {
      icon: MapPin,
      title: "Офис",
      details: ["г. Москва, ул. Тверская, 15", "БЦ 'Централь', офис 401"],
      subtitle: "Пн-Пт с 9:00 до 18:00"
    },
    {
      icon: MessageCircle,
      title: "Мессенджеры",
      details: ["Telegram: @pickmytrip", "WhatsApp: +7 (495) 123-45-67"],
      subtitle: "Быстрые ответы 24/7"
    }
  ];

  const faqCategories = [
    { value: "booking", label: "Вопросы о бронировании" },
    { value: "payment", label: "Оплата и возврат" },
    { value: "travel", label: "Во время путешествия" },
    { value: "technical", label: "Технические вопросы" },
    { value: "partnership", label: "Сотрудничество" },
    { value: "other", label: "Другое" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Симуляция отправки формы
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Сообщение отправлено!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-16 relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Beautiful landscape background with SVG */}
        <div className="absolute inset-0 z-0">
          <svg
            viewBox="0 0 1200 800"
            className="w-full h-full object-cover"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="30%" stopColor="#E0F6FF" />
                <stop offset="100%" stopColor="#FFE4B5" />
              </linearGradient>
              <linearGradient id="mountainGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4A5568" />
                <stop offset="100%" stopColor="#2D3748" />
              </linearGradient>
              <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#718096" />
                <stop offset="100%" stopColor="#4A5568" />
              </linearGradient>
              <linearGradient id="lakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#63B3ED" />
                <stop offset="100%" stopColor="#3182CE" />
              </linearGradient>
              <linearGradient id="forestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38A169" />
                <stop offset="100%" stopColor="#2F855A" />
              </linearGradient>
            </defs>
            
            {/* Sky */}
            <rect width="1200" height="800" fill="url(#skyGradient)" />
            
            {/* Mountains */}
            <polygon points="0,400 200,250 400,350 600,200 800,300 1000,150 1200,250 1200,800 0,800" fill="url(#mountainGradient1)" opacity="0.9" />
            <polygon points="100,500 350,350 550,450 750,300 950,400 1200,350 1200,800 0,800" fill="url(#mountainGradient2)" opacity="0.7" />
            
            {/* Forest */}
            <polygon points="0,600 200,550 400,580 600,560 800,590 1000,570 1200,580 1200,800 0,800" fill="url(#forestGradient)" />
            
            {/* Lake */}
            <ellipse cx="600" cy="650" rx="300" ry="80" fill="url(#lakeGradient)" opacity="0.8" />
            
            {/* Trees */}
            <circle cx="150" cy="580" r="25" fill="#2F855A" />
            <circle cx="180" cy="570" r="20" fill="#38A169" />
            <circle cx="300" cy="590" r="30" fill="#2F855A" />
            <circle cx="850" cy="585" r="35" fill="#38A169" />
            <circle cx="900" cy="575" r="25" fill="#2F855A" />
            <circle cx="1050" cy="580" r="28" fill="#38A169" />
            
            {/* Sun */}
            <circle cx="950" cy="150" r="60" fill="#FFD700" opacity="0.8" />
            
            {/* Clouds */}
            <ellipse cx="300" cy="120" rx="80" ry="30" fill="white" opacity="0.7" />
            <ellipse cx="700" cy="100" rx="100" ry="40" fill="white" opacity="0.6" />
            <ellipse cx="1000" cy="180" rx="70" ry="25" fill="white" opacity="0.5" />
          </svg>
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Headphones className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Свяжитесь с нами
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Мы всегда готовы помочь вам спланировать идеальное путешествие 
              или ответить на любые вопросы
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Animated gradient background similar to hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-sky-500/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-cyan-500/10 animate-pulse"></div>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-sky-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Как с нами связаться</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Выберите удобный способ связи — мы всегда на связи
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full text-center border-0 bg-white/70 backdrop-blur-lg shadow-xl hover:shadow-2xl hover:bg-white/80 transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-3">
                      {info.details.map((detail, i) => (
                        <div key={i} className="text-gray-800 font-medium">{detail}</div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{info.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Напишите нам</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Заполните форму ниже, и мы свяжемся с вами в ближайшее время
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900">Форма обратной связи</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Введите ваше имя"
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+7 (999) 123-45-67"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Тема вопроса *</Label>
                      <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Выберите тему" />
                        </SelectTrigger>
                        <SelectContent>
                          {faqCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Сообщение *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Расскажите нам подробнее о вашем вопросе..."
                      required
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                      className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Отправляем...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Отправить сообщение
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-sky-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 mr-3" />
              <h2 className="text-3xl font-bold">Нужна срочная помощь?</h2>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Наша служба поддержки работает 24/7 для экстренных случаев во время путешествий
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-white/90">
                <Phone className="h-4 w-4 mr-2" />
                Позвонить сейчас
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="h-4 w-4 mr-2" />
                Написать в Telegram
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}