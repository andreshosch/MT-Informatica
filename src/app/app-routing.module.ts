import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexComponent } from './components/index/index.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { GestionPedidosComponent } from './components/gestion-pedidos/gestion-pedidos.component';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'contacto',component:ContactoComponent},
  {path: 'gestion', component:GestionProductosComponent },
  {path: 'gestionUsr', component: GestionUsuariosComponent }, 
  {path: 'gestionPedido', component: GestionPedidosComponent }  
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
