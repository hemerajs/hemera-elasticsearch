'use strict'

const Hemera = require('nats-hemera')
const HemeraElasticsearch = require('./../index')
const HemeraJoi = require('hemera-joi')
const Code = require('code')
const Nats = require('nats')
const HemeraTestsuite = require('hemera-testsuite')

const expect = Code.expect

describe('Hemera-arango-store', function() {
  const topic = 'elasticsearch'
  let PORT = 6242
  var natsUrl = 'nats://localhost:' + PORT

  let index = 'myindex'
  let type = 'mytype'
  let server
  let hemera
  let elasticsearch

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, () => {
      const nats = Nats.connect(natsUrl)
      hemera = new Hemera(nats, {
        logLevel: 'silent'
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

  it('Create', function(done) {
    hemera.act(
      {
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
      },
      (err, resp) => {
        expect(err).to.be.not.exists()
        expect(resp).to.be.an.object()
        done()
      }
    )
  })
})
