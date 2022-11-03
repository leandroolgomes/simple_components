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

const getAllNodes = (g) => {
    return new Set(Object.keys(g.dependencies).concat(Object.keys(g.dependents)))
}

const traverseNode = (graph, sorted, node) => {
    const deps = graph.dependencies[node]
    deps?.forEach(d => {
        if(!sorted.has(d)) traverseNode(graph, sorted, d)
        sorted.add(d)
    })
}

const sortedNodes = (graph) => {
    let nodes = getAllNodes(graph)
    let sorted = new Set()
    nodes?.forEach(n => {
        traverseNode(graph, sorted, n)
        sorted.add(n)
    })

    return sorted
}

module.exports = { depends, getTransactiveDependencies, sortedNodes }