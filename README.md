# Portfolio de Ações
Este sistema tem como objetivo buscar informações sobre ações, como o valor atual no mercado, e calcular a porcentagem de ganho ou perda, assim como o total atual na carteira. Ele também permite salvar o portfólio de ações em formato JSON, garantindo que as informações das ações não sejam perdidas. O sistema é implementado como uma API REST.

## Requesitos
- Conta na https://www.alphavantage.co

## Instalação
1. Clone o repositório para sua máquina local:
    ```bash
    git clone (https://github.com/carlos-002/Portfolio_acoes.git)
    ```

2. Instale as dependências do projeto:
    ```bash
    npm install
    ```
### Arquivo `.env`
Adicione as seguintes variáveis ao arquivo `.env`:
```env
CONVERTKIT_API_SECRET = <Sua chave de acesso>
```

## Execução
1. Certifique-se de que todas as dependências estão instaladas.
2. Inicie o servidor:
    ```bash
    npm run start
    ```

