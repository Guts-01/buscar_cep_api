"""Aplicação web para consultar endereços pelo CEP."""

import re

import requests
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/"
ADDRESS_FIELDS = (
    "cep",
    "logradouro",
    "complemento",
    "unidade",
    "bairro",
    "localidade",
    "uf",
    "estado",
    "regiao",
    "ibge",
    "ddd",
)


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/consultar_cep")
def consultar_cep():
    payload = request.get_json(silent=True)
    cep = payload.get("cep") if isinstance(payload, dict) else None

    if not isinstance(cep, str) or not re.fullmatch(r"[0-9]{5}-?[0-9]{3}", cep.strip()):
        return jsonify(erro="Informe um CEP válido com 8 dígitos."), 400

    cep = cep.strip().replace("-", "")

    try:
        response = requests.get(VIACEP_URL.format(cep=cep), timeout=5)
        response.raise_for_status()
        address = response.json()
    except (requests.RequestException, ValueError):
        return jsonify(erro="Não foi possível consultar o CEP agora. Tente novamente."), 502

    if not isinstance(address, dict):
        return jsonify(erro="A consulta retornou uma resposta inválida."), 502

    if address.get("erro"):
        return jsonify(erro="CEP não encontrado. Confira os números e tente novamente."), 404

    return jsonify({field: address.get(field) or "" for field in ADDRESS_FIELDS})


if __name__ == "__main__":
    app.run()
