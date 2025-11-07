import { Component, OnInit } from '@angular/core';
import { StockserviceService } from 'src/app/services/stockservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParametrageService } from 'src/app/services/parametrage.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-liste-stock',
  templateUrl: './liste-stock.component.html',
  styleUrls: ['./liste-stock.component.css']
})
export class ListeStockComponent implements OnInit {

  stocks: any[] = [];
  paginatedStocks: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  showAddModal: boolean = false;
  stockForm!: FormGroup;

  categories: any[] = [];
  fournisseurs: any[] = [];
  deleteStockId: number | null = null;
  showDeleteModal: boolean = false;

  editingStockId: number | null = null;

  constructor(
    private stockservice: StockserviceService,
    private fb: FormBuilder,
    private parametrageservice: ParametrageService,
    private userservice: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStocks();
    this.loadCategories();     // ✅ ajout ()
    this.loadFournisseurs();   // ✅ ajout ()
  }

  initForm() {
    this.stockForm = this.fb.group({
      nom: ['', Validators.required],
      reference: ['', Validators.required],
      description: [''],
      quantite_disponible: [0, Validators.required],
      seuil_minimum: [0, Validators.required],
      categorie_id: [null],
      fournisseur_id: [null],
      created_at: ['', Validators.required]
    });
  }

  loadStocks(): void {
    this.stockservice.getStocks().subscribe({
      next: (data) => {
        this.stocks = data;
        this.totalPages = Math.ceil(this.stocks.length / this.itemsPerPage);
        this.updatePage();
      },
      error: (err) => console.error(err)
    });
  }

  loadCategories(): void {
    this.parametrageservice.getCategorie().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  loadFournisseurs(): void {
    this.userservice.getAlluseer().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => console.error('Erreur chargement fournisseurs :', err)
    });
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedStocks = this.stocks.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePage();
    }
  }

  editStock(stock: any) {
    this.stockForm.patchValue({
      nom: stock.nom,
      reference: stock.reference,
      description: stock.description,
      quantite_disponible: stock.quantite_disponible,
      seuil_minimum: stock.seuil_minimum,
      categorie_id: stock.categorie_id,
      fournisseur_id: stock.fournisseur_id,
      created_at: stock.created_at.substring(0, 10)
    });
    this.showAddModal = true;
    this.editingStockId = stock.id;
  }

  confirmDelete(stock: any) {
    this.deleteStockId = stock.id;
    this.showDeleteModal = true;
  }

  deleteStockConfirmed() {
    if (this.deleteStockId) {
      this.stockservice.deleteStock(this.deleteStockId).subscribe({
        next: () => {
          this.stocks = this.stocks.filter(s => s.id !== this.deleteStockId);
          this.totalPages = Math.ceil(this.stocks.length / this.itemsPerPage);
          this.updatePage();
          this.showDeleteModal = false;
          this.deleteStockId = null;
        },
        error: (err) => console.error(err)
      });
    }
  }

  onSubmit(): void {
    if (this.stockForm.valid) {
      if (this.editingStockId) {
        this.stockservice.updateStock(this.editingStockId, this.stockForm.value).subscribe({
          next: (res) => {
            const index = this.stocks.findIndex(s => s.id === this.editingStockId);
            this.stocks[index] = res;
            this.updatePage();
            this.showAddModal = false;
            this.stockForm.reset();
            this.editingStockId = null;
          }
        });
      } else {
        this.stockservice.addStock(this.stockForm.value).subscribe({
          next: (res) => {
            this.stocks.push(res);
            this.totalPages = Math.ceil(this.stocks.length / this.itemsPerPage);
            this.updatePage();
            this.showAddModal = false;
            this.stockForm.reset();
          }
        });
      }
    }
  }

}
