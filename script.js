
// ===================================
// GLAMORA BEAUTY PRODUCT DATA
// ===================================

const products = [
    {
        id: 1,
        name: "Lipsticks",
        price: 8500,
        image: "media/lipsticksgtr.jpeg",
        alt: "Lipstick"
    },
    {
        id: 2,
        name: "Foundation",
        price: 15000,
        image: "media/foundation j.jpeg",
        alt: "Foundation"
    },
    {
        id: 3,
        name: "Eyeshadow",
        price: 12000,
        image: "media/Eyeshadow y.jpeg",
        alt: "Eyeshadow"
    },
    {
        id: 4,
        name: "Concealers",
        price: 7000,
        image: "media/concealerh.jpeg",
        alt: "Concealer"
    },
    {
        id: 5,
        name: "Blush & Highlighters",
        price: 9500,
        image: "media/Blush & Highlighters hy.jpeg",
        alt: "Blush and highlighter makeup products"
    },
    {
        id: 6,
        name: "Makeup Brushes",
        price: 10000,
        image: "media/makeup brush h.jpeg",
        alt: "Makeup brushes"
    }
];


// ===================================
// SELECT HTML ELEMENTS
// ===================================

const productContainer = document.querySelector("#productContainer");
const cartCount = document.querySelector(".cart-count");


// ===================================
// FORMAT PRODUCT PRICES
// ===================================

function formatPrice(price) {
    return "₦" + price.toLocaleString("en-NG");
}


// ===================================
// DISPLAY PRODUCTS ON THE WEBSITE
// ===================================

function displayProducts(productList) {

    productContainer.textContent = "";

    productList.forEach(function(product) {

        const productCard = document.createElement("div");
        productCard.classList.add("category-card");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.alt;

        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const productPrice = document.createElement("p");
        productPrice.textContent = formatPrice(product.price);

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.classList.add("add-to-cart-btn");
        addButton.textContent = "Add to Cart";

        addButton.dataset.productId = product.id;

        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);
        productCard.appendChild(addButton);

        productContainer.appendChild(productCard);

    });

}


// ===================================
// SHOPPING CART
// ===================================

let cart = [];

function updateCartCount() {

    const totalItems = cart.reduce(function(total, product) {
        return total + product.quantity;
    }, 0);

    cartCount.textContent = totalItems;

}


// ===================================
// ADD PRODUCTS TO CART
// ===================================

productContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-to-cart-btn")) {

        const productId = Number(event.target.dataset.productId);

        const selectedProduct = products.find(function(product) {
            return product.id === productId;
        });

        if (selectedProduct) {

            const existingProduct = cart.find(function(product) {
                return product.id === productId;
            });

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    ...selectedProduct,
                    quantity: 1
                });
            }

            updateCartCount();

            event.target.textContent = "Added!";

            console.log("Product added:", selectedProduct.name);
            console.log("Shopping cart:", cart);

        }

    }

});


// ===================================
// LOAD PRODUCTS
// ===================================

displayProducts(products);
updateCartCount();




// ===================================
// BEAUTY PRODUCTS API
// ===================================

const tipsContainer = document.querySelector("#tipsContainer");
const tipSearch = document.querySelector("#tipSearch");
const tipFilter = document.querySelector("#tipFilter");
const loadingMessage = document.querySelector("#loadingMessage");
const apiError = document.querySelector("#apiError");

let beautyApiItems = [];


// ===================================
// FETCH BEAUTY PRODUCTS FROM API
// ===================================

async function fetchBeautyProducts() {

    try {

        loadingMessage.textContent = "Loading beauty products...";
        apiError.textContent = "";

        const [makeupResponse, skincareResponse] = await Promise.all([
            fetch("https://dummyjson.com/products/category/beauty?limit=0"),
            fetch("https://dummyjson.com/products/category/skin-care?limit=0")
        ]);

        if (!makeupResponse.ok || !skincareResponse.ok) {
            throw new Error("Unable to fetch beauty products.");
        }

        const makeupData = await makeupResponse.json();
        const skincareData = await skincareResponse.json();

        const makeupProducts = makeupData.products.map(function(product) {
            return {
                ...product,
                type: "makeup"
            };
        });

        const skincareProducts = skincareData.products.map(function(product) {
            return {
                ...product,
                type: "skincare"
            };
        });

        beautyApiItems = [...makeupProducts, ...skincareProducts];

        loadingMessage.textContent = "";

        displayBeautyProducts(beautyApiItems);

    } catch (error) {

        loadingMessage.textContent = "";
        apiError.textContent =
            "Sorry, beauty products could not load. Please try again.";

        console.error("API Error:", error);

    }

}


// ===================================
// DISPLAY API PRODUCTS
// ===================================

