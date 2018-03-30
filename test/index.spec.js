'use strict'

const Hemera = require('nats-hemera')
const HemeraElasticsearch = require('./../index')
const HemeraJoi = require('hemera-joi')
const Code = require('code')
const Nats = require('nats')
const HemeraTestsuite = require('hemera-testsuite')

const expect = Code.expect

describe('Hemera-elasticsearch', function() {
  const topic = 'elasticsearch'
  let PORT = 6242
  const natsUrl = 'nats://localhost:' + PORT

  let index = 'myindex'
  let type = 'mytype'
  let server
  let hemera
  let elasticsearch

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, () => {
      const nats = Nats.connect(natsUrl)
      hemera = new Hemera(nats, {
        logLevel: 'error'
      })
      hemera.use(HemeraJoi)
      hemera.use(HemeraElasticsearch)
      hemera.ready(() => {
        elasticsearch = hemera.elasticsearch
        elasticsearch.indices.delete(
          {
            index,
            ignoreUnavailable: true
          },
          done
        )
      })
    })
  })

  after(function() {
    hemera.close()
    server.kill()
  })

  it('Create', function() {
    return hemera
      .act({
        topic,
        cmd: 'create',
        data: {
          index,
          type,
          id: '1',
          body: {
            title: 'Test 1',
            tags: ['y', 'z'],
            published: true,
            published_at: '2013-01-01',
            counter: 1
          }
        }
      })
      .then(resp => {
        expect(resp.data).to.be.an.object()
      })
  })

  it('Exists', function() {
    return hemera
      .act({
        topic,
        cmd: 'create',
        data: {
          index,
          type,
          id: '2',
          body: {
            title: 'Test 1',
            tags: ['y', 'z'],
            published: true,
            published_at: '2013-01-01',
            counter: 1
          }
        }
      })
      .then(resp => {
        expect(resp.data).to.be.an.object()
        return hemera
          .act({
            topic,
            cmd: 'exists',
            data: {
              index,
              type,
              id: '2'
            }
          })
          .then(resp => {
            expect(resp.data).to.be.boolean()
          })
      })
  })

  it('Count', function() {
    return hemera
      .act({
        topic,
        cmd: 'create',
        data: {
          index,
          type,
          id: '3',
          body: {
            title: 'pants',
            tags: ['y', 'z'],
            published: true,
            published_at: '2013-01-01',
            counter: 1
          }
        }
      })
      .then(resp => {
        expect(resp.data).to.be.an.object()
        return hemera
          .act({
            topic,
            cmd: 'count',
            data: {
              index
            }
          })
          .then(resp => {
            expect(resp.data.count).to.be.exists()
          })
      })
  })

  it('Search', function() {
    return hemera
      .act({
        topic,
        cmd: 'create',
        data: {
          index,
          type,
          id: '4',
          refresh: true, // needed to to make this operation visible to search
          body: {
            title: 'pants',
            tags: ['y', 'z'],
            published: true,
            published_at: '2013-01-01',
            counter: 1
          }
        }
      })
      .then(resp => {
        expect(resp.data).to.be.an.object()
        return hemera
          .act({
            topic,
            cmd: 'search',
            data: {
              index,
              type,
              body: {
                query: {
                  match: { title: 'pants' }
                }
              }
            }
          })
          .then(resp => {
            expect(resp.data).to.be.exists()
            expect(resp.data.hits.total).to.be.greaterThan(0)
          })
      })
  })
})

describe('Cluster availability', function() {
  let PORT = 6242
  const natsUrl = 'nats://localhost:' + PORT

  let server
  let hemera

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, done)
  })

  after(function() {
    hemera.close()
    server.kill()
  })

  it('Should not connect successfully', () => {
    const nats = Nats.connect(natsUrl)
    hemera = new Hemera(nats, {
      logLevel: 'error'
    })
    hemera.use(HemeraJoi)
    hemera.use(HemeraElasticsearch, {
      elasticsearch: {
        timeout: 350,
        host: 'localhost:9999'
      }
    })
    return hemera
      .ready()
      .then(() => Code.fail('Should not be successfull'))
      .catch(err => expect(err.message).to.be.equals('Request Timeout after 350ms'))
  })
})
