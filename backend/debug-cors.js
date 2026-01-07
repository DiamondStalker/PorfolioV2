// Agregar este endpoint temporal para debuggear CORS
app.get('/debug/cors', (req, res) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:3000',
        'https://diamondstalker.github.io',
        'https://*.github.io',
        'https://*.onrender.com'
    ];

    res.json({
        corsConfig: {
            allowedOrigins: allowedOrigins,
            credentials: true,
            currentOrigin: req.headers.origin,
            isAllowed: allowedOrigins.includes(req.headers.origin),
            environmentVars: {
                FRONTEND_URL: process.env.FRONTEND_URL,
                NODE_ENV: process.env.NODE_ENV
            }
        },
        headers: {
            origin: req.headers.origin,
            'user-agent': req.headers['user-agent'],
            referer: req.headers.referer
        }
    });
});
