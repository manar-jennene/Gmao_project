import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StockserviceService } from 'src/app/services/stockservice.service';

@Component({
  selector: 'app-affiche-stock',
  templateUrl: './affiche-stock.component.html',
  styleUrls: ['./affiche-stock.component.css']
})
export class AfficheStockComponent implements OnInit, AfterViewInit {
  showIA = false;
  predictions: any[] = [];
  alertMessage = '';
  minPrediction: number = 0;

  // 🆕 Ajout de la propriété pour les produits en alerte
  produitsAlertes: any[] = [];

  constructor(private stockService: StockserviceService) {}

  ngOnInit(): void {
    Chart.register(...registerables);

    const stockId = 1;
    this.stockService.getForecast(stockId).subscribe(
      (res: any) => {
        this.predictions = res;
        this.checkAlerts();
        if (this.showIA) {
          setTimeout(() => this.renderChart(), 0);
        }
      },
      err => {
        console.error('Erreur récupération forecast', err);
      }
    );

    // 🆕 Récupération (ou mock) des produits en alerte
    this.loadProduitsAlertes();
  }

  // 🆕 Exemple de fonction pour charger les produits
  loadProduitsAlertes(): void {
    // Si ton service a une méthode dédiée :
    // this.stockService.getProduitsAlertes().subscribe((data: any[]) => {
    //   this.produitsAlertes = data;
    // });

    // Sinon, tu peux temporairement simuler :
    this.produitsAlertes = [
      { reference: 'Ph-001', nom: 'Pompe', seuil: 9, quantite: 0 },
      { reference: 'rf002', nom: 'Filtres', seuil: 3, quantite: 0 }
    ];
  }

  ngAfterViewInit(): void {
    if (this.predictions.length > 0) {
      this.renderChart();
    }
  }

  checkAlerts() {
    const threshold = 5;
    const alert = this.predictions.find(p => p.yhat < threshold);
    this.minPrediction = this.predictions.length > 0 ? Math.min(...this.predictions.map(p => p.yhat)) : 0;
    if (alert) {
      this.alertMessage = `⚠ Attention : Stock prévu à ${alert.yhat.toFixed(2)} le ${alert.ds}`;
    }
  }

  renderChart() {
    if (!this.predictions || this.predictions.length === 0) return;

    const labels = this.predictions.map(p => p.ds);
    const data = this.predictions.map(p => p.yhat);

    new Chart("predictionChart", {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Prévision Stock',
          data,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76,175,80,0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Prédictions IA du stock' }
        }
      }
    });
  }

  toggleIA() {
    this.showIA = !this.showIA;
    if (this.showIA) {
      setTimeout(() => this.renderChart(), 0);
    }
  }
}
