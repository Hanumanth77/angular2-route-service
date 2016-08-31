import {
    NgModule,
    Type
} from '@angular/core';
import * as ngCore from '@angular/core';

import {isBlank} from '@angular/core/src/facade/lang';

import {NgRouteService, RouteService} from './RouteService';
import {RouteDispatcher, IRouteDispatcher} from './RouteDispatcher';
import {IAppStateRoute, AppStateRoute} from './RouteState';

export class RouteServiceModuleFactory {

    static makeModule(stateCtor?:{new (...args:Array<any>):IAppStateRoute}, dispatcherCtor?:{new (...args:Array<any>):IRouteDispatcher}):Type {
        const providers:Array<any> = [
            ngCore.provide(RouteService, {useClass: NgRouteService})
        ];

        providers.push(
            !isBlank(stateCtor)
                ? ngCore.provide(AppStateRoute, {useFactory: (state:IAppStateRoute) => state, deps: [stateCtor]})
                : AppStateRoute
        );

        providers.push(
            !isBlank(dispatcherCtor)
                ? ngCore.provide(RouteDispatcher, {useFactory: (dispatcher:IRouteDispatcher) => dispatcher, deps: [dispatcherCtor]})
                : RouteDispatcher
        );

        @NgModule({providers: providers})
        class RouteServiceModule {
        }
        return RouteServiceModule;
    }
}

// before Angular2 router code will be executed
document.addEventListener("DOMContentLoaded", () => {
    const location = window.location;

    // queryParams -> params
    location.assign(location.hash
        .replace(/\/\?/g, ';')
        .replace(/[?&]/g, ';'));
});
