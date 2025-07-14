import { motion } from "framer-motion";
import { Award, Users, MapPin, Clock, Heart, Zap, Shield, Star } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const stats = [
    { icon: Users, label: "Довольных путешественников", value: "50,000+" },
    { icon: MapPin, label: "Городов России", value: "200+" },
    { icon: Award, label: "Лет опыта", value: "8" },
    { icon: Star, label: "Средний рейтинг", value: "4.9" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Любовь к России",
      description: "Мы знаем и любим каждый уголок нашей родины, и хотим поделиться этой любовью с вами",
    },
    {
      icon: Zap,
      title: "Спонтанность",
      description: "Лучшие приключения случаются неожиданно. Мы помогаем найти тур прямо сейчас",
    },
    {
      icon: Shield,
      title: "Надежность",
      description: "Проверенные партнеры, безопасные маршруты, полная поддержка на протяжении всего путешествия",
    },
  ];

  const team = [
    {
      name: "Алексей Морозов",
      role: "Основатель и CEO",
      description: "Путешественник с 15-летним стажем, объездил всю Россию",
      avatar: "🧑‍💼",
    },
    {
      name: "Мария Петрова",
      role: "Директор по продукту",
      description: "Эксперт по UX и туристическим технологиям",
      avatar: "👩‍💻",
    },
    {
      name: "Дмитрий Волков",
      role: "Руководитель направления",
      description: "15 лет в туризме, знает лучшие места России",
      avatar: "🧑‍🎒",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-16 bg-gradient-to-br from-emerald-500 via-sky-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Мы — Пикми трип
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Платформа для спонтанных путешествий по России. Находим идеальные туры 
              для тех, кто любит приключения здесь и сейчас.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
                🏆 Лучшая платформа 2024
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
                ⭐ 4.9 из 5 звезд
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Наша история</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                Все началось в 2016 году, когда наш основатель Алексей в очередной раз искал 
                интересный тур на выходные. Сайты были неудобными, информации мало, 
                а процесс бронирования — настоящая мука.
              </p>
              <p className="mb-6">
                "Должен быть способ проще!" — подумал он и создал первую версию Пикми трип. 
                Идея была простой: платформа, где можно быстро найти и забронировать 
                идеальный тур по России прямо сейчас.
              </p>
              <p>
                Сегодня мы — команда из 50+ энтузиастов, которые помогают тысячам россиян 
                открывать красоту родной страны. От Калининграда до Владивостока, 
                от Северного полюса до Кавказских гор — мы знаем лучшие места и поможем 
                вам их найти.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши ценности</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Принципы, которые направляют нас каждый день
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Команда мечты</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Люди, которые делают путешествия по России лучше каждый день
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-4">{member.avatar}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <div className="text-emerald-600 font-semibold mb-4">{member.role}</div>
                    <p className="text-gray-600">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-sky-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Готовы к приключениям?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам путешественников, которые уже открыли для себя 
              Россию с Пикми трип
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-white/90">
                Найти тур
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Связаться с нами
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}