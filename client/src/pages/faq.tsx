import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, HelpCircle, BookOpen, CreditCard, MapPin, Phone, MessageCircle } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Все вопросы", icon: HelpCircle, count: 24 },
    { id: "booking", name: "Бронирование", icon: BookOpen, count: 8 },
    { id: "payment", name: "Оплата", icon: CreditCard, count: 6 },
    { id: "travel", name: "Путешествие", icon: MapPin, count: 7 },
    { id: "support", name: "Поддержка", icon: Phone, count: 3 },
  ];

  const faqs = [
    {
      category: "booking",
      question: "Как забронировать тур?",
      answer: "Выберите понравившийся тур, нажмите 'Забронировать', заполните форму с вашими данными и подтвердите бронирование. Мы свяжемся с вами в течение часа для подтверждения деталей."
    },
    {
      category: "booking",
      question: "Можно ли отменить бронирование?",
      answer: "Да, бронирование можно отменить бесплатно за 24 часа до начала тура. При отмене менее чем за 24 часа взимается комиссия 50% от стоимости тура."
    },
    {
      category: "booking",
      question: "Что делать, если тур отменили?",
      answer: "Если тур отменен по вине организатора, мы предложим альтернативные варианты или вернем 100% стоимости в течение 3-5 рабочих дней."
    },
    {
      category: "booking",
      question: "Можно ли изменить дату тура?",
      answer: "Изменение даты возможно при наличии свободных мест на другую дату. Изменения вносятся бесплатно за 48 часов до тура."
    },
    {
      category: "booking",
      question: "Как узнать статус моего бронирования?",
      answer: "В личном кабинете во вкладке 'Мои поездки' вы можете отслеживать статус всех ваших бронирований в реальном времени."
    },
    {
      category: "booking",
      question: "Что включено в стоимость тура?",
      answer: "В описании каждого тура указано, что входит в стоимость. Обычно это трансфер, экскурсионная программа, услуги гида. Питание и входные билеты указываются отдельно."
    },
    {
      category: "booking",
      question: "Можно ли забронировать тур для группы?",
      answer: "Да, для групп от 6 человек действуют специальные условия и скидки. Свяжитесь с нами для индивидуального расчета."
    },
    {
      category: "booking",
      question: "Есть ли детские скидки?",
      answer: "Дети до 3 лет путешествуют бесплатно, от 3 до 12 лет — скидка 50%, от 12 до 18 лет — скидка 25%. Скидки автоматически применяются при бронировании."
    },
    {
      category: "payment",
      question: "Какие способы оплаты доступны?",
      answer: "Принимаем банковские карты Visa, MasterCard, МИР, СБП, электронные кошельки ЮMoney, QIWI, а также наличные в офисе."
    },
    {
      category: "payment",
      question: "Когда списывается оплата?",
      answer: "Оплата списывается сразу после подтверждения бронирования. Для некоторых туров возможна предоплата 50% с доплатой перед началом тура."
    },
    {
      category: "payment",
      question: "Можно ли получить чек об оплате?",
      answer: "Да, электронный чек отправляется на указанный email сразу после оплаты. Бумажный чек можно получить в офисе."
    },
    {
      category: "payment",
      question: "Как получить возврат?",
      answer: "Возврат осуществляется на ту же карту, с которой была произведена оплата, в течение 5-10 рабочих дней после подачи заявления."
    },
    {
      category: "payment",
      question: "Есть ли рассрочка?",
      answer: "Для туров стоимостью от 15 000 рублей доступна рассрочка на 3-6 месяцев без переплаты через партнерские банки."
    },
    {
      category: "payment",
      question: "Можно ли оплатить сертификатом?",
      answer: "Да, принимаем подарочные сертификаты нашей компании и сертификаты социальных программ 'Мир' и 'Забота'."
    },
    {
      category: "travel",
      question: "Что взять с собой в тур?",
      answer: "Список необходимых вещей указан в описании каждого тура. Обычно это удобная обувь, одежда по погоде, документы и личные вещи."
    },
    {
      category: "travel",
      question: "Какие документы нужны?",
      answer: "Для внутренних туров достаточно паспорта РФ. Для детей до 14 лет — свидетельство о рождении. Для некоторых регионов могут потребоваться дополнительные разрешения."
    },
    {
      category: "travel",
      question: "Что делать, если опоздал на автобус?",
      answer: "Сразу свяжитесь с номером экстренной связи (указан в ваучере). Мы поможем организовать трансфер к группе, если это возможно."
    },
    {
      category: "travel",
      question: "Можно ли покинуть группу во время тура?",
      answer: "Свободное время предусмотрено в программе. Покидать группу можно только в согласованное время и с уведомлением гида."
    },
    {
      category: "travel",
      question: "Что делать при плохой погоде?",
      answer: "У нас есть запасные программы для любой погоды. При критических условиях тур может быть перенесен или изменен с полным возмещением разницы."
    },
    {
      category: "travel",
      question: "Есть ли страховка?",
      answer: "Все туристы автоматически застрахованы от несчастных случаев. Медицинскую страховку можно оформить дополнительно при бронировании."
    },
    {
      category: "travel",
      question: "Можно ли курить/употреблять алкоголь?",
      answer: "Курение запрещено в автобусе и на территории объектов. Употребление алкоголя в умеренных количествах разрешено в свободное время для лиц старше 18 лет."
    },
    {
      category: "support",
      question: "Как связаться со службой поддержки?",
      answer: "Круглосуточная поддержка: +7 (800) 555-35-35, email: support@pickmytrip.ru, Telegram: @pickmytrip_support"
    },
    {
      category: "support",
      question: "Сколько ждать ответа на вопрос?",
      answer: "В рабочее время (9:00-21:00 МСК) отвечаем в течение 15 минут. В остальное время — в течение 2 часов. Экстренные вопросы решаем круглосуточно."
    },
    {
      category: "support",
      question: "Можно ли оставить отзыв о туре?",
      answer: "Да, после завершения тура вам придет ссылка для оценки. Отзывы можно также оставить в личном кабинете или на сайте."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Часто задаваемые вопросы
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Найдите ответы на самые популярные вопросы о наших турах и услугах
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Поиск по вопросам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <category.icon size={16} />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {activeCategory === "all" ? "Все вопросы" : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <p className="text-xl text-gray-600">
              Найдено {filteredFaqs.length} {filteredFaqs.length === 1 ? 'вопрос' : 'вопросов'}
            </p>
          </motion.div>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={`${faq.category}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 text-left flex-1 pr-4">
                              {faq.question}
                            </h3>
                            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200 transform group-data-[state=open]:rotate-180" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-6 pb-6 pt-0">
                          <div className="text-gray-600 leading-relaxed border-t pt-4">
                            {faq.answer}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Вопросы не найдены
              </h3>
              <p className="text-gray-600 mb-6">
                Попробуйте изменить поисковый запрос или выбрать другую категорию
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}>
                Сбросить фильтры
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-sky-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Не нашли ответ?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Наша команда поддержки готова помочь вам 24/7. Задайте любой вопрос — мы найдем решение!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-white/90">
                <Phone className="h-4 w-4 mr-2" />
                Позвонить
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="h-4 w-4 mr-2" />
                Написать
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}