import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  const counterServiceMock = {
    add: vi.fn().mockResolvedValue(undefined),
  };

  const saved: SavedCounter = {
    id: 'first',
    name: 'První',
    value: 1,
    createdAt: '2026-09-17T08:00:00.000Z',
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [{provide: CounterService, 
        useValue: counterServiceMock}],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
/*
  it('should add the newest saved counter to the beginning', () => {
    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
    };
    const second: SavedCounter = {
      id: 'second',
      name: 'Druhé',
      value: 2,
    };

    component.onSaved(first);
    component.onSaved(second);

    expect(component.savedCounters).toEqual([second, first]);
  });
  */
 it('should pass the saved counter to CounterService.add()',async() => {
  await component.poUlozeni(saved);

  expect(counterServiceMock.add).toHaveBeenCalledTimes(1);
  expect(counterServiceMock.add).toHaveBeenCalledWith(saved);
 });
}); 