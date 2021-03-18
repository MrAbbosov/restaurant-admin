let elRefreshBtn = document.querySelector('.refresh-btn');
let elStatPrice = document.querySelector('.js-statistics-price');
let elStatNumSets = document.querySelector('.js-statistics-number-sets');
let elStatAllCustomers = document.querySelector('.js-statistics-all-customers');
let elRowList = document.querySelector('.row-body');
let elTemplate = document.querySelector('#row').content;

let elMostOrderedList = document.querySelector('.most-ordered-list');
let elMostOrderedItem = document.querySelector('#most_ordered_item').content;



let $_ = function(selector, node = document) {
  return node.querySelector(selector);
}

const fetchMostOrdered = async (CONFIG) => {
  const res = await fetch(`${CONFIG.HOST}/admin/top-orders`)
  const response = await res.json()

  let listFragment = document.createDocumentFragment();
  elMostOrderedList.innerHTML = '';

   
  response.data.forEach((order) => {
    let elMostOrderedItem = elTemplate.cloneNode(true);


    $_('.js-most-ordered-img', elMostOrderedItem).src = order.product_image;
    $_('.js-most-ordered-heading', elMostOrderedItem).textContent = order.product_name;
    $_('.js-most-ordered-subheading', elMostOrderedItem).textContent = order.product_count;
 
    
    listFragment.prepend(elMostOrderedItem);
  })
  elMostOrderedList.appendChild(listFragment);
}

fetchMostOrdered(CONFIG)

const fetchAllData = async (CONFIG) => {

  const res = await fetch(`${CONFIG.HOST}/admin/orders`)
  const response = await res.json()
  
  const resClients = await fetch(`${CONFIG.HOST}/admin/clients`)
  const responseClients = await resClients.json()
  const clientsNumber = await responseClients.data[0].clients_number
  elStatAllCustomers.textContent = clientsNumber

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
    $_('.js-order-status', elOrderItem).dataset.clientId = order.client_id;
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
  const socket = await io(CONFIG.HOST, { transports: ['websocket'] })
  try {

    fetchAllData(CONFIG)

    socket.on('new_order', ({ data }) => {
          if (data.length > 0) {
          try{
            fetchAllData(CONFIG)
          }
          catch(e) {
            console.log(e);
          }
        }
      })
    } catch (error) {
      console.log(error)
    }

    elRowList.addEventListener('change', async (evt) => {
      const sale_id = Number(evt.target.dataset.saleId)
      const client_id = Number(evt.target.dataset.clientId)
      
      try {
        const body = {
          sale_id: sale_id,
          status: evt.target.value
        }

        const socketBody = {
          sale_id: sale_id,
          client_id: client_id,
          status: evt.target.value
        }
    
        await fetch(`${CONFIG.HOST}/admin/orders`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
    
        socket.emit('order_edited', socketBody)
    
      } catch (error) {
        console.log(error);
      }
    })
})()
/*END OF SOCKET*/

// Change order status
