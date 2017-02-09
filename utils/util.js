module.exports = {
    fetch(url, options){
      if (this.getConstructorName(options) === "Object") {

        options.credentials = options.credentials === undefined ? 'include' : options.credentials;

        if (this.getConstructorName(options.body) === "Object") {

          /** POST请求,把参数转化为JSON字符串,并设置Content-Type **/
          if (options.method === 'POST' || options.method === 'post') {

            options.headers = options.headers || {};
            options.headers["Content-type"] = options.headers["Content-type"] || "application/json; charset=UTF-8";
            options.body = JSON.stringify(options.body)

          } else {

            /** GET请求,把参数转化为查询字符串,并拼接到url后面 **/
            url = url + this.obj2Search(options.body);
            delete options.body;
          }
        }
      } else {
        options = {
          credentials: 'include'
        }
      }

      return fetch(url, options).then(response => response.json());
    },
    getConstructorName (obj){
      if (obj === 0) return "Number";
      return obj && obj.constructor && obj.constructor.toString().match(/function\s*([^(]*)/)[1];
    }
};
