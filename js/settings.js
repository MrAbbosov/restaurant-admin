let elNewProductForm = document.querySelector('.modal-form');
let elDishesList = document.querySelector('.js-add-dishes-list');
let elAddNewProductName = elNewProductForm.querySelector('.js-new-product-name');
let elAddNewProductPrice = elNewProductForm.querySelector('.js-new-product-price');
let elNewProductImg = elNewProductForm.querySelector('.js-new-product-img');
let elNewProductPreview = elNewProductForm.querySelector('.js-new-product-preview');
let elAddNewProductTextarea = elNewProductForm.querySelector('.js-item-input-textarea');
let elAddNewProductBtn = elNewProductForm.querySelector('.js-add-new-product-btn');

let elTemplateNewProduct = document.querySelector('#add-new-dish-template').content;

let modal = document.getElementById("myModal");
let modalBtn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];

let $_ = function(selector, node = document) {
  return node.querySelector(selector);
}

modalBtn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


elNewProductImg.addEventListener("change", (evt)=> {
  evt.preventDefault()

  elNewProductPreview.src = evt.target.value
})

elNewProductForm.addEventListener("submit", async (evt)=> {
  evt.preventDefault()
  
  try {
    const newProduct = await fetch(`${CONFIG.HOST}/admin/product`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: elAddNewProductName.value,
        price: elAddNewProductPrice.value,
        image: elNewProductImg.value,
        info: elAddNewProductTextarea.value
      })
    })
    await newProduct.json()

    elNewProductForm.reset()
    modal.style.display = "none";
  } catch (error) {
    console.log(error);
  }
})


const fetchNewProductData = async (CONFIG) => {

  const res = await fetch(`${CONFIG.HOST}/admin/products`)
  const response = await res.json()


  let listNewFragment = document.createDocumentFragment();


  response.data.forEach((product) => {

    let elProductItem = elTemplateNewProduct.cloneNode(true);


    $_('.js-add-dish-img', elProductItem).src = product.product_image;
    $_('.js-add-dish-name', elProductItem).textContent = product.product_name;
    $_('.js-add-dish-price', elProductItem).textContent = product.product_price;
    $_('.js-add-dish-btn', elProductItem).dataset.productId = product.product_id;
    $_('.js-add-dish-delate-btn', elProductItem).dataset.deleteProductId = product.product_id;
  
    listNewFragment.appendChild(elProductItem);
  })

  elDishesList.appendChild(listNewFragment);
} 

fetchNewProductData(CONFIG)

// Delate Products

elDishesList.addEventListener('click', async (evt) => {
  const product_id = Number(evt.target.dataset.deleteProductId)

  try {
    if(evt.target.dataset.deleteProductId) {

      const res = await fetch(`${CONFIG.HOST}/admin/product`, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product_id
        })
      })

      console.log(await res.json())
  
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
})


// EDIT MODAL 




