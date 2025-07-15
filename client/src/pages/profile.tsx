import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, MapPin, Clock, Star, Calendar, Heart, Settings, LogOut } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import type { Booking, Tour } from "@shared/schema";

export default function Profile() {
  const { user, isLoading } = useAuth();
  
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: tours = [] } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Требуется авторизация
            </h1>
            <p className="text-gray-600 mb-8">
              Войдите в систему, чтобы просмотреть свой профиль
            </p>
            <Link href="/">
              <Button>Вернуться на главную</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter bookings for current user (in real app, this would be done on backend)
  const userBookings = bookings.filter(() => true); // For now, show all bookings
  const completedBookings = userBookings.filter(b => b.status === "confirmed");
  const pendingBookings = userBookings.filter(b => b.status === "pending");

  const stats = {
    totalBookings: userBookings.length,
    completedTrips: completedBookings.length,
    pendingBookings: pendingBookings.length,
    favoriteDestinations: 3, // Mock data
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {user.firstName || user.email?.split('@')[0] || 'Пользователь'} {user.lastName || ''}
                    </h1>
                    <p className="text-white/90 text-lg">
                      {user.email}
                    </p>
                    <Badge className="mt-2 bg-white/20 text-white">
                      {user.userType === "agency" ? "Турагентство" : "Путешественник"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего бронирований</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Завершенных поездок</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.completedTrips}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ожидают подтверждения</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Избранные места</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.favoriteDestinations}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bookings">Мои бронирования</TabsTrigger>
                <TabsTrigger value="favorites">Избранное</TabsTrigger>
                <TabsTrigger value="settings">Настройки</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>История бронирований</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookingsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="border rounded-lg p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : userBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Пока нет бронирований
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Найдите свой первый тур и отправляйтесь в приключение
                        </p>
                        <Link href="/">
                          <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
                            Найти туры
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userBookings.map((booking) => {
                          const tour = tours.find(t => t.id === booking.tourId);
                          return (
                            <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {tour?.title || "Неизвестный тур"}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {tour?.location} • {booking.peopleCount} человек
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                    booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                                    "bg-red-100 text-red-800"
                                  }
                                >
                                  {booking.status === "pending" ? "Ожидает подтверждения" :
                                   booking.status === "confirmed" ? "Подтверждено" :
                                   "Отклонено"}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">
                                  {new Date(booking.createdAt).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                                {tour && (
                                  <Link href={`/tour/${tour.id}`}>
                                    <Button variant="outline" size="sm">
                                      Подробнее
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Избранные туры</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Избранных туров пока нет
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Добавляйте понравившиеся туры в избранное
                      </p>
                      <Link href="/">
                        <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
                          Найти туры
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Мои отзывы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Отзывов пока нет
                      </h3>
                      <p className="text-gray-600">
                        Оставьте отзыв о завершенных поездках
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}