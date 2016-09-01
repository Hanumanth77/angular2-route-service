# angular2-route-service

An implementation of router wrapper at Angular2 (RC5 compatible).

## Installation

First you need to install the npm module:
```sh
npm install angular2-route-service --save
```

## Features  

Support a [Flux](https://facebook.github.io/flux/docs/overview.html) application architecture (state, dispatcher).  

## Publish

```sh
npm run deploy
```

## Use

**main.ts**  
```typescript
@NgModule({
    bootstrap: [ApplicationComponent],
    imports: [
        ...
        // If your application does not have its own the state and the dispatcher
        // See AppStateRoute and RouteDispatcher
        RouteServiceModuleFactory.makeModule()
        
        // Or you have the application state and the dispatcher
        // RouteServiceModuleFactory.makeModule(State, Dispatcher)
    ],
    ...
})
export class ApplicationModule {
}
```

**state.ts**  
You can create your own State or use AppStateRoute instead. And by analogy - Dispatcher.  

```typescript
    constructor(@Inject(AppStateRoute) private state:IAppStateRoute) {
        ...
    }
```

```typescript
import {
    IAppStateRouteSnapshot, 
    IAppStateRouteData, 
    DEFAULT_ROUTER_PATH, 
    IAppStateRoute
} from 'angular2-route-service';

@Injectable()
export class State implements IAppStateRoute {
    routeSnapshot:IAppStateRouteSnapshot = {
        config: {},
        params: {},
        name: DEFAULT_ROUTER_PATH
    };
    navigateInProgress:boolean = false;
    ...
    // the other states of the main application
}
...
class Test {
    constructor(@Inject(State) private state:IAppStateRoute) {
        ...
    }
}
```

**store.ts**  
```typescript
import {
    RouteService,
    IRouteEventPayload
} from 'angular2-route-service';

@Injectable()
export class Store {

    // When "RouteServiceModuleFactory.makeModule(State, Dispatcher)" is used.
    constructor(@Inject(Dispatcher) private dispatcher:Dispatcher,              // Or @Inject(RouteDispatcher) when RouteServiceModuleFactory.makeModule() is used.
                @Inject(State) private state:IAppStateRoute) {                  // Or @Inject(AppStateRoute) when RouteServiceModuleFactory.makeModule() is used.

        dispatcher.navigationEnd.subscribe((payload:IRouteEventPayload) => {
            console.log(this.state.routeSnapshot);
            
            this.dispatcher.activateApp.emit(
                this.asyncTasksFactory.createTask(AppActivationTask) 
            );
            
            ga('send', 'pageview', payload.path);   // Google analytics
        });
    }
}
```

## License

Licensed under MIT.