const request = require('request');

const findAll = (cond, completion) => {
  const options = {
    uri: "http://52.175.154.14/api/find",
    headers: { "Content-type": "application/json" },
    json: cond,
  };

  request.post(options, (error, response, body)=>{
    completion(error, response, body);
  });
};

const init = () => {
  return Room.sync({force: true});
};

module.exports = {
  findAll: findAll,
}
