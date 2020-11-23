import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroesComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should remove a hero', () => {
    
  //   const spyDelete = spyOn(component, 'delete');
  //   const compiled = fixture.debugElement.nativeElement;
  //   fixture.detectChanges();
  //   const deleteButton = compiled.querySelector('.button')
  //   console.log(deleteButton)
  //   deleteButton.click()
  //   expect(spyDelete).toHaveBeenCalledTimes(1)
  // });

  it('should call add() method ', () => {
    
    const spyAdd = spyOn(component, 'add');
    const compiled = fixture.nativeElement;
    const addButton = compiled.querySelector('button')
    addButton.click()
    expect(spyAdd).toHaveBeenCalledTimes(1)
  })

  
});
