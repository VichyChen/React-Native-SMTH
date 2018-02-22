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
      NetworkUtil.timeout(fetch(url, {
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
      NetworkUtil.timeout(fetch(url, {
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

  // return new Promise(function (resolve, reject) {
  //   fetch(url, {
  //     method: 'POST',
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify(params)
  //   }).then((response) => response.json())
  //     .then((responseData) => {
  //       console.log('ResponseJson:\n' + JSON.stringify(responseData));
  //       resolve(responseData);
  //     })
  //     .catch((error) => {
  //       console.log('error:' + error);
  //       reject(error);
  //     });
  // });

  static timeout(promise) {
    return new Promise(function (resolve, reject) {
      const timeoutId = setTimeout(function () {
        reject(new Error("Timeout"))
      }, 20000)
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
