import {NgModule} from '@angular/core';
import * as ngCore from '@angular/core';

import {NgRouteService, RouteService} from './RouteService';

@NgModule({
    providers: [
        ngCore.provide(RouteService, {useClass: NgRouteService})
    ]
})
export class RouteServiceModule {
}

// before Angular2 router code will be executed
document.addEventListener("DOMContentLoaded", () => {
    const location = window.location;

    // queryParams -> params
    location.assign(location.hash
        .replace(/\/\?/g, ';')
        .replace(/[?&]/g, ';'));
});
