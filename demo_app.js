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

const test = {
    ...base,
    ...{ config:      components.define(new ConfigMock()) }
}

const system = components.createSystem(base)

const startSystem = (system) => {
    system.start()
    console.log('started!')
}

const stopSystem = () => {
    system.stop()
}

process.on('SIGINT', () => {
    console.log('SIGINT signal received')
    stopSystem()
})

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received')
    stopSystem()
})

startSystem(system)
