const components = require('./component')

class SimpleComponent extends components.Lifecycle {
    constructor(name) {
        super()
        this.name = name
    }

    start(context) {
        console.log(context)
        console.log('Started ' + this.name + '!!!')
        return this
    }

    stop(context) {
        console.log(context)
        console.log('Stopped ' + this.name + '!!!')
    }
}

test('should build a simple system', () => {
    const base = {
        simple_component_1: components.define(new SimpleComponent('simple_component_1')),
        simple_component_2: components.define(new SimpleComponent('simple_component_2'), ['simple_component_1']),
        simple_component_3: components.define(new SimpleComponent('simple_component_3'), ['simple_component_1'])
    }    
    
    const system = components.createSystem(base)
    system.start()
    system.stop()
});