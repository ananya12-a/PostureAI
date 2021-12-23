let engine = {};
engine.init = function(name) {
  this.name = name;
  this.__internals__ = {};
  this.__internals__.state = {};
  this.__internals__.output = {};
};

engine.update = function(state) {
  this.__internals__.state = state;
  this.__internals__.output = {};
}

engine.getOutput = function() {
  return this.__internals__.output;
}

engine.getKeyPoints = function() {
  return this.__internals__.state && this.__internals__.state.keypoints ? this.__internals__.state.keypoints : {};
}

engine.updateOutput = function(output) {
  this.__internals__.output = output;
}

engine.run = function(mff) {
  mff(this);
}

export default engine;