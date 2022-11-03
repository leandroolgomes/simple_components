const dep = require('./dependency')

test('should build a simple graph', () => {
    let g = {
        dependencies : {},
        dependents   : {}
    }    
    
    g = dep.depends(g, 'b', 'a')
    g = dep.depends(g, 'c', 'b')
    g = dep.depends(g, 'c', 'a')
    g = dep.depends(g, 'd', 'c')

    expect(Object.keys(g.dependencies)).toEqual(['b', 'c', 'd'])
    expect(Object.keys(g.dependents)).toEqual(['a', 'b', 'c'])

    expect(() => dep.depends(g, 'a', 'd')).toThrow('Circular dependency!')
});

test('should retrieve all transitive dependencies', () => {    
    let g1 = {
        dependencies : {},
        dependents   : {}
    }    
    
    g1 = dep.depends(g1, 'b', 'a')
    g1 = dep.depends(g1, 'c', 'b')
    g1 = dep.depends(g1, 'c', 'a')
    g1 = dep.depends(g1, 'd', 'c')
    
    expect(dep.getTransactiveDependencies(g1, 'd')).toEqual(new Set(['c', 'b', 'a']))
    expect(dep.getTransactiveDependencies(g1, 'c')).toEqual(new Set(['b', 'a']))
    expect(dep.getTransactiveDependencies(g1, 'a')).toEqual(new Set())
    expect(dep.getTransactiveDependencies(g1, 'b')).toEqual(new Set(['a']))
    expect(dep.getTransactiveDependencies(g1, [])).toEqual(new Set())
    expect(dep.getTransactiveDependencies(g1, undefined)).toEqual(new Set())
    expect(dep.getTransactiveDependencies(undefined, ['a'])).toEqual(new Set())
    expect(dep.getTransactiveDependencies(undefined, undefined)).toEqual(new Set())
});

test('should traverse graph', () => {
    let g = {
        dependencies : {},
        dependents   : {}
    }    
    
    g = dep.depends(g, 'b', 'a')
    g = dep.depends(g, 'c', 'b')
    g = dep.depends(g, 'c', 'a')
    g = dep.depends(g, 'd', 'c')
    g = dep.depends(g, 'a', 'e')

    expect(dep.sortedNodes(g)).toEqual(new Set(['e', 'a', 'b', 'c', 'd']))

    expect(dep.reverveSortedNodes(g)).toEqual(new Set(['e', 'a', 'b', 'c', 'd'].reverse()))
});