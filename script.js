
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const convertRequestToJSON = (url) => {
  const conversion = fetch(url).then(response => response.json());
  return conversion;
};

const addRequestToHTMLClass = (request, callback, HTMLClass) => {
  const { id, title, price, thumbnail } = request;
  let imgOrPrice = price;
  if (HTMLClass.length < 10) imgOrPrice = thumbnail;
  const item = callback(id, title, imgOrPrice);
  document.querySelector(`${HTMLClass}`).appendChild(item);
};

const addItemToCart = (element) => {
  const idNumber = element.previousSibling.previousSibling.previousSibling.innerText;
  convertRequestToJSON(`https://api.mercadolibre.com/items/${idNumber}`)
    .then((response) => {
      addRequestToHTMLClass(response, createCartItemElement, '.cart__items');
    });
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', function () {
    addItemToCart(event.target);
  });
  section.appendChild(button);

  return section;
}

const createItens = () => {
  convertRequestToJSON('https://api.mercadolibre.com/sites/MLB/search?q=cumputador')
    .then(response => response.results.forEach((computer) => {
      addRequestToHTMLClass(computer, createProductItemElement, '.items');
    }),
    );
};

window.onload = function onload() {
  createItens();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
