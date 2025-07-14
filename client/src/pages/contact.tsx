import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Headphones,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Phone,
      title: "Телефон",
      details: ["+7 (495) 123-45-67", "+7 (800) 555-35-35"],
      subtitle: "Звоните с 9:00 до 21:00 МСК",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@pickmytrip.ru", "support@pickmytrip.ru"],
      subtitle: "Отвечаем в течение 2 часов",
    },
    {
      icon: MapPin,
      title: "Офис",
      details: ["г. Москва, ул. Тверская, 15", "БЦ 'Централь', офис 401"],
      subtitle: "Пн-Пт с 9:00 до 18:00",
    },
    {
      icon: MessageCircle,
      title: "Мессенджеры",
      details: ["Telegram: @pickmytrip", "WhatsApp: +7 (495) 123-45-67"],
      subtitle: "Быстрые ответы 24/7",
    },
  ];

  const faqCategories = [
    { value: "booking", label: "Вопросы о бронировании" },
    { value: "payment", label: "Оплата и возврат" },
    { value: "travel", label: "Во время путешествия" },
    { value: "technical", label: "Технические вопросы" },
    { value: "partnership", label: "Сотрудничество" },
    { value: "other", label: "Другое" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Симуляция отправки формы
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Сообщение отправлено!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <div className="pt-16 relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Beautiful landscape background image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.wallpaperscraft.ru/image/single/krasivyj_pejzazh_gory_ozero_93318_1920x1080.jpg)'
          }}
        ></div>
        
        {/* Enhanced overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 z-10"></div>

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
              Мы всегда готовы помочь вам спланировать идеальное путешествие или
              ответить на любые вопросы
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Animated gradient background exactly like hero */}
        <div className="absolute inset-0 gradient-bg-animated"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Как с нами связаться
            </h2>
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
                <Card className="h-full text-center border-0 bg-black/10 backdrop-blur-[30px] shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:bg-black/15 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 drop-shadow-sm">
                      {info.title}
                    </h3>
                    <div className="space-y-1 mb-3">
                      {info.details.map((detail, i) => (
                        <div
                          key={i}
                          className="text-white/90 font-medium drop-shadow-sm"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-white/75 drop-shadow-sm">
                      {info.subtitle}
                    </p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Напишите нам
            </h2>
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
                <CardTitle className="text-2xl text-gray-900">
                  Форма обратной связи
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+7 (999) 123-45-67"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Тема вопроса *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          handleInputChange("subject", value)
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Выберите тему" />
                        </SelectTrigger>
                        <SelectContent>
                          {faqCategories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
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
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
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
                      disabled={
                        isSubmitting ||
                        !formData.name ||
                        !formData.email ||
                        !formData.subject ||
                        !formData.message
                      }
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
              Наша служба поддержки работает 24/7 для экстренных случаев во
              время путешествий
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-emerald-600 hover:bg-white/90"
              >
                <Phone className="h-4 w-4 mr-2" />
                Позвонить сейчас
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
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
