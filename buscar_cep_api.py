import os
from threading import Timer
from flask import Flask, jsonify, request, render_template
import requests
import webbrowser

app = Flask(__name__)

# Rota principal para servir o arquivo HTML
@app.route('/')
def index():
    return render_template('index.html')

# Rota que processa a requisição AJAX e retorna os dados do CEP
@app.route('/consultar_cep', methods=['POST'])
def consultar_cep():
    data = request.json
    enderecoCep = data.get('cep')

    if not enderecoCep:
        return jsonify({'erro': 'CEP não informado!'}), 400

    url = f'https://viacep.com.br/ws/{enderecoCep}/json/'
    response = requests.get(url)

    try:
        response.raise_for_status()
        endereco = response.json()

        if endereco.get('erro'):
            return jsonify({'erro': 'CEP inválido ou não encontrado!'}), 404

        if not endereco['complemento']:
            endereco['complemento'] = 'Não consta'
        if not endereco['unidade']:
            endereco['unidade'] = 'Não encontrada'

        return jsonify({
            'cep': endereco['cep'],
            'logradouro': endereco['logradouro'],
            'complemento': endereco['complemento'],
            'unidade': endereco['unidade'],
            'bairro': endereco['bairro'],
            'localidade': endereco['localidade'],
            'uf': endereco['uf'],
            'estado': endereco['estado'],
            'regiao': endereco['regiao'],
            'ibge': endereco['ibge'],
            'ddd': endereco['ddd']
        })

    except requests.exceptions.HTTPError as erro:
        return jsonify({'erro': f'Erro na requisição da API: {erro}'}), 500

# def open_browser():
#     if not os.environ.get("FLASK_DEBUG"):  
#         webbrowser.open_new("http://127.0.0.1:5000")

if __name__ == '__main__':
    # Timer(1, open_browser).start()
    app.run(debug=False)
