export function generateNumericShareId() {
    return Math.floor(100000 + Math.random() * 900000); // Gera número aleatório entre 100000 e 999999 - exatamente 6 dígitos
}