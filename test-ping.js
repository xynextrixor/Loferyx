import http from 'http';
http.get('http://127.0.0.1:3000', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(res.statusCode, data.substring(0, 500)));
});
