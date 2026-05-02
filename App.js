let cart = JSON.parse(localStorage.getItem("cart")) || [];

function login(){
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;

    if(u && p){
        window.location.href = "shop.html";
    } else {
        alert("Enter username and password");
    }
}

function add(name, price){
    cart.push({name, price});
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart");
}

function loadCart(){
    let c = document.getElementById("cart");
    if(!c) return;

    let total = 0;
    c.innerHTML = "";

    cart.forEach(item=>{
        total += item.price;
        c.innerHTML += `<p>${item.name} - ₱${item.price}</p>`;
    });

    let t = document.getElementById("total");
    if(t) t.innerText = "Total: ₱" + total;
}

function checkout(){
    let total = cart.reduce((a,b)=>a+b.price,0);
    alert("Order placed! Total: ₱" + total);
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
}

loadCart();