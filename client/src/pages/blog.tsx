import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Tag, Search, TrendingUp, Heart, MessageCircle, Share2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: string;
  tags: string[];
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const categories = [
    { value: "all", label: "Все статьи" },
    { value: "guides", label: "Путеводители" },
    { value: "tips", label: "Советы" },
    { value: "stories", label: "Истории" },
    { value: "news", label: "Новости" },
    { value: "reviews", label: "Обзоры" }
  ];

  const sortOptions = [
    { value: "recent", label: "Новые" },
    { value: "popular", label: "Популярные" },
    { value: "trending", label: "Трендовые" },
    { value: "most-liked", label: "Больше лайков" }
  ];

  // Моковые данные блога
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 скрытых жемчужин Карелии, о которых знают не все",
      excerpt: "Откройте для себя удивительные места Карелии, которые не найдете в туристических буклетах. От затерянных водопадов до древних петроглифов.",
      content: "",
      author: "Мария Лесных",
      publishDate: "2025-01-10",
      readTime: 8,
      category: "guides",
      tags: ["карелия", "природа", "скрытые места"],
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      views: 2547,
      likes: 156,
      comments: 23,
      featured: true
    },
    {
      id: 2,
      title: "Как спланировать идеальное путешествие на Байкал",
      excerpt: "Пошаговое руководство по планированию поездки на самое глубокое озеро мира. Когда ехать, что взять с собой и как не переплатить.",
      content: "",
      author: "Александр Путешественников",
      publishDate: "2025-01-08",
      readTime: 12,
      category: "tips",
      tags: ["байкал", "планирование", "бюджет"],
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      views: 4231,
      likes: 298,
      comments: 67,
      featured: true
    },
    {
      id: 3,
      title: "Первое путешествие в одиночку: мой опыт и советы",
      excerpt: "История о том, как преодолеть страхи и отправиться в solo-путешествие по России. Личный опыт и практические советы для новичков.",
      content: "",
      author: "Анна Свободная",
      publishDate: "2025-01-05",
      readTime: 6,
      category: "stories",
      tags: ["solo travel", "личный опыт", "психология"],
      imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
      views: 1876,
      likes: 134,
      comments: 45,
      featured: false
    },
    {
      id: 4,
      title: "Новые туристические маршруты в Дагестане",
      excerpt: "Правительство Дагестана анонсировало открытие пяти новых туристических маршрутов. Что это значит для путешественников?",
      content: "",
      author: "Редакция Пикми трип",
      publishDate: "2025-01-03",
      readTime: 4,
      category: "news",
      tags: ["дагестан", "новости", "маршруты"],
      imageUrl: "https://images.unsplash.com/photo-1464822759844-d150baec4253?w=800",
      views: 987,
      likes: 67,
      comments: 12,
      featured: false
    },
    {
      id: 5,
      title: "Обзор лучших приложений для путешествий по России",
      excerpt: "Тестируем и сравниваем мобильные приложения, которые сделают ваше путешествие по России удобнее и интереснее.",
      content: "",
      author: "Дмитрий Техно",
      publishDate: "2025-01-01",
      readTime: 10,
      category: "reviews",
      tags: ["приложения", "технологии", "обзор"],
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      views: 3124,
      likes: 189,
      comments: 34,
      featured: false
    },
    {
      id: 6,
      title: "Зимняя Камчатка: когда лучше ехать и что увидеть",
      excerpt: "Камчатка зимой — это совершенно другой мир. Рассказываем, почему стоит поехать туда именно в холодное время года.",
      content: "",
      author: "Игорь Северный",
      publishDate: "2024-12-28",
      readTime: 9,
      category: "guides",
      tags: ["камчатка", "зима", "экстрим"],
      imageUrl: "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800",
      views: 1567,
      likes: 112,
      comments: 28,
      featured: false
    }
  ];

  const filteredPosts = blogPosts
    .filter(post => {
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.views - a.views;
        case "trending":
          return (b.likes + b.comments) - (a.likes + a.comments);
        case "most-liked":
          return b.likes - a.likes;
        case "recent":
        default:
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
    });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Блог путешественников
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Истории, советы и вдохновение для ваших приключений по России
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Поиск статей, тегов, авторов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Рекомендуем прочитать</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Самые популярные и интересные статьи от наших путешественников
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <div className="relative h-64">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600">
                        Рекомендуем
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User size={14} className="mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {post.readTime} мин
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Heart size={14} className="mr-1" />
                            {post.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle size={14} className="mr-1" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Controls */}
      <section className="py-8 bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Найдено: {filteredPosts.length} статей
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Tag size={16} className="mr-2" />
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
                  <TrendingUp size={16} className="mr-2" />
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

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                      <div className="relative h-48">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <Badge 
                          variant="secondary" 
                          className="absolute top-3 left-3 bg-white/90 text-gray-700"
                        >
                          {categories.find(c => c.value === post.category)?.label}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(post.publishDate)}
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {post.readTime} мин
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Heart size={14} className="mr-1" />
                              {post.likes}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle size={14} className="mr-1" />
                              {post.comments}
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Share2 size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Статьи не найдены</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Попробуйте изменить параметры поиска или фильтрации
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Сбросить фильтры
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}