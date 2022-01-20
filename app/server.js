const port = process.env.PORT || 3000,
    pjson = require('./package');

const express = require('express'),
    next = require('next');

const dev = process.env.NODE_ENV !== 'production',
    app = next({ dev }),
    handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    server.all('*', (req, res) => {
        return handle(req, res)
    });
    server.listen(port, (error) => {
        if (error) throw error;
        console.log(`${pjson.name}-${pjson.version} > Ready on http://localhost:${port}`);
    });
});
