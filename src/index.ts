import './scss/styles.scss';
import { AppState } from './components/model/AppState';
import { CardApi } from './components/model/CardApi';
import { EventEmitter } from './components/base/events';
import { ICard, ButtonLabels, Message, IOrderInfo, IContacts } from './types';
import { settings, API_URL, CDN_URL, appStateEvents, appStateEventPatterns } from './utils/constants'
import { Main } from './components/view/screen/Main';
import { cloneTemplate } from './utils/utils';
import { Card } from './components/view/screen/Card';
import { Modal } from './components/view/partial/Modal';
import { Basket } from './components/view/partial/Basket';
import { Form } from './components/view/Form';
import { Success } from './components/view/partial/Success';

const BASE_URL = process.env.API_ORIGIN;

// Список состояния
export enum appStates {
    basketOpened = 'basket',
    cardPreviewOpened = 'cardPreview',
    orderOpened = 'orderForm',
    successOpened = 'success',
    noOpened = '',
}

// html Шаблоны
const mainContainer = document.querySelector(settings.mainSelector) as HTMLTemplateElement;
const cardCatalogTemplate = document.querySelector(settings.cardCatalogTemplate) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(settings.cardBasketTemplate) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(settings.cardPreviewTemplate) as HTMLTemplateElement;
const basketTemplate = document.querySelector(settings.basketTemplate) as HTMLTemplateElement;
const orderTemplate = document.querySelector(settings.orderInfoTemplate) as HTMLTemplateElement;
const contactsTemplate = document.querySelector(settings.contactsTemplate) as HTMLTemplateElement;
const successTemplate = document.querySelector(settings.successTemplate) as HTMLTemplateElement;
const modalTemplate = document.querySelector(settings.modalTemplate) as HTMLTemplateElement;

// Все объекты для работы со слоем данных
const events = new EventEmitter();
const api = new CardApi(BASE_URL, API_URL, CDN_URL);
const app = new AppState({}, events);

// Все объекты для работы со слоем представления
const main = new Main(mainContainer, events);
const modal = new Modal(modalTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Обработчик изменения списка карточек
// Создает элементы каталога из шаблона при обновлении данных
events.on(appStateEvents.cardsChanged, (cards: Iterable<ICard>) => {
    main.catalog = Array.from(cards).map(cardData => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), events, {
            onClick: () => app.setPreview(cardData),
        });
        return card.render({
            ...cardData,
            price: app.formatCurrency(cardData.price),
        });
    })
});

// Показывает детали карточки в модалке
// Обновляет кнопку добавления в корзину в зависимости от состояния
events.on(appStateEvents.cardPreviewOpen, (data: {
    id: string, 
    title: string,
    description: string;
    image: string;
    category: string;
    price: number;
})  => {
    app.setState(appStates.cardPreviewOpened);
    
    const buttonLabel = app.getBasketCardId().includes(data.id) ? 
        ButtonLabels.inBasket: 
        data.price === null ? 
            ButtonLabels.isUnvailable:
            ButtonLabels.isAvailable;
    
    modal.open();
    modal.content = new Card(cloneTemplate(cardPreviewTemplate), events, {
        onClick: () => events.emit(appStateEvents.basketChanged, {id: data.id})
    }).render({
        ...data,
        price: app.formatCurrency(data.price),
        buttonLabel: buttonLabel,
    });
});

// Добавляет/удаляет товар из корзины
// Синхронизирует состояние с AppState
events.on(appStateEvents.basketChanged, (data: {id: string}) => {
    if (app.getBasketCardId().includes(data.id)) {
        app.removeCard(data.id);
    } else {
        app.addCard(data.id);
    }
})

// Открывает корзину и очищает временные данные заказа
// Инициирует рендер компонента Basket
events.on(appStateEvents.basketOpen, () => {
    app.setState(appStates.basketOpened);
    app.clearOrder();

    modal.open();
    modal.content = basket.render();
});

// Валидирует форму заказа и показывает ошибки
// Переключает состояние на форму оплаты и адреса
events.on(appStateEvents.basketSubmit, () => {
    app.setState(appStates.orderOpened);
    console.log(app.validateOrder().payment, app.validateOrder().address)

    modal.content = order.render({
        payment: app.getOrder().payment,
        address: app.getOrder().address,
        valid: !(app.getOrder().payment && app.getOrder().address),
        error: (app.validateOrder().payment !== undefined && app.validateOrder().address !== undefined)?
                    Message.form:
                    app.validateOrder().payment !== undefined?
                        Message.payment:
                        app.validateOrder().address !== undefined?
                            Message.address:
                            Message.no,        
    })
})

// Обновляет поле заказа в AppState
events.on(appStateEventPatterns.orderInputChange, (data: { field: keyof IOrderInfo, value: string }) => {
    app.setOrderFiedls(data.field, data.value);
})

// Фиксирует выбор способа оплаты
// Обновляет UI кнопок выбора
events.on(appStateEvents.paymentSelected, (data: {payment: keyof IOrderInfo}) => {
    app.setOrderFiedls('payment', data.payment);
})