function displayBeautyProducts(productList) {

    tipsContainer.textContent = "";

    if (productList.length === 0) {

        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No matching products found.";

        tipsContainer.appendChild(emptyMessage);

        return;
    }

    productList.forEach(function(product) {

        const card = document.createElement("article");
        card.classList.add("tip-card");

        const image = document.createElement("img");
        image.src = product.thumbnail;
        image.alt = product.title;
        image.loading = "lazy";

        const heading = document.createElement("h3");
        heading.textContent = product.title;

        const description = document.createElement("p");
        description.textContent = product.description;

        const category = document.createElement("p");
        category.textContent =
            product.type === "makeup" ? "Makeup" : "Skincare";

        const price = document.createElement("p");
        price.textContent = "$" + product.price.toFixed(2);

        card.appendChild(image);
        card.appendChild(heading);
        card.appendChild(description);
        card.appendChild(category);
        card.appendChild(price);

        tipsContainer.appendChild(card);

    });

}


// ===================================
// SEARCH AND FILTER API PRODUCTS
// ===================================

function filterBeautyProducts() {

    const searchText = tipSearch.value.toLowerCase().trim();
    const selectedCategory = tipFilter.value;

    const filteredProducts = beautyApiItems.filter(function(product) {

        const matchesSearch =
            product.title.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.type === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayBeautyProducts(filteredProducts);

}


// ===================================
// LISTEN FOR SEARCH AND FILTER
// ===================================

tipSearch.addEventListener("input", filterBeautyProducts);

tipFilter.addEventListener("change", filterBeautyProducts);


// ===================================
// START THE API APP
// ===================================

fetchBeautyProducts();



// ===================================
// CONTACT FORM VALIDATION
// ===================================

const contactForm = document.querySelector("#contactForm");

const customerName = document.querySelector("#customerName");
const customerEmail = document.querySelector("#customerEmail");
const customerMessage = document.querySelector("#customerMessage");

const nameError = document.querySelector("#nameError");
const emailError = document.querySelector("#emailError");
const messageError = document.querySelector("#messageError");

const formFeedback = document.querySelector("#formFeedback");


// ===================================
// VALIDATE CUSTOMER NAME
// ===================================

function validateName(name) {

    if (name.trim().length < 3) {
        return "Please enter at least 3 characters for your name.";
    }

    return "";
}


// ===================================
// VALIDATE CUSTOMER EMAIL
// ===================================

function validateEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
        return "Please enter a valid email address.";
    }

    return "";
}


// ===================================
// VALIDATE CUSTOMER MESSAGE
// ===================================

function validateMessage(message) {

    if (message.trim().length < 10) {
        return "Your message must contain at least 10 characters.";
    }

    return "";
}


// ===================================
// HANDLE CONTACT FORM SUBMISSION
// ===================================

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    formFeedback.textContent = "";

    const name = customerName.value;
    const email = customerEmail.value;
    const message = customerMessage.value;

    const nameResult = validateName(name);
    const emailResult = validateEmail(email);
    const messageResult = validateMessage(message);

    nameError.textContent = nameResult;
    emailError.textContent = emailResult;
    messageError.textContent = messageResult;

    const isFormValid =
        nameResult === "" &&
        emailResult === "" &&
        messageResult === "";

    if (isFormValid) {

        formFeedback.textContent =
            "Thank you! Your form has been validated successfully.";

        contactForm.reset();

    } else {

        formFeedback.textContent =
            "Please correct the errors above and try again.";

    }

});



/* ===================================
   DARK MODE AND LOCAL STORAGE
=================================== */

const themeToggle = document.querySelector("#themeToggle");


// Apply the selected theme
function applyTheme(theme) {

    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    themeToggle.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    themeToggle.setAttribute("aria-pressed", String(isDark));

}


// Load saved theme preference
function loadTheme() {

    try {

        const savedPreference = localStorage.getItem("glamoraTheme");

        if (savedPreference !== null) {

            const preference = JSON.parse(savedPreference);

            if (preference.theme === "dark" ||
                preference.theme === "light") {

                applyTheme(preference.theme);
                return;
            }

        }

    } catch (error) {

        console.error("Unable to load saved theme:", error);

    }

    applyTheme("light");

}


// Save and change theme when button is clicked
themeToggle.addEventListener("click", function() {

    const isCurrentlyDark =
        document.body.classList.contains("dark-mode");

    const newTheme = isCurrentlyDark ? "light" : "dark";

    applyTheme(newTheme);

    try {

        localStorage.setItem(
            "glamoraTheme",
            JSON.stringify({ theme: newTheme })
        );

    } catch (error) {

        console.error("Unable to save theme:", error);

    }

});


// Load theme when website opens
loadTheme();
