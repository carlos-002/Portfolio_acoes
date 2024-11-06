const portfolio = [];

document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const ticker = document.getElementById('ticker').value;
    const empresa = document.getElementById('empresa').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const precoCompra = parseFloat(document.getElementById('precoCompra').value);

    const stock = { ticker, empresa, quantidade, precoCompra };
    portfolio.push(stock);

    updatePortfolioTable();
    calculatePortfolioValue();
});

function updatePortfolioTable() {
    const tableBody = document.getElementById('portfolioTableBody');
    tableBody.innerHTML = '';

    portfolio.forEach((stock, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${stock.ticker}</td>
            <td>${stock.empresa}</td>
            <td>${stock.quantidade}</td>
            <td>${stock.precoCompra.toFixed(2)}</td>
            <td>${(stock.quantidade * stock.precoCompra).toFixed(2)}</td>
            <td id="precoAtual-${stock.ticker}">-</td>
            <td id="variacao-${stock.ticker}">-</td>
            <td id="valorAtual-${stock.ticker}">-</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openEditModal(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStock(${index})">Excluir</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

async function calculatePortfolioValue() {
    let valorAquisicaoTotal = 0;
    portfolio.forEach(stock => {
        valorAquisicaoTotal += stock.quantidade * stock.precoCompra;
    });

    document.getElementById('valorAquisicaoTotal').innerText = valorAquisicaoTotal.toFixed(2);

    let valorAtualTotal = 0;
    let variacaoTotal = 0;

    for (const stock of portfolio) {
        try {
            const precoAtual = await getCurrentPrice(stock.ticker);
            const valorAtual = stock.quantidade * precoAtual;
            valorAtualTotal += valorAtual;

            const variacao = ((precoAtual - stock.precoCompra) / stock.precoCompra) * 100;
            const variacaoClass = variacao > 0 ? 'positive' : (variacao < 0 ? 'negative' : 'neutral');

          
            document.getElementById(`precoAtual-${stock.ticker}`).innerText = precoAtual.toFixed(2);
            document.getElementById(`variacao-${stock.ticker}`).innerText = variacao.toFixed(2) + '%';
            document.getElementById(`variacao-${stock.ticker}`).className = variacaoClass;
            document.getElementById(`valorAtual-${stock.ticker}`).innerText = valorAtual.toFixed(2);
            
           
            variacaoTotal += variacao * (stock.quantidade * stock.precoCompra / valorAquisicaoTotal);
        } catch (error) {
            console.error(`Erro ao obter preço atual para ${stock.ticker}`, error);
        }
    }

    document.getElementById('valorAtualTotal').innerText = valorAtualTotal.toFixed(2);
    document.getElementById('variacaoTotal').innerText = variacaoTotal.toFixed(2) + '%';
    document.getElementById('variacaoTotal').className = variacaoTotal > 0 ? 'positive' : (variacaoTotal < 0 ? 'negative' : 'neutral');
}

const priceCache = {};

async function getCurrentPrice(ticker) {
    try {
        if (priceCache[ticker]) {
            console.log(`Usando dados do cache para ${ticker}`);
            return priceCache[ticker];
        }

        const response = await fetch(`/api/price/${ticker}`);
        const data = await response.json();

        if (data.price) {
            const currentPrice = data.price;

            priceCache[ticker] = currentPrice;

            return currentPrice;
        } else {
            console.error(`Dados de preço não encontrados para ${ticker}. Resposta da API:`, data);
            throw new Error(`Dados de preço não encontrados para ${ticker}`);
        }
    } catch (error) {
        console.error(`Erro ao obter preço atual para ${ticker}`, error);
        return 0;
    }
}
function savePortfolioToFile() {
    if (portfolio.length === 0) {
        alert('O portfólio está vazio. Não há dados para salvar.');
        return;  // Não prosseguir com o download se o portfólio estiver vazio
    }

    const dataStr = JSON.stringify(portfolio, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = 'portfolio.json';  // Nome do arquivo que será baixado
    downloadLink.click();
}


function loadPortfolio() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            jsonData.forEach(stock => {
                portfolio.push(stock);
            });
            updatePortfolioTable();
            calculatePortfolioValue();
        } catch (error) {
            console.error('Erro ao ler arquivo JSON', error);
            alert('Erro ao ler arquivo JSON. Por favor, verifique a estrutura do arquivo.');
        }
    };

    if (file) {
        reader.readAsText(file);
    } else {
        alert('Por favor, selecione um arquivo JSON.');
    }
}

function openEditModal(index) {
    const stock = portfolio[index];
    document.getElementById('editTicker').value = stock.ticker;
    document.getElementById('editEmpresa').value = stock.empresa;
    document.getElementById('editQuantidade').value = stock.quantidade;
    document.getElementById('editPrecoCompra').value = stock.precoCompra;

    const saveChangesBtn = document.getElementById('saveChangesBtn');
    saveChangesBtn.onclick = function() {
        saveChanges(index);
    };

    const editStockModal = new bootstrap.Modal(document.getElementById('editStockModal'));
    editStockModal.show();
}

function saveChanges(index) {
    const ticker = document.getElementById('editTicker').value;
    const empresa = document.getElementById('editEmpresa').value;
    const quantidade = parseInt(document.getElementById('editQuantidade').value);
    const precoCompra = parseFloat(document.getElementById('editPrecoCompra').value);

    portfolio[index] = { ticker, empresa, quantidade, precoCompra };

    updatePortfolioTable();
    calculatePortfolioValue();

    const editStockModal = bootstrap.Modal.getInstance(document.getElementById('editStockModal'));
    editStockModal.hide();
}

function deleteStock(index) {
    portfolio.splice(index, 1);
    updatePortfolioTable();
    calculatePortfolioValue();
}
