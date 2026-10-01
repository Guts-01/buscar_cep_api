# Consulta de CEP

Aplicação Flask para consultar endereços pela [API ViaCEP](https://viacep.com.br/). A página aceita CEPs com ou sem hífen e mostra os dados do endereço em uma interface responsiva.

## Executar localmente

1. Instale as dependências: `pip install -r requirements.txt`
2. Inicie a aplicação: `python buscar_cep_api.py`
3. Acesse `http://127.0.0.1:5000` no navegador.

## API

Envie um `POST` para `/consultar_cep` com JSON no formato `{"cep": "01001-000"}`. A resposta contém os campos do endereço fornecidos pelo ViaCEP. Campos ausentes são retornados como strings vazias.

A API retorna erro `400` para CEP inválido, `404` para CEP não encontrado e `502` quando a consulta ao ViaCEP falha. Em todos os casos de erro, a resposta JSON contém a chave `erro`.