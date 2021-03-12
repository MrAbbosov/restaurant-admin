// Utilities
let $_ = function(selector, node = document) {
  return node.querySelector(selector);
}



//SELECT COMPONETS FROM HTML
const elNewProductForm = document.querySelector('.modal-form');
const elDishesList = document.querySelector('.js-add-dishes-list');
const elAddNewProductName = elNewProductForm.querySelector('.js-new-product-name');
const elAddNewProductPrice = elNewProductForm.querySelector('.js-new-product-price');
const elNewProductImg = elNewProductForm.querySelector('.js-new-product-img');
const elNewProductPreview = elNewProductForm.querySelector('.js-new-product-preview');
const elAddNewProductTextarea = elNewProductForm.querySelector('.js-item-input-textarea');
const elAddNewProductBtn = elNewProductForm.querySelector('.js-add-new-product-btn');
const editModal = document.getElementById("edit_modal");

const elTemplateNewProduct = document.querySelector('#add-new-dish-template').content;



// Select modal elements
const modal = document.getElementById("myModal");
const modalBtn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

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



//ADD NEW PRODUCT
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

// RENDER PRODUCTS

const fetchNewProductData = async (CONFIG) => {
  const res = await fetch(`${CONFIG.HOST}/admin/products`)
  const response = await res.json()

  let listNewFragment = document.createDocumentFragment();

  response.data.forEach((product) => {
    let elProductItem = elTemplateNewProduct.cloneNode(true);

    $_('.js-add-dish-img', elProductItem).src = product.product_image;
    $_('.js-add-dish-name', elProductItem).textContent = product.product_name;
    $_('.js-add-dish-price', elProductItem).textContent = product.product_price;
    $_('.js-edit-dish-btn', elProductItem).dataset.editProductId = product.product_id;
    $_('.js-edit-dish-btn', elProductItem).onclick = editProductFunc;
    $_('.js-delete-dish-btn', elProductItem).dataset.deleteProductId = product.product_id;
    $_('.js-delete-dish-btn', elProductItem).onclick = deleteProductFunc;
  
    listNewFragment.appendChild(elProductItem);
  })
  elDishesList.appendChild(listNewFragment);
} 

fetchNewProductData(CONFIG)

// Delete Products
elNewProductForm.addEventListener("click", (evt) => {
  evt.preventDefault()
  const product_id = Number(evt.target.dataset.deleteProductId)

})
async function deleteProductFunc (evt) {
  try {
    if(evt.target.dataset.deleteProductId) {
      console.log('this is delete')

      const res = await fetch(`${CONFIG.HOST}/admin/product`, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product_id
        })
      })

      location.reload()      
    }

  } catch (error) {
    console.log(error);
  }
}

// Edit product
function editProductFunc(evt) {
  const product_id = Number(evt.currentTarget.dataset.editProductId);
  elNewProductForm.dataset.productId = product_id;
  editModal.style.display = "block";
}


// EDIT MODAL 
let editModalBtn = document.querySelector(".js-add-dish-btn");
let editSpan = document.getElementsByClassName("close-arrow")[0];


editSpan.onclick = function() {
  editModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == editModal) {
    editModal.style.display = "none";
  }
}

elNewProductForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  try {
    if(evt.currentTarget.dataset.editProductId) {
      console.log('this is edit')

      const res = await fetch(`${CONFIG.HOST}/admin/product`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product_id,
          name: elAddNewProductName.value,
          price: elAddNewProductPrice.value,
          image: elNewProductImg.value,
          info: elAddNewProductTextarea.value,
          // status: 
        })
      })

    }
  } catch (error) {
    console.log(error);
  }
})