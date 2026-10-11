import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { TabsPage } from './tabs.page';

describe('TabsPage',()=>{
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async ()=>{
    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',()=> {
    expect(component).toBeTruthy();
  });
  /*
  it('should increment the counter', () => {
    component.increment();

    expect(component.count).toBe(1);
  });

  it('should decrement but never go below zero', () => {
    component.decrement();
    expect(component.count).toBe(0);

    component.count = 2;
    component.decrement();
    expect(component.count).toBe(1);
  });

  it('should reset the counter and update the template', () => {
    component.count = 5;
    component.reset();
    fixture.detectChanges();

    const value = fixture.nativeElement.querySelector(
      '.counter-value',
    ) as HTMLElement;

    expect(component.count).toBe(0);
    expect(value.textContent?.trim()).toBe('0');
  }); */
});
