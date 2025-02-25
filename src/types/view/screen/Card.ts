import { ButtonLabels } from "../..";

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface CardConstructor {
    new (cardTemplate: HTMLTemplateElement): ICardView;
}

export interface ICardView {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
    image: string;
    buttonLabel: ButtonLabels;
    indexLabel: string;
}