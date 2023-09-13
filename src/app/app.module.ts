import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from './environment/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { DatePipe } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    FooterComponent,
    NavbarComponent,
    OfertasCalientesComponent,
    ProductosComponent,
    ContactoComponent,
    IndexComponent,
    GestionProductosComponent,
    LoginyregistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  exports: [
    AngularFireModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    // DatePipe,
    // { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    // { provide: LOCALE_ID, useValue: 'es-ES' },
    // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
