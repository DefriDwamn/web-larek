import './scss/styles.scss';
import { AppState } from './components/model/AppState';
import { CardApi } from './components/model/CardApi';
import { EventEmitter } from './components/base/events';
import { ICard, ButtonLabels, Message, IOrderInfo, IContacts } from './types';
import { settings, API_URL, CDN_URL, appStateEvents, appStateEventPatterns } from './utils/constants'

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

/**
 * Загрузка всех карточек товаров с сервера
 */
api.getCards()
    .then(data => app.loadCards(data))
    .catch(err => console.log(err));
