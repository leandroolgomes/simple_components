const deps = require('./dependency')

/* 
 * defines a simple lifecyle to be implemented by a component 
 */
class Lifecycle {
    start(context) {
        throw new Error('Non implemented')
    }

    stop(context) {
        throw new Error('Non implemented')
    }
}

/*
 * Defines the main component, called System. As system is also a component, it has to implement Lifecycle
 */
class System extends Lifecycle {
    constructor() {
        super()
        this.componentGraph = deps.createGraph()
        this.componentMap = {}
        this.context = {}
    }

    addComponent(componentKey, componentManager, dependencies) {
        this.componentGraph[componentKey] = componentManager
        if(dependencies) {
            dependencies.forEach(d => {
                deps.depends(this.componentGraph, componentKey, d)
            });
        } else {
            deps.depends(this.componentGraph, componentKey)
        }
    }
  
    start() {
        const componentsToStart = deps.sortedNodes(this.componentGraph)
        this.context = {}
        componentsToStart.forEach(c => {
            const startedComponent = this.componentGraph[c].start(this.context)
            this.context[c] = startedComponent
        })
    }

    stop() {
        const componentsToStop = deps.reverveSortedNodes(this.componentGraph)
        componentsToStop.forEach(c => {
            this.componentGraph[c].stop(this.context)
        })
    }
}

module.exports = {System, Lifecycle}