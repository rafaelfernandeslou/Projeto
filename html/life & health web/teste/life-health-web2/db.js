/**
 * Life & Health Web - Sistema de Banco de Dados 100% Funcional
 * Arquitetura Relacional com Armazenamento Persistente, CRUD Completo e Sessão
 */

"use strict";

const LifeHealthDB = (function () {
  const DB_PREFIX = "lifehealth_db_";
  const TABLES = ["usuarios", "agendamentos", "medicos", "produtos", "pedidos"];
  const SESSION_KEY = "lifehealth_sessao_ativa";

  // Dados iniciais padrão (Seed)
  const DADOS_INICIAIS = {
    usuarios: [
      {
        
      },
    ],

    medicos: [
      {
       
      },
    ],

    agendamentos: [
      {
        
      },
    ],

    produtos: [
      {
        
      },
    ],

    pedidos: [
      {
        
      },
    ],
  };

  // Inicialização do banco
  function init() {
    TABLES.forEach((tabela) => {
      const storageKey = DB_PREFIX + tabela;
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(
          storageKey,
          JSON.stringify(DADOS_INICIAIS[tabela] || []),
        );
      }
    });
  }

  // Operações de tabela
  function tabela(nome) {
    if (!TABLES.includes(nome)) {
      throw new Error(`Tabela "${nome}" não existe no banco de dados.`);
    }
    const storageKey = DB_PREFIX + nome;

    function lerDados() {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error("Erro ao ler tabela " + nome, e);
        return [];
      }
    }

    function salvarDados(dados) {
      localStorage.setItem(storageKey, JSON.stringify(dados));
      window.dispatchEvent(
        new CustomEvent("lifehealth_db_change", { detail: { tabela: nome } }),
      );
    }

    return {
      listar: function (filtroFn) {
        const dados = lerDados();
        return typeof filtroFn === "function" ? dados.filter(filtroFn) : dados;
      },

      obterPorId: function (id) {
        const dados = lerDados();
        return dados.find((item) => item.id == id) || null;
      },

      inserir: function (novoItem) {
        const dados = lerDados();
        if (!novoItem.id) {
          const maxId = dados.reduce(
            (max, item) => Math.max(max, Number(item.id) || 0),
            0,
          );
          novoItem.id = maxId > 0 ? maxId + 1 : Date.now();
        }
        if (!novoItem.criadoEm) {
          novoItem.criadoEm = new Date().toISOString();
        }
        dados.unshift(novoItem);
        salvarDados(dados);
        return novoItem;
      },

      atualizar: function (id, camposAtualizados) {
        const dados = lerDados();
        const index = dados.findIndex((item) => item.id == id);
        if (index === -1) return null;
        dados[index] = { ...dados[index], ...camposAtualizados };
        salvarDados(dados);
        return dados[index];
      },

      deletar: function (id) {
        let dados = lerDados();
        const initialLength = dados.length;
        dados = dados.filter((item) => item.id != id);
        if (dados.length !== initialLength) {
          salvarDados(dados);
          return true;
        }
        return false;
      },

      contar: function () {
        return lerDados().length;
      },
    };
  }

  // Métodos de Autenticação e Sessão de Usuário
  function autenticar(email, senha) {
    const usuarios = tabela("usuarios").listar();
    const user = usuarios.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase().trim() &&
        u.senha === senha,
    );
    if (user) {
      const sessaoData = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo || "paciente",
        loginEm: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessaoData));
      window.dispatchEvent(
        new CustomEvent("lifehealth_auth_change", { detail: sessaoData }),
      );
      return { sucesso: true, usuario: sessaoData };
    }
    return { sucesso: false, mensagem: "E-mail ou senha inválidos." };
  }

  function cadastrarUsuario(dados) {
    const usuarios = tabela("usuarios").listar();
    const existe = usuarios.some(
      (u) => u.email.toLowerCase() === dados.email.toLowerCase().trim(),
    );
    if (existe) {
      return {
        sucesso: false,
        mensagem: "Este e-mail já está cadastrado no sistema!",
      };
    }
    const novoUsuario = tabela("usuarios").inserir({
      nome: dados.nome,
      email: dados.email.toLowerCase().trim(),
      telefone: dados.telefone,
      senha: dados.senha,
      tipo: "paciente",
    });
    // Iniciar sessão automaticamente
    const sessaoData = {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      tipo: novoUsuario.tipo,
      loginEm: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessaoData));
    window.dispatchEvent(
      new CustomEvent("lifehealth_auth_change", { detail: sessaoData }),
    );
    return { sucesso: true, usuario: sessaoData };
  }

  function obterUsuarioLogado() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function fazerLogout() {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(
      new CustomEvent("lifehealth_auth_change", { detail: null }),
    );
  }

  // Backup e Restauração
  function exportarBackup() {
    const backup = {
      versao: "1.0",
      dataExportacao: new Date().toISOString(),
      banco: {},
    };
    TABLES.forEach((t) => {
      backup.banco[t] = tabela(t).listar();
    });
    return JSON.stringify(backup, null, 2);
  }

  function importarBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.banco) throw new Error("Estrutura de arquivo inválida");
      TABLES.forEach((t) => {
        if (Array.isArray(parsed.banco[t])) {
          localStorage.setItem(DB_PREFIX + t, JSON.stringify(parsed.banco[t]));
        }
      });
      window.dispatchEvent(
        new CustomEvent("lifehealth_db_change", { detail: { tabela: "all" } }),
      );
      return { sucesso: true };
    } catch (e) {
      return { sucesso: false, mensagem: e.message };
    }
  }

  function resetarPadrao() {
    TABLES.forEach((tabela) => {
      localStorage.setItem(
        DB_PREFIX + tabela,
        JSON.stringify(DADOS_INICIAIS[tabela] || []),
      );
    });
    window.dispatchEvent(
      new CustomEvent("lifehealth_db_change", { detail: { tabela: "all" } }),
    );
  }

  // Auto-inicializar
  init();

  return {
    init,
    tabela,
    tabelasDisponiveis: () => [...TABLES],
    autenticar,
    cadastrarUsuario,
    obterUsuarioLogado,
    fazerLogout,
    exportarBackup,
    importarBackup,
    resetarPadrao,
  };
})();

// Disponibilizar globalmente
window.DB = LifeHealthDB;