// Рендерит форму контактов с валидацией
events.on(appStateEvents.orderSubmit, () => {
    modal.content = contacts.render({
        email: app.getOrder().email,
        phone: app.getOrder().phone,
        valid: !(app.getOrder().email && app.getOrder().phone),
        error: (app.validateOrder().email !== undefined && app.validateOrder().phone !== undefined)?
                    Message.form:
                    app.validateOrder().email !== undefined?
                        Message.email:
                        app.validateOrder().phone !== undefined?
                            Message.phone:
                            Message.no,     
    })
})

/**
 * Отвечает за добавление данных в заказ в Model из формы
 * заполнения контактов пользователя
 * 
 * @event appStateEventPatterns.orderInputChange
 * @param {Object} data - Объект с информацией о input
 * @param {keyof IContacts} data.field - Имя поля ввода
 * @param {string} data.value - Внесенные данные в поле ввода
 * 
 * При вызове выполняет заполнение данных об заказе в Model в соответствии с именем поля ввода
 * и внесенным значением
 */
events.on(appStateEventPatterns.contactsInputChange, (data: { field: keyof IContacts, value: string }) => {
    app.setOrderFiedls(data.field, data.value);
})

// Отправляет заказ на сервер
// Очищает корзину и показывает экран успеха
events.on(appStateEvents.contactsSubmit, () => {
    api.orderCards(app.getOrder())
        .then(data => {
            app.setState(appStates.successOpened);
            app.clearBasket();
            app.clearOrder();

            modal.content = success.render({
                total: app.formatCurrency(data.total),
            });
        })
        .catch(err => console.log(err))
})

// Закрывает модалку успешного заказа
events.on(appStateEvents.successSubmit, () => {
    modal.close();
})

// Блокирует основной интерфейс
events.on(appStateEvents.modalOpen, () => {
    main.isLocked = true;
});

// Разблокирует интерфейс
events.on(appStateEvents.modalClose, () => {
    app.setState(appStates.noOpened);
    updateState();

    main.isLocked = false;
});

events.on(appStateEvents.stateUpdate, (data?: { 
    id: string,  
    field: keyof IOrderInfo | keyof IContacts,
}) => { 
    updateState({
        id: data.id, 
        field: data.field,
    });
}) 

// Обработчик изменений состояния
// Вызывает соответствующие методы рендера для текущего экрана
function updateState(data?: {
    id?: string, 
    field?: keyof IOrderInfo | keyof IContacts,
}) {
    switch(app.getState()) {
        case appStates.cardPreviewOpened: {
            renderCardPreview({id: data.id});
            renderBasket();
            main.counter = app.getBasketCardId().length;
            break;
        }
        case appStates.basketOpened: {
            renderBasket();
            main.counter = app.getBasketCardId().length;
            break;
        }
        case appStates.orderOpened: {
            (data && 'field' in data)?
                renderOrder({field: data.field}):
                renderOrder();
            break;
        } 
        case appStates.successOpened: {
            renderBasket();
            break;
        } 
        default: main.counter = app.getBasketCardId().length;
    }
}

function renderCardPreview(data: {id: string}) {
    const cardData = app.getCard(data.id);
    
    modal.content = new Card(cloneTemplate(cardPreviewTemplate), events, {
        onClick: () => events.emit(appStateEvents.basketChanged, {id: data.id})
    }).render({
        ...cardData,
        buttonLabel: app.getBasketCardId().includes(data.id)?
            ButtonLabels.inBasket:
            ButtonLabels.isAvailable,
        price: app.formatCurrency(cardData.price),
    });
}

function renderBasket() {
    basket.render({
        total: app.formatCurrency(app.getTotal()),
        disabled: app.getBasketCardId().length === 0 ? 
            true: 
            false,
        items: app.getBasketCardId().map((cardId, index) => {
            const cardData = app.getCard(cardId);
            return new Card(cloneTemplate(cardBasketTemplate), events, {
                onClick: () => events.emit(appStateEvents.basketChanged, {id: cardData.id})
            }).render({
                title: cardData.title,
                price: app.formatCurrency(cardData.price),
                indexLabel: (index + 1).toString(),
            });
        })
    });
}

function renderOrder(data?: {field: keyof IOrderInfo | keyof IContacts}) {
    order.render({
        payment: app.getOrder().payment,
        address: app.getOrder().address,
        valid: !(app.getOrder().payment && app.getOrder().address),
        error: (app.validateOrder().payment !== undefined && app.validateOrder().address !== undefined)?
                    Message.form:
                    app.validateOrder().payment !== undefined?
                        Message.payment:
                        app.validateOrder().address !== undefined?
                            Message.address:
                            Message.no,        
    })

    contacts.render({
        email: app.getOrder().email,
        phone: app.getOrder().phone,
        valid: !(app.getOrder().email && app.getOrder().phone),
        error: (app.validateOrder().email !== undefined && app.validateOrder().phone !== undefined)?
                    Message.form:
                    app.validateOrder().email !== undefined?
                        Message.email:
                        app.validateOrder().phone !== undefined?
                            Message.phone:
                            Message.no,     
    })

    if (data && data.field) {
        if (data.field in order) {
            order.focus = data.field as keyof IOrderInfo;
        } else if (data.field in contacts) {
            contacts.focus = data.field as keyof IContacts;
        }
    }
}

/**
 * Загрузка всех карточек товаров с сервера
 */
api.getCards()
    .then(data => app.loadCards(data))
    .catch(err => console.log(err));
