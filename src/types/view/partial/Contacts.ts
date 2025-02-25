import { IForm } from "../common/Form";

export interface IContacts extends IForm {
    email: string;
    phone: string;
}