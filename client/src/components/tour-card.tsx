import { motion } from "framer-motion";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Tour } from "@shared/schema";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const gradientOverlays = [
    "from-emerald-400 to-sky-500",
    "from-orange-400 to-pink-500",
    "from-sky-400 to-blue-500",
    "from-yellow-400 to-orange-500",
    "from-red-400 to-orange-500",
    "from-blue-400 to-purple-500",
  ];

  const gradientOverlay = gradientOverlays[tour.id % gradientOverlays.length];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className={`relative h-48 bg-gradient-to-br ${gradientOverlay} overflow-hidden`}>
          <img 
            src={tour.imageUrl} 
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute top-4 right-4">
            {tour.isHot && (
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                Горящий тур
              </Badge>
            )}
          </div>
          
          {/* Tour info overlay */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold mb-1">{tour.title}</h3>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <Clock size={14} />
              <span>{tour.duration}</span>
              <span>•</span>
              <Users size={14} />
              <span>{tour.maxPeople} человек</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="text-emerald-500" size={16} />
              <span className="text-gray-600">{tour.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-400 fill-current" size={16} />
              <span className="text-gray-700 font-medium">
                {(tour.rating / 10).toFixed(1)}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {tour.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              ₽{tour.price.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal">
                {tour.maxPeople <= 2 ? " за двоих" : " за группу"}
              </span>
            </div>
            <Link href={`/tour/${tour.id}`}>
              <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:from-emerald-600 hover:to-sky-600 transition-all duration-200 font-medium">
                Подробнее
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
