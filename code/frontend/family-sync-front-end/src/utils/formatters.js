export const formatCPF = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
};

export const formatDateForInput = (date) => {
  if (!date) return "";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    return d.toISOString().split("T")[0];
  } catch (error) {
    console.error("Erro ao formatar data para input:", error);
    return "";
  }
};

export const cleanCPF = (cpf) => cpf.replace(/\D/g, "");

export const formatUserName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
};

export const formatPhone = (value) => {
  if (!value) return "";

  const f = value.replace(/\D/g, "");

  if (f.length <= 2) return `(${f}`;
  if (f.length <= 6) return `(${f.slice(0, 2)}) ${f.slice(2)}`;
  if (f.length <= 10)
    return `(${f.slice(0, 2)}) ${f.slice(2, 6)}-${f.slice(6)}`;

  return `(${f.slice(0, 2)}) ${f.slice(2, 7)}-${f.slice(7, 11)}`;
};

export const formatCEP = (value) => {
  if (!value) return "";

  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

export const cleanCEP = (cep) => cep.replace(/\D/g, "");

export const formatToBRL = (value) => {
  if (typeof value !== "number") {
    value = parseFloat(value) || 0;
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const validateExpenseValue = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const formatMoneyMask = (value) => {
  const cleanValue = value.replace(/\D/g, "");

  if (!cleanValue) return "";

  const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const result = (Number(cleanValue) / 100).toLocaleString("pt-BR", options);

  return `R$ ${result}`;
};

export const parseMoneyToFloat = (formattedValue) => {
  if (!formattedValue) return 0;

  const clean = formattedValue
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  return parseFloat(clean) || 0;
};
