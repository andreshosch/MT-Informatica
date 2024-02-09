import { Component } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent {

  mostrarVideo = true;
  mostrarFoto = false;

  ngOnInit(): void {
    // Esperar un segundo antes de reproducir el video automáticamente
    setTimeout(() => {
      const video = document.getElementById('miVideo') as HTMLVideoElement;
      if (video) {
        video.play();
      }
    }, 1000);
  }

  finalizarVideo(): void {
    // Cuando el video termina, mostrar la foto y ocultar el video
    this.mostrarVideo = false;
    this.mostrarFoto = true;
  }


}
