import { IContacts } from '../../../types';
import { Form } from '../common/Form';
import { IEvents } from '../../../types/base/events';
import { settings } from '../../../utils/constants';

export class Contacts extends Form<IContacts> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(protected readonly container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._email = container.querySelector(settings.contactsSettings.email);
        this._phone = container.querySelector(settings.contactsSettings.phone);
    }

    set email(value: string) {
       this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }
}