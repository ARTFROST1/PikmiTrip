import { motion } from "framer-motion";
import Header from "@/components/header";
import Hero from "@/components/hero";
import DestinationCards from "@/components/destination-cards";
import Filters from "@/components/filters";
import TourCard from "@/components/tour-card";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Tour } from "@shared/schema";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const filteredTours = tours?.filter(tour => {
    if (!selectedFilter) return true;
    
    switch (selectedFilter) {
      case "couple":
        return tour.maxPeople <= 2;
      case "nature":
        return tour.category === "nature";
      case "short":
        return tour.duration.includes("2 дня") || tour.duration.includes("1 день");
      case "water":
        return tour.category === "coastal" || tour.tags?.includes("озеро");
      case "photo":
        return tour.tags?.includes("фотогенно") || tour.category === "cultural";
      case "hot":
        return tour.isHot;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      
      <DestinationCards />
      
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Выбери свой стиль путешествия
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы подберем идеальный тур под твое настроение и предпочтения
            </p>
          </motion.div>
          
          <Filters 
            selectedFilter={selectedFilter} 
            onFilterChange={setSelectedFilter} 
          />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Популярные направления
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Откройте для себя самые захватывающие места России для незабываемых выходных
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours?.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-sky-600 transition-all duration-200 transform hover:scale-105">
              Показать больше туров
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы делаем путешествия простыми, доступными и незабываемыми
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Быстрое бронирование",
                description: "Забронируй тур за 2 минуты. Никаких длинных форм и ожиданий — только простота и скорость.",
                gradient: "from-emerald-50 to-sky-50",
                iconBg: "from-emerald-500 to-sky-500"
              },
              {
                icon: "🛡️",
                title: "Проверенные туры",
                description: "Все направления тщательно отобраны нашими экспертами. Качество и безопасность гарантированы.",
                gradient: "from-orange-50 to-pink-50",
                iconBg: "from-orange-500 to-pink-500"
              },
              {
                icon: "🎧",
                title: "Поддержка 24/7",
                description: "Наша команда готова помочь в любое время. Поддержка на всех этапах путешествия.",
                gradient: "from-purple-50 to-blue-50",
                iconBg: "from-purple-500 to-blue-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className={`group text-center p-8 bg-gradient-to-br ${feature.gradient} rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.iconBg} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
