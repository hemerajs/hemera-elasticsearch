'use strict'

const Hp = require('hemera-plugin')
const Elasticsearch = require('elasticsearch')

function hemeraElasticSearch(hemera, opts, done) {
  const topic = 'elasticsearch'

  const client =
    opts.elasticsearchInstance || new Elasticsearch.Client(opts.elasticsearch)
  hemera.decorate('elasticsearch', client)

  client.ping(
    {
      requestTimeout: opts.elasticsearch.timeout
    },
    function(err) {
      if (err) {
        done(err)
      } else {
        hemera.log.debug('elasticsearch cluster is available')
        done()
      }
    }
  )

  hemera.ext('onClose', function closeESClient() {
    hemera.log.debug('elasticsearch client is closing ...')
    return client.close()
  })

  const Joi = hemera.joi
  hemera.add(
    {
      topic,
      cmd: 'search',
      data: Joi.object().keys({
        index: Joi.string(),
        body: Joi.object(),
        q: Joi.string()
      })
    },
    req => client.search(req.data)
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
    req => client.exists(req.data)
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
    req => client.create(req.data)
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
    req => client.update(req.data)
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
    req => client.delete(req.data)
  )

  hemera.add(
    {
      topic,
      cmd: 'count',
      data: Joi.object().keys({
        index: Joi.string().required(),
        type: Joi.string()
      })
    },
    req => client.count(req.data)
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
    req => client.bulk(req.data)
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
    req => client.refresh(req.data)
  )
}

module.exports = Hp(hemeraElasticSearch, {
  hemera: '>=5.0.0',
  name: require('./package.json').name,
  dependencies: ['hemera-joi'],
  decorators: ['joi'],
  options: {
    elasticsearch: {
      timeout: 3000,
      host: 'localhost:9200',
      apiVersion: '6.2'
    }
  }
})
