import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, ArrowUpDown, Grid, List, Star, MapPin, Clock, 
  Users, Heart, X, Calendar, ChevronDown 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TourCard from "@/components/tour-card";
import { Tour } from "@/shared/schema";

const categories = [
  { id: "all", name: "Все", icon: "🎯" },
  { id: "nature", name: "Природа", icon: "🌲" },
  { id: "culture", name: "Культура", icon: "🏛️" },
  { id: "adventure", name: "Приключения", icon: "🏔️" },
  { id: "food", name: "Еда", icon: "🍽️" },
  { id: "couples", name: "Для двоих", icon: "💕" },
  { id: "short", name: "Короткие", icon: "⏰" },
  { id: "water", name: "Вода", icon: "🌊" },
  { id: "historical", name: "История", icon: "🏰" },
  { id: "wellness", name: "Здоровье", icon: "🧘" },
];

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price-asc", label: "По возрастанию цены" },
  { value: "price-desc", label: "По убыванию цены" },
  { value: "rating", label: "По рейтингу" },
  { value: "newest", label: "Новые" },
];

const durationOptions = [
  { value: "all", label: "Любая длительность" },
  { value: "short", label: "Короткие (до 3 часов)" },
  { value: "half-day", label: "Полдня (до 6 часов)" },
  { value: "full-day", label: "Весь день (до 12 часов)" },
  { value: "overnight", label: "С ночевкой (1-2 дня)" },
  { value: "weekend", label: "Выходные (2-3 дня)" },
  { value: "long", label: "Длительные (4+ дня)" },
];

