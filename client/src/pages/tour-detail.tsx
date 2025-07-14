import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Users, Camera, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookingModal from "@/components/booking-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Тур не найден
            </h1>
            <p className="text-gray-600 mb-8">
              Возможно, тур был удален или URL неверный
            </p>
            <Button onClick={() => window.history.back()}>
              Вернуться назад
            </Button>
          </div>
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
            <Card className="mb-6">
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
                    <span className="text-gray-600">127 отзывов</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ₽{tour.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">за {tour.maxPeople <= 2 ? 'двоих' : 'группу'}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  О путешествии
                </h3>
                <p className="text-gray-600 mb-6">
                  {tour.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-sky-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Включено</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Проживание в отеле</li>
                      <li>• Трансфер туда-обратно</li>
                      <li>• Экскурсии</li>
                      <li>• Завтраки</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Не включено</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Обеды и ужины</li>
                      <li>• Личные расходы</li>
                      <li>• Сувениры</li>
                      <li>• Страховка</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Программа тура
                </h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <h4 className="font-semibold text-gray-900">День 1</h4>
                    <p className="text-gray-600">
                      Прибытие, размещение в отеле, знакомство с группой. 
                      Вечером - прогулка по центру города.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-sky-500 pl-4">
                    <h4 className="font-semibold text-gray-900">День 2</h4>
                    <p className="text-gray-600">
                      Основная экскурсионная программа. Посещение главных 
                      достопримечательностей, обед на природе.
                    </p>
                  </div>
                  
                  {tour.duration.includes("3 дня") && (
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-gray-900">День 3</h4>
                      <p className="text-gray-600">
                        Дополнительные активности, свободное время, 
                        трансфер к месту отправления.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Маршрут на карте
                </h3>
                <div className="w-full h-64 bg-gradient-to-br from-emerald-100 to-sky-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Интерактивная карта маршрута
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ₽{tour.price.toLocaleString()}
                  </div>
                  <div className="text-gray-500">
                    за {tour.maxPeople <= 2 ? 'двоих' : 'группу'}
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Продолжительность</span>
                    <span className="font-semibold">{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Макс. человек</span>
                    <span className="font-semibold">{tour.maxPeople}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Рейтинг</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{(tour.rating / 10).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Забронировать
                </Button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  Бесплатная отмена до 24 часов
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      <BookingModal 
        tour={tour}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
      
      <Footer />
    </div>
  );
}
