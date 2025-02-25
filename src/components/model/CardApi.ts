import { ICardApi } from '../../types/model/CardApi';
import { ICard, IOrder, OrderResult } from '../../types';
import { Api } from '../base/api'
import { ApiListResponse } from '../../types/base/api';

export class CardApi extends Api implements ICardApi {
    protected apiPath: string;
    protected cdnPath: string;
    
    constructor(baseUrl: string, apiPath: string, cdnPath: string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.apiPath = apiPath;
        this.cdnPath = cdnPath;
    }

    getCards() {
        const uri = this.apiPath + '/product';
       
        return this.get(uri)
            .then((data: ApiListResponse<ICard>) => 
                data.items.map((item) => ({
                    ...item,
                    image: this.baseUrl + this.cdnPath + item.image,
                }))
            )
    }

    orderCards(order: IOrder) {
        const uri = this.apiPath + '/order';

        return this.post(uri, order)
            .then((data: OrderResult) => data)
    }
}