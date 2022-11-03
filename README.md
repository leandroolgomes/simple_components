### Simple Components

This project defines a simple component management system.

#### Example
```javascript
class HttpServer extends components.Lifecycle {
    start({app_routes, config}) {
        const express = require('express')
        const app = express()
        const port = 3000
        
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

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

const system = new components.System()
system.addComponent('http_server', new HttpServer())
system.start()
process.on('SIGINT', () => {
    console.log('SIGINT signal received')
    system.stop()
})
```

#### Component
A simple class that implements Lifecycle class. A component can depend on other components.

### System
The main component that manages all system components. All components are stored as a directed graph with no cycles(tree).

#### Demo App
You can find a simple demo on `demo_app.js`. Just type `node demo_app.js` and voilá!
