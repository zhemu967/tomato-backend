const express = require('express');
const cors = require('cors');
const app = express();

// 跨域 + JSON 解析
app.use(cors());
app.use(express.json());

// ★ 新增：托管 public 文件夹下的静态文件（让前端页面能被访问）★
app.use(express.static('public'));

// ===== 后端核心数据（内存存储）=====
const DEFAULT_TIME = 25 * 60;
let totalSeconds = DEFAULT_TIME;
let isRunning = false;
let countTimer = null;

// ===== 接口 =====
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

// ★ 导出 app（Vercel 需要）★
module.exports = app;

// ★ 本地开发时启动（保留，方便你本地测试）★
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🍅 番茄钟后端服务已启动，端口 ${port}`);
    });
}