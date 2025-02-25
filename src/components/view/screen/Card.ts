import { ICardView, ICardActions } from '../../../types/view/screen/Card';
import { Component } from '../../base/Component';
import { settings } from '../../../utils/constants';
import { IEvents } from '../../../types/base/events';
import { ButtonLabels } from '../../../types';

const enum Categories {
    soft = 'софт-скил',
    hard = 'хард-скил',
    other = 'другое',
    button = 'кнопка',
    additional = 'дополнительное',
}

export class Card extends Component<ICardView> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _description: HTMLElement;
    protected _buttonBasket: HTMLButtonElement;
    protected _buttonDelete: HTMLButtonElement;
    protected _id: HTMLElement;

    constructor(protected readonly container: HTMLElement, protected events: IEvents, action?: ICardActions) {
        super(container);
        
        this._title = container.querySelector(settings.cardSettings.title);
        this._price = container.querySelector(settings.cardSettings.price);

        if (container.classList.contains(settings.cardSettings.compactClass)) {
            this._id = container.querySelector(settings.cardSettings.id);
            this._buttonDelete = container.querySelector(settings.cardSettings.delete);
            this._buttonDelete.addEventListener('click', action.onClick);
        } else {
            this._image = container.querySelector(settings.cardSettings.image);
            this._category = container.querySelector(settings.cardSettings.category);
            
            if (container.classList.contains(settings.cardSettings.expendedClass)) {
                this._description = container.querySelector(settings.cardSettings.description);
                this._buttonBasket = container.querySelector(settings.cardSettings.toBasket);
                this._buttonBasket.addEventListener('click', action.onClick);
            } else {
                this.container.addEventListener('click', action.onClick);
            }
        }
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set category(value: string) {
        switch(value) {
            case Categories.soft: {
                this._category.classList.add(settings.cardCategory.soft);
                break;
            }
            case Categories.hard: {
                this._category.classList.add(settings.cardCategory.hard);
                break;
            }
            case Categories.additional: {
                this._category.classList.add(settings.cardCategory.additional);
                break;
            }
            case Categories.other: {
                this._category.classList.add(settings.cardCategory.other);
                break;
            }
            case Categories.button: {
                this._category.classList.add(settings.cardCategory.button);
                break;
            }
        }
        
        this.setText(this._category, value);
    }

    set buttonLabel(value: ButtonLabels) {
        this._buttonBasket.textContent = value;
        if (value === ButtonLabels.isUnvailable) 
            this.setDisabled(this._buttonBasket, true);
    }

    set indexLabel(value: string) {
        this.setText(this._id, value);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set price(value: string) {
        this.setText(this._price, value);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }
}