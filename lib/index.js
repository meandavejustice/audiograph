var cap = require('lodash.capitalize');
var values = require('lodash.values');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var uuid = require('uuid');

inherits(AudioGraph, EventEmitter);

module.exports = AudioGraph;

function getNode(ctx, type, source) {
  return ctx['create' + cap(type)](source);
}

function setParams(node, params) {
  Object.keys(params).forEach(function(p) {
    node[p] = params[p];
  })
  return node;
}

function AudioGraph(context, initGraph) {
  EventEmitter.call(this);
  this.context = context;
  this.graph = initGraph || [];
  this.id = 'audiograph-'+ uuid();
  this.update();
  this.sourceIds = getSourceIds(this.graph);
  return this;
}

AudioGraph.prototype.update = function() {
  this.graph = generateAndConnectGraph(this.context, this.graph);
  this.sourceIds = getSourceIds(this.graph);
  this.emit('update', this);
  return this;
}

function getSourceIds(graph) {
  return graph.map(function(obj) {return obj.id})
         .filter(function(id) {
           return !~graph.map(function(obj) {
                      return obj.output;
                    }).indexOf(id)});
}

function generateAndConnectGraph(ctx, oldGraph) {
  if (!oldGraph.length) return oldGraph;
  var outputId, nuGraph = {
    "output": {node: ctx.destination}
  };

  // loop over and create (or disconnect) nodes
  oldGraph.forEach(function(obj) {
    if (obj.output === 'output') outputId = obj.id;
    if (obj.node) obj.node.disconnect();
    if (obj.type === 'mediaStreamSource') obj.node = getNode(ctx, obj.type, obj.source);
    else if (obj.type === 'delay') obj.node = getNode(ctx, obj.type, obj.params.maxDelayTime);
    else obj.node = getNode(ctx, obj.type);
    nuGraph[obj.id] = obj;

    setParams(obj.node, obj.params);
  });

  oldGraph.forEach(function(obj) {
    nuGraph[obj.id].node.connect(nuGraph[obj.output].node);
  })

  return values(nuGraph);
}
