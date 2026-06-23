let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

const horariosPadrao = [
    "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00"
];

// ================= LOGIN =================

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "123") {
        iniciarSistema("admin");
    } else if (user === "paciente" && pass === "123") {
        iniciarSistema("paciente");
    } else {
        document.getElementById("loginError").innerText = "Login inválido.";
    }
}

function iniciarSistema(tipo) {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("mainSystem").classList.remove("hidden");

    if (tipo === "admin") {
        document.getElementById("adminTab").classList.remove("hidden");
    }
}

function logout() {
    localStorage.setItem("consultas", JSON.stringify(consultas));
    location.reload();
}

// ================= ABAS =================

function showTab(tabId) {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.add("hidden");
    });

    document.getElementById(tabId).classList.remove("hidden");

    if (tabId === "admin") atualizarPainelAdmin();
}

// ================= ALERGIA =================

function toggleRemedio() {
    const checkbox = document.getElementById("alergicoRemedio");
    const campo = document.getElementById("campoRemedio");

    checkbox.checked
        ? campo.classList.remove("hidden")
        : campo.classList.add("hidden");
}

// ================= HORÁRIOS =================

function mostrarHorarios() {
    const data = document.getElementById("dataSelecionada").value;
    const container = document.getElementById("horariosContainer");

    if (!data) return;

    container.innerHTML = "";

    horariosPadrao.forEach(horario => {

        const ocupado = consultas.some(c => c.data === data && c.hora === horario);

        const btn = document.createElement("button");
        btn.innerText = horario;

        if (ocupado) {
            btn.disabled = true;
            btn.style.background = "#ef4444";
        } else {
            btn.onclick = () => agendarConsulta(data, horario);
        }

        container.appendChild(btn);
    });
}

// ================= AGENDAR =================

function agendarConsulta(data, hora) {

    const nome = document.getElementById("nomeCompleto").value;
    const idade = document.getElementById("idade").value;
    const email = document.getElementById("email").value;
    const alergico = document.getElementById("alergicoRemedio").checked;
    const nomeRemedio = document.getElementById("nomeRemedio").value;

    if (!nome || !idade || !email) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const novaConsulta = {
        nome,
        idade,
        email,
        alergico,
        nomeRemedio: alergico ? nomeRemedio : "Nenhum",
        data,
        hora
    };

    consultas.push(novaConsulta);
    localStorage.setItem("consultas", JSON.stringify(consultas));

    simularEnvioEmail(nome, email, data, hora);

    limparFormulario();
    mostrarHorarios();
}


// ================= ADMIN =================

function atualizarPainelAdmin() {

    const lista = document.getElementById("listaConsultasAdmin");
    lista.innerHTML = "";

    if (consultas.length === 0) {
        lista.innerHTML = "<li>Nenhuma consulta agendada.</li>";
        return;
    }

    consultas.forEach((c, index) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${c.nome}</strong><br>
            Idade: ${c.idade}<br>
            Email: ${c.email}<br>
            Alergia: ${c.alergico ? c.nomeRemedio : "Não"}<br>
            Data: ${c.data}<br>
            Horário: ${c.hora}<br>
            <button onclick="excluirConsulta(${index})" class="btn-delete">Excluir</button>
        `;
        lista.appendChild(item);
    });
}

function excluirConsulta(index) {
    if (confirm("Deseja realmente excluir essa consulta?")) {
        consultas.splice(index, 1);
        localStorage.setItem("consultas", JSON.stringify(consultas));
        atualizarPainelAdmin();
    }
}

// ================= UTIL =================

function limparFormulario() {
    document.getElementById("nomeCompleto").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("email").value = "";
    document.getElementById("alergicoRemedio").checked = false;
    document.getElementById("nomeRemedio").value = "";
    document.getElementById("campoRemedio").classList.add("hidden");
}

function simularEnvioEmail(nome, email, data, hora) {

    console.log(`
    ====== SIMULAÇÃO DE ENVIO DE EMAIL ======
    Para: ${email}
    Assunto: Confirmação de Consulta
    -----------------------------------------
    Olá ${nome},
    Sua consulta foi agendada com sucesso.
    Data: ${data}
    Horário: ${hora}
    =========================================
    `);

    const notification = document.getElementById("emailNotification");
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 4000);
}
