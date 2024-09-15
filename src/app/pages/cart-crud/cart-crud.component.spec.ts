import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCrudComponent } from './cart-crud.component';

describe('CartCrudComponent', () => {
  let component: CartCrudComponent;
  let fixture: ComponentFixture<CartCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
