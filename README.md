# HealthTracker: дневник самочувствия с социальной лентой

Приложение для ежедневных записей о настроении, сне и стрессе. Можно смотреть историю, добавлять заметки и делиться записью в ленте с друзьями.

## Что сделано

- Дневник по датам: сон, стресс, оценка настроения и заметки.
- Экран статистики и расчёт показателя самочувствия.
- Публикации с привязкой к записи дневника, лайки и комментарии.
- Запросы в друзья, профиль и загрузка изображений.
- Регистрация и вход с JWT, документация API.

## Как устроен проект

Frontend написан на Next.js 16, React 19 и TypeScript. Redux Toolkit хранит состояние авторизации и дневника, Axios отправляет запросы.

Backend использует Express и Sequelize. Данные лежат в локальном файле SQLite, поэтому для запуска не нужен отдельный сервер базы данных. Пароли хешируются через bcryptjs, входящие данные проверяются через express-validator.

| Путь | Назначение |
| --- | --- |
| `frontend/src/app` | Страницы дневника, статистики и ленты |
| `frontend/src/store` | Состояние клиента |
| `frontend/src/shared/lib/calcMoodScore.ts` | Расчёт показателя самочувствия |
| `backend/src/routes` | REST API |
| `backend/src/models` | Модели Sequelize |
| `backend/src/seed.js` | Демонстрационные записи |

## Запуск

Нужны Node.js 24 и npm. Docker не требуется.

```bash
git clone https://github.com/kvantoniY/HealthTracker.git
cd HealthTracker
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm ci --prefix backend
npm ci --prefix frontend
npm run seed --prefix backend
npm start --prefix backend
```

Во втором терминале:

```bash
npm run dev --prefix frontend
```

Сайт: http://localhost:3000. API: http://localhost:4000/api/_health. Локальная база создастся в `backend/data/local.sqlite`.

В Windows PowerShell используйте `Copy-Item` вместо `cp`. Если PowerShell блокирует `npm.ps1`, запускайте `npm.cmd` вместо `npm`.

## Что проверить

1. Войдите на `/auth` с логином `ivan` и паролем `Password123!`.
2. В дневнике `/healthtracker` добавьте запись за сегодня и обновите страницу.
3. Посмотрите `/dashboard`, создайте публикацию в `/feed`.
4. Второй демо-пользователь: `kate`, пароль тот же. С его аккаунта можно проверить комментарии и лайки.

Сборка: `npm run build --prefix frontend`. Результаты проверки: [docs/VERIFICATION.md](docs/VERIFICATION.md).

## Ограничения

Показатель самочувствия рассчитывается по формуле проекта и не является медицинской оценкой. SQLite и автоматическое изменение таблиц подходят для локального прототипа. Для многопользовательского сервиса потребуются миграции и отдельная проверка хранения личных данных.