export default function Tours() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [peopleCount, setPeopleCount] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");

  // Get destination from URL parameters
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');
    if (destination) {
      setSelectedDestination(destination);
      // Auto-open filters to show the destination filter
      setShowFilters(true);
    }
  }, []);

  const { data: tours = [], isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const filteredAndSortedTours = useMemo(() => {
    let filtered = tours.filter(tour => {
      // Destination filter
      if (selectedDestination) {
        const destinationMap: Record<string, string[]> = {
          "spb": ["санкт-петербург", "петербург", "спб"],
          "moscow": ["москва", "московская"],
          "kazan": ["казань", "татарстан"],
          "sochi": ["сочи", "адлер", "красная поляна"],
          "irkutsk": ["иркутск", "байкал", "листвянка"],
          "kaliningrad": ["калининград", "зеленоградск"],
          "turkey": ["турция", "стамбул", "анталия", "каппадокия"],
          "georgia": ["грузия", "тбилиси", "батуми"],
          "armenia": ["армения", "ереван"],
          "uzbekistan": ["узбекистан", "самарканд", "бухара"],
          "thailand": ["таиланд", "бангкок", "пхукет"],
          "india": ["индия", "дели", "гоа", "мумбаи"]
        };
        
        const keywords = destinationMap[selectedDestination] || [selectedDestination];
        const matchesDestination = keywords.some(keyword => 
          tour.location.toLowerCase().includes(keyword) || 
          tour.title.toLowerCase().includes(keyword) ||
          tour.description.toLowerCase().includes(keyword)
        );
        
        if (!matchesDestination) return false;
      }

      // Search filter
      if (searchQuery && !tour.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !tour.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !tour.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some(category => {
          if (category === "couples" && tour.maxPeople <= 2) return true;
          if (category === "short" && (tour.duration.includes("1") || tour.duration.includes("2"))) return true;
          if (category === "water" && tour.tags?.some(tag => 
            tag.includes("море") || tag.includes("озеро") || tag.includes("река"))) return true;
          if (!["couples", "short", "water"].includes(category) && tour.category === category) return true;
          return false;
        });
        if (!matchesCategory) return false;
      }

      // Duration filter
      if (selectedDuration !== "all") {
        const tourDays = parseInt(tour.duration.match(/\d+/)?.[0] || "1");
        const tourHours = tour.duration.includes("часов") ? parseInt(tour.duration.match(/\d+/)?.[0] || "1") : tourDays * 24;
        
        switch (selectedDuration) {
          case "short":
            if (tourHours > 3) return false;
            break;
          case "half-day":
            if (tourHours > 6) return false;
            break;
          case "full-day":
            if (tourHours > 12) return false;
            break;
          case "overnight":
            if (tourDays < 1 || tourDays > 2) return false;
            break;
          case "weekend":
            if (tourDays < 2 || tourDays > 3) return false;
            break;
          case "long":
            if (tourDays < 4) return false;
            break;
        }
      }

      // Price filter
      if (tour.price < priceRange[0] || tour.price > priceRange[1]) return false;

      // People count filter
      if (peopleCount !== "all") {
        const maxPeople = parseInt(peopleCount);
        if (tour.maxPeople < maxPeople) return false;
      }

      return true;
    });

    // Sort filtered tours
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id;
        default: // popular
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [tours, searchQuery, selectedCategories, selectedDuration, priceRange, peopleCount, sortBy, selectedDestination]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedDuration("all");
    setPriceRange([0, 50000]);
    setPeopleCount("all");
    setSortBy("popular");
    setSelectedDestination("");
    // Clear URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('destination');
    window.history.replaceState({}, '', url.toString());
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategories.length > 0 ? "categories" : null,
    selectedDuration !== "all" ? selectedDuration : null,
    priceRange[0] !== 0 || priceRange[1] !== 50000 ? "price" : null,
    peopleCount !== "all" ? peopleCount : null,
    selectedDestination ? "destination" : null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Найди свой идеальный тур
              </h1>
              <p className="text-xl text-white/90 mb-8">
                {tours.length} туров по всей России ждут тебя
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Поиск по названию, описанию или городу..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/30"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-between"
              >
                <span className="flex items-center space-x-2">
                  <Filter size={16} />
                  <span>Фильтры</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </span>
                <ChevronDown 
                  className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  size={16}
                />
              </Button>
            </div>

            {/* Filters Sidebar */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Фильтры</h2>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-500 hover:text-red-700"
                      >
                        Сбросить
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Destination Filter */}
                    {selectedDestination && (
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Направление</Label>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                          <div className="flex items-center space-x-2">
                            <MapPin size={16} className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                              {selectedDestination === 'spb' && 'Санкт-Петербург'}
                              {selectedDestination === 'moscow' && 'Москва'}
                              {selectedDestination === 'kazan' && 'Казань'}
                              {selectedDestination === 'sochi' && 'Сочи'}
                              {selectedDestination === 'irkutsk' && 'Иркутск'}
                              {selectedDestination === 'kaliningrad' && 'Калининград'}
                              {selectedDestination === 'turkey' && 'Турция'}
                              {selectedDestination === 'georgia' && 'Грузия'}
                              {selectedDestination === 'armenia' && 'Армения'}
                              {selectedDestination === 'uzbekistan' && 'Узбекистан'}
                              {selectedDestination === 'thailand' && 'Таиланд'}
                              {selectedDestination === 'india' && 'Индия'}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDestination("");
                              const url = new URL(window.location.href);
                              url.searchParams.delete('destination');
                              window.history.replaceState({}, '', url.toString());
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Category Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Категории {selectedCategories.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedCategories.length}
                          </Badge>
                        )}
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.filter(cat => cat.id !== "all").map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleCategory(category.id)}
                            className="justify-start text-xs"
                          >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Duration Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Длительность</Label>
                      <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
                      </Label>
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={(value) => {
                            // Ensure the values don't cross over
                            const [min, max] = value;
                            if (min <= max) {
                              setPriceRange(value);
                            }
                          }}
                          max={50000}
                          min={0}
                          step={1000}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>0 ₽</span>
                        <span>50 000 ₽</span>
                      </div>
                    </div>

                    {/* People Count */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Количество человек</Label>
                      <Select value={peopleCount} onValueChange={setPeopleCount}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Любое количество</SelectItem>
                          <SelectItem value="1">1 человек</SelectItem>
                          <SelectItem value="2">2 человека</SelectItem>
                          <SelectItem value="3">3 человека</SelectItem>
                          <SelectItem value="4">4+ человека</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls Bar */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Найдено: {filteredAndSortedTours.length} туров
                    </span>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary">
                        {activeFiltersCount} фильтр(ов)
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <ArrowUpDown size={16} className="mr-2" />
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

                    {/* View Mode */}
                    <div className="flex items-center border rounded-lg p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid size={16} />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Active Filters */}
                {(selectedCategories.length > 0 || selectedDuration !== "all" || priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-500 mr-2">Активные фильтры:</span>
                    {selectedCategories.map(categoryId => {
                      const category = categories.find(c => c.id === categoryId);
                      return category ? (
                        <Badge key={categoryId} variant="outline" className="flex items-center gap-1">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                          <X 
                            size={12} 
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => toggleCategory(categoryId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                    {selectedDuration !== "all" && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{durationOptions.find(d => d.value === selectedDuration)?.label}</span>
                        <X 
                          size={12} 
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => setSelectedDuration("all")}
                        />
                      </Badge>
                    )}
                    {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <span>₽</span>
                        <span>{priceRange[0].toLocaleString()}-{priceRange[1].toLocaleString()}</span>
                        <X 
                          size={12} 
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => setPriceRange([0, 50000])}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Tours Grid/List */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredAndSortedTours.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Туры не найдены
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Попробуйте изменить параметры поиска или очистить фильтры
                  </p>
                  <Button onClick={clearFilters} className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
                    Очистить фильтры
                  </Button>
                </div>
              ) : (
                <motion.div
                  layout
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {filteredAndSortedTours.map((tour) => (
                      <motion.div
                        key={tour.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className={viewMode === "list" ? "w-full" : ""}
                      >
                        {viewMode === "grid" ? (
                          <TourCard tour={tour} />
                        ) : (
                          <TourListItem tour={tour} />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function TourListItem({ tour }: { tour: Tour }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-1/3 relative">
            <img
              src={tour.imageUrl}
              alt={tour.title}
              className="w-full h-48 object-cover"
            />
            {tour.isHot && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                🔥 Горящий тур
              </Badge>
            )}
          </div>
          <div className="w-2/3 p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">{tour.title}</h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{tour.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>до {tour.maxPeople} чел</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {tour.price.toLocaleString()} ₽
                </p>
                <p className="text-sm text-gray-500">за человека</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}