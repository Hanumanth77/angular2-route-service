import {
    Injectable,
    EventEmitter
} from '@angular/core';

import {IRouteEventPayload} from './RouteService';

export interface IRouteDispatcher {
    navigationEnd:EventEmitter<IRouteEventPayload>;
}

@Injectable()
export class RouteDispatcher implements IRouteDispatcher {
    navigationEnd = new EventEmitter<IRouteEventPayload>(false);
}
