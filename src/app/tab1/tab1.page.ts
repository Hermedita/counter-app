import { Component, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonToast } from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CounterComponent, IonContent, IonHeader, IonTitle, IonToolbar, IonToast],
})
export class Tab1Page {
  private readonly counterService = inject(CounterService);
  readonly toastOpen = signal(false);

  //5) po úspěšném uložení nebo odstranění záznamu zobrazit ion-toast
  async poUlozeni(counter: SavedCounter): Promise<void> {
    await this.counterService.add(counter);
    this.toastOpen.set(true);
  }

}