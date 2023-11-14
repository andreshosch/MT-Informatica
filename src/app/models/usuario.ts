export class Usuario{
    dni: number;
    nombre: string;
    apellido: string;
    celular: number;
    domicilio: string;
    mail: string;
    cuit?: number;
    password: string;
    provincia: string;
    localidad: string;
    codigoPostal: number;
    observaciones?: string;
    estadoFiscal: string;


    constructor(dni: number, nombre:string, apellido:string, celular:number, domicilio:string, mail:string, cuit:number, password:string, provincia:string, localidad:string, codigoPostal:number, observaciones:string, estadoFiscal:string){
        this.dni = dni
        this.nombre = nombre
        this.apellido = apellido
        this.celular = celular
        this.domicilio = domicilio
        this.mail = mail
        this.cuit = cuit
        this.password = password
        this.provincia = provincia
        this.localidad = localidad
        this.codigoPostal = codigoPostal
        this.observaciones = observaciones
        this.estadoFiscal = estadoFiscal
    }

}