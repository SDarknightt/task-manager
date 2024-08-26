import {toast} from "~/components/ui/use-toast";


export function generateNumericShareId() {
    return Math.floor(100000 + Math.random() * 900000); // Gera número aleatório entre 100000 e 999999 - exatamente 6 dígitos
}

export function generalToast(type: "success" | "destructive") {
    if (type === "success") {
        toast({
            title: "Sucesso!",
            description: "Operação realizada com sucesso.",
            variant: type,
        })
    } else {
        toast({
            title: "Erro!",
            description: "Ocorreu um erro ao realizar a operação.",
            variant: type,
        })
    }
}