const { prefecture_list, city_list, layout_list } = require('./japan_data');

const getPrefecture = (query) => {
  const lst = query.split(' ');
  for (let i = 0; i < lst.length; i++) {
    for (let j = 0; j < prefecture_list.length; j++) {
      if (lst[i] == prefecture_list[j]) {
        return prefecture_list[j];
      }
    }
  }
  return null;
};

const getCity = (query) => {
  const lst = query.split(' ');
  for (let i = 0; i < lst.length; i++) {
    for (let p in city_list) {
      const city = city_list[p];
      for (let j = 0; j < city.length; j++) {
        if (lst[i] == city[j]) {
          return city[j];
        }
      }
    }
  }
  return null;
};

const getWhere = (raw_query) => {
  const query = raw_query.replace('　', ' ');
  const prefecture = getPrefecture(query);
  const city = getCity(query);

  var where = {$and:{}};
  if (prefecture != null) {
    where.$and.prefecture = prefecture
  }
  if (city != null) {
    where.$and.city = city
  }

  return where;
};

module.exports = {
  getWhere: getWhere,
};
