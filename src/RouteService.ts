import {
    Injectable,
    Inject
} from '@angular/core';

import {
    Router,
    NavigationEnd,
    NavigationStart,
    NavigationCancel,
    ActivatedRouteSnapshot,
    Data,
    Params,
    UrlSegment
} from '@angular/router';

import {isBlank} from '@angular/core/src/facade/lang';

import {LoggerFactory, ILogger} from 'angular2-smart-logger';

import {RouteDispatcher, IRouteDispatcher} from './RouteDispatcher';
import {ImmutableHelper} from './ImmutableHelper';
import {IAppStateRoute, AppStateRoute} from './RouteState';

export interface IRouteEventPayload {
    name:string,
    path:string;
    data:Data,
    params:Params;
}

interface IRouteEvent {
    url:string;
}

export abstract class RouteService {
    abstract go(path:string, parameters?:Params):Promise<boolean>;
}

@Injectable()
export class NgRouteService extends RouteService {

    private static logger:ILogger = LoggerFactory.makeLogger(NgRouteService);

    constructor(@Inject(AppStateRoute) protected state:IAppStateRoute,
                @Inject(Router) protected router:Router,
                @Inject(RouteDispatcher) protected dispatcher:IRouteDispatcher) {
        super();

        this.router.events.subscribe((event:IRouteEvent) => {
            if (event instanceof NavigationStart) {
                this.state.navigateInProgress = true;
            } else if (event instanceof NavigationCancel) {
                this.state.navigateInProgress = false;
            } else if (event instanceof NavigationEnd) {
                const payload:IRouteEventPayload = this.buildPayload();
                NgRouteService.logger.debug('[$NgRouteService][events] NavigationEnd:', payload);

                this.state.navigateInProgress = false;
                this.state.routeSnapshot.config = payload.data;
                this.state.routeSnapshot.name = payload.name;
                this.state.routeSnapshot.params = payload.params;

                this.dispatcher.navigationEnd.emit(payload);
            }
        });
    }

    private buildPayload():IRouteEventPayload {
        /**
         * The event has been emitted on start of the application
         */
        const activatedRoute:ActivatedRouteSnapshot = this.findActivatedRoute(
            this.router.routerState.snapshot.root
        );

        return {
            path: this.router.url,                                              // "/page1/page2;q=1"
            name: activatedRoute.pathFromRoot
                // We have to observe the route tree and get full path from the leaf to the root.
                // The root node is empty node "" therefore we must use the filter
                .filter((activatedRouteSnapshot:ActivatedRouteSnapshot) => activatedRouteSnapshot.url.length > 0)
                .map((activatedRouteSnapshot:ActivatedRouteSnapshot):string => {
                    return activatedRouteSnapshot.url
                        .map((segment:UrlSegment) => segment.path)
                        .join(ROUTER_PATH_SEPARATOR);
                })
                .join(ROUTER_PATH_SEPARATOR),                                   // "page1/page2"
            data: ImmutableHelper.toImmutable(activatedRoute.data),             // {data:true}
            params: ImmutableHelper.toImmutable(activatedRoute.params)          // {q:1}
        };
    }

    /**
     * We can't use native ActivatedRoute
     *
     * class MyComponent {constructor(route: ActivatedRoute) {})
     *
     * because:
      * 1. We use the State
      * 2. We have to use abstraction to replace the implementation of (NativeScript/Angular2)
     */
    private findActivatedRoute(node:ActivatedRouteSnapshot):ActivatedRouteSnapshot {
        if (isBlank(node.firstChild)) {
            return node;
        }
        return this.findActivatedRoute(node.firstChild);
    }

    private static isOuterPath(path:string):boolean {
        return (/^(http|https)/i.test(path) && path.indexOf(window.location.origin) === -1)
            || new RegExp(`^${ROUTER_PATH_SEPARATOR}`, 'i').test(path);
    }

    /**
     * @override
     */
    public go(path:string, parameters?:Params):Promise<boolean> {
        if (NgRouteService.isOuterPath(path)) {
            NgRouteService.logger.debug('[$NgRouteService][go] The path', path, 'is detected as outer resources, so leave the current application');

            this.state.navigateInProgress = true;
            window.location.assign(path);
            return;
        }

        NgRouteService.logger.debug('[$NgRouteService][go] Navigation has started by the path "', path, '" and parameters "', parameters, '"');

        return this.router.navigate(isBlank(parameters) ? [path] : [path, parameters])
            .then((result:boolean):boolean => {
                NgRouteService.logger.debug('[$NgRouteService][go] Navigation using the path "', path, '" and parameters "', parameters, '" is successfully completed');
                return result;
            }, (result:boolean):boolean => {
                NgRouteService.logger.debug('[$NgRouteService][go] Navigation using the path "', path, '" and parameters "', parameters, '" is completed with the errors');
                return result;
            });
    }
}

const ROUTER_PATH_SEPARATOR:string = '/';

export function buildRoutePath(...args:Array<string>) {
    return args.join(ROUTER_PATH_SEPARATOR);
}
