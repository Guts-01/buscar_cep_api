const form = document.querySelector('#cep-form');
const cepInput = document.querySelector('#cep-input');
const submitButton = document.querySelector('#submit-button');
const clearButton = document.querySelector('#clear-button');
const statusMessage = document.querySelector('#status');
const result = document.querySelector('#result');
const addressDetails = document.querySelector('#address-details');

const fields = [
  ['cep', 'CEP'],
  ['logradouro', 'Logradouro'],
  ['bairro', 'Bairro'],
  ['localidade', 'Cidade'],
  ['uf', 'UF'],
  ['estado', 'Estado'],
  ['regiao', 'Região'],
  ['complemento', 'Complemento'],
  ['unidade', 'Unidade'],
  ['ibge', 'Código IBGE'],
  ['ddd', 'DDD'],
];

let currentRequest;

function showStatus(message, type = 'error') {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
  statusMessage.hidden = false;
}

function clearStatus() {
  statusMessage.textContent = '';
  statusMessage.hidden = true;
}

function hideResult() {
  result.hidden = true;
  addressDetails.replaceChildren();
}

function renderAddress(address) {
  const details = document.createDocumentFragment();

  fields.forEach(([key, label]) => {
    const item = document.createElement('div');
    item.className = 'detail';

    const term = document.createElement('dt');
    term.textContent = label;

    const description = document.createElement('dd');
    description.textContent = address[key] || 'Não informado';

    item.append(term, description);
    details.append(item);
  });

  addressDetails.replaceChildren(details);
  result.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  currentRequest?.abort();
  hideResult();
  clearStatus();

  const cep = cepInput.value.trim();
  if (!/^\d{5}-?\d{3}$/.test(cep)) {
    cepInput.setAttribute('aria-invalid', 'true');
    showStatus('Informe um CEP válido com 8 números.');
    cepInput.focus();
    return;
  }

  cepInput.removeAttribute('aria-invalid');
  const requestController = new AbortController();
  currentRequest = requestController;
  submitButton.disabled = true;
  submitButton.textContent = 'Buscando...';
  showStatus('Consultando CEP...', 'loading');

  try {
    const response = await fetch('/consultar_cep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep }),
      signal: requestController.signal,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Não foi possível consultar o CEP.');
    }

    clearStatus();
    renderAddress(data);
  } catch (error) {
    if (error.name !== 'AbortError') {
      const message = error instanceof SyntaxError
        ? 'Resposta inválida. Tente novamente.'
        : error instanceof TypeError
          ? 'Falha de conexão. Tente novamente.'
          : error.message || 'Não foi possível consultar o CEP.';
      showStatus(message);
    }
  } finally {
    if (currentRequest === requestController) {
      currentRequest = undefined;
      submitButton.disabled = false;
      submitButton.textContent = 'Buscar endereço';
    }
  }
});

cepInput.addEventListener('input', () => {
  currentRequest?.abort();
  cepInput.removeAttribute('aria-invalid');
  clearStatus();
  hideResult();
});

clearButton.addEventListener('click', () => {
  currentRequest?.abort();
  clearStatus();
  hideResult();
  form.reset();
  cepInput.focus();
});
