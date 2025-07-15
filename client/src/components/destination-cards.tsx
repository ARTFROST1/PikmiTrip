import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Globe, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

// Russian cities data
const russianCities = [
  {
    id: "spb",
    name: "Санкт-Петербург",
    description: "Культурная столица России",
    image: "🏛️",
    toursCount: 45,
    gradient: "from-blue-500/20 to-indigo-500/20"
  },
  {
    id: "moscow",
    name: "Москва",
    description: "Сердце России",
    image: "🏰",
    toursCount: 38,
    gradient: "from-red-500/20 to-rose-500/20"
  },
  {
    id: "kazan",
    name: "Казань",
    description: "Третья столица России",
    image: "🕌",
    toursCount: 22,
    gradient: "from-emerald-500/20 to-teal-500/20"
  },
  {
    id: "sochi",
    name: "Сочи",
    description: "Курортная жемчужина",
    image: "🏖️",
    toursCount: 31,
    gradient: "from-orange-500/20 to-amber-500/20"
  },
  {
    id: "irkutsk",
    name: "Иркутск",
    description: "Ворота Байкала",
    image: "🏔️",
    toursCount: 18,
    gradient: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: "kaliningrad",
    name: "Калининград",
    description: "Европейский форпост",
    image: "🏰",
    toursCount: 15,
    gradient: "from-purple-500/20 to-violet-500/20"
  }
];

// World countries data
const worldCountries = [
  {
    id: "turkey",
    name: "Турция",
    description: "Мост между Европой и Азией",
    image: "🇹🇷",
    toursCount: 28,
    gradient: "from-red-500/20 to-orange-500/20"
  },
  {
    id: "georgia",
    name: "Грузия",
    description: "Гостеприимная страна вина",
    image: "🇬🇪",
    toursCount: 19,
    gradient: "from-pink-500/20 to-rose-500/20"
  },
  {
    id: "armenia",
    name: "Армения",
    description: "Древняя земля Арарата",
    image: "🇦🇲",
    toursCount: 12,
    gradient: "from-indigo-500/20 to-purple-500/20"
  },
  {
    id: "uzbekistan",
    name: "Узбекистан",
    description: "Сокровища Великого шёлкового пути",
    image: "🇺🇿",
    toursCount: 16,
    gradient: "from-teal-500/20 to-cyan-500/20"
  },
  {
    id: "thailand",
    name: "Таиланд",
    description: "Страна улыбок",
    image: "🇹🇭",
    toursCount: 24,
    gradient: "from-yellow-500/20 to-orange-500/20"
  },
  {
    id: "india",
    name: "Индия",
    description: "Невероятная Индия",
    image: "🇮🇳",
    toursCount: 21,
    gradient: "from-green-500/20 to-emerald-500/20"
  }
];

interface DestinationCardProps {
  destination: any;
  index: number;
  onSelect: (id: string) => void;
}

function DestinationCard({ destination, index, onSelect }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        className="group cursor-pointer overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300"
        onClick={() => onSelect(destination.id)}
      >
        <CardContent className="p-0">
          <div className={`bg-gradient-to-br ${destination.gradient} p-6 relative`}>
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{destination.image}</span>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ x: 5 }}
                >
                  <ChevronRight className="text-white" size={20} />
                </motion.div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {destination.name}
              </h3>
              
              <p className="text-white/80 text-sm mb-4 leading-relaxed">
                {destination.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  {destination.toursCount} туров
                </Badge>
                <div className="flex items-center text-white/60 text-xs">
                  <MapPin size={12} className="mr-1" />
                  Доступно сейчас
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DestinationCards() {
  const [selectedTab, setSelectedTab] = useState<'russia' | 'world'>('russia');

  const handleDestinationSelect = (destinationId: string) => {
    // Navigate to tours page with filter
    window.location.href = `/tours?destination=${destinationId}`;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-black/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Популярные направления
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Откройте для себя лучшие туристические направления России и мира
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2 border border-white/30">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTab('russia')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedTab === 'russia'
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Flag size={18} />
                <span>Россия</span>
              </button>
              <button
                onClick={() => setSelectedTab('world')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedTab === 'world'
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Globe size={18} />
                <span>Мир</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Destination Cards Grid */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(selectedTab === 'russia' ? russianCities : worldCountries).map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
              onSelect={handleDestinationSelect}
            />
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/tours">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Посмотреть все туры
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}