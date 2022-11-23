### Simple Components

This project defines a simple component management system.

#### Example
```javascript
const components = require('./component')

class Config extends components.Lifecycle {
    start(context) {
       return { http_port: 3000 }
    }

    stop(context) {
    }
}

class ConfigMock extends components.Lifecycle {
    start(context) {
       return { http_port: 4000 }
    }

    stop(context) {
    }
}

class AppRoutes extends components.Lifecycle {
    start(context) {
       return (app) => {
            app.get('/', (req, res) => {
                res.send('Hello World!')
            })

            console.log('App routes configured!')
        }
    }

    stop(context) {
    }
}


class HttpServer extends components.Lifecycle {
    start({app_routes, config}) {
        const express = require('express')
        const app = express()
        const port = config.http_port
        
        app_routes(app)

        return app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }

    stop({ http_server }) {
        http_server.close(() => {
            console.log('HTTP server closed')
        })
    }
}

const base = {
    config:      components.define(new Config()),
    http_server: components.define(new HttpServer(), ['app_routes', 'config']),
    app_routes:  components.define(new AppRoutes())
}

const system = components.createSystem(base)

process.on('SIGINT', () => {
    console.log('SIGINT signal received')
    system.stop()
})

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received')
    system.stop()
})

system.start()
```

#### Component
A simple class that implements Lifecycle class. A component can depend on other components.

### System
The main component that manages all system components. All components are stored as a directed graph with no cycles(tree).

#### Demo App
You can find a simple demo on `demo_app.js`. Just type `node demo_app.js` and voilá!
