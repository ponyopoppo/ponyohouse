"use strict";

const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const mysql = require('../tools/mysql');
const collection = mongo.collection;
const detail_collection = () => { return collection('detail'); }
const $ = require('jquery');

const NUM_PER_PAGE = 15;
const MAX_TEXT_LENGTH = 400;

const remove_tag = (str) => {
  return str.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
};

const find_text = (str, query) => {
  return remove_tag(str).slice(0, MAX_TEXT_LENGTH);
};

const trim = (results, query) => {
  return results.map((result) => {
    return {
      TITLE: remove_tag(result.TITLE.join()),
      ADDRESS: remove_tag(result.ADDRESS.join()).slice(0, 40),
      URL: result.PAGE_URL,
      TEXT: find_text(result.TEXT.join(), query),
    };
  });
};

const homepage = (req, res, next) => {
  const query = req.query.query;
  if (query == null || query == undefined || query == "") {
    res.render('index', {
      title: 'Ponyohouse',
      query: false,
    });
    return;
  }
  let page = req.query.page;
  if (page == null || page == undefined || page == "") {
    page = 0;
  }

  const attributes = [`title`, `url`, `layout`, `prefecture`, `city`, `address`, `description`, `createdAt`, `updatedAt`];
  const where = {$or: {
    prefecture: query,
    city: query,
  }};
  mysql.findAll({attributes: attributes, where: where}, (error, response, body)=>{
    const rooms = body.result;
    console.log("findAll result:");
    res.render('result', {
      title: 'Ponyohouse',
      results: rooms,
      count: rooms.length,
      query: query,
      page: page,
    });
  });

  /*
  const Detail = detail_collection();
  const cur = Detail.find();
  cur.count((err, count) => {
    cur.skip(page * NUM_PER_PAGE).limit(NUM_PER_PAGE).toArray((err, results) => {
      const trimmed_results = trim(results, query);
      res.render('result', {
        title: 'Ponyohouse',
        results: trimmed_results,
        count: count,
        query: query,
        page: page,
      });
    });
  })
  */
};

router.get('/', homepage);
router.get('/index.html', homepage);

module.exports = router;
