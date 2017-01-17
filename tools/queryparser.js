const { prefecture_list, city_list, layout_list } = require('./japan_data');

const locationEqual = (query, location) => {
  return query == location || query == location.slice(0, location.length - 1);
}

const getPrefecture = (query) => {
  for (let j = 0; j < prefecture_list.length; j++) {
    if (locationEqual(query, prefecture_list[j])) {
      return prefecture_list[j];
    }
  }
  return null;
};

const getCity = (query) => {
  for (let p in city_list) {
    const city = city_list[p];
    for (let j = 0; j < city.length; j++) {
      if (locationEqual(query, city[j])) {
        return city[j];
      }
    }
  }
  return null;
};

const getLayout = (query) => {
  for (let i = 0; i < layout_list.length; i++) {
    if (query == layout_list[i]) {
      return layout_list[i];
    }
  }
  return null;
};

const like = (str) => {
  return {
    description: {
      $like: `%${str}%`,
    }
  };
};

const getWhere = (raw_query) => {
  const where = {
    $and: raw_query
    .split('　').join(' ')
    .split(' ')
    .filter((query) => { return query != ''; })
    .map((query) => {
      const prefecture = getPrefecture(query);
      if (prefecture != null) {
        return { prefecture: prefecture }
      }
      const city = getCity(query);
      if (city != null) {
        return { city: city }
      }
      const layout = getLayout(query);
      if (layout != null) {
        return { layout: layout }
      }
      return like(query);
    })
  }

  console.log(JSON.stringify(where));
  return where;
};

module.exports = {
  getWhere: getWhere,
};
