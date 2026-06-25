const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DEFAULT_TIME = 25 * 60;
let totalSeconds = DEFAULT_TIME;
let isRunning = false;
let countTimer = null;

app.get('/api/time', (req, res) => {
    res.json({
        code: 1,
        data: { seconds: totalSeconds, status: isRunning ? '运行中' : '已暂停' },
        msg: '获取成功'
    });
});

app.post('/api/start', (req, res) => {
    if (isRunning) return res.json({ code: 0, msg: '计时器已在运行' });
    isRunning = true;
    countTimer = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
        } else {
            clearInterval(countTimer);
            isRunning = false;
        }
    }, 1000);
    res.json({ code: 1, msg: '启动成功' });
});

app.post('/api/pause', (req, res) => {
    clearInterval(countTimer);
    isRunning = false;
    res.json({ code: 1, msg: '暂停成功' });
});

app.post('/api/reset', (req, res) => {
    clearInterval(countTimer);
    isRunning = false;
    totalSeconds = DEFAULT_TIME;
    res.json({ code: 1, msg: '重置成功' });
});

// 根路径返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
