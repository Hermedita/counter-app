import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import {IonAlert, IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList,IonNote, IonSearchbar, IonSelect, IonSelectOption, IonSpinner, 
  IonTitle, IonToast, IonToolbar,} from '@ionic/angular';
import { CounterService } from '../services/counter.service';
import type {OverlayEventDetail} from '@ionic/core';
import { SavedCounter } from '../models/saved-counter';

export type SortOption = 'nejnovejsi' | 'nejstarsi' | 'nazev' | 'nejvetsiHodnota'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [ DatePipe, DecimalPipe, IonAlert, IonButton, IonContent, IonHeader, IonItem, IonLabel,
    IonList, IonNote, IonSearchbar, IonSelect, IonSelectOption, IonSpinner,
    IonTitle, IonToast, IonToolbar]
  ,})

export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  readonly seradit = signal<SortOption>('nejnovejsi');
  readonly vyhledani = signal('');
  readonly vymazatOpen = signal(false);
  readonly toastOpen = signal(false);

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
  }

  //1) zobrazit součet hodnot všech uložených počítadel
  readonly celkem = computed(()=>
    this.counterService.counters().reduce((num,saved) => num + saved.value, 0),
  );

  //BONUS A: zobrazit průměr hodnot uložených počítadel
  readonly prumer = computed(() => {
    const pocitadla = this.counterService.counters();
    // length === 0 (nedelit nulou)
    return pocitadla.length === 0 ? 0 : this.celkem() / pocitadla.length;
  });

  //3) umožnit vyhledávání podle názvu
  readonly filtrovane = computed(() => {
    const termin = this.vyhledani().trim().toLowerCase();
    return this.counterService.counters().filter((c) => c.name.toLowerCase().includes(termin));
  });  

  //2) umožnit řazení historie 
  readonly viditelne = computed(() =>
    [...this.filtrovane()].sort((a,b) => {
      switch (this.seradit()){
        case 'nejstarsi':
          return a.createdAt.localeCompare(b.createdAt);
        case 'nazev':
          return a.name.localeCompare(b.name, 'cs');
        case 'nejvetsiHodnota':
          return b.value - a.value;
        default: //nejnovejsi
          return b.createdAt.localeCompare(a.createdAt);
      }
    }),
  );

  //4) před vymazáním celé historie zobrazit potvrzovací ion-alert
  readonly alertButtons = [
    {text: 'Zrušit', role: 'cancel'},
    {text: 'Vymazat', role: 'confirm'}
  ];

  vymazat(): void{
    this.vymazatOpen.set(true);
  }

  async poZavreniAlertu(event: CustomEvent<OverlayEventDetail>): Promise<void> {
    this.vymazatOpen.set(false);
    if (event.detail.role === 'confirm') {
      await this.clear();
    }
  }

  //5) po úspěšném uložení nebo odstranění záznamu zobrazit ion-toast
  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    this.toastOpen.set(true);
  }
  async poUlozeni(counter: SavedCounter): Promise<void> {
    await this.counterService.add(counter);
    this.toastOpen.set(true);
  }

}
