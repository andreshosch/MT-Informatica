import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexComponent } from './components/index/index.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { GestionPedidosComponent } from './components/gestion-pedidos/gestion-pedidos.component';
import { GestionPagoComponent } from './components/gestion-pago/gestion-pago.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { ServiciosComponent } from './components/servicios/servicios.component';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'contacto',component:ContactoComponent},
  {path: 'gestionProducto', component:GestionProductosComponent },
  {path: 'gestionUsr', component: GestionUsuariosComponent }, 
  {path: 'gestionPedido', component: GestionPedidosComponent },
  {path: 'gestionPago', component: GestionPagoComponent },  
  {path: 'nosotros', component: NosotrosComponent },
  {path: 'servicios', component: ServiciosComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
