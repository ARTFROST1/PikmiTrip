import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, User, Mail, Lock, UserCheck, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { InsertUser } from "@shared/schema";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    userType: "traveler" as "traveler" | "agency",
  });

  const { toast } = useToast();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (user) => {
      login(user);
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в систему",
      });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка входа",
        description: error.message || "Неверные учетные данные",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (user) => {
      login(user);
      toast({
        title: "Регистрация успешна!",
        description: "Добро пожаловать в Пикми трип",
      });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      userType: "traveler",
    });
    setShowPassword(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      loginMutation.mutate({
        username: formData.username,
        password: formData.password,
      });
    } else {
      registerMutation.mutate(formData);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center gradient-text">
            {mode === "login" ? "Вход" : "Регистрация"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Выберите тип аккаунта
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: "traveler" })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.userType === "traveler"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.userType === "traveler"
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <User size={20} />
                      </div>
                      <span className="text-sm font-medium">Путешественник</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: "agency" })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.userType === "agency"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        formData.userType === "agency"
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <Building size={20} />
                      </div>
                      <span className="text-sm font-medium">Турагентство</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Иван"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Иванов"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ivan@example.com"
                  required
                />
              </div>
            </motion.div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center space-x-2">
              <UserCheck size={16} />
              <span>Имя пользователя</span>
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="ivan123"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Lock size={16} />
              <span>Пароль</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            {isLoading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>

          {/* Mode Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                resetForm();
              }}
              className="text-emerald-600 hover:text-emerald-700 text-sm"
            >
              {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}