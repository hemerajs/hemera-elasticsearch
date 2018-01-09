# Hemera-elasticsearch package

[![Build Status](https://travis-ci.org/hemerajs/hemera-elasticsearch.svg?branch=master)](https://travis-ci.org/hemerajs/hemera-elasticsearch)
[![npm](https://img.shields.io/npm/v/hemera-elasticsearch.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-elasticsearch)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)

This is a plugin to use Elasticsearch with Hemera.
This plugin based on the official driver [elasticsearch](https://github.com/elastic/elasticsearch-js).

## Start elasticsearch via docker

```
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.1.1
```

## Install

```
npm i hemera-elasticsearch --save
```

## Usage

```js
const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const nats = require('nats').connect()
const hemeraElasticsearch = require('hemera-elasticsearch')
const hemera = new Hemera(nats, {
  logLevel: 'info'
})

hemera.use(HemeraJoi)
hemera.use(hemeraElasticsearch, {
  elasticsearch: {
    log: 'trace'
  }
})

// elasticsearch client instance
hemera.elasticsearch
```

## Dependencies
- hemera-joi

## Interface

* [Elasticsearch API](#elasticsearch-api)
  * [search](#search)
  * [create](#create)
  * [delete](#delete)
  * [update](#update)
  * [count](#count)
  * [bulk](#bulk)
  * [refresh](#refresh)
  
 
-------------------------------------------------------
### search

The pattern is:

* `topic`: is the service name to publish to `elasticsearch`
* `cmd`: is the command to execute `search`
* `data`: the name of the table or collection `string
  * `index`: the name of your index `string`
  * `body`: the search criteria `object` *(optional)*
  * `q`: the search criteria `object` *(optional)*

Example:
```js
hemera.act({
  topic: 'elasticsearch',
  cmd: 'search',
  data: {}
}, function(err, resp) ...)
```

-------------------------------------------------------
### exists

The pattern is:

* `topic`: is the service name to publish to `elasticsearch`
* `cmd`: is the command to execute `exists`
* `data`:
  * `index`: the name of your index `string`
  * `type`: the type of your document `string`
  * `id`: the id of your document `string`

Example:
```js
hemera.act({
  topic: 'elasticsearch',
  cmd: 'exists',
  data: {
    index: 'my-index',
    type: 'my-type',
    id: 'jieu99'
  }
}, function(err, resp) ...)
```

-------------------------------------------------------
### create

The pattern is:

* `topic`: is the service name to publish to `elasticsearch`
* `cmd`: is the command to execute `create`
* `data`: options see [elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create)

Example:
```js
hemera.act({
  topic: 'elasticsearch',
  cmd: 'create',
  data: {}
}, function(err, resp) ...)
```

-------------------------------------------------------
### delete

The pattern is:

* `topic`: is the service name to publish to `elasticsearch`
* `cmd`: is the command to execute `delete`
* `data`: options see [elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-delete)

Example:
```js
hemera.act({
  topic: 'elasticsearch',
  cmd: 'delete',
  data: {}
}, function(err, resp) ...)
```

-------------------------------------------------------
### update

The pattern is:

* `topic`: is the service name to publish to `elasticsearch`
* `cmd`: is the command to execute `update`
* `data`: options see [elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-update)

Example:
```js
hemera.act({
  topic: 'elasticsearch',
  cmd: 'update',
  data: {}
}, function(err, resp) ...)
```

-------------------------------------------------------
### count

The pattern is:

* `topic`: is the service name to publish to `elasticsearch`
* `cmd`: is the command to execute `count`
* `data`: options see [elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-count)

Example:
```js
hemera.act({
  topic: 'elasticsearch',
  cmd: 'count',
  data: {}
}, function(err, resp) ...)
```

-------------------------------------------------------
### bulk

The pattern is:

* `topic`: is the service name to publish to `elasticsearch`
* `cmd`: is the command to execute `bulk`
* `data`: options see [elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-bulk)

Example:
```js
hemera.act({
  topic: 'elasticsearch',
  cmd: 'bulk',
  data: {}
}, function(err, resp) ...)
```

-------------------------------------------------------
### refresh

The pattern is:

* `topic`: is the service name to publish to `elasticsearch`
* `cmd`: is the command to execute `refresh`
* `data`: options see [elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-indices-refresh)

Example:
```js
hemera.act({
  topic: 'elasticsearch',
  cmd: 'refresh',
  data: {}
}, function(err, resp) ...)
```
