import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { IndexComponent } from './components/index/index.component';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'contacto',component:ContactoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
