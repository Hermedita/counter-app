import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from './counter.service';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('CounterService', () => {
  let service: CounterService;
  let errorSpyOn: MockInstance;

  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);
  const removeMock = vi.mocked(Preferences.remove);

  const first: SavedCounter = {
    id: 'first',
    name: 'První',
    value: 1,
    createdAt: '2026-09-17T08:00:00.000Z',
  };

  const second: SavedCounter = {
    id: 'second',
    name: 'Druhé',
    value: 2,
    createdAt: '2026-09-17T09:00:00.000Z',
  };

  beforeEach(() => {
    // Vynulujeme počty volání mocků z předchozího testu.
    vi.clearAllMocks();
    errorSpyOn = vi.spyOn(console,'error').mockImplementation(() => {});

    // Výchozí stav: v Preferences zatím není uložená historie.
    getMock.mockResolvedValue({ value: null });

    // Zápis i odstranění ve výchozím stavu úspěšně skončí.
    setMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);

    // Pro každý test vytvoříme nové prostředí Angular dependency injection.
    TestBed.configureTestingModule({
      providers: [CounterService],
    });

    // Z testovacího injectoru získáme čerstvou instanci služby.
    service = TestBed.inject(CounterService);
  });

  afterEach(() => {
    errorSpyOn.mockRestore();
  });

  it('should initialize only once', async () => {
    // Dvě volání bez čekání simulují souběžné požadavky na inicializaci.
    await Promise.all([service.initialize(), service.initialize()]);

    // Další volání proběhne až po dokončení první inicializace.
    await service.initialize();

    // Všechna volání musí sdílet jedinou operaci načtení Preferences.
    expect(getMock).toHaveBeenCalledTimes(1);

    // Služba dokončila inicializaci a při value: null má prázdnou historii.
    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
  });

  ////////////////////////////////////////////////////
  //TODO: 1) Načtení uložených dat – JSON obsahující pole SavedCounter se po initialize() objeví v counters().
  it('should load saved counters after initialization', async() => {
    getMock.mockResolvedValue({value: JSON.stringify([first,second])});
    await service.initialize();

    expect(getMock).toHaveBeenCalledWith({key: 'saved-counters'});
    expect(service.counters()).toEqual([first, second]);
    expect(service.initialized()).toBe(true);
  });

  //TODO: 2) Přidání záznamu – add() vloží nový záznam na začátek a zavolá Preferences.set() se správným klíčem a JSON hodnotou.
  it('should add new item to the beginning and call preferences.set() with the correct credentials', async() => {
    getMock.mockResolvedValue({value: JSON.stringify([first])});
    await service.initialize();
    await service.add(second);

    const call = setMock.mock.calls[0][0];

    expect(service.counters()).toEqual([second,first]);
    expect(setMock).toHaveBeenCalledTimes(1);
    expect(call.key).toBe('saved-counters');
    expect(JSON.parse(call.value)).toEqual([second,first]);
  });

  //TODO: 3) Odstranění jednoho záznamu – remove(id) odstraní pouze odpovídající objekt a nový stav uloží.
  it('should delete only one item', async() => {
    getMock.mockResolvedValue({value: JSON.stringify([first,second])});
    await service.initialize();
    await service.remove('first');

    const call = setMock.mock.calls[0][0];

    expect(service.counters()).toEqual([second]);
    expect(setMock).toHaveBeenCalledTimes(1);
    expect(call.key).toBe('saved-counters');
    expect(JSON.parse(call.value)).toEqual([second]);
  });

  //TODO: 4) Vymazání historie – clear() vyprázdní signal a zavolá Preferences.remove() pouze pro klíč saved-counters.
  it('should remove history', async() => {
    getMock.mockResolvedValue({value: JSON.stringify([first,second])});
    await service.initialize(); 
    await service.clear();

    expect(service.counters()).toEqual([]);
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith({key: 'saved-counters'})
  });

  //TODO: 5) Poškozená uložená hodnota – neplatný JSON nezpůsobí pád testu; služba nastaví prázdnou historii, dokončí inicializaci a zapíše chybu do konzole.
  it('should handle corrupted JSON', async() => {
    getMock.mockResolvedValue({value: '{(<>*<*>neplatný džejsn*><*>'});
    await expect(service.initialize()).resolves.toBeUndefined();

    expect(service.counters()).toEqual([]);
    expect(service.initialized()).toBe(true);
    expect(errorSpyOn).toHaveBeenCalled();

    errorSpyOn.mockRestore();
  });

});
