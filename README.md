# audiograph

Generate audionodes and connect them into a graph.

# stability
nope.

## example usage

``` javascript
var audioGraph = new AudioGraph(context);
audioGraph.graph = [{output: 'output',
                     id: 1,
                     type: 'gain',
                     params: {
                       gain: 0.2
                     }
                    },{
                      output: 1,
                      id: 2,
                      type: 'oscillator',
                      params: {
                        type: 'square',
                        frequency: 440
                      }
                    },{
                      output: 1,
                      id: 3,
                      type: 'oscillator',
                      params: {
                        type: 'sawtooth',
                        frequency: 220,
                        detune: 4
                      }
                    }
                   ];
audioGraph.update();
audioGraph.sourceIds.forEach()

audioGraph.sourceIds.forEach(function(id) {
  audioGraph.graph.forEach(function(obj) {
    if (obj.id === id && obj.node.start) obj.node.start();
  });
});
```

inspired by [benji6/virtual-audio-graph](https://github.com/benji6/virtual-audio-graph) and the firefox web audio editor
