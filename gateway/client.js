const coap  = require('coap') // or coap
    , req   = coap.request('coap://[fdde:ba7a:b1e5:0:2a74:8e08:c783:d370]/temp')

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()