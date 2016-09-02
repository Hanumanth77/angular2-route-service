import {NgModule} from '@angular/core';

import {isBlank} from '@angular/core/src/facade/lang';

import {NgRouteService, RouteService} from './RouteService';
import {RouteDispatcher, IRouteDispatcher} from './RouteDispatcher';
import {IAppStateRoute, AppStateRoute} from './RouteState';

export class RouteServiceModuleFactory {

    static makeModule(stateCtor?:{new (...args:Array<any>):IAppStateRoute}, dispatcherCtor?:{new (...args:Array<any>):IRouteDispatcher}):Function {
        const providers:Array<any> = [
            {provide: RouteService, useClass: NgRouteService}
        ];

        providers.push(
            !isBlank(stateCtor)
                ? {provide: AppStateRoute, useFactory: (state:IAppStateRoute) => state, deps: [stateCtor]}
                : AppStateRoute
        );

        providers.push(
            !isBlank(dispatcherCtor)
                ? {provide: RouteDispatcher, useFactory: (dispatcher:IRouteDispatcher) => dispatcher, deps: [dispatcherCtor]}
                : RouteDispatcher
        );

        @NgModule({providers: providers})
        class RouteServiceModule {
        }
        return RouteServiceModule;
    }
}

if (typeof window !== 'undefined' && window['$$PREVENT_QUERY_TRANSFORM'] !== true) {
    // before Angular2 router code will be executed
    document.addEventListener("DOMContentLoaded", () => {
        const location = window.location;

        // prevent infinity redirect
        if (location.hash.length) {
            // queryParams -> params
            location.assign(location.hash
                .replace(/\/\?/g, ';')
                .replace(/[?&]/g, ';'));
        }
    });
}
