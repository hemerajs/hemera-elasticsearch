'use strict'

const Hp = require('hemera-plugin')
const Elasticsearch = require('elasticsearch')

function hemeraElasticSearch(hemera, opts, done) {
  const topic = 'elasticsearch'
  const Joi = hemera.joi

  const client = new Elasticsearch.Client(opts.elasticsearch)
  hemera.decorate('elasticsearch', client)

  /**
   * Check if cluster is available otherwise exit this client.
   */
  client.ping(
    {
      requestTimeout: opts.elasticsearch.timeout
    },
    function(error) {
      if (error) {
        hemera.log.error(error, 'elasticsearch cluster is down!')
        hemera.fatal()
      } else {
        hemera.log.debug('elasticsearch cluster is available')
        done()
      }
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'search',
      data: Joi.object().keys({
        index: Joi.string(),
        body: Joi.object()
      })
    },
    req => {
      return client.search(req.data)
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'exists',
      data: Joi.object().keys({
        index: Joi.string().required(),
        type: Joi.string().required(),
        id: Joi.string().required()
      })
    },
    req => {
      return client.exists(req.data)
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'create',
      data: Joi.object().keys({
        index: Joi.string().required(),
        type: Joi.string().required(),
        id: Joi.string().required(),
        body: Joi.object().required()
      })
    },
    req => {
      return client.create(req.data)
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'update',
      data: Joi.object().keys({
        index: Joi.string().required(),
        type: Joi.string().required(),
        id: Joi.string().required(),
        body: Joi.object().required()
      })
    },
    req => {
      return client.update(req.data)
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'delete',
      data: Joi.object().keys({
        index: Joi.string().required(),
        type: Joi.string().required(),
        id: Joi.string().required(),
        ignore: Joi.array()
          .default([404])
          .optional()
      })
    },
    req => {
      return client.delete(req.data)
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'count',
      data: Joi.object().keys({
        index: Joi.string().required()
      })
    },
    req => {
      return client.count(req.data)
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'bulk',
      data: Joi.object().keys({
        body: Joi.alternatives()
          .try(Joi.array(), Joi.string())
          .required()
      })
    },
    req => {
      return client.bulk(req.data)
    }
  )

  hemera.add(
    {
      topic,
      cmd: 'refresh',
      data: Joi.object().keys({
        index: Joi.array()
          .items(Joi.string())
          .required(),
        body: Joi.object().required()
      })
    },
    req => {
      return client.refresh(req.data)
    }
  )
}

module.exports = Hp(hemeraElasticSearch, {
  hemera: '>=3',
  name: require('./package.json').name,
  dependencies: ['hemera-joi'],
  options: {
    payloadValidator: 'hemera-joi',
    elasticsearch: {
      timeout: 3000,
      host: 'localhost:9200',
      apiVersion: '6.0'
    }
  }
})
