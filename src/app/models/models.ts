export interface Usuario {
    uid?: string;
    nome: string;
    sobrenome?: string;
    email: string;
    senha?: string;
    
    last_login?: string;
    latitude?: number;
    longitude?: number;
}

export interface Dog {
    uid?: string;
    nome: string;
    raca?: string;
    idade?: number;
    vacinado: boolean;
    docil: boolean;
    porte: string;
    sexo: string;
    cor: string;
    caracteristicas?: string;
    foto?: string;
    usuarioId?: string;
    status?: string;
}

export enum PORTE{
    GRANDE, 
    MEDIO,
    PEQUENO
}



