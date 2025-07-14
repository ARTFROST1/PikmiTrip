import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Sparkles, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Tour } from "@shared/schema";

export default function Hero() {
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    people: "",
  });

  const { data: tours } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const handleSurpriseMe = () => {
    if (tours && tours.length > 0) {
      const randomTour = tours[Math.floor(Math.random() * tours.length)];
      window.location.href = `/tour/${randomTour.id}`;
    }
  };

  const handleHotTours = () => {
    const element = document.getElementById("tours");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-bg-animated"></div>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/30 rounded-full"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-white/20 rounded-full"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Спонтанные поездки
            <span className="block text-3xl md:text-5xl font-light opacity-90">
              по России
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Найди идеальные выходные. Забронируй за минуту. Отправляйся в приключение.
          </p>
        </motion.div>
        
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <MapPin className="text-white" size={20} />
              <Input
                type="text"
                placeholder="Куда поедем?"
                value={searchData.destination}
                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                className="bg-transparent text-white placeholder-white/70 border-0 outline-none flex-1 font-medium"
              />
            </div>
            <div className="flex items-center space-x-3 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <Calendar className="text-white" size={20} />
              <Input
                type="text"
                placeholder="Когда?"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                className="bg-transparent text-white placeholder-white/70 border-0 outline-none flex-1 font-medium"
              />
            </div>
            <div className="flex items-center space-x-3 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <Users className="text-white" size={20} />
              <Input
                type="text"
                placeholder="Человек"
                value={searchData.people}
                onChange={(e) => setSearchData({ ...searchData, people: e.target.value })}
                className="bg-transparent text-white placeholder-white/70 border-0 outline-none flex-1 font-medium"
              />
            </div>
            <Link href="/tours">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl p-4 font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105">
                <Search className="mr-2" size={20} />
                Найти
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={handleSurpriseMe}
            className="group px-8 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
            Удиви меня
          </Button>
          <Button
            onClick={handleHotTours}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-sky-600 transition-all duration-200 transform hover:scale-105"
          >
            <Zap className="mr-2" size={20} />
            Горящие туры
          </Button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="text-white/70" size={24} />
      </motion.div>
    </section>
  );
}
