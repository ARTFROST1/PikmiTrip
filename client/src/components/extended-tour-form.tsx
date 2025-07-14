import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, X, MapPin, Save, ImageIcon, Calendar, Users, DollarSign, Star, Route, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertTourSchema, type InsertTour, type Tour } from "@shared/schema";
import { z } from "zod";

const extendedTourSchema = insertTourSchema.extend({
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  route: z.string().optional(),
  program: z.string().optional(),
});

type ExtendedTourForm = z.infer<typeof extendedTourSchema>;

interface ExtendedTourFormProps {
  tour?: Tour | null;
  onClose: () => void;
}

export default function ExtendedTourForm({ tour, onClose }: ExtendedTourFormProps) {
  const [newIncluded, setNewIncluded] = useState("");
  const [newExcluded, setNewExcluded] = useState("");
  const [routePoints, setRoutePoints] = useState<Array<{name: string, lat: number, lng: number}>>([]);
  const [newRoutePoint, setNewRoutePoint] = useState({ name: "", lat: 0, lng: 0 });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ExtendedTourForm>({
    resolver: zodResolver(extendedTourSchema),
    defaultValues: {
      title: tour?.title || "",
      description: tour?.description || "",
      location: tour?.location || "",
      duration: tour?.duration || "",
      price: tour?.price || 0,
      maxPeople: tour?.maxPeople || 1,
      category: tour?.category || "",
      imageUrl: tour?.imageUrl || "",
      tags: tour?.tags || [],
      included: tour?.included || [],
      excluded: tour?.excluded || [],
      program: tour?.program || "",
      route: tour?.route || "",
      isHot: tour?.isHot || false,
    },
  });

  const createTourMutation = useMutation({
    mutationFn: async (data: ExtendedTourForm) => {
      const processedData = {
        ...data,
        route: routePoints.length > 0 ? JSON.stringify(routePoints) : null,
      };
      
      if (tour) {
        return apiRequest("PUT", `/api/tours/${tour.id}`, processedData);
      } else {
        return apiRequest("POST", "/api/tours", processedData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({
        title: tour ? "Тур обновлен" : "Тур создан",
        description: tour ? "Изменения сохранены успешно" : "Новый тур добавлен в каталог",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Tour mutation error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить тур. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ExtendedTourForm) => {
    // Validate required fields
    if (!data.title || !data.description || !data.location || !data.duration) {
      toast({
        title: "Заполните обязательные поля",
        description: "Название, описание, локация и продолжительность обязательны для заполнения",
        variant: "destructive",
      });
      return;
    }

    if (data.price <= 0) {
      toast({
        title: "Некорректная цена",
        description: "Цена должна быть больше нуля",
        variant: "destructive",
      });
      return;
    }

    createTourMutation.mutate(data);
  };

  const addIncluded = () => {
    if (newIncluded.trim()) {
      const currentIncluded = form.getValues("included") || [];
      form.setValue("included", [...currentIncluded, newIncluded.trim()]);
      setNewIncluded("");
    }
  };

  const removeIncluded = (index: number) => {
    const currentIncluded = form.getValues("included") || [];
    form.setValue("included", currentIncluded.filter((_, i) => i !== index));
  };

  const addExcluded = () => {
    if (newExcluded.trim()) {
      const currentExcluded = form.getValues("excluded") || [];
      form.setValue("excluded", [...currentExcluded, newExcluded.trim()]);
      setNewExcluded("");
    }
  };

  const removeExcluded = (index: number) => {
    const currentExcluded = form.getValues("excluded") || [];
    form.setValue("excluded", currentExcluded.filter((_, i) => i !== index));
  };

  const addRoutePoint = () => {
    if (newRoutePoint.name.trim() && newRoutePoint.lat !== 0 && newRoutePoint.lng !== 0) {
      setRoutePoints([...routePoints, { ...newRoutePoint }]);
      setNewRoutePoint({ name: "", lat: 0, lng: 0 });
    }
  };

  const removeRoutePoint = (index: number) => {
    setRoutePoints(routePoints.filter((_, i) => i !== index));
  };

  const categories = [
    "Пары", "Природа", "Короткие", "Водные", "Горы", "Города", "Экстрим", "Культурные", "Гастрономические"
  ];

  const durations = [
    "Несколько часов", "Полдня", "Целый день", "2 дня", "3 дня", "Выходные", "Неделя", "Больше недели"
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {tour ? "Редактировать тур" : "Создать новый тур"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Основная информация</TabsTrigger>
                <TabsTrigger value="details">Детали</TabsTrigger>
                <TabsTrigger value="route">Маршрут</TabsTrigger>
                <TabsTrigger value="program">Программа</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название тура *</FormLabel>
                        <FormControl>
                          <Input placeholder="Карельские озера" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Локация *</FormLabel>
                        <FormControl>
                          <Input placeholder="Республика Карелия" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Продолжительность *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите продолжительность" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration} value={duration}>
                                {duration}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Категория *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Цена (руб.) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="15000" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxPeople"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Максимум участников</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="8" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL изображения</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isHot"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Горящий тур</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Описание тура..." 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                {/* Included Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Что включено в тур
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Добавить пункт..."
                          value={newIncluded}
                          onChange={(e) => setNewIncluded(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluded())}
                        />
                        <Button type="button" onClick={addIncluded}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("included")?.map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIncluded(index)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Excluded Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Что не включено в тур
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Добавить пункт..."
                          value={newExcluded}
                          onChange={(e) => setNewExcluded(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExcluded())}
                        />
                        <Button type="button" onClick={addExcluded}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("excluded")?.map((item, index) => (
                          <Badge key={index} variant="destructive" className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExcluded(index)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="route" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-blue-600" />
                      Маршрут тура
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          placeholder="Название точки"
                          value={newRoutePoint.name}
                          onChange={(e) => setNewRoutePoint({ ...newRoutePoint, name: e.target.value })}
                        />
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="Широта"
                          value={newRoutePoint.lat || ""}
                          onChange={(e) => setNewRoutePoint({ ...newRoutePoint, lat: Number(e.target.value) })}
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.0001"
                            placeholder="Долгота"
                            value={newRoutePoint.lng || ""}
                            onChange={(e) => setNewRoutePoint({ ...newRoutePoint, lng: Number(e.target.value) })}
                          />
                          <Button type="button" onClick={addRoutePoint}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {routePoints.map((point, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">{point.name}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({point.lat.toFixed(4)}, {point.lng.toFixed(4)})
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRoutePoint(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      {routePoints.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          Добавьте точки маршрута для отображения на карте
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="program" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Программа тура
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="program"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подробная программа</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="День 1: Прибытие и размещение..."
                              rows={10}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={createTourMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {createTourMutation.isPending ? "Сохранение..." : tour ? "Сохранить изменения" : "Создать тур"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}