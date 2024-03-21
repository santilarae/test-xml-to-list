const root = document.getElementById('result');
const form = document.getElementById('file-form');
const notify = document.getElementById('notify');

let timeout;

const tableTemplate = (title, content) => {
  return `
<div class="tableWrapper">
  <h2>${title}</h2>
  <table border>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>URL</th>
    </tr>
  </thead>
  <tbody>
    ${content}
  </tbody>
  </table>
</div>`;
};

const copyBtnTemplate = (url) => {
  return `
  <button class="copyBtn" onclick="copyToClipboard('${url}')" title="Copiar url">
  <svg
    stroke="currentColor"
    fill="none"
    stroke-width="2"
    viewBox="0 0 24 24"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path
      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
    ></path>
  </svg>
</button>
  `;
};

const renderTable = (dataSet) => {
  let products = '';

  let logos = '';

  dataSet.forEach((variable) => {
    const isProduct =
      variable.tagName.startsWith('P-') || variable.tagName.startsWith('p-');
    const name = isProduct ? variable.tagName.slice(2) : variable.tagName;
    const content = `
    <tr>
    <td>${name}</td>
    <td>${variable.textContent}</td>
    <td>${copyBtnTemplate(variable.textContent)}</td>
  </tr>`;

    if (isProduct) {
      products += content;
    } else {
      logos += content;
    }
  });

  root.innerHTML =
    tableTemplate('Productos', products) + tableTemplate('Logos', logos);
};

form.addEventListener('change', (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);
  const file = formData.get('file');
  const reader = new FileReader();
  reader.readAsText(file);
  reader.addEventListener('loadend', () => {
    const xmlText = reader.result;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const dataSet = xmlDoc.getElementsByTagName('v:sampleDataSet')[0];
    const dataSetArr = [...dataSet.children];
    renderTable(dataSetArr);
    form.reset();
  });
});

const copyToClipboard = (url) => {
  navigator.clipboard.writeText(url);
  showNotify();
};

const showNotify = () => {
  if (timeout) {
    clearTimeout(timeout);
  }
  notify.classList.add('show');
  timeout = setTimeout(() => {
    notify.classList.remove('show');
  }, 1500);
};
