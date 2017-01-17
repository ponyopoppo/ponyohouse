"use strict";

const express = require('express');
const router = express.Router();
const mysql = require('../tools/mysql');
const detail_collection = () => { return collection('detail'); }
const $ = require('jquery');
const { prefecture_list, city_list, layout_list } = require('../tools/japan_data');
const keyword_list = layout_list.concat([
  "デザイナーズ",
  "ペット可",
  "リノベーション",
  "マンション",
  "UR",
  "格安",
  "古民家",
  "タワーマンション",
  "事故物件",
  "おすすめ",
  "穴場",
  "新築",
  "おしゃれ",
  "一戸建て",
]);
const queryparser = require('../tools/queryparser');

const NUM_PER_PAGE = 10;
const result_suffix = "の物件";

const search = (query, page, res) => {
  if (page == null || page == undefined || page == "") {
    page = 0;
  }
  const where = queryparser.getWhere(query);
  const attributes = [`title`, `url`, `layout`, `address`,
    `description`, `createdAt`, `updatedAt`];
  mysql.findAll({
    attributes: attributes,
    where: where,
    offset: NUM_PER_PAGE * page,
    limit: NUM_PER_PAGE,
  },
  (error, response, body)=>{
    const rooms = body.result.rows;
    const count = body.result.count;
    res.render('result', {
      title: query + result_suffix,
      results: rooms,
      count: count,
      query: query,
      page: page,
      from: NUM_PER_PAGE * page + 1,
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
    keyword_list: keyword_list,
  });
};

const showPrefecture = (req, res, next) => {
  const prefecture = req.params.prefecture;
  const keyword = req.params.keyword;
  const title = keyword ? prefecture + "の" + keyword + result_suffix : prefecture + result_suffix;

  res.render('prefecture', {
    title: title,
    keyword: keyword,
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
    .split("-").join(" ");

  search(query, 0, res);
};

const keywordSelected = (req, res, next) => {
  const keyword = req.params.keyword;
  res.render('keyword', {
    title: keyword + result_suffix,
    keyword: keyword,
    result_suffix: result_suffix,
    prefecture_list: prefecture_list,
  });
};

router.get('/', homepage);
router.get('/index.html', homepage);
router.get('/rooms', showRooms);
router.get('/prefecture/:prefecture', showPrefecture);
router.get('/prefecture/:keyword/:prefecture', showPrefecture);
router.get('/result/:query', result);
router.get('/keyword/:keyword', keywordSelected);

module.exports = router;
