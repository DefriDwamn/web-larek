import { Payment } from "../..";
import { IForm } from "../common/Form";

export interface IOrder extends IForm {
    payment: Payment;
    address: string;
}