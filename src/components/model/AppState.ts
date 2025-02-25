import { IEvents } from '../../types/base/events';
import { ICard, IOrder, Message, IOrderInfo, IContacts, FormErrors } from '../../types/index';
import { IAppState } from '../../types/model/AppState';
import { Model } from '../base/Model';
import { appStates } from '../../index';
import { appStateEvents } from '../../utils/constants';

export class AppState extends Model<{}> implements IAppState {
    protected cards: Map<string, ICard> = new Map();
    protected basket: Map<string, ICard> = new Map();
    protected order: IOrder = {
        address: '',
        email: '',
        phone: '',
        payment: '',
    };
    protected _messages: FormErrors = {}; 
    protected preview: string | null;
    protected _state: string | null;
    
    constructor(data: Partial<{}>, protected events: IEvents) {
        super(data, events);
    }

    loadCards(cards: ICard[]) {
        cards.forEach(card => this.cards.set(card.id, card));
        this.emitChanges(appStateEvents.cardsChanged, this.cards.values());
    }

    getCard(id: string) {
        return this.cards.get(id);
    }

    addCard(id: string) {
        this.basket.set(id, this.getCard(id))
        this.emitChanges(appStateEvents.stateUpdate, {id});
    }

    removeCard(id: string) {
        this.basket.delete(id);
        this.emitChanges(appStateEvents.stateUpdate, {id});
    }

    setOrderFiedls(field: keyof IOrderInfo | keyof IContacts, value: string) {
        this.order[field] = value;
        this.validateOrder();
        this.emitChanges(appStateEvents.stateUpdate, {field});
    }

    validateOrder() {
        const error: typeof this._messages = {};

        if (!this.order.address) error.address = Message.address;
        if (!this.order.payment) error.payment = Message.payment;
        if (!this.order.email) error.email = Message.email;
        if (!this.order.phone) error.phone = Message.phone;
        
        this._messages = error;

        return this._messages;
    }

    getBasketCardId() {
        return Array.from(this.basket.keys());
    }

    getOrder() {
        return {
            ...this.order,
            total: this.getTotal(),
            items: this.getBasketCardId(),
        };
    }

    clearBasket() {
        this.basket.clear();
        this.emitChanges(appStateEvents.stateUpdate);
    }

    clearOrder() {
        this.order = {
            address: '',
            email: '',
            phone: '',
            payment: '',
        };
    }

    getTotal() {
        let total: number = 0;
        for (let cardBasket of this.basket.values()) {
            total += cardBasket.price;
        }
        return total;
    }

    setPreview(card: ICard) {
        this.preview = card.id;
        this.emitChanges(appStateEvents.cardPreviewOpen, card);
    }

    formatCurrency(value: number) {
        if (value === null ) return 'Бесценно';
        if (value % 10 === 1 )
            return value.toString() + ' синапс';
        if (value % 10 <= 4 && value % 10 >= 2)
            return value.toString() + ' синапса';
        return value.toString() + ' синапсов';
    }

    setState(value: appStates) {
        this._state = value;
    }

    getState() {
        return this._state;
    }
}