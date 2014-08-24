'use strict';

var _ = require('lodash');
var url = require('url');
var cheerio = require('cheerio-httpcli');

/** AV女優一覧の取得 **/
exports.index = function(req, res) {
  var targetUrl = 'http://www.dmm.co.jp/digital/videoa/-/actress/recommend/';

  // スクレイピング
  cheerio.fetch(targetUrl, {}, function(err, jq, response){
    if(err || !jq) {
      console.log('取り込めず。');
      return res.send(404);
    }
    
    var girlsNew = [];
    var girlsRecommended = [];
   
    // 新人AV女優
    jq('.act-box').first().find('ul li').each(function(idx, ele){
      scrapeGirls(girlsNew, jq(this));
    });
    // おすすめAV女優
    jq('.act-box').last().find('ul li').each(function(idx, ele){
      scrapeGirls(girlsRecommended, jq(this));
    });
    
    return res.json(200, {
      girlsNew: girlsNew,
      girlsRecommended: girlsRecommended
    });
  });
};

/** 各AV女優の作品取得 **/
exports.details = function(req, res) {
  var detailUrl = 'http://www.dmm.co.jp/digital/videoa/-/list/=/article=actress/id=';
  
  cheerio.fetch(detailUrl + req.params.id, {}, function(err, jq, response){
    if(err || !jq) {
      console.log('取り込めず。');
      return res.send(404);
    }
    
    var works = [];

    jq('#list li').each(function(idx, ele){
      scrapeDetails(works, jq(this));
    });

    return res.send(200, works);
  });
};

// 一覧スクレイピングのフォーマット整形
function scrapeGirls(girls, target) {
  var girlLink = target.find('a').attr('href');
  var id = girlLink.match(/\d+/)[0];
  
  var girlImgTag = target.find('img');
  var girlInfo = {
    name: girlImgTag.attr('alt'),
    imgSrc: girlImgTag.attr('src'),
    id: id
  };
  girls.push(girlInfo);
}

// 詳細スクレイピングのフォーマット整形
function scrapeDetails(works, target) {
  var targetTag = target.find('.tmb');
  var workInfo = {
    title: targetTag.find('img').attr('alt'),
    imgSrc: targetTag.find('img').attr('src'),
    link: targetTag.find('a').attr('href')
  };
  works.push(workInfo);
}

