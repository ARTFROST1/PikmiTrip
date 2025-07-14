import { motion } from "framer-motion";
import { Heart, Leaf, Clock, Waves, Camera, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  selectedFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export default function Filters({ selectedFilter, onFilterChange }: FiltersProps) {
  const filters = [
    {
      id: "couple",
      label: "Для пары",
      icon: Heart,
      gradient: "from-emerald-50 to-sky-50",
      borderColor: "border-emerald-200",
      hoverBorderColor: "hover:border-emerald-400",
      iconColor: "text-emerald-600",
      hoverIconColor: "group-hover:text-emerald-700",
    },
    {
      id: "nature",
      label: "Природа",
      icon: Leaf,
      gradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      hoverBorderColor: "hover:border-green-400",
      iconColor: "text-green-600",
      hoverIconColor: "group-hover:text-green-700",
    },
    {
      id: "short",
      label: "До 3 часов",
      icon: Clock,
      gradient: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-200",
      hoverBorderColor: "hover:border-orange-400",
      iconColor: "text-orange-600",
      hoverIconColor: "group-hover:text-orange-700",
    },
    {
      id: "water",
      label: "У воды",
      icon: Waves,
      gradient: "from-blue-50 to-sky-50",
      borderColor: "border-blue-200",
      hoverBorderColor: "hover:border-blue-400",
      iconColor: "text-blue-600",
      hoverIconColor: "group-hover:text-blue-700",
    },
    {
      id: "photo",
      label: "Фотогенно",
      icon: Camera,
      gradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      hoverBorderColor: "hover:border-purple-400",
      iconColor: "text-purple-600",
      hoverIconColor: "group-hover:text-purple-700",
    },
    {
      id: "hot",
      label: "Горящие",
      icon: Flame,
      gradient: "from-red-50 to-orange-50",
      borderColor: "border-red-200",
      hoverBorderColor: "hover:border-red-400",
      iconColor: "text-red-600",
      hoverIconColor: "group-hover:text-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {filters.map((filter, index) => {
        const Icon = filter.icon;
        const isActive = selectedFilter === filter.id;
        
        return (
          <motion.div
            key={filter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Button
              onClick={() => onFilterChange(isActive ? null : filter.id)}
              className={`
                group p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg w-full h-auto
                ${isActive
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : `bg-gradient-to-br ${filter.gradient} ${filter.borderColor} ${filter.hoverBorderColor}`
                }
              `}
              variant="ghost"
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon 
                  className={`
                    group-hover:scale-110 transition-transform
                    ${isActive 
                      ? "text-white" 
                      : `${filter.iconColor} ${filter.hoverIconColor}`
                    }
                  `}
                  size={24}
                />
                <span className={`
                  text-sm font-medium
                  ${isActive 
                    ? "text-white" 
                    : `text-gray-700 ${filter.hoverIconColor}`
                  }
                `}>
                  {filter.label}
                </span>
              </div>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
