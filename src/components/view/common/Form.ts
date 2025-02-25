import { Component } from '../../base/Component';
import { IForm } from '../../../types/view/common/Form';
import { IEvents } from '../../../types/base/events';
import { Message } from '../../../types';
import { settings } from '../../../utils/constants';

export class Form<T> extends Component<IForm> {
    protected _error: HTMLElement;
    protected _submit: HTMLElement;
    protected _valid: boolean;

    constructor(protected readonly container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._error = container.querySelector(settings.formSettings.error);
        
        if (this.container.name === settings.formSettings.order_name)
            this._submit = container.querySelector(settings.formSettings.submit_order);
        if (this.container.name === settings.formSettings.contacts_name)
            this._submit = container.querySelector(settings.formSettings.submit_contacts);
        
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });
        
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, value);
    }

    set error(value: Message) {
        this.setText(this._error, value);
    }

    set focus(value: keyof T) {
        const input = this[`_${String(value)}` as keyof this];
        if (input instanceof HTMLElement && typeof input.focus === 'function')
            input.focus();
    }

    render(state: Partial<T> & IForm): HTMLFormElement {
        const {valid, error, ...inputs} = state;
        super.render({valid, error});
        Object.assign(this, inputs);
        return this.container;
    }
}
