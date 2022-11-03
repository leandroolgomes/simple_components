// let graph = {
//     dependencies : {},
//     dependents   : {}
// }


//       :a
//      / |
//    :b  |
//      \ |
//       :c
//        |
//       :d

// depends(g, b, a)
// depends(g, c, b)
// depends(g, c, a)
// depends(g, d, c)


const depends = (graph, node, dep) => {
    if(node === dep) throw new Error('Circular dependency!')
    if(getTransactiveDependencies(graph, dep).has(node)) throw new Error('Circular dependency!')

    if(!graph.dependents[dep]) {
        graph.dependents[dep] = []
    }
    
    graph.dependents[dep].push(node)

    if(!graph.dependencies[node]) graph.dependencies[node] = []
    graph.dependencies[node].push(dep)

    return graph
}

const removeEdge = (graph, node, dep) => {
    if(!graph.dependencies[dep]) graph.dependencies[dep] = []
    var indexNode = graph.dependencies[dep].indexOf(node);
    if(indexNode > -1) graph.dependencies.splice(indexNode, 1)    

    if(!graph.dependents[node]) graph.dependents[node] = []
    var indexDep = graph.dependents[dep].indexOf(dep);
    if(indexDep > -1) graph.dependents.splice(indexDep, 1)    
}

const getTransactiveDependencies = (graph, node) => {
    let deps = graph?.dependencies[node]
    let t = new Set()
    deps?.forEach(d => {
        let children = getTransactiveDependencies(graph, d)
        t.add(d)
        children?.forEach(c => t.add(c))
    });
            
    return t
}

module.exports = { depends, getTransactiveDependencies }