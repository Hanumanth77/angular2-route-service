export type IAppStateRouteDataValue = any;

export interface IAppStateRouteData {
    [index:string]:IAppStateRouteDataValue;
}

export interface IAppStateRouteConfig {
    [index:string]:IAppStateRouteDataValue;
}

export interface IAppStateRouteSnapshot {
    params:IAppStateRouteData,
    config:IAppStateRouteConfig,
    name:string
}

export interface IAppStateRoute {
    routeSnapshot:IAppStateRouteSnapshot,
    navigateInProgress:boolean
}

export class AppStateRoute implements IAppStateRoute {
    routeSnapshot:IAppStateRouteSnapshot = {
        config: {},
        params: {},
        name: DEFAULT_ROUTER_PATH
    };
    navigateInProgress:boolean = false;
}

export const DEFAULT_ROUTER_PATH = '';