import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { HttpClient } from '@angular/common/http';
import { MailsService } from 'src/app/services/mails.service';
import { DataService } from 'src/app/services/data.service';
import { lastValueFrom } from 'rxjs';
import { MensajeService } from 'src/app/services/mensaje.service';


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
  actualizarPass: boolean = false

  login: boolean = true
  formRegistro: FormGroup
  updateUsr: FormGroup
  listUsuario: Usuario[] = []
  usuariosRegistrados: Usuario[] = []
  loginUsr: FormGroup
  usuario: number;
  nombre: string;
  apellido: string;
  celular: number
  contrasena: string;
  usuarioSoporte: any;

  //Fin Login


  constructor(private _usuarioService: UsuariosService, private _mailService: MailsService, private fb: FormBuilder, private http: HttpClient, public dataService: DataService, private _mensaje: MensajeService) {

    this.loginUsr = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    })

    this.formRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      contrasena: ['', Validators.required],
      mail: ['', Validators.required],
      dni: ['', Validators.required],
      cuit: [''],
      domicilio: ['', Validators.required],
      telefono: ['', Validators.required],
      provincia: ['', Validators.required],
      localidad: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      observaciones: [''],
      estadoFiscal: ['', Validators.required],
    })

    this.updateUsr = this.fb.group({
      usuario: ['', Validators.required],
      contrasenaOld: ['', Validators.required],
      contrasenaNew: ['', Validators.required],
      contrasenaNewFactor: ['', Validators.required],
    })

  }

  ngOnInit() {
    this.getUsuarios()
    this.getSolicitudes()
    this.usuarioLogueado()
  }

  usuarioLogueado() {
    let arregloLS = JSON.parse(localStorage.getItem("hayUsuario"));
    if (arregloLS) {
      const fechaActual = new Date()
      const fechaEnSegundos = fechaActual.getTime()
      const fechaAlmacenada = new Date(arregloLS[2])
      const fechaAlmDif = fechaAlmacenada.getTime()
      const tiempoLogin = Math.round((fechaEnSegundos - fechaAlmDif) / 1000)

      if (tiempoLogin < 3600) {
        this.hayUsuario = true
        this.habilitar = true
        this.esAdmin = (arregloLS[1] == "true")
        this.dataService.actualizarEstadoLogin(true)
        this.usuario = arregloLS[0]
      } else {
        this.desloguear()
      }

    }
  }

  habilitarLogin() {
    this.loginProgress = true

  }

  desloguear() {
    this.hayUsuario = false
    this.esAdmin = false
    this.habilitar = false
    localStorage.removeItem("hayUsuario");
    this.dataService.limpiar();
    this.dataService.actualizarEstadoLogin(false)
  }

  cerrarLogin() {
    this.loginUsr.patchValue({
      usuario: '',
      contrasena: ''
    })
    this.loginUsr.markAsPristine()
    this.loginUsr.markAsUntouched()
    this.loginProgress = false
    this.dataService.resetLoginProgress();
  }

  irALogin() {
    this.login = true
  }

  irARegistro() {
    this.login = false
  }

  getUsuarios() {
    this._usuarioService.getUsers().subscribe(doc => {
      this.listUsuario = []
      doc.forEach((element: any) => {
        // this.listUsuario.push(element)
        this.listUsuario.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
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
          ...element.payload.doc.data()
        })
      })
    })
  }

  ingresoUsr() {
    let arregloLS = []
    this.usuario = this.loginUsr.get('usuario').value
    this.contrasena = this.loginUsr.get('contrasena').value

    for (let j = 0; j < this.listUsuario.length; j++) {
      if ((this.usuario == null) || (this.contrasena == "")) {
        this._mensaje.snackBar("Los campos usuario y contraseña son obligatorios", "red")
      }
      else
        if (this.listUsuario[j].dni != this.usuario || this.listUsuario[j].password != this.contrasena) {
          this._mensaje.snackBar("Error de usuario o contraseña", "red")
        }

      if (this.listUsuario[j].dni == this.usuario) {
        if (this.listUsuario[j].password === this.contrasena) {

          if (this.contrasena === 'MTInformatica1') {
            //Habilitar el cambio
            this._mensaje.snackBar("Debes cambiar la contraseña", "red")
            console.log(`usuario. ${JSON.stringify(this.listUsuario[j])}`)
            this.actualizarPass = true
            this.usuarioSoporte = this.listUsuario[j]
          }
          else {
            this._mensaje.snackBar(`Bienvenido/a, ${this.listUsuario[j].apellido.charAt(0).toLocaleUpperCase()+this.listUsuario[j].apellido.slice(1)} ${this.listUsuario[j].nombre.charAt(0).toLocaleUpperCase()+this.listUsuario[j].nombre.slice(1)}!`, "green")
            this.hayUsuario = true
            this.habilitar = true
            this.nombre = this.listUsuario[j].nombre
            this.apellido = this.listUsuario[j].apellido
            this.celular = this.listUsuario[j].celular
            arregloLS.push(this.usuario)
            j = this.listUsuario.length
            this.dataService.actualizarEstadoLogin(true)
            //reemplazar por los DNI de Mariano u Natalia
            if ((this.usuario == 29560560) || (this.usuario == 29560560)) {
              this.esAdmin = true
              this._usuarioService.setAdminStatus(true)
              arregloLS.push("true")
            } else {
              arregloLS.push("false")
            }
            this.loginProgress = false
            this.dataService.resetLoginProgress();
            this.loginUsr.reset()
            let fecha = new Date()
            arregloLS.push(fecha)
            localStorage.setItem("hayUsuario", JSON.stringify(arregloLS));
          }
        }
      }
    }
  }

  actualizarUsr(elUsuario) {
    let unUsuario = this.updateUsr.get('usuario').value
    let unContrasena = this.updateUsr.get('contrasenaOld').value
    let unPassNew = this.updateUsr.get('contrasenaNew').value
    let uncheckPass = this.updateUsr.get('contrasenaNewFactor').value
    if (unContrasena != 'MTInformatica1') {
      this._mensaje.snackBar("Clave actual incorrecta", "red")
    } else {
      if (unPassNew != uncheckPass) {
        this._mensaje.snackBar("Clave nueva no coincidente con verificación", "red")
      } else {
        this.usuarioSoporte.password = unPassNew
        this._usuarioService.updateUsr(this.usuarioSoporte.id, this.usuarioSoporte)
        this._mensaje.snackBar("Usuario actualizado", "green")
        this.actualizarPass = false
      }

    }
  }

  cerrarUpdate() {
    this.actualizarPass = false
  }

  solicitarAlta() {
    let dniSolicitud = this.formRegistro.get('dni').value;
    let resultado = "x"

    //Chequeamos si es un usuario registrado
    for (let j = 0; j < this.listUsuario.length; j++) {
      if (this.listUsuario[j].dni == dniSolicitud) {
        resultado = "El DNI ya está asociado a un cliente"
        j = this.listUsuario.length
      }
    }
    //Chequeamos si existe una solicitud pendiente con ese DNI
    if (resultado === "x") {
      for (let j = 0; j < this.usuariosRegistrados.length; j++) {
        if (this.usuariosRegistrados[j].dni == dniSolicitud) {
          resultado = "Ya existe una solicitud pendiente con este DNI"
          j = this.usuariosRegistrados.length
        }
      }
    }
    if (resultado === "x") {
      const unaSolicitud: Usuario = {
        nombre: this.formRegistro.get('nombre').value,
        apellido: this.formRegistro.get('apellido').value,
        dni: this.formRegistro.get('dni').value,
        celular: this.formRegistro.get('telefono').value,
        mail: this.formRegistro.get('mail').value,
        domicilio: this.formRegistro.get('domicilio').value,
        password: this.formRegistro.get('contrasena').value,
        provincia: this.formRegistro.get('provincia').value,
        localidad: this.formRegistro.get('localidad').value,
        codigoPostal: this.formRegistro.get('codigoPostal').value,
        observaciones: this.formRegistro.get('observaciones').value,
        estadoFiscal: this.formRegistro.get('estadoFiscal').value,
      }
      const formData: any = this.formRegistro.value
      const formUrl = 'https://formspree.io/f/maygvrgw'
      this._mailService.sendMails(formUrl, formData)
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
      this.loginProgress = false
      this.dataService.resetLoginProgress();
      this.login = true

    } else {
      //Dar aviso correspondiente por falla
      console.log(resultado)
    }
  }


}
