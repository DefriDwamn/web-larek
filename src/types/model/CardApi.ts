import { ICard, IOrder, OrderResult } from '../index';

export interface ICardApi {    
    getCards: () => Promise<ICard[]>;
    orderCards: (order: IOrder) => Promise<OrderResult>;
}