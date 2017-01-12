"use strict";

const express = require('express');
const router = express.Router();
const mysql = require('../tools/mysql');
const detail_collection = () => { return collection('detail'); }
const $ = require('jquery');
const { prefecture_list, city_list, layout_list } = require('../tools/japan_data');
const queryparser = require('../tools/queryparser');

const NUM_PER_PAGE = 15;
const result_suffix = "の物件";

const search = (query, page, res) => {
  if (page == null || page == undefined || page == "") {
    page = 0;
  }
  const where = queryparser.getWhere(query);
  const attributes = [`title`, `url`, `layout`, `address`,
    `description`, `createdAt`, `updatedAt`];
  mysql.findAll({attributes: attributes, where: where}, (error, response, body)=>{
    const rooms = body.result;
    console.log("findAll result:");
    res.render('result', {
      title: query + result_suffix,
      results: rooms,
      count: rooms.length,
      query: query,
      page: page,
    });
  });
};

const homepage = (req, res, next) => {
  const query = req.query.query;
  if (query == null || query == undefined || query == "") {
    res.render('index', {
      title: 'Ponyo House',
      query: false,
    });
    return;
  }
  search(query, req.query.page, res);
};

const showRooms = (req, res, next) => {
  res.render('rooms', {
    title: '部屋情報の閲覧',
    result_suffix: result_suffix,
    prefecture_list: prefecture_list,
  });
};

const showPrefecture = (req, res, next) => {
  const prefecture = req.params.prefecture;
  res.render('prefecture', {
    title: prefecture + result_suffix,
    result_suffix: result_suffix,
    prefecture: prefecture,
    city_list: city_list[prefecture],
  });
};

const result = (req, res, next) => {
  const q = req.query.query;
  if (q != null && q != undefined && q != "") {
    res.redirect('/?query=' + q);
    return;
  }
  const query = req.params.query
    .slice(0, req.params.query.length - result_suffix.length)
    .replace("-", " ");

  search(query, 0, res);
};

router.get('/', homepage);
router.get('/index.html', homepage);
router.get('/rooms', showRooms);
router.get('/prefecture/:prefecture', showPrefecture);
router.get('/result/:query', result);

module.exports = router;
