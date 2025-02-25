import { IEvents } from '../../types/base/events';


export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // вызвать у всхе эмит на изменение модели
    emitChanges(event: string, payload?: object) {
        // данных можно модифицировать
        this.events.emit(event, payload ?? {});
    }
}
