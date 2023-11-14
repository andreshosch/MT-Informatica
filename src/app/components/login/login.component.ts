import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { HttpClient } from '@angular/common/http';
import { MailsService } from 'src/app/services/mails.service';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  //Inicio Login
  esAdmin: boolean = false
  habilitar: boolean = false
  hayUsuario: boolean = false
  loginProgress: boolean = false
  
  login: boolean= true
  formRegistro: FormGroup
  listUsuario: Usuario[] = []
  usuariosRegistrados: Usuario[] = []
  loginUsr: FormGroup
  usuario: number;
  contrasena: string;
  
  //Fin Login


  constructor(private _usuarioService: UsuariosService, private _mailService:MailsService, private fb:FormBuilder,private http: HttpClient, private dataService: DataService){

    this.loginUsr = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    })

    this.formRegistro = this.fb.group({
      nombre:['',Validators.required],
      apellido:['',Validators.required],
      contrasena:['',Validators.required],
      mail:['',Validators.required],
      dni:['',Validators.required],      
      cuit:['',Validators.required],  
      domicilio:['',Validators.required],
      telefono:['',Validators.required],
    })
    
  }
 
ngOnInit(){
  this.getUsuarios()
  this.getSolicitudes()
  this.usuarioLogueado()
}

usuarioLogueado(){
  let arregloLS = JSON.parse(localStorage.getItem("hayUsuario"));
  if (arregloLS){
    const fechaActual = new Date()
    const fechaEnSegundos = fechaActual.getTime()
    const fechaAlmacenada = new Date(arregloLS[2])
    const fechaAlmDif = fechaAlmacenada.getTime()
    const tiempoLogin = Math.round((fechaEnSegundos - fechaAlmDif) / 1000)
    
    if(tiempoLogin < 3600){
      this.hayUsuario = true
      this.habilitar=true
      this.esAdmin = (arregloLS[1] == "true")
    }else{
      this.desloguear()
    }
    
  }
}

habilitarLogin(){
  this.loginProgress = true
}

desloguear(){
  this.hayUsuario=false
  this.esAdmin=false
  this.habilitar=false
  localStorage.removeItem("hayUsuario");
  this.dataService.limpiar();
}

cerrarLogin(){
  this.loginProgress = false
}

irALogin(){
  this.login=true
}

irARegistro(){
  this.login=false
}

getUsuarios(){
  this._usuarioService.getUsers().subscribe(doc => {
    this.listUsuario = []
    doc.forEach((element: any) => {
      // this.listUsuario.push(element)
      this.listUsuario.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
      })
    })
  }) 
}

getSolicitudes() {
  this._usuarioService.getSolicitudes().subscribe(doc => {
    this.usuariosRegistrados = []
    doc.forEach((element: any) => {
      this.usuariosRegistrados.push({
        id: element.payload.doc.id,
        ... element.payload.doc.data()
      })
    })
  })
}

ingresoUsr(){
  let arregloLS = []
  this.usuario = this.loginUsr.get('usuario').value
  this.contrasena = this.loginUsr.get('contrasena').value
  for (let j=0; j < this.listUsuario.length; j++){
    if(this.listUsuario[j].dni == this.usuario){
      if(this.listUsuario[j].password === this.contrasena){
        this.hayUsuario = true
        this.habilitar=true
        arregloLS.push(this.usuario)
        j = this.listUsuario.length
        //reemplazar por los DNI de Mariano u Natalia
        if((this.usuario == 29560560)||(this.usuario == 29560560)){
          this.esAdmin = true
          arregloLS.push("true")
        }else{
          arregloLS.push("false")
        }
        this.loginProgress = false
        this.loginUsr.reset()
        let fecha = new Date()
        arregloLS.push(fecha)
        localStorage.setItem("hayUsuario", JSON.stringify(arregloLS));
      }else{
        console.log('Error en ingreso')
      }
    }
  }
}

solicitarAlta(){
  let dniSolicitud = this.formRegistro.get('dni').value;
  let resultado = "x"
 
  //Chequeamos si es un usuario registrado
  for (let j=0; j < this.listUsuario.length; j++){
    if(this.listUsuario[j].dni == dniSolicitud){
      resultado = "El DNI ya está asociado a un cliente"
      j = this.listUsuario.length
    }
  }
  //Chequeamos si existe una solicitud pendiente con ese DNI
  if (resultado === "x"){
    for (let j=0; j < this.usuariosRegistrados.length; j++){
      if(this.usuariosRegistrados[j].dni == dniSolicitud){
        resultado = "Ya existe una solicitud pendiente con este DNI"
        j = this.usuariosRegistrados.length
      }
    }
  }
  if(resultado === "x"){
    const unaSolicitud: Usuario = {
      nombre: this.formRegistro.get('nombre').value,
      apellido: this.formRegistro.get('apellido').value,
      dni: this.formRegistro.get('dni').value,
      celular: this.formRegistro.get('telefono').value,
      mail: this.formRegistro.get('mail').value,
      domicilio: this.formRegistro.get('domicilio').value,
      password: this.formRegistro.get('contrasena').value,
    }
    const formData:any=this.formRegistro.value
    const formUrl='https://formspree.io/f/maygvrgw'
    this._mailService.sendMails(formUrl,formData)
    // this.http.post(formUrl, formData).subscribe(
    // (response) => {
    //   console.log('Formulario enviado con éxito', response);
    // },
    // (error) => {
    //   console.error('Error al enviar el formulario', error);
    // })
    this._usuarioService.createSolicitud(unaSolicitud)
    this.formRegistro.reset()
    //enviar mensaje de exito de solicitud
    this.loginProgress=false
    this.login=true
   
  } else{
    //Dar aviso correspondiente por falla
    console.log(resultado)
  }
}


}
