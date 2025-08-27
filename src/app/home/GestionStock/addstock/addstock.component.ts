import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Stock } from 'src/app/model/Stock';

@Component({
  selector: 'app-addstock',
  templateUrl: './addstock.component.html',
  styleUrls: ['./addstock.component.css']
})
export class AddstockComponent {
    stockForm!: FormGroup;   // <-- 加 ! 即可
stocks!:any[];
    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
      this.stockForm = this.fb.group({
        nom: [''],
        description: [''],
        reference: [''],
        quantite_disponible: [''],
        date_ajout: [''],
        seuil_minimum: [''],
        fournisseur_id: ['']
      });
    }

    onSubmit() {
      if (this.stockForm.valid) {
        const newStock: Stock = this.stockForm.value;
        console.log('Stock à ajouter:', newStock);
      }
    }

    onCancel() {
      this.stockForm.reset();
    }
  }
