import { IEvents } from '../../../types/base/events';
import { settings, appStateEvents } from '../../../utils/constants';
import { IBasket } from '../../../types/view/partial/Basket';
import { Component } from '../../base/Component';

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = container.querySelector(settings.basketSettings.itemsList);
        this._total = container.querySelector(settings.basketSettings.totalLabel);
        this._button = container.querySelector(settings.basketModal.button);
        
        this.setDisabled(this._button, true);

        this._button.addEventListener('click', () => {
            this.events.emit(appStateEvents.basketSubmit);
        });
    }

    set items(cards: HTMLElement[]) {
        this._list.replaceChildren(...cards);
    }

    set total(value: string) {
        this.setText(this._total, value);
    }

    set disabled(value: boolean) {
        this.setDisabled(this._button, value);
    }
}