
const _pcUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36";

export default class NetworkUtil {

  static get(url, params) {
    console.log('NetworkUtil get');
    return new Promise(function (resolve, reject) {
      if (params) {
        let paramsArray = [];
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&')
        } else {
          url += '&' + paramsArray.join('&')
        }
      }
      NetworkUtil.timeout(15000, fetch(url, {
        method: 'GET'
      }))
        .then((responseData) => {
          console.log('result:', url, responseData);
          resolve(responseData);
        })
        .catch((err) => {
          console.log('error:', url, err);
          reject(err);
        });
    });
  }

  static post(url, params) {
    console.log('\n\n');
    console.log('*****************************************************************');
    console.log('Post:\n' + url);
    console.log('Params:\n' + JSON.stringify(params));

    return new Promise(function (resolve, reject) {
      NetworkUtil.timeout(15000, fetch(url, {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify(params)
      }))
        .then((response) => response.json())
        .then((responseData) => {
          console.log('ResponseJson:\n' + JSON.stringify(responseData));
          resolve(responseData);
        })
        .catch((error) => {
          console.log('error.name====' + error.name);
          console.log('error.message====' + error.message);
          reject(error);
        });
    });
  }

  static getNew(url, params) {
    console.log('NetworkUtil get');
    return new Promise(function (resolve, reject) {
      if (params) {
        let paramsArray = [];
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&')
        } else {
          url += '&' + paramsArray.join('&')
        }
      }
      NetworkUtil.timeout(15000, fetch(url, {
        method: 'GET',
        headers: { "user-agent": _pcUserAgent },
        credentials: 'include'
      }))
        .then((responseData) => {
          console.log('result:', url, responseData);
          resolve(responseData);
        })
        .catch((err) => {
          console.log('error:', url, err);
          reject(err);
        });
    });
  }

  static getImage(url, params) {
    console.log('NetworkUtil getImage');
    return new Promise(function (resolve, reject) {
      NetworkUtil.timeout(15000, fetch(url, {
        method: 'GET',
        headers: { "user-agent": _pcUserAgent },
        credentials: 'include'
      }))
        .then((response) => response.arrayBuffer())
        .then((responseData) => {
          console.log('result:', url, responseData);
          resolve(responseData);
        })
        .catch((err) => {
          console.log('error:', url, err);
          reject(err);
        });
    });
  }

  static postNew(url, params) {
    let paramsArray = [];
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))

    console.log('\n\n');
    console.log('*****************************************************************');
    console.log('Post:\n' + url);
    console.log('paramsArray.join(): ' + paramsArray.join('&'))

    return new Promise(function (resolve, reject) {
      NetworkUtil.timeout(15000, fetch(url, {
        method: 'POST',
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "origin": "https://exp.newsmth.net",
          "referer": "https://exp.newsmth.net/authorize",
          "user-agent": _pcUserAgent,
          "x-requested-with": " XMLHttpRequest",
        },
        credentials: 'include',
        body: paramsArray.join('&')
      }))
        .then((response) => response.json())
        .then((responseData) => {
          console.log('ResponseJson:\n' + JSON.stringify(responseData));
          resolve(responseData);
        })
        .catch((error) => {
          console.log('error:' + error);
          console.log('error.name====' + error.name);
          console.log('error.message====' + error.message);
          reject(error);
        });
    });
  }

  static uploadNew(url, key, uri, name) {

    var data = new FormData();
    // data.append('files', {uri: uri, name: '123.jpg', type: 'multipart/form-data'});
    data.append(key, {uri: uri, name: name, type: 'multipart/form-data'});

    return new Promise(function (resolve, reject) {
      NetworkUtil.timeout(30000, fetch(url, {
        method: 'POST',
        headers: {
          "origin": "https://exp.newsmth.net",
          "user-agent": _pcUserAgent,
          "x-requested-with": " XMLHttpRequest",
          "accept": "application/json",
        },
        credentials: 'include',
        body: data,
      }))
        .then((response) => response.json())
        .then((responseData) => {
          console.log('ResponseJson:\n' + JSON.stringify(responseData));
          resolve(responseData);
        })
        .catch((error) => {
          console.log('error:' + error);
          console.log('error.name====' + error.name);
          console.log('error.message====' + error.message);
          reject(error);
        });
    });
  }

  static timeout(time, promise) {
    return new Promise(function (resolve, reject) {
      const timeoutId = setTimeout(function () {
        reject(new Error("Timeout"))
      }, time)
      promise.then(
        (result) => {
          clearTimeout(timeoutId);
          resolve(result);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        }
      );
    })
  }

}
