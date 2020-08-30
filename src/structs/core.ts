interface RefresherFilter {
  run: Function
  runSpecific: Function
  add: Function
  addGlobal: Function
  remove: Function
  on: Function
  events: Function
}

interface RefresherEventBus {
  emit: Function
  emitNextTick: Function
  emitForResult: Function
  on: Function
  remove: Function
}