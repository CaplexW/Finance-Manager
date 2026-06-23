# Проект WatchMoney: Правила и Конвенции

## 📌 Общая информация
- **Тип проекта**: Fullstack финансовый трекер
- **Стек технологий**:
  - **Сервер**: Node.js/TypeScript + Express + MongoDB (Mongoose)
  - **Клиент**: React 18 + Redux Toolkit + TypeScript/JavaScript
  - **Сборка**: Vite

---

## 📁 Структура проекта

### Основные директории
```
Finance-Manager/
├── src/
│   ├── server/          # Серверная часть (Node.js/TypeScript)
│   │   ├── routes/      # Маршруты API
│   │   ├── middleware/  # Middleware (например, auth.middleware.ts)
│   │   ├── services/    # Сервисы (validator.service.ts, token.service.ts, etc.)
│   │   ├── utils/       # Утилиты и хелперы
│   │   │   ├── errors/  # Обработка ошибок
│   │   │   ├── console/ # Логирование
│   │   │   └── ...      # Прочие утилиты
│   │   └── main.ts      # Точка входа сервера
│   │
│   ├── client/          # Клиентская часть (React)
│   │   ├── app/         # Компоненты React (JSX)
│   │   │   ├── components/
│   │   │   │   ├── UI/  # UI-компоненты (loginForm.jsx, NavBar.jsx, etc.)
│   │   │   │   └── ...  # Прочие компоненты
│   │   ├── types/       # Типы TypeScript для клиента
│   │   └── main.jsx     # Точка входа клиента
│   │
│   ├── db/              # База данных
│   │   ├── models/      # Модели MongoDB (User.ts, Operation.ts, etc.)
│   │   ├── initialData/ # Начальные данные (defaultCategories.ts, etc.)
│   │   └── structure.md # Документация структуры БД
│   │
│   └── config/          # Конфигурация (config.ts)
│
├── package.json
├── vite.config.ts
└── ...
```

---

## 📜 Правила именования и форматов файлов

### 1. **Формат файлов по типу содержимого**
| Тип содержимого | Расширение | Пример |
|----------------|------------|--------|
| **React-компоненты** | `.jsx` | `NavBar.jsx`, `loginForm.jsx` |
| **Логика сервера** | `.ts` | `auth.middleware.ts`, `validator.service.ts` |
| **Модели БД** | `.ts` | `User.ts`, `Operation.ts` |
| **Типы TypeScript** | `.ts` | `types.ts` |
| **Утилиты** | `.ts` или `.js` | `formatDate.ts`, `paginate.js` |

> ⚠️ **ВАЖНО**: 
> - **ВСЕ** React-компоненты пишутся в формате **JSX** (не TSX!).
> - Вся прочая логика (сервер, модели, утилиты, типы) пишется на **TypeScript** (.ts).


### 2. **Именование файлов**
- **PascalCase** для React-компонентов: `UserAvatar.jsx`, `CreateOperationForm.jsx`
- **kebab-case** для утилит и сервисов: `format-date.ts`, `token.service.ts`
- **snake_case** для конфигурационных файлов: `vite.config.ts`
- **CamelCase** для моделей БД: `User.ts`, `Operation.ts`

---

## 🗃️ Структура данных (MongoDB)

### Коллекции и их поля
См. [src/db/structure.md](src/db/structure.md) для полной документации.

#### Основные коллекции:
1. **User**
   - `email` (String, уникальный)
   - `password` (String, хешированный)
   - `name` (String)
   - `currentBalance` (Number)
   - `categories` ([ObjectId] → Category)
   - `accounts` ([ObjectId] → Account)
   - `goals` ([ObjectId] → Goal)
   - `operations` ([ObjectId] → Operation)
   - `image` (String, опционально)

2. **Operation**
   - `date` (String, обязательно)
   - `time` (String, опционально)
   - `name` (String, обязательно)
   - `amount` (Number, обязательно)
   - `balanceBefore` (Number, опционально)
   - `balanceAfter` (Number, опционально)
   - `category` (ObjectId → Category, обязательно)
   - `user` (ObjectId → User, обязательно)

3. **Category**
   - `name` (String, обязательно)
   - `color` (String, обязательно)
   - `isIncome` (Boolean, обязательно)
   - `user` (ObjectId → User, обязательно)
   - `icon` (ObjectId → Icon, обязательно)

4. **Account**
   - `name` (String, обязательно)
   - `type` (Enum: `savings`, `credit`, `deposit`, `debit`)
   - `currentBalance` (Number, обязательно)
   - `user` (ObjectId → User, обязательно)
   - `goal` (ObjectId → Goal, опционально)
   - `percent` (Number, опционально)
   - `image` (String, опционально)

5. **Goal**
   - `name` (String, обязательно)
   - `goalPoint` (Number, обязательно)
   - `status` (Enum: `complete`, `in progress`, `abandoned`)
   - `user` (ObjectId → User, обязательно)
   - `account` (ObjectId → Account, опционально)

6. **Icon**
   - `name` (String, обязательно)
   - `src` (Object, ReactElement)

7. **Token**
   - `user` (ObjectId → User, обязательно)
   - `refreshToken` (String, обязательно)

8. **DefaultCategory**
   - `name` (String, обязательно)
   - `color` (String, обязательно)
   - `iconName` (String, обязательно)
   - `isIncome` (Boolean, обязательно)
   - `icon` (ObjectId → Icon, опционально)

9. **MCC** (Merchant Category Code)
   - `code` (Number, обязательно)
   - `name` (String, обязательно)

---

## 🔧 Типизация (TypeScript)

### Клиентские типы
См. [src/client/types/types.ts](src/client/types/types.ts) для основных интерфейсов.

