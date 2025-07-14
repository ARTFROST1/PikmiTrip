import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Users, Camera, Heart, Share2, CheckCircle, XCircle, Route } from "lucide-react";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookingModal from "@/components/booking-modal";
import TourReviews from "@/components/tour-reviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tour } from "@shared/schema";

export default function TourDetail() {
  const [, params] = useRoute("/tour/:id");
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const { data: tour, isLoading } = useQuery<Tour>({
    queryKey: ["/api/tours", params?.id],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-16 animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-16 max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">🏔️</div>
          <h1 className="text-2xl font-bold mb-4">Тур не найден</h1>
          <p className="text-gray-600 mb-8">
            Запрашиваемый тур не существует или был удалён.
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
          >
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={tour.imageUrl} 
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Floating action buttons */}
        <div className="absolute top-20 right-4 flex flex-col gap-2">
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30">
            <Heart className="h-4 w-4 text-white" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30">
            <Share2 className="h-4 w-4 text-white" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30">
            <Camera className="h-4 w-4 text-white" />
          </Button>
        </div>
        
        {/* Tour info overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            {tour.isHot && (
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500">
                Горящий тур
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-emerald-500 to-sky-500">
              {tour.category}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{tour.title}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>до {tour.maxPeople} человек</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="program">Программа</TabsTrigger>
                <TabsTrigger value="route">Маршрут</TabsTrigger>
                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">
                            {(tour.rating / 10).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">Рейтинг на основе отзывов</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ₽{tour.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">за человека</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      О путешествии
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {tour.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {tour.duration}
                        </div>
                        <div className="text-sm text-gray-600">Продолжительность</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {tour.maxPeople}
                        </div>
                        <div className="text-sm text-gray-600">Макс. участников</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {(tour.rating / 10).toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Рейтинг</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Included/Excluded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Что включено
                      </h3>
                      <div className="space-y-2">
                        {tour.included?.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        Что не включено
                      </h3>
                      <div className="space-y-2">
                        {tour.excluded?.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="program" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Программа тура</h3>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {tour.program}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="route" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Route className="h-5 w-5 text-blue-600" />
                      Маршрут на карте
                    </h3>
                    {tour.route ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-3">Основные точки маршрута:</p>
                          <div className="space-y-2">
                            {(() => {
                              try {
                                const routePoints = JSON.parse(tour.route);
                                return routePoints.map((point: any, index: number) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                      {index + 1}
                                    </div>
                                    <span className="font-medium">{point.name}</span>
                                    <span className="text-sm text-gray-500">
                                      ({point.lat.toFixed(4)}, {point.lng.toFixed(4)})
                                    </span>
                                  </div>
                                ));
                              } catch (error) {
                                return <p className="text-gray-500">Некорректный формат маршрута</p>;
                              }
                            })()}
                          </div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600">
                            Интеграция с Яндекс.Картами будет доступна в следующих обновлениях
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Маршрут не указан</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <TourReviews tourId={tour.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ₽{tour.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">за человека</div>
                </div>
                
                <Button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full mb-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="lg"
                >
                  Забронировать тур
                </Button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Локация:</span>
                    <span className="font-medium">{tour.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Продолжительность:</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Группа:</span>
                    <span className="font-medium">до {tour.maxPeople} человек</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Категория:</span>
                    <span className="font-medium">{tour.category}</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Быстрое бронирование</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Подтверждение в течение 24 часов
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      
      <Footer />
      
      {showBookingModal && (
        <BookingModal
          tour={tour}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}