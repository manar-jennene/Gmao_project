import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Statut } from 'src/app/model/Statut';

@Component({
  selector: 'app-detailstatut',
  templateUrl: './detailstatut.component.html',
  styleUrls: ['./detailstatut.component.css']
})
export class DetailstatutComponent {
  @Input() statut?: Statut;
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