#### Основные интерфейсы:
- **User**: `_id`, `name`, `email`, `currentBalance`, `image`, `goals`, `accounts`, `operations`, `categories`
- **Operation**: `_id`, `name`, `amount`, `category`, `date`, `user`
- **Category**: `_id`, `name`, `color`, `isIncome`, `icon` (ReactElement)
- **Account**: `_id`, `name`, `type`, `currentBalance`, `user`, `goal`, `percent`, `image`
- **Goal**: `_id`, `name`, `goalPoint`, `status`, `user`, `account`
- **Icon**: `_id`, `src` (ReactElement)

> ⚠️ **ВАЖНО**: 
> - На клиенте `icon` в **Category** и `src` в **Icon** представлены как `ReactElement`.
> - На сервере `icon` в **Category** и `src` в **Icon** хранятся как `ObjectId` (для Category) или `Object` (для Icon).

### Серверные модели
См. директорию [src/db/models/](src/db/models/) для Mongoose-моделей.

---

## 🛠️ Конвенции кода

### 1. **TypeScript vs JavaScript**
- **TypeScript (.ts)**: Вся логика, не связанная с рендерингом (сервер, модели, утилиты, типы).
- **JavaScript (.jsx)**: Только React-компоненты (с JSX-разметкой).

### 2. **Импорты**
- **Абсолютные пути**: Используйте абсолютные пути от корня проекта.
  ```typescript
  // ✅ Правильно
  import User from "src/db/models/User";
  
  // ❌ Неправильно
  import User from "../../../db/models/User";
  ```

### 3. **Экспорты**
- **По умолчанию**: Для основных сущностей (модели, компоненты).
  ```typescript
  // User.ts
  export default User;
  ```
- **Именованные**: Для интерфейсов и типов.
  ```typescript
  // User.ts
  export interface IUser { ... }
  ```

### 4. **Обработка ошибок**
- Серверные ошибки обрабатываются в [src/server/utils/errors/](src/server/utils/errors/).
- Используйте специализированные функции для отправки ошибок клиенту:
  - `sendBadRequest.ts`
  - `sendAuthError.ts`
  - `sendForbidden.ts`
  - `sendNotFound.ts`
  - `serverError.ts`

### 5. **Логирование**
- Используйте утилиты из [src/server/utils/console/](src/server/utils/console/):
  - `coloredLogs.ts`
  - `showError.ts`
  - `showElement.ts`

### 6. **Валидация**
- Используйте `express-validator` для валидации запросов.
- См. [src/server/services/validator.service.ts](src/server/services/validator.service.ts).

---

## 🚀 Работа с API

### Маршруты
См. директорию [src/server/routes/](src/server/routes/) для всех API-маршрутов.

#### Основные маршруты:
- `/api/auth` – Авторизация (регистрация, вход, выход)
- `/api/user` – Пользователи
- `/api/operation` – Операции
- `/api/category` – Категории
- `/api/account` – Счета
- `/api/goal` – Цели
- `/api/icon` – Иконки

### Middleware
- **Auth Middleware**: [src/server/middleware/auth.middleware.ts](src/server/middleware/auth.middleware.ts)
  - Проверяет JWT-токен.
  - Добавляет `req.user` с данными пользователя.

---

## 🎨 UI/UX Конвенции

### 1. **Компоненты**
- Все компоненты находятся в [src/client/app/components/](src/client/app/components/).
- **UI-компоненты**: В директории `UI/` (кнопки, формы, карточки).
- **Общие компоненты**: В директории `common/` (таблицы, виджеты).

### 2. **Стили**
- Используйте **Bootstrap 5** для базовых стилей.
- Кастомные стили в [src/client/index.css](src/client/index.css).

### 3. **Иконки**
- Статические иконки: [src/client/assets/static_icons/](src/client/assets/static_icons/)
- Динамические иконки (React-компоненты): [src/client/app/components/UI/icons.jsx](src/client/app/components/UI/icons.jsx)

---

## 🔒 Безопасность

1. **Хеширование паролей**: Используйте `bcryptjs`.
2. **JWT-токены**: Используйте `jsonwebtoken`.
3. **CORS**: Настроен в [src/server/main.ts](src/server/main.ts).
4. **Защита маршрутов**: Все защищенные маршруты используют `auth.middleware.ts`.

---

## 📦 Зависимости

### Основные зависимости (см. [package.json](package.json)):
- **Сервер**: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `multer`
- **Клиент**: `react`, `react-dom`, `react-router-dom`, `redux`, `@reduxjs/toolkit`, `react-redux`
- **Утилиты**: `axios`, `lodash`, `chart.js`, `react-chartjs-2`
- **Сборка**: `vite`, `@vitejs/plugin-react`

---

## 🛠️ Скрипты (package.json)

| Скрипт | Описание |
|--------|----------|
| `npm run dev` | Запуск сервера в режиме разработки (с hot-reload) |
| `npm run start` | Запуск сервера в продакшн-режиме |
| `npm run build` | Сборка клиентской части (Vite) |

---

## 📝 Дополнительные замечания

1. **Timestamps**: Все модели MongoDB используют `timestamps: true` для автоматического добавления `createdAt` и `updatedAt`.
2. **Связи между коллекциями**: Используйте `ref` в схемах для ссылок на другие коллекции.
3. **Типизация на клиенте**: Клиентские типы могут отличаться от серверных (например, `icon` как `ReactElement`).
4. **Обработка дат**: Используйте утилиту `formatDate.ts` для форматирования дат.

---

## 📌 Полезные ссылки
- [Структура БД](src/db/structure.md)
- [Клиентские типы](src/client/types/types.ts)
- [Серверные модели](src/db/models/)
- [API Маршруты](src/server/routes/)
- [Конфигурация](src/config/config.ts)
