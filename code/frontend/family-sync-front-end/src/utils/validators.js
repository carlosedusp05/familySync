export const validateName = (name) => {
  if (!name || name.trim().length < 3 || !isNaN(name)) {
    return "Insira um nome válido (mínimo 3 caracteres)";
  }
  return "";
};

export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) return "O e-mail é obrigatório";
  if (email.length > 100) return "O e-mail deve ter no máximo 100 caracteres";
  if (!regex.test(email)) return "Insira um formato de e-mail válido";
  return "";
};

export const validarCpf = (cpf) => {
  if (!cpf) return "CPF é obrigatório";
  const limpo = cpf.replace(/\D/g, "");

  if (limpo.length !== 11 || /^(\d)\1{10}$/.test(limpo)) return "CPF inválido";

  const cpfDigitos = limpo.split("").map(Number);
  const calcularDigito = (quantidade) => {
    const soma = cpfDigitos
      .slice(0, quantidade - 1)
      .reduce((acc, curr, index) => acc + curr * (quantidade - index), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcularDigito(10);
  const d2 = calcularDigito(11);

  return d1 === cpfDigitos[9] && d2 === cpfDigitos[10] ? "" : "CPF inválido";
};

export const validarDataNascimento = (data) => {
  if (!data) return "Data de nascimento é obrigatória";
  const selecionada = new Date(data);
  const hoje = new Date();
  if (selecionada > hoje) return "Data de nascimento não pode ser futura";
  return "";
};

export const validatePassword = (senha) => {
  if (!senha) return "A senha é obrigatória";
  if (senha.length > 100) return "A senha excedeu o limite de 100 caracteres";

  const faltaMinuscula = !/[a-z]/.test(senha);
  const faltaMaiuscula = !/[A-Z]/.test(senha);
  const faltaNumero = !/\d/.test(senha);
  const faltaEspecial = !/[!@#$%^&*(),.?":{}|<>_=+ \-]/.test(senha);
  const tamanhoCurto = senha.length < 8;

  if (
    tamanhoCurto ||
    faltaMinuscula ||
    faltaMaiuscula ||
    faltaNumero ||
    faltaEspecial
  ) {
    let mensagens = [];
    if (tamanhoCurto) mensagens.push("ter pelo menos 8 caracteres");
    if (faltaMinuscula) mensagens.push("conter letras minúsculas");
    if (faltaMaiuscula) mensagens.push("incluir letras maiúsculas");
    if (faltaNumero) mensagens.push("ter pelo menos um número");
    if (faltaEspecial) mensagens.push("usar símbolos (ex: @, #, +, -)");

    const fraseFinal = mensagens.join(", ").replace(/, ([^,]*)$/, " e $1");
    return `Sua senha precisa ${fraseFinal}.`;
  }
  return "";
};

export const validateConfirmPassword = (senha, repetirSenha) => {
  if (!repetirSenha) return "Confirme sua senha";
  if (senha !== repetirSenha) return "As senhas não conferem";
  return "";
};

export const validateRegisterFields = (dados) => {
  const erros = {
    nome: validateName(dados.nome),
    email: validateEmail(dados.email),
    cpf: validarCpf(dados.cpf),
    dataNascimento: validarDataNascimento(dados.dataNascimento),
    senha: validatePassword(dados.senha),
    repetirSenha: validateConfirmPassword(dados.senha, dados.repetirSenha),
  };

  Object.keys(erros).forEach((key) => !erros[key] && delete erros[key]);

  return {
    isValid: Object.keys(erros).length === 0,
    erros,
  };
};

export const validateLoginFields = (dados) => {
  const erros = {
    email: validateEmail(dados.email),
    senha: dados.senha === "" ? "A senha é obrigatória" : "",
  };

  const isValid = !erros.email && !erros.senha;

  return { isValid, erros };
};

export const validatePhone = (telefone) => {
  if (!telefone) return "O telefone é obrigatório";

  const limpo = telefone.replace(/\D/g, "");

  if (limpo.length < 10 || limpo.length > 11) {
    return "Telefone inválido (insira DDD + número)";
  }

  if (/^(\d)\1{9,10}$/.test(limpo)) {
    return "Número de telefone inválido";
  }

  return "";
};
