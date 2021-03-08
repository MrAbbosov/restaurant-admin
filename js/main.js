let elRefreshBtn = document.querySelector('.refresh-btn');
let elStatPrice = document.querySelector('.js-statistics-price');
let elStatNumSets = document.querySelector('.js-statistics-number-sets');
let elStatAllCustomers = document.querySelector('.js-statistics-all-customers');
let elRowList = document.querySelector('.row-body');
let elTemplate = document.querySelector('#row').content;

let $_ = function(selector, node = document) {
  return node.querySelector(selector);
}

elRefreshBtn.addEventListener('click', async function (evt) {
  evt.preventDefault();
  
  const res = await fetch('http://192.168.1.22:4002/admin/orders')
  const response = await res.json()
  elRowList.innerHTML = '';
  elStatPrice.innerHTML = '';
  elStatNumSets.innerHTML = '';

  let listFragment = document.createDocumentFragment();

  let statPrice = 0
  let statSetNums = 0

  response.data.forEach((order) => {

    let elOrderItem = elTemplate.cloneNode(true);

    statPrice += order.product_price * order.sale_product_count;
    statSetNums += order.sale_product_count;


    $_('.js-user-id', elOrderItem).textContent = order.sale_id;
    $_('.js-date', elOrderItem).textContent = moment(order.sale_date).format('LL');
    $_('.js-client-username', elOrderItem).textContent = order.tg_first_name;
    $_('.js-client-phone-number', elOrderItem).textContent = order.tg_phone;
    $_('.js-product-name', elOrderItem).textContent = order.product_name;
    $_('.js-quantity', elOrderItem).textContent = order.sale_product_count;
    $_('.js-product-price', elOrderItem).textContent = order.product_price;
    $_('.js-price-summ', elOrderItem).textContent = order.product_price * order.sale_product_count;
    $_('.js-location-link', elOrderItem).href = `https://www.google.com/maps/place/${order.latitude}, ${ order.longitude}`;
    
    listFragment.prepend(elOrderItem);
  })

  elStatPrice.textContent = statPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
  elStatNumSets.textContent = statSetNums.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")

  elRowList.appendChild(listFragment);
});
