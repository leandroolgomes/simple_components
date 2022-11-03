const c = require('./component')

class SimpleComponent extends c.Lifecycle {
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
    const system = new c.System()
    system.addComponent('simple_component_1', new SimpleComponent('simple_component_1'))
    system.addComponent('simple_component_2', new SimpleComponent('simple_component_2'), ['simple_component_1'])
    system.addComponent('simple_component_3', new SimpleComponent('simple_component_3'), ['simple_component_1'])
    system.start()
    console.log('================')
    system.stop()
});