const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/api/users', createProxyMiddleware({ target: 'http://user-service:3001', changeOrigin: true,   pathRewrite: { '^/api/users': '' },
}));
app.use('/api/orders', createProxyMiddleware({ target: 'http://order-service:3002', changeOrigin: true,  pathRewrite: { '^/api/orders': '' },
}));

const PORT = 3000;
app.listen(PORT, () => console.log(`API Gateway on ${PORT}`));
