import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Search, Filter, SortAsc } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TourCard from "@/components/tour-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import type { Tour } from "@shared/schema";

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterCategory, setFilterCategory] = useState("all");
  const { user, isAuthenticated } = useAuth();

  // В реальном приложении это был бы отдельный API endpoint
  const { data: tours = [] } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  // Симуляция избранных туров (в реальном приложении хранилось бы в БД)
  const [favoriteTourIds] = useState<number[]>([1, 3, 5]); // Моковые ID избранных туров
  
  const favoriteTours = tours.filter(tour => favoriteTourIds.includes(tour.id));

  const filteredAndSortedTours = favoriteTours
    .filter(tour => {
      const matchesSearch = searchQuery === "" || 
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === "all" || tour.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        case "recent":
        default:
          return b.id - a.id; // Симуляция сортировки по времени добавления
      }
    });

  const categories = [
    { value: "all", label: "Все категории" },
    { value: "nature", label: "Природа" },
    { value: "cultural", label: "Культурные" },
    { value: "adventure", label: "Приключения" },
    { value: "coastal", label: "Побережье" },
    { value: "mountains", label: "Горы" }
  ];

  const sortOptions = [
    { value: "recent", label: "Недавно добавленные" },
    { value: "title", label: "По названию" },
    { value: "price-asc", label: "По цене (возрастание)" },
    { value: "price-desc", label: "По цене (убывание)" },
    { value: "rating", label: "По рейтингу" }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Требуется авторизация
            </h1>
            <p className="text-gray-600 mb-8">
              Войдите в систему, чтобы просмотреть избранные туры
            </p>
            <Link href="/">
              <Button>Вернуться на главную</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-16 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Избранные туры
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Ваша персональная коллекция самых интересных путешествий
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
                ❤️ {favoriteTours.length} туров
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
                💰 От {Math.min(...favoriteTours.map(t => t.price))}₽
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Поиск в избранном..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <Filter size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SortAsc size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAndSortedTours.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {filteredAndSortedTours.length} избранных {filteredAndSortedTours.length === 1 ? 'тур' : 'туров'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Туры, которые вы добавили в избранное для будущих путешествий
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredAndSortedTours.map((tour, index) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <TourCard tour={tour} />
                      
                      {/* Remove from favorites button */}
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white z-10"
                        onClick={() => {
                          // В реальном приложении здесь был бы вызов API для удаления из избранного
                          console.log(`Remove tour ${tour.id} from favorites`);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchQuery || filterCategory !== "all" ? "Туры не найдены" : "Пока нет избранных туров"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery || filterCategory !== "all" 
                  ? "Попробуйте изменить параметры поиска или фильтрации"
                  : "Добавляйте туры в избранное, нажимая на сердечко на карточке тура"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchQuery || filterCategory !== "all" ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("all");
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                ) : null}
                <Link href="/tours">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Найти туры
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {filteredAndSortedTours.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6">Готовы отправиться в путешествие?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Забронируйте один из ваших избранных туров прямо сейчас и получите незабываемые эмоции
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                  Забронировать тур
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Найти еще туры
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}