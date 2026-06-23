import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./landing-page.css";

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid bg-white">
          <a className="navbar-brand" href="#">
            <img
              src="./img/Logo.png"
              alt="Logo"
              width="200px"
              height="80px"
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Minhas Consultas
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">
                  Suporte
                </a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Atendimentos
                </a>

                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Horários
                    </a>
                  </li>

                  <li>
                    <a className="dropdown-item" href="#">
                      Médicos
                    </a>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <a className="dropdown-item" href="#">
                      Sobre nós
                    </a>
                  </li>
                </ul>
              </li>
            </ul>

            <button className="login" type="button">
              Faça Login
            </button>

            <button className="cadastro" type="button">
              Cadastre-se
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 className="text-center fs-3 text-primary"></h1>

        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="./img/ChatGPT Image 31 de mar. de 2026, 07_52_35.png"
                className="d-block w-100 alturaImg rounded-5"
                alt="Imagem 1"
              />
            </div>

            <div className="carousel-item">
              <img
                src="./img/library-849797__480.jpg"
                className="d-block w-100 alturaImg rounded-5"
                alt="Imagem 2"
              />
            </div>

            <div className="carousel-item">
              <img
                src="./img/new-years-eve-1845065__480.jpg"
                className="d-block w-100 alturaImg rounded-5"
                alt="Imagem 3"
              />
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>

            <span className="visually-hidden">Previous</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>

            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <section className="sobre">
        <div className="texto">
          <h1>Sobre nós</h1>

          <p>
            A Life & Health é um centro médico especializado em consultas
            rotineiras, oferecendo atendimento humanizado, ágil e de qualidade
            para pacientes de todas as idades. Nossa equipe é formada por
            profissionais qualificados e comprometidos com o bem-estar,
            prevenção e cuidado contínuo da saúde. Contamos com estrutura
            moderna, equipamentos atualizados e um ambiente acolhedor,
            proporcionando segurança e conforto em cada atendimento. Nosso
            objetivo é promover saúde e qualidade de vida, sempre colocando o
            paciente em primeiro lugar.
          </p>
        </div>

        <div className="imagem">
          <img src="./img/utensilios.png" alt="Imagem médica" />
        </div>
      </section>

      <section className="atendimento">
        <div className="imagem2">
          <img src="./img/atendimento.png" alt="Atendimento" />
        </div>

        <div className="texto">
          <h1>Atendimento</h1>

          <p>
            Nosso atendimento é pautado na ética, no respeito e na atenção
            individualizada a cada paciente. Desde o agendamento até a
            finalização da consulta, buscamos oferecer um processo simples,
            rápido e organizado, garantindo conforto e tranquilidade. Nossa
            equipe está preparada para acolher, orientar e esclarecer dúvidas,
            proporcionando uma experiência humanizada e segura. Na Life &
            Health, acreditamos que cuidar da saúde vai além do diagnóstico —
            envolve escuta, empatia e compromisso com o bem-estar de cada
            pessoa.
          </p>

          <button className="ver" type="button">
            Ver agora
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="col">
            <h3>Atendimento</h3>
            <p>Ver Horários</p>
          </div>

          <div className="col">
            <h3>Agendamento</h3>
            <p>Consultar Agendamentos</p>
            <p>Fazer um Agendamento</p>

            <h3>Produtos</h3>
            <p>Comprar Produtos</p>
          </div>

          <div className="col">
            <h3>Médicos</h3>
            <p>Veja Nossos Médicos</p>
          </div>
        </div>

        <div className="creditos">
          <p>&copy; 2025 By Life & Health Web</p>
        </div>
      </footer>
    </>
  );
}