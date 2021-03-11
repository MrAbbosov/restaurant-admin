let elRefreshBtn = document.querySelector('.refresh-btn');
let elStatPrice = document.querySelector('.js-statistics-price');
let elStatNumSets = document.querySelector('.js-statistics-number-sets');
let elStatAllCustomers = document.querySelector('.js-statistics-all-customers');
let elRowList = document.querySelector('.row-body');
let elTemplate = document.querySelector('#row').content;

let $_ = function(selector, node = document) {
  return node.querySelector(selector);
}

const fetchAllData = async (CONFIG) => {

  const res = await fetch(`${CONFIG.HOST}/admin/orders`)
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
    $_('.js-date', elOrderItem).textContent = moment(order.sale_date).format('MM.DD h:mm:ss a');
    $_('.js-client-username', elOrderItem).textContent = order.tg_first_name;
    $_('.js-client-phone-number', elOrderItem).textContent = order.tg_phone;
    $_('.js-product-name', elOrderItem).textContent = order.product_name;
    $_('.js-quantity', elOrderItem).textContent = order.sale_product_count;
    $_('.js-product-price', elOrderItem).textContent = order.product_price;
    $_('.js-order-status', elOrderItem).dataset.saleId = order.sale_id;
    $_('.js-order-status', elOrderItem).value = order.sale_status;
    $_('.js-price-summ', elOrderItem).textContent = order.product_price * order.sale_product_count;
    $_('.js-location-link', elOrderItem).href = `https://www.google.com/maps/place/${order.latitude}, ${ order.longitude}`;
    
    listFragment.prepend(elOrderItem);
  })

  elStatPrice.textContent = statPrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
  elStatNumSets.textContent = statSetNums.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")

  elRowList.appendChild(listFragment);

} 

/*SOCKET*/
;(async () => {
  try {
    const socket = await io(CONFIG.HOST, { transports: ['websocket'] })

    fetchAllData(CONFIG)

    socket.on('new_order', data => {
        try{
          fetchAllData(CONFIG)
        }
        catch(e) {
          console.log(e);
        }
    })
  } catch (error) {
    console.log(error)
  }
})()
/*END OF SOCKET*/

// Change order status
elRowList.addEventListener('change', async (evt) => {
  const sale_id = Number(evt.target.dataset.saleId)

  try {
    await fetch(`${CONFIG.HOST}/admin/orders`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sale_id: sale_id,
        status: evt.target.value
      })
    })
  } catch (error) {
    console.log(error);
  }
})
