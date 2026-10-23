/**
 * Life & Health Web - Scripts de Interface e Integração
 */

"use strict";

// ============================================================
// 1. INICIALIZAÇÃO GERAL E ATUALIZAÇÃO DA NAVBAR
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const navBurger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");
  if (navBurger && navLinks) {
    navBurger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navBurger.classList.toggle("open");
    });
  }

  // Atualizar barra de autenticação na Navbar
  atualizarNavbarAuth();

  // Ouvir mudanças na sessão de autenticação
  window.addEventListener("lifehealth_auth_change", () => {
    atualizarNavbarAuth();
  });
});

function atualizarNavbarAuth() {
  const userArea = document.getElementById("navUserArea");
  const authItem = document.getElementById("navAuthItem");
  if (!window.DB) return;

  const usuario = window.DB.obterUsuarioLogado();
  if (usuario) {
    if (userArea) {
      userArea.innerHTML = `
        <div class="nav__user-status" title="${usuario.email}">
          <span>👤</span>
          <span class="nav__user-name">${usuario.nome.split(" ")[0]}</span>
          <button class="nav__btn-logout" onclick="fazerLogoutSite()" title="Sair da Conta">Sair</button>
        </div>
      `;
    }
    if (authItem) {
      authItem.style.display = "none";
    }
  } else {
    if (userArea) {
      userArea.innerHTML = "";
    }
    if (authItem) {
      authItem.style.display = "block";
    }
  }
}

function fazerLogoutSite() {
  if (window.DB) {
    window.DB.fazerLogout();
    mostrarToast("👋 Sessão encerrada com sucesso!");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  }
}

// Toast de notificação moderno
function mostrarToast(mensagem, duracao = 3000) {
  let toast = document.querySelector(".toast-msg");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.innerHTML = mensagem;
  toast.style.display = "flex";

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    if (toast) toast.style.display = "none";
  }, duracao);
}

// ============================================================
// 2. LÓGICA DO CARRINHO DE COMPRAS (COMPARTILHADO)
// ============================================================
const CART_STORAGE_KEY = "lifehealth_carrinho";

function obterCarrinho() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function salvarCarrinho(itens) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itens));
  window.dispatchEvent(new Event("carrinho_atualizado"));
}

function adicionarAoCarrinho(nome, preco) {
  const carrinho = obterCarrinho();
  const existente = carrinho.find((i) => i.nome === nome);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco: Number(preco), quantidade: 1 });
  }
  salvarCarrinho(carrinho);
  mostrarToast(`🛒 "${nome}" adicionado ao carrinho!`);
}

function removerDoCarrinho(index) {
  const carrinho = obterCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  renderizarCarrinhoNaPagina();
}

function alterarQuantidadeCarrinho(index, delta) {
  const carrinho = obterCarrinho();
  if (carrinho[index]) {
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
      carrinho.splice(index, 1);
    }
  }
  salvarCarrinho(carrinho);
  renderizarCarrinhoNaPagina();
}

function limparCarrinho() {
  salvarCarrinho([]);
  renderizarCarrinhoNaPagina();
  mostrarToast("🗑️ Carrinho esvaziado.");
}

function renderizarCarrinhoNaPagina() {
  const container = document.getElementById("carrinhoItens");
  const totalEl = document.getElementById("carrinhoTotal");
  const btnFinalizar = document.getElementById("btnFinalizarCompra");
  if (!container || !totalEl) return;

  const carrinho = obterCarrinho();
  if (carrinho.length === 0) {
    container.innerHTML =
      '<p class="empty-cart-msg">Seu carrinho está vazio.</p>';
    totalEl.textContent = "R$ 0,00";
    if (btnFinalizar) btnFinalizar.disabled = true;
    return;
  }

  let total = 0;
  container.innerHTML = carrinho
    .map((item, index) => {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;
      return `
      <div class="cart-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #edf2f7;">
        <div>
          <strong style="font-size: 0.9rem; color: #1e293b;">${item.nome}</strong>
          <div style="font-size: 0.8rem; color: #64748b;">
            R$ ${item.preco.toFixed(2).replace(".", ",")} &times;
            <button onclick="alterarQuantidadeCarrinho(${index}, -1)" style="padding: 0 4px; font-weight: bold; background: #e2e8f0; border-radius: 3px; cursor: pointer;">-</button>
            <span style="font-weight: bold; padding: 0 4px;">${item.quantidade}</span>
            <button onclick="alterarQuantidadeCarrinho(${index}, 1)" style="padding: 0 4px; font-weight: bold; background: #e2e8f0; border-radius: 3px; cursor: pointer;">+</button>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 700; color: #0f172a;">R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
          <span class="cart-item-remove" onclick="removerDoCarrinho(${index})" title="Remover" style="cursor: pointer; color: #ef4444; font-size: 1.2rem;">&times;</span>
        </div>
      </div>
    `;
    })
    .join("");

  totalEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  if (btnFinalizar) btnFinalizar.disabled = false;
}

function finalizarCompraNoBanco() {
  const carrinho = obterCarrinho();
  if (carrinho.length === 0) return;

  const usuarioLogado = window.DB.obterUsuarioLogado();
  let total = 0;
  carrinho.forEach((item) => (total += item.preco * item.quantidade));

  // Inserir pedido no banco de dados
  const novoPedido = {
    id: Date.now(),
    usuarioId: usuarioLogado ? usuarioLogado.id : null,
    clienteNome: usuarioLogado ? usuarioLogado.nome : "Cliente Visitante",
    clienteEmail: usuarioLogado ? usuarioLogado.email : "cliente@visitante.com",
    itens: carrinho,
    total: Number(total.toFixed(2)),
    status: "Aprovado",
    data: new Date().toISOString().split("T")[0],
  };

  window.DB.tabela("pedidos").inserir(novoPedido);

  limparCarrinho();
  mostrarToast(
    `🎉 Pedido #${novoPedido.id.toString().slice(-4)} gerado e salvo no Banco de Dados com sucesso!`,
    4000,
  );
}
