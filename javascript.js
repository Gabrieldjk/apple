const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');

if (toggle && nav) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
let index = 0;

function updateCarousel() {
    if (!track) return;
    track.style.transform = `translateX(-${index * 100}%)`;
}

if (nextBtn && prevBtn && slides.length) {
    nextBtn.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        updateCarousel();
    });
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let total = cart.reduce((sum, item) => {
        return sum + Number(item.quantidade || 1);
    }, 0);

    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.innerText = total;
    }
}

function addToCart(nome, preco, imagem) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let existing = cart.find(item => item.nome === nome);

    if (existing) {
        existing.quantidade += 1;
    } else {
        cart.push({
            nome,
            preco: Number(preco),
            imagem,
            quantidade: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    showToast("Produto adicionado ao carrinho");
}

const cartItems = document.getElementById('cart-items');
const totalEl = document.getElementById('total');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
    if (!cartItems || !totalEl) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const qtd = item.quantidade || 1;
        const subtotal = item.preco * qtd;
        total += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem}">
                <h4>${item.nome} <small>(x${qtd})</small></h4>
                <span>R$ ${subtotal.toFixed(2)}</span>
                <button class="remove" onclick="removeItem(${index})">Remover</button>
            </div>
        `;
    });

    totalEl.innerText = total.toFixed(2);
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();

    showToast("Produto removido do carrinho");
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

