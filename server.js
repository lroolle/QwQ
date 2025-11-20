const express = require('express');
const path = require('path');
const app = express();

// 启用详细日志
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 设置静态文件目录：当前根目录 + scenes 目录
app.use(express.static(path.join(__dirname)));
app.use('/scenes', express.static(path.join(__dirname, 'scenes')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// 主页路由：返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error loading page');
        } else {
            console.log('Successfully sent index.html');
        }
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Server error');
});

// 启动服务器
const PORT = 9527;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📁 Root directory: ${__dirname}`);
    console.log(`📁 Scenes directory: ${path.join(__dirname, 'scenes')}`);
});
