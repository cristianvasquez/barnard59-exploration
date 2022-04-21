import { fromFile } from 'rdf-utils-fs'
import findPipeline from 'barnard59/findPipeline.js'
import rdf from 'rdf-ext'
import runner from 'barnard59/runner.js'
import { resolve } from 'path'
import { ProbeDAG } from './src/probe.js'
import { draw } from './src/draw.js'

async function fileToDataset (filename) {
  return rdf.dataset().import(fromFile(filename))
}

const basePath = resolve('pipelines')
const filename = `${basePath}/main.ttl`

const iri = 'http://example/pipeline'

const dataset = await fileToDataset(filename)
const ptr = findPipeline(dataset, iri)
const level = 'error'// ['error', 'info', 'debug'][verbose] || 'error'
const variables = new Map()

const { finished, pipeline } = await runner(ptr, {
  basePath: resolve(basePath),
  level,
  outputStream: process.stdout,
  variables
})

const dag = new ProbeDAG(pipeline)
const interval = 1000 // milliseconds
const display = (node) => {
  if (!node.sample) {
    return 'N/A'
  }
  const count = node.sample.count
  const perSecond = ((node.sample.count - node.sample.lastCount) * 1000) / interval
  return `${node.name}
Count: ^G${count}
Per second: ^Y${perSecond} 
`
  // buffer.length ${node.sample.readableState?.buffer?.length}
  // length ${node.sample.readableState?.length}
}

setInterval(
  () => {
    console.clear()
    draw(dag.sample(), display)
  }, interval)
