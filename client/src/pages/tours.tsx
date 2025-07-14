import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ArrowUpDown, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  X,
  ChevronDown
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TourCard from "@/components/tour-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Tour } from "@shared/schema";

const categories = [
  { id: "all", name: "Все категории", icon: "🌍" },
  { id: "nature", name: "Природа", icon: "🌲" },
  { id: "cultural", name: "Культурные", icon: "🏛️" },
  { id: "adventure", name: "Приключения", icon: "🏔️" },
  { id: "coastal", name: "Побережье", icon: "🏖️" },
  { id: "mountains", name: "Горы", icon: "⛰️" },
  { id: "couples", name: "Для двоих", icon: "💑" },
  { id: "short", name: "Короткие", icon: "⏰" },
  { id: "water", name: "Водные", icon: "🌊" },
];

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price-asc", label: "По цене (возрастание)" },
  { value: "price-desc", label: "По цене (убывание)" },
  { value: "rating", label: "По рейтингу" },
  { value: "newest", label: "Новые" },
];

const durationOptions = [
  { value: "all", label: "Любая длительность" },
  { value: "1", label: "1 день" },
  { value: "2", label: "2 дня" },
  { value: "3", label: "3 дня" },
  { value: "4+", label: "4+ дня" },
];

export default function Tours() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [peopleCount, setPeopleCount] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: tours = [], isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const filteredAndSortedTours = useMemo(() => {
    let filtered = tours.filter(tour => {
      // Search filter
      if (searchQuery && !tour.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !tour.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !tour.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "couples" && tour.maxPeople > 2) return false;
        if (selectedCategory === "short" && !tour.duration.includes("1") && !tour.duration.includes("2")) return false;
        if (selectedCategory === "water" && !tour.tags?.some(tag => 
          tag.includes("море") || tag.includes("озеро") || tag.includes("река"))) return false;
        if (!["couples", "short", "water"].includes(selectedCategory) && tour.category !== selectedCategory) return false;
      }

      // Duration filter
      if (selectedDuration !== "all") {
        const tourDays = parseInt(tour.duration.match(/\d+/)?.[0] || "1");
        if (selectedDuration === "4+" && tourDays < 4) return false;
        if (selectedDuration !== "4+" && tourDays !== parseInt(selectedDuration)) return false;
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

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "popular":
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [tours, searchQuery, selectedCategory, selectedDuration, priceRange, peopleCount, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDuration("all");
    setPriceRange([0, 50000]);
    setPeopleCount("all");
    setSortBy("popular");
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== "all" ? selectedCategory : null,
    selectedDuration !== "all" ? selectedDuration : null,
    priceRange[0] !== 0 || priceRange[1] !== 50000 ? "price" : null,
    peopleCount !== "all" ? peopleCount : null,
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
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        Очистить
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Категория</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
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
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50000}
                        min={0}
                        step={1000}
                        className="w-full"
                      />
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
                  <Calendar size={16} />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>до {tour.maxPeople} чел.</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {tour.price.toLocaleString()} ₽
                </div>
                <div className="text-sm text-gray-500">за человека</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}