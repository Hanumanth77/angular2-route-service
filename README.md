# angular2-route-service

An implementation of router wrapper at Angular2 (RC5 compatible).

## Installation

First you need to install the npm module:
```sh
npm install angular2-route-service --save
```

## Features  

1. Support a [Flux](https://facebook.github.io/flux/docs/overview.html) application architecture (state, dispatcher).  
2. Allows transform queryParams to [matrix params](https://www.w3.org/DesignIssues/MatrixURIs.html) when dom content is loaded ($$PREVENT_QUERY_TRANSFORM = true allows disable the feature).  

## Use

**main.ts**  
```typescript
@NgModule({
    bootstrap: [ApplicationComponent],
    imports: [
        ...
        // If your application does not have its own the state and the dispatcher
        // See AppStateRoute and RouteDispatcher
        RouteServiceModuleFactory.makeModule(),
        
        RouterModule.forRoot([
           ...
           {
               path: 'equipment',
               component: EquipmentsPage,
               data: {configValue: 'value'}
           },
           ...
        ])
        
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
    // the initial state value
    routeSnapshot:IAppStateRouteSnapshot = {
        config: {},                             // runtime config = {configValue: 'value'}
        params: {},                             // runtime params = {param1:100} when "http://localhost:3000/#/equipment;param1=100"      
        // Full route path ('path1/path2/..' when "http://localhost:3000/#/path1/path2/..")                      
        name: DEFAULT_ROUTER_PATH               // runtime name = 'equipment'          
    };
    // the initial state value
    navigateInProgress:boolean = false;         // runtime value = false | true
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
            console.log(this.state.routeSnapshot.name);
            console.log(this.state.routeSnapshot.params);
            console.log(this.state.routeSnapshot.config);
            
            if (this.state.routeSnapshot.name === 'equipment') { // "http://localhost:3000/#/equipment;param1=100"
                this.dispatcher.activateApp.emit(
                    this.asyncTasksFactory.createTask(AppActivationTask) 
                );
            }
            
            ga('send', 'pageview', payload.path);   // Google analytics
        });
        
        dispatcher.panelClose.subscribe(() => {
            if (this.state.routeSnapshot.name === 'hardware') { // the current page is "http://localhost:3000/#/hardware"
                this.routeService.go('equipment', {q:200});     // go back to the page "http://localhost:3000/#/equipment;q=200"
            } else {
                this.routeService.go('home');                   // go to the page "http://localhost:3000/#/home"
            }
        });
    }
}
```

## Publish

```sh
npm run deploy
```

## License

Licensed under MIT.