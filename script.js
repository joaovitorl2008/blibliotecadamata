document.addEventListener("DOMContentLoaded", () => {

    const spanData = document.getElementById("data-atual");
    if (spanData) {
        const hoje = new Date();
        spanData.textContent = hoje.toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    const btnSobre = document.getElementById('btn-sobre');
    const menuVerticalSobre = document.getElementById('menu-vertical-sobre');
    const btnContato = document.getElementById('btn-contato');
    const menuVerticalContato = document.getElementById('menu-vertical-contato');

    function abreMenu(event, menu) {
        event.preventDefault();
        
        if (menu === menuVerticalSobre && menuVerticalContato) {
            menuVerticalContato.classList.remove('active');
        }
        if (menu === menuVerticalContato && menuVerticalSobre) {
            menuVerticalSobre.classList.remove('active');
        }

        if (menu) {
            menu.classList.toggle('active');
        }
    }

    function fechaMenu(event, menu, btn) {
        if (menu && btn) {
            if (!menu.contains(event.target) && event.target !== btn) {
                menu.classList.remove('active');
            }
        }
    }

    if (btnSobre && menuVerticalSobre) {
        btnSobre.addEventListener('click', function(event) {
            abreMenu(event, menuVerticalSobre);
        });
    }

    if (btnContato && menuVerticalContato) {
        btnContato.addEventListener('click', function(event) {
            abreMenu(event, menuVerticalContato);
        });
    }

    document.addEventListener('click', function(event) {
        fechaMenu(event, menuVerticalSobre, btnSobre);
        fechaMenu(event, menuVerticalContato, btnContato);
    });

    const subEmpresa = document.getElementById("sublink-empresa");
    if (subEmpresa) {
        subEmpresa.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Sobre a Empresa:\nA Livraria da Mata conecta estudantes para troca e doação sustentável de livros.");
        });
    }

    const subClientes = document.getElementById("sublink-clientes");
    if (subClientes) {
        subClientes.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Nossos Clientes:\nMais de 1.000 estudantes universitários e de escolas da região.");
        });
    }

    const subTelefone = document.getElementById("sublink-telefone");
    if (subTelefone) {
        subTelefone.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Telefone de Contato da Empresa:\nTelefone Fixo: (31) 3333-0000\nWhatsApp: (31) 98765-4321");
        });
    }

    const salvarEmTXT = (nomeArquivo, conteudo) => {
        const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const containerLivrosSebo = document.getElementById("containerLivrosSebo");
    
    function carregarLivrosSalvos() {
        if (!containerLivrosSebo) return;
        
        const livrosSalvos = JSON.parse(localStorage.getItem("livrosCadastrados")) || [];
        livrosSalvos.forEach(livro => {
            adicionarLivroNaTela(livro);
        });
    }

    function adicionarLivroNaTela(livro) {
        if (!containerLivrosSebo) return;

        const article = document.createElement("article");
        article.innerHTML = `
            <h3>${livro.nome}</h3>
            <ul>
                <li><strong>Modalidade:</strong> ${livro.modalidade}</li>
                <li><strong>Autor:</strong> ${livro.autor}</li>
                <li><strong>Estado:</strong> ${livro.estado}</li>
                <li><strong>Dono(a):</strong> Usuário Cadastrado</li>
            </ul>
            <button type="button" class="btn-interesse" data-livro="${livro.nome}">Tenho Interesse</button>
        `;

        containerLivrosSebo.appendChild(article);

        const btnNovoInteresse = article.querySelector(".btn-interesse");
        configurarBotaoInteresse(btnNovoInteresse);
    }

    carregarLivrosSalvos();

    const formLivroSebo = document.getElementById("formLivroSebo");
    if (formLivroSebo) {
        formLivroSebo.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("nomeLivro").value;
            const autor = document.getElementById("autorLivro").value;
            const estado = document.getElementById("estadoLivro").value;
            const modalidade = document.getElementById("modalidadeLivro").value;

            const novoLivro = { nome, autor, estado, modalidade };

            let livros = JSON.parse(localStorage.getItem("livrosCadastrados")) || [];
            livros.push(novoLivro);
            localStorage.setItem("livrosCadastrados", JSON.stringify(livros));

            adicionarLivroNaTela(novoLivro);

            alert("Livro anunciado com sucesso no Sebo!");
            formLivroSebo.reset();
        });
    }

    const formCadastro = document.getElementById("formCadastro");
    if (formCadastro) {
        const inputCpf = document.getElementById("cpf");
        if (inputCpf) {
            inputCpf.addEventListener("input", (e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 11) val = val.slice(0, 11);
                val = val.replace(/(\d{3})(\d)/, "$1.$2");
                val = val.replace(/(\d{3})(\d)/, "$1.$2");
                val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                e.target.value = val;
            });
        }

        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();

            const usuario = {
                nome: document.getElementById("nome").value,
                cpf: document.getElementById("cpf").value,
                endereco: document.getElementById("endereco").value,
                email: document.getElementById("email").value,
                senha: document.getElementById("senha").value,
                dataCadastro: new Date().toLocaleString("pt-BR")
            };

            localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));

            const conteudoTXT = 
