let products = JSON.parse(localStorage.getItem("products")) || [
  { name: "Помідори", count: 2, bought: true },
  { name: "Печиво", count: 2, bought: false },
  { name: "Сир", count: 1, bought: false }
];

const productInput = document.getElementById("productInput");
const addButton = document.getElementById("addButton");
const productList = document.getElementById("productList");
const leftStats = document.getElementById("leftStats");
const boughtStats = document.getElementById("boughtStats");

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function renderProducts() {
  productList.innerHTML = "";

  products.forEach(function(product, index) {
    const item = document.createElement("div");
    item.className = "item";

    const name = document.createElement("span");
    name.textContent = product.name;

    if (product.bought) {
      name.className = "bought";
    }

    name.onclick = function() {
  if (!product.bought) {
    editName(index);
  }
};

   
    item.appendChild(name);

    if (!product.bought) {
      const count = document.createElement("div");
      count.className = "count";

      const minus = document.createElement("button");
      minus.textContent = "-";
      minus.dataset.tooltip = "Зменшити кількість";
      minus.disabled = product.count === 1;

      minus.onclick = function() {
        if (product.count > 1) {
          product.count--;
          update();
        }
      };

      const number = document.createElement("span");
      number.className = "number";
      number.textContent = product.count;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.dataset.tooltip = "Збільшити кількість";

      plus.onclick = function() {
        product.count++;
        update();
      };

      count.appendChild(minus);
      count.appendChild(number);
      count.appendChild(plus);
      item.appendChild(count);
    } else {
      const number = document.createElement("span");
      number.className = "number";
      number.textContent = product.count;
      item.appendChild(number);
    }

    const statusButton = document.createElement("button");
    statusButton.dataset.tooltip = "Змінити статус";
    statusButton.textContent = product.bought ? "Не куплено" : "Куплено";

    statusButton.onclick = function() {
      product.bought = !product.bought;
      update();
    };

    item.appendChild(statusButton);

    if (!product.bought) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.dataset.tooltip = "Видалити товар";
      deleteButton.textContent = "x";

      deleteButton.onclick = function() {
        products.splice(index, 1);
        update();
      };

      item.appendChild(deleteButton);
    }

    productList.appendChild(item);
  });
}

function editName(index) {
  const newName = prompt("Введіть нову назву товару:", products[index].name);

  if (newName !== null && newName.trim() !== "") {
    products[index].name = newName.trim();
    update();
  }
}

function renderStats() {
  leftStats.innerHTML = "";
  boughtStats.innerHTML = "";

  products.forEach(function(product) {
    const stat = document.createElement("div");
    stat.className = "badge-item";
    stat.innerHTML = product.name + ' <span class="badge-number">' + product.count + "</span>";

    if (product.bought) {
      boughtStats.appendChild(stat);
    } else {
      leftStats.appendChild(stat);
    }
  });
}

function editName(index) {
  const item = productList.children[index];
  const oldName = item.querySelector("span");

  const input = document.createElement("input");
  input.type = "text";
  input.value = products[index].name;

  item.replaceChild(input, oldName);
  input.focus();

  function saveNewName() {
    const newName = input.value.trim();

    if (newName !== "") {
      products[index].name = newName;
    }

    update();
  }

  input.addEventListener("blur", saveNewName);

  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      input.blur();
    }
  });
}


function addProduct() {
  const name = productInput.value.trim();

  if (name === "") {
    return;
  }

  products.push({
    name: name,
    count: 1,
    bought: false
  });

  productInput.value = "";
  productInput.focus();

  update();
}

function update() {
  saveProducts();
  renderProducts();
  renderStats();
}

addButton.onclick = addProduct;

productInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addProduct();
  }
});

update();