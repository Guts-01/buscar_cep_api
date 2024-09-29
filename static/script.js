function consultarCep() {
    const btn_limpar = document.getElementById('btn_limpar');
    btn_limpar.style.display = 'block';
    const cep = document.getElementById('cepInput').value.trim();
    
    

    if (cep === "") {
        document.getElementById('resultado').style.display = 'block';
        document.getElementById('resultado').style.color = 'red';
        document.getElementById('resultado').innerText = '*Digite um CEP';
        document.getElementById('resultado').style.textAlign = 'center';
        return;
    }
    else if (cep.length !== 8) {
            const cepFomatted = parseInt(cep);
            if (cep.length > 8) {
                console.log(typeof cep);
                console.log(typeof cepFomatted);
                document.getElementById('resultado').style.display = 'block';
                document.getElementById('resultado').style.color = 'red';
                document.getElementById('resultado').innerText = '*Apenas 8 dígitos são permitidos';
                document.getElementById('resultado').style.textAlign = 'center';
                return;
            }
            if (cep.length < 8 && !isNaN(cepFomatted)) {
                document.getElementById('resultado').style.display = 'block';
                document.getElementById('resultado').style.color = 'red';
                document.getElementById('resultado').innerText = '*Digite um CEP válido com 8 dígitos';
                document.getElementById('resultado').style.textAlign = 'center';
                return;
            }
            if (cep.length < 8 || cep.length > 8 || cep.length === 8 && !isNaN(cepFomatted)) {
                document.getElementById('resultado').style.display = 'block';
                document.getElementById('resultado').style.color = 'red';
                document.getElementById('resultado').innerText = '*Digite apenas números';
                document.getElementById('resultado').style.textAlign = 'center';
                return;
            }
            console.log("Erro");
            return;
                }
        
    fetch('/consultar_cep', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cep: cep }),  // Envia o CEP em formato JSON
    })
    .then(response => response.json())
    .then(data => {
        // Se houver erro, exibe a mensagem de erro
        if (data.erro) {
            document.getElementById('resultado').innerText = data.erro;
            document.getElementById('resultado').style.display = 'block';
            document.getElementById('resultado').style.color = 'red';
            document.getElementById('resultado').innerText = '*CEP inválido ou não encontrado';
            document.getElementById('resultado').style.textAlign = 'center';
        } else {
            // Formata os dados para exibição
            let resultado = `CEP: ${data.cep}\n`;
            resultado += `Endereço: ${data.logradouro}\n`;
            resultado += `Complemento: ${data.complemento}\n`;
            resultado += `Unidade: ${data.unidade}\n`;
            resultado += `Bairro: ${data.bairro}\n`;
            resultado += `Cidade: ${data.localidade}\n`;
            resultado += `UF: ${data.uf}\n`;
            resultado += `Estado: ${data.estado}\n`;
            resultado += `Região: ${data.regiao}\n`;
            resultado += `IBGE: ${data.ibge}\n`;
            resultado += `DDD: (${data.ddd})`;

            // Exibe os dados do endereço no frontend
            document.getElementById('resultado').style.color = 'black';
            document.getElementById('resultado').style.gap = '20px';
            document.getElementById('resultado').style.display = 'block';
            document.getElementById('resultado').innerText = resultado;
            document.getElementById('resultado').style.textAlign = 'left';
        }
    })
    .catch((error) => {
        document.getElementById('resultado').innerText = 'Erro na consulta';
        console.error('Erro:', error);
    });
}

function limparResultado() {
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('cepInput').value = '';
    document.getElementById('btn_limpar').style.display = 'none';
}
