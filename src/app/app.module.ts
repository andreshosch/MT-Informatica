import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OfertasCalientesComponent } from './components/ofertas-calientes/ofertas-calientes.component';
import { ProductosComponent } from './components/productos/productos.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginyregistroComponent } from './components/loginyregistro/loginyregistro.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexComponent } from './components/index/index.component';

@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    FooterComponent,
    NavbarComponent,
    OfertasCalientesComponent,
    ProductosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