`===================================
     CADASTRO - LIVRARIA DA MATA
===================================
Nome Completo: ${usuario.nome}
CPF: ${usuario.cpf}
Endereço: ${usuario.endereco}
E-mail: ${usuario.email}
Senha: ${usuario.senha}
Data do Cadastro: ${usuario.dataCadastro}
===================================`;

            const nomeArquivo = `cadastro_${usuario.nome.toLowerCase().replace(/\s+/g, "_")}.txt`;
            salvarEmTXT(nomeArquivo, conteudoTXT);

            alert("Cadastro realizado com sucesso! Os dados foram salvos e o arquivo TXT foi gerado.");
            window.location.href = "login.html";
        });
    }

    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const emailDigitado = document.getElementById("email").value.trim();
            const senhaDigitada = document.getElementById("senha").value;

            const usuarioSalvoJSON = localStorage.getItem("usuarioCadastrado");

            if (!usuarioSalvoJSON) {
                alert("Nenhum cadastro foi encontrado neste navegador. Por favor, faça o seu cadastro primeiro.");
                return;
            }

            const usuarioSalvo = JSON.parse(usuarioSalvoJSON);

            if (emailDigitado !== usuarioSalvo.email || senhaDigitada !== usuarioSalvo.senha) {
                alert("E-mail ou senha incorretos. Por favor, verifique suas informações e tente novamente.");
                return;
            }

            localStorage.setItem("usuarioLogado", emailDigitado);

            const logTXT = 
`===================================
     LOG DE ACESSO - LOGIN
===================================
E-mail: ${emailDigitado}
Senha: ${senhaDigitada}
Data/Hora: ${new Date().toLocaleString("pt-BR")}
Status: Sucesso
===================================`;

            const nomeArquivo = `login_${emailDigitado.replace(/[@.]/g, "_")}.txt`;
            salvarEmTXT(nomeArquivo, logTXT);

            alert("Login efetuado com sucesso. Redirecionando para o Sebo...");
            window.location.href = "sebo.html";
        });
    }

    function configurarBotaoInteresse(botao) {
        let livrosReservados = JSON.parse(localStorage.getItem("livrosReservados")) || [];
        const nomeLivro = botao.getAttribute("data-livro") || "Livro";

        if (livrosReservados.includes(nomeLivro)) {
            botao.textContent = "Indisponível (Já Reservado)";
            botao.classList.add("btn-indisponivel");
            botao.disabled = true;
        }

        botao.addEventListener("click", () => {
            if (!livrosReservados.includes(nomeLivro)) {
                livrosReservados.push(nomeLivro);
                localStorage.setItem("livrosReservados", JSON.stringify(livrosReservados));

                botao.textContent = "Indisponível (Reservado por Você)";
                botao.classList.add("btn-indisponivel");
                botao.disabled = true;

                alert(`Interesse registrado. O livro "${nomeLivro}" foi reservado e marcado como indisponível.`);
            }
        });
    }

    const botoesInteresse = document.querySelectorAll(".btn-interesse");
    botoesInteresse.forEach(botao => configurarBotaoInteresse(botao));

    const botoesDetalhes = document.querySelectorAll(".btn-detalhes");
    botoesDetalhes.forEach(botao => {
        botao.addEventListener("click", () => {
            alert("Atenção: Você precisa estar logado para ver os detalhes deste livro. Redirecionando para o Login...");
            window.location.href = "login.html";
        });
    });

});