import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { AddEdit } from './addedit';

describe('AddEdit', () => {
  let component: AddEdit;
  let fixture: ComponentFixture<AddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEdit],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: null } // Mock route params for new user mode
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
