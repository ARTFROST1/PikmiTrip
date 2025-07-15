import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Sparkles, Zap, ChevronDown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import type { Tour } from "@shared/schema";
import type { DateRange } from "react-day-picker";

// Popular destinations for autocomplete
const popularDestinations = [
  "Санкт-Петербург", "Карелия", "Москва", "Золотое кольцо", 
  "Сочи", "Калининград", "Байкал", "Алтай", "Камчатка", 
  "Казань", "Нижний Новгород", "Екатеринбург", "Владивосток",
  "Мурманск", "Архангельск", "Псков", "Великий Новгород"
];

export default function Hero() {
  const [searchData, setSearchData] = useState({
    destination: "",
    people: 2,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showDestinations, setShowDestinations] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);
  const destinationRef = useRef<HTMLDivElement>(null);

  const { data: tours } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  // Handle destination input and filtering
  useEffect(() => {
    if (searchData.destination) {
      const filtered = popularDestinations.filter(dest =>
        dest.toLowerCase().includes(searchData.destination.toLowerCase())
      );
      setFilteredDestinations(filtered);
      setShowDestinations(filtered.length > 0);
    } else {
      setShowDestinations(false);
    }
  }, [searchData.destination]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDestinationSelect = (destination: string) => {
    setSearchData({ ...searchData, destination });
    setShowDestinations(false);
  };

  const handlePeopleChange = (increment: boolean) => {
    setSearchData(prev => ({
      ...prev,
      people: increment 
        ? Math.min(prev.people + 1, 20) 
        : Math.max(prev.people - 1, 1)
    }));
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return "Выберите даты";
    if (!dateRange.to) return format(dateRange.from, "d MMM", { locale: ru });
    return `${format(dateRange.from, "d MMM", { locale: ru })} - ${format(dateRange.to, "d MMM", { locale: ru })}`;
  };

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
        
        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Destination with Autocomplete */}
            <div ref={destinationRef} className="relative">
              <div className="flex items-center space-x-3 bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                <MapPin className="text-white flex-shrink-0" size={20} />
                <Input
                  type="text"
                  placeholder="Куда поедем?"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  onFocus={() => setShowDestinations(filteredDestinations.length > 0)}
                  className="bg-transparent text-white placeholder-white/60 border-0 outline-none flex-1 font-medium text-lg"
                />
              </div>
              {/* Dropdown with suggestions */}
              {showDestinations && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl z-50 max-h-60 overflow-y-auto"
                >
                  {filteredDestinations.map((destination, index) => (
                    <button
                      key={destination}
                      onClick={() => handleDestinationSelect(destination)}
                      className="w-full text-left px-5 py-3 hover:bg-white/20 transition-colors duration-200 text-gray-800 font-medium first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin size={16} className="text-gray-600" />
                        <span>{destination}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Date Range Picker */}
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center space-x-3 bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                    <Calendar className="text-white flex-shrink-0" size={20} />
                    <span className="text-white font-medium text-lg flex-1 truncate">
                      {formatDateRange()}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-xl border-white/30" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    locale={ru}
                    className="rounded-2xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* People Counter */}
            <div className="flex items-center space-x-3 bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20">
              <Users className="text-white flex-shrink-0" size={20} />
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => handlePeopleChange(false)}
                  disabled={searchData.people <= 1}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="text-white font-semibold text-lg min-w-[3ch] text-center">
                  {searchData.people}
                </span>
                <button
                  onClick={() => handlePeopleChange(true)}
                  disabled={searchData.people >= 20}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Search Button */}
            <Link href="/tours" className="block">
              <Button className="w-full h-full bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl p-5 font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                <Search className="mr-3" size={20} />
                <span className="text-lg">Найти</span>
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
