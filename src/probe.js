import { isReadable } from 'isstream'

class Probe {

  constructor (stream) {
    this.stream = stream
    this.lastCount = 0
    this.count = 0
    if (isReadable(stream)) {
      stream.addListener('data', () => {
        this.count = this.count + 1
      })
    }
  }

  /**
   * Thingies in readableState
   buffer.length
   length
   flowing
   ended
   endEmitted
   reading
   destroyed
   highWaterMark
   **/
  sample () {
    const result = {
      count: this.count,
      lastCount: this.lastCount,
      writableState: this.stream._writableState,
      readableState: this.stream._readableState
    }
    this.lastCount = this.count
    return result
  }
}

class ProbeDAG {
  constructor (node) {
    this.name = node?.ptr?.term?.value ? node.ptr.term.value : node.constructor.name
    const stream = node?.stream
    this.readable = isReadable(stream)
    this.probe = new Probe(stream)
    this.children = node.children ? node.children.map((x) => new ProbeDAG(x)) : []
  }

  sample () {
    return {
      name: this.name,
      sample: this.probe.sample(),
      children: this.children.map((x) => x.sample())
    }
  }
}

export { Probe, ProbeDAG }