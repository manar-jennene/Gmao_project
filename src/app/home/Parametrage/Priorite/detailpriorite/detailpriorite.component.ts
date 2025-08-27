import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Priorite } from 'src/app/model/Priorite';

@Component({
  selector: 'app-detailpriorite',
  templateUrl: './detailpriorite.component.html',
  styleUrls: ['./detailpriorite.component.css']
})
export class DetailprioriteComponent {
   @Input() priorite?: Priorite;
    @Output() onClose = new EventEmitter<void>();
  
    close() {
      this.onClose.emit();
    }

}
