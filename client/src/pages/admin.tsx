import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, Users, TrendingUp } from "lucide-react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Tour, Booking, InsertTour } from "@shared/schema";

export default function Admin() {
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tours = [], isLoading: toursLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const deleteTourMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tours/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({
        title: "Тур удален",
        description: "Тур успешно удален из системы",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить тур",
        variant: "destructive",
      });
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Статус обновлен",
        description: "Статус бронирования успешно изменен",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive",
      });
    },
  });

  const handleDeleteTour = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот тур?")) {
      deleteTourMutation.mutate(id);
    }
  };

  const handleUpdateBookingStatus = (id: number, status: string) => {
    updateBookingStatusMutation.mutate({ id, status });
  };

  const stats = {
    totalTours: tours.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === "pending").length,
    hotTours: tours.filter(t => t.isHot).length,
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Админ-панель
              </h1>
              <p className="text-gray-600">
                Управление турами и бронированиями
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего туров</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTours}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего бронирований</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
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
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Горящие туры</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.hotTours}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tours Management */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Управление турами</CardTitle>
                  <Dialog open={isAddingTour} onOpenChange={setIsAddingTour}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить тур
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Добавить новый тур</DialogTitle>
                      </DialogHeader>
                      <TourForm onClose={() => setIsAddingTour(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {toursLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="flex justify-between">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tours.map((tour) => (
                      <div key={tour.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{tour.title}</h3>
                            <p className="text-sm text-gray-600">{tour.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {tour.isHot && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500">
                                Горящий
                              </Badge>
                            )}
                            <Badge variant="secondary">{tour.category}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {tour.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">₽{tour.price.toLocaleString()}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingTour(tour)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTour(tour.id)}
                              disabled={deleteTourMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bookings Management */}
            <Card>
              <CardHeader>
                <CardTitle>Бронирования</CardTitle>
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
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const tour = tours.find(t => t.id === booking.tourId);
                      return (
                        <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {booking.firstName} {booking.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {tour?.title} • {booking.peopleCount} чел.
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.email} • {booking.phone}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                  booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                                  "bg-red-100 text-red-800"
                                }
                              >
                                {booking.status === "pending" ? "Ожидает" :
                                 booking.status === "confirmed" ? "Подтверждено" :
                                 "Отклонено"}
                              </Badge>
                              <Select
                                value={booking.status}
                                onValueChange={(status) => handleUpdateBookingStatus(booking.id, status)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Ожидает</SelectItem>
                                  <SelectItem value="confirmed">Подтвердить</SelectItem>
                                  <SelectItem value="cancelled">Отклонить</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                              {booking.notes}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(booking.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Edit Tour Dialog */}
      <Dialog open={!!editingTour} onOpenChange={() => setEditingTour(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать тур</DialogTitle>
          </DialogHeader>
          <TourForm tour={editingTour} onClose={() => setEditingTour(null)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TourForm({ tour, onClose }: { tour?: Tour | null; onClose: () => void }) {
  const [formData, setFormData] = useState<Partial<InsertTour>>({
    title: tour?.title || "",
    description: tour?.description || "",
    location: tour?.location || "",
    duration: tour?.duration || "",
    price: tour?.price || 0,
    maxPeople: tour?.maxPeople || 2,
    imageUrl: tour?.imageUrl || "",
    rating: tour?.rating || 45,
    category: tour?.category || "nature",
    tags: tour?.tags || [],
    isHot: tour?.isHot || false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveTourMutation = useMutation({
    mutationFn: async (data: Partial<InsertTour>) => {
      if (tour) {
        await apiRequest("PUT", `/api/tours/${tour.id}`, data);
      } else {
        await apiRequest("POST", "/api/tours", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({
        title: tour ? "Тур обновлен" : "Тур создан",
        description: tour ? "Тур успешно обновлен" : "Новый тур успешно создан",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить тур",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTourMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Название</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Местоположение</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="duration">Продолжительность</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="2 дня"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Цена</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="maxPeople">Макс. человек</Label>
          <Input
            id="maxPeople"
            type="number"
            value={formData.maxPeople}
            onChange={(e) => setFormData({ ...formData, maxPeople: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl">URL изображения</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Категория</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nature">Природа</SelectItem>
              <SelectItem value="cultural">Культурный</SelectItem>
              <SelectItem value="adventure">Приключения</SelectItem>
              <SelectItem value="coastal">Побережье</SelectItem>
              <SelectItem value="mountains">Горы</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rating">Рейтинг (0-50)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="50"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isHot"
          checked={formData.isHot}
          onCheckedChange={(checked) => setFormData({ ...formData, isHot: checked })}
        />
        <Label htmlFor="isHot">Горящий тур</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button 
          type="submit" 
          disabled={saveTourMutation.isPending}
          className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600"
        >
          {saveTourMutation.isPending ? "Сохранение..." : tour ? "Обновить" : "Создать"}
        </Button>
      </div>
    </form>
  );
}
