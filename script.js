const maskBase = document.querySelector('#baseInput');
const baseCurrency = document.getElementById('baseCurrency');
const toCurrency = document.getElementById('toCurrency');
const maskTo = document.querySelector('#toInput');
const form = document.querySelector("#myForm");

var baseText = IMask(maskBase, {
  mask: "num",
  blocks: {
    num: {
      // nested masks are available!
      mask: Number,
      thousandsSeparator: " ",
      radix: ".",
      scale: 4,
      max: Number.MAX_VALUE,
      padFractionalZeros: false,
      normalizeZeros: true
    },
  },
});

var toText = IMask(maskTo, {
  mask: "num",
  blocks: {
    num: {
      // nested masks are available!
      mask: Number,
      thousandsSeparator: " ",
      radix: ".",
      scale: 4,
      max: Number.MAX_VALUE,
      padFractionalZeros: false,
      normalizeZeros: true
    },
  },
});

let base = 'RUB';
let symbol = 'USD';

function setLink() {
  const myForm = new FormData(form);
  if (base !== myForm.get("btnbase") || symbol !== myForm.get("btnTo")) {
    base = myForm.get("btnbase");
    symbol = myForm.get("btnTo");
  }
  const url = new URL('https://api.exchangerate.host/lates');
  url.searchParams.set("base", base);
  url.searchParams.set("symbols", symbol);

  return [url, base, symbol];
}

const ErrorMessage = () => {
  maskBase.value = 'Something went wrong about connection or API';
  maskTo.value = '';
  maskBase.style.fontSize = 'medium';
  maskTo.style.fontSize = 'medium';
  maskBase.style.color = 'red';
  maskTo.disabled = true;
}

function showCurrency() {

  const url = setLink();
  fetch(url[0].href)
    .then(response => response.json())
    .then(data => {
      baseCurrency.innerHTML = `1 ${url[1]} = ${(data.rates[symbol]).toFixed(4)} ${url[2]}`;
      toCurrency.innerHTML = `1 ${url[2]} = ${(1 / data.rates[symbol]).toFixed(4)} ${url[1]}`
    }).catch(() => {
      ErrorMessage();
    });
}

const defValue = (t = true) => {

  if (!navigator.onLine) {
    ErrorMessage();
    return;
  }

  const url = setLink();
  fetch(url[0].href)
    .then(response => response.json())
    .then(data => {
      if(t) toText.value = (+baseText.unmaskedValue * data.rates[symbol]).toString();
      else baseText.value = (+toText.unmaskedValue * (1 / data.rates[symbol])).toString();
    });
}
form.addEventListener('input', (inp) => {
 
  inp.target.name === 'toInput' ? defValue(false) : defValue();
  showCurrency();
});

showCurrency();
defValue();