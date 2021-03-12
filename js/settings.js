// UTILITIES
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

const elTemplateNewProduct = document.querySelector('#add-new-dish-template').content;
const elAddignBtn = document.querySelector('#adding_btn').content;


// SELECT MODAL ELEMENTS
const modal = document.getElementById("myModal");
const modalBtn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

const FormTypes = {
  Edit: `edit`,
  Create: `create`
};

let meals = [];

const renderMeals = (meals) => {
  elDishesList.innerHTML = ``;
  const listNewFragment = document.createDocumentFragment();
  let addButtonOfList = elAddignBtn.cloneNode(true).querySelector(`.add-dish-button-wrapper`);

  elDishesList.appendChild(addButtonOfList);

  addButtonOfList.addEventListener("click", handleAddMealClick)
  
  meals.sort(function(a, b) {
    return a.product_id - b.product_id;
  }).forEach((product) => {
    let elProductItem = elTemplateNewProduct.cloneNode(true);
    elProductItem.querySelector(`.add-dish-item`).id = `product-${product.product_id}`
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
};

const handleAddMealClick = function() {
  elNewProductForm.reset();
  elNewProductPreview.src = `https://panor.ru/img/default/category.png`;
  elNewProductForm.dataset.type = FormTypes.Create;
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



elNewProductImg.addEventListener("blur", (evt)=> {
  evt.preventDefault()
  elNewProductPreview.src = evt.target.value
})

const editMeal = async () => {
  try {
    const editedProductId = elAddNewProductBtn.dataset.editId;
    const res = await fetch(`${CONFIG.HOST}/admin/product`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editedProductId,
        name: elAddNewProductName.value,
        price: elAddNewProductPrice.value,
        image: elNewProductImg.value,
        info: elAddNewProductTextarea.value,
        status: 1
      })
    })

    const response = await res.json()

    elNewProductForm.reset()
    modal.style.display = "none";

    const editedProductIndex = meals.findIndex(meal => meal.product_id === editedProductId - 0);

    await meals.splice(editedProductIndex, 1, response.data[0]);
    await renderMeals(meals)
  } catch (error) {
    console.log(error);
  }
};

const addMeal = async () => {
  try {
    console.log("NEW");
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
    const res = await newProduct.json()
    
    meals.push(res.data[0]) 
    elNewProductForm.reset()
    modal.style.display = "none";
    await renderMeals(meals)

  } catch (error) {
    console.log(error);
  }
};

//ADD NEW PRODUCT
elNewProductForm.addEventListener("submit", async (evt)=> {
  evt.preventDefault()
  
  if (evt.currentTarget.dataset.type === FormTypes.Create) {
    addMeal();
  } else if (evt.currentTarget.dataset.type === FormTypes.Edit) {
    editMeal();
  }
})



// RENDER PRODUCTS
const fetchNewProductData = async (CONFIG) => {
  const res = await fetch(`${CONFIG.HOST}/admin/products`)
  const response = await res.json()
  
  meals = await response.data;
  await renderMeals(meals)
} 
fetchNewProductData(CONFIG)



// DELATE PRODUCTS
async function deleteProductFunc (evt) {
  const productId = evt.currentTarget.dataset.deleteProductId
  try {
    if(productId) {
      
      const res = await fetch(`${CONFIG.HOST}/admin/product`, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId
        })
      })
      
      await document.querySelector(`#product-${productId}`).remove();

    }
  } catch (error) {
    console.log(error);
  }
}


const fetchEditData = async (CONFIG) => {
  const res = await fetch(`${CONFIG.HOST}/admin/products`)
  const response = res.json()
  return response
} 


// EDIT PRODUCTS
async function editProductFunc(evt) {
  const product_id = Number(evt.currentTarget.dataset.editProductId);
  
  const fetchingData = await fetchEditData(CONFIG)
  const dataOfSelectedItem = fetchingData.data.find( dataItem =>(dataItem.product_id === product_id))
  elNewProductForm.dataset.type = FormTypes.Edit;
  
  modal.style.display = "block";
  
  elAddNewProductName.value = dataOfSelectedItem.product_name
  elAddNewProductPrice.value = dataOfSelectedItem.product_price
  elNewProductImg.value = dataOfSelectedItem.product_image
  elNewProductPreview.src = dataOfSelectedItem.product_image
  elAddNewProductTextarea.value = dataOfSelectedItem.product_info
  elAddNewProductBtn.dataset.editId = product_id
}

