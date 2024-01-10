import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductosComponent } from './components/productos/productos.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexComponent } from './components/index/index.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environment/environment'
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {MatTabsModule} from '@angular/material/tabs';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { GestionPedidosComponent } from './components/gestion-pedidos/gestion-pedidos.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SpinnerComponent } from './components/spinner/spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GestionPagoComponent } from './components/gestion-pago/gestion-pago.component';


@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    FooterComponent,
    NavbarComponent,
    ProductosComponent,
    ContactoComponent,
    IndexComponent,
    GestionProductosComponent,
    GestionUsuariosComponent,
    LoginComponent,
    CarritoComponent,
    GestionPedidosComponent,
    SpinnerComponent,
    GestionPagoComponent,
   
    
    
    
    
   
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
    BrowserAnimationsModule,
    FormsModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    
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
