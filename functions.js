const axios = require('axios');

class Functions {
  constructor(url) {
    if (url) {
      this.conn = axios.create({
        baseURL: url,
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    } else {
      console.log('! no url specified for functions');
    }
  }

  document(token, url) {
    console.log("> POST /document");
    if(this.conn) {
      return this.conn.post('/document', { token, url });
    }
  }
}

module.exports = Functions;
