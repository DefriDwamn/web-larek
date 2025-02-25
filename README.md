



# 🛒 Веб-ларек - Интернет-магазин для веб-разработчиков

**Стек технологий**:  
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) 
![SCSS](https://img.shields.io/badge/-SCSS-CC6699?logo=sass&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Webpack](https://img.shields.io/badge/-Webpack-8DD6F9?logo=webpack&logoColor=black)

**Архитектурный паттерн**: MVP (Model-View-Presenter)

## 🏗 Структура проекта
```
src/
├── components/         # Базовые компоненты
│   ├── base/           # Инфраструктурные классы
│   ├── model/          # Модели данных (Бизнес-логика)
│   └── view/           # UI-компоненты
│       ├── common      # Базовые элементы (Form)
│       ├── partial     # Вспомогательные частичные элементы (Modal, Basket..)
│       └── screen      # Основные элементы (Main, Card)
├── types/              # Типы данных
├── utils/              # Вспомогательные утилиты
├── index.ts            # Точка входа
└── scss/               # Стили 
```

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run start

# Production сборка
npm run build
```

## Базовые классы

| Компонент          | Назначение                          | Методы                     |
|--------------------|-------------------------------------|----------------------------|
| `EventEmitter`     | Управление событиями                | `on()`, `emit()`, `off()`, `onAll`, `offAll`, `trigger()`  |
| `Component`        | Базовый класс UI элементов          | `render()`, `toggleClass()`|
| `Model`            | Абстрактная модель данных           | `emitChanges()`            |
| `Api`              | Работа с API                        | `get()`, `post()`, `handleResponse()` |

## Модели данных

| Компонент       | Описание                              | Ключевые методы               |
|-----------------|---------------------------------------|-------------------------------|
| `AppState`      | Хранит состояние приложения          | `addCard()`, `validateOrder()`|
| `CardApi`       | Работа с товарами и заказами          | `getCards()`, `orderCards()`  |

## Компоненты представления

| Компонент       | Назначение                          | Особенности                  |
|-----------------|-------------------------------------|------------------------------|
| `Card`          | Карточка товара                     | 3 режима отображения         |
| `Basket`        | Интерактивная корзина               | Динамический подсчет суммы   |
| `Modal`         | Универсальное модальное окно        | Поддержка любого контента    |
| `Form`          | Базовый компонент форм              | Валидация в реальном времени |

### 🎯 Пример компонента Card

```typescript
class Card extends Component {
  set price(value: string) {
    this.setText(this._price, value); 
  }
  
  set category(value: string) {
    this._category.classList.add(`card__category_${value}`);
  }
}
```

### 🎯 Пример интерфейсов

```typescript
interface ICard {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
}

interface IOrder {
  address: string;
  payment: 'card' | 'cash';
  email: string;
  phone: string;
  items: string[];
}
```

### 🎯 Состояния приложения

```typescript
enum appStates {
  basketOpened = 'basket',
  orderOpened = 'orderForm',
  successOpened = 'success',
  // ... другие состояния
}
```

## 🌐 Событийная система

| Событие                 | Назначение                                  |
|-------------------------|---------------------------------------------|
| `cards:changed`         | Обновление списка товаров                   |
| `basket:changed`        | Изменение содержимого корзины               |
| `payment:select`        | Выбор способа оплаты                        |
| `modal:open/close`      | Управление модальными окнами                |

### 🎯 Пример обработки

```typescript
events.on(appStateEvents.basketChanged, ({ id }) => {
  app.toggleBasketItem(id);
  basket.updateTotal(app.getTotal());
});
```
