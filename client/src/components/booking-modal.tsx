import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X, User, Mail, Phone, Users, MessageCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Tour, InsertBooking } from "@shared/schema";

interface BookingModalProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    peopleCount: 1,
    notes: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: InsertBooking) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Бронирование отправлено!",
        description: "Мы свяжемся с вами в ближайшее время для подтверждения.",
      });
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        peopleCount: 1,
        notes: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка бронирования",
        description: error.message || "Произошла ошибка при создании бронирования",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    const bookingData: InsertBooking = {
      tourId: tour.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      peopleCount: formData.peopleCount,
      notes: formData.notes,
    };

    createBookingMutation.mutate(bookingData);
  };

  const totalPrice = tour.price * (formData.peopleCount / tour.maxPeople);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Забронировать тур
          </DialogTitle>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>{tour.title}</span>
            <span>•</span>
            <span>{tour.location}</span>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center space-x-2">
                <User size={16} />
                <span>Имя *</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Ваше имя"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center space-x-2">
                <User size={16} />
                <span>Фамилия *</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Ваша фамилия"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail size={16} />
              <span>Email *</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone size={16} />
              <span>Телефон *</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (999) 999-99-99"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="peopleCount" className="flex items-center space-x-2">
              <Users size={16} />
              <span>Количество человек</span>
            </Label>
            <Select 
              value={formData.peopleCount.toString()} 
              onValueChange={(value) => setFormData({ ...formData, peopleCount: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(tour.maxPeople)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1} {i === 0 ? "человек" : "человека"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center space-x-2">
              <MessageCircle size={16} />
              <span>Дополнительные пожелания</span>
            </Label>
            <Textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Расскажите о ваших предпочтениях..."
            />
          </div>
          
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-lg p-6 border"
          >
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard size={20} />
              <span>Детали бронирования</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Тур:</span>
                <span className="font-medium">{tour.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Количество человек:</span>
                <span className="font-medium">{formData.peopleCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Цена за человека:</span>
                <span className="font-medium">₽{(tour.price / tour.maxPeople).toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Итого:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ₽{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex items-center justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={createBookingMutation.isPending}
              className="px-8 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold transition-all duration-200 transform hover:scale-105"
            >
              {createBookingMutation.isPending ? "Бронирование..." : "Забронировать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
