import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import type { Review, InsertReview } from "@shared/schema";

interface TourReviewsProps {
  tourId: number;
}

export default function TourReviews({ tourId }: TourReviewsProps) {
  const { user } = useAuth();
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", tourId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${tourId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: InsertReview) => {
      await apiRequest("POST", "/api/reviews", reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", tourId] });
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      setNewReview({ rating: 5, comment: "" });
      toast({
        title: "Отзыв добавлен",
        description: "Спасибо за ваш отзыв! Он поможет другим путешественникам.",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить отзыв. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Авторизация необходима",
        description: "Войдите в аккаунт, чтобы оставить отзыв",
        variant: "destructive",
      });
      return;
    }

    if (newReview.comment.trim().length < 10) {
      toast({
        title: "Слишком короткий отзыв",
        description: "Отзыв должен содержать не менее 10 символов",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    createReviewMutation.mutate({
      tourId,
      userId: user.id,
      rating: newReview.rating,
      comment: newReview.comment.trim(),
    });

    setIsSubmitting(false);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-semibold">Отзывы</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {reviews.length > 0 && (
                <>
                  {renderStars(Math.round(averageRating))}
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span>•</span>
                </>
              )}
              <span>{reviews.length} отзыв{reviews.length === 1 ? '' : reviews.length < 5 ? 'а' : 'ов'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      {user && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Оставить отзыв</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Оценка</label>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({ ...newReview, rating })
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Комментарий</label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Поделитесь своим опытом о данном туре..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || newReview.comment.trim().length < 10}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Отправляем..." : "Опубликовать отзыв"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence>
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Путешественник</span>
                          <Badge variant="secondary" className="text-xs">
                            {renderStars(review.rating)}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет отзывов</h3>
          <p className="text-gray-500 mb-4">Станьте первым, кто поделится своим опытом!</p>
          {!user && (
            <p className="text-sm text-gray-400">
              Войдите в аккаунт, чтобы оставить отзыв
            </p>
          )}
        </div>
      )}
    </div>
  );
}