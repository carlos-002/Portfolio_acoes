const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

const API_KEY = process.env.CONVERTKIT_API_SECRET; 

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/price/:ticker', async (req, res) => {
    const ticker = req.params.ticker;

    try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`);
        const data = response.data;

        if (data['Global Quote'] && data['Global Quote']['05. price']) {
            const currentPrice = parseFloat(data['Global Quote']['05. price']);
            res.json({ price: currentPrice });
        } else {
            res.status(404).json({ error: 'Dados de preço não encontrados' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter preço atual' });
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
