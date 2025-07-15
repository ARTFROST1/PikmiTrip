# Настройка Supabase для Пикми Трип

## Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project" 
3. Войдите через GitHub
4. Создайте новый проект:
   - **Name**: `pikmi-trip`
   - **Database Password**: Придумайте надежный пароль
   - **Region**: Выберите ближайший регион

## Шаг 2: Получение строки подключения DATABASE_URL

1. В Supabase Dashboard перейдите в **Settings** → **Database**
2. Найдите раздел **Connection string**
3. Скопируйте строку **"Connection pooling"** (рекомендуется для продакшена)
4. Строка будет выглядеть примерно так:
```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## ВАЖНО: У вас уже есть API ключи Supabase!

Ваши ключи:
- **Publishable**: `sb_publishable_Sg5iFy2hb0ccpyWOS9fS2w_HJd1oNly`
- **Secret**: `sb_secret_607F722vpfjcRT9ENRabnA_8qLKDrSG`

Но для базы данных нужна **DATABASE_URL** (connection string), которую можно найти в Settings → Database.

## Шаг 3: Добавление секретов в Replit

В Replit перейдите в **Secrets** и добавьте:

1. **DATABASE_URL** - строка подключения из Supabase Dashboard
2. **SUPABASE_URL** - URL вашего проекта (например: `https://abcdefgh.supabase.co`)
3. **SUPABASE_ANON_KEY** - ваш publishable ключ: `sb_publishable_Sg5iFy2hb0ccpyWOS9fS2w_HJd1oNly`
4. **SUPABASE_SERVICE_ROLE_KEY** - ваш secret ключ: `sb_secret_607F722vpfjcRT9ENRabnA_8qLKDrSG`

## Шаг 4: Применение схемы базы данных

После добавления DATABASE_URL выполните:
```bash
npm run db:push
```

Эта команда создаст все необходимые таблицы в Supabase:
- `users` - пользователи
- `tours` - туры  
- `bookings` - бронирования
- `reviews` - отзывы
- `favorites` - избранное
- `sessions` - сессии для аутентификации

## Шаг 5: Перезапуск приложения

Приложение автоматически перезапустится и подключится к Supabase.

## Преимущества Supabase

✅ **Независимость**: Не привязан к Replit
✅ **Бесплатный план**: До 500MB и 2GB трафика
✅ **Масштабируемость**: Легко увеличить лимиты
✅ **PostgreSQL**: Полная совместимость
✅ **Резервные копии**: Автоматические бэкапы
✅ **Real-time**: Поддержка websockets
✅ **Dashboard**: Удобный интерфейс управления

## Мониторинг данных

В Supabase Dashboard вы можете:
- Просматривать таблицы и данные
- Выполнять SQL запросы
- Мониторить производительность
- Настраивать доступы
- Создавать бэкапы

Теперь ваше приложение полностью независимо от Replit!