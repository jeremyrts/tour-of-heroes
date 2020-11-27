import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';

import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;


  beforeEach(async () => {
    const testHeroes = HEROES
    const heroToDelete = testHeroes[0]
    const heroesService = jasmine.createSpyObj('HeroService', ['getHeroes']);
    const getHeroes = heroesService.getHeroes.and.returnValue(of(testHeroes));
    await TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [{provide: HeroService, useValue: heroesService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call getHeroes()', () => {
    const spyGetHeroes = spyOn(component, 'getHeroes').and.callThrough();
    component.ngOnInit()
    fixture.detectChanges()
    expect(spyGetHeroes).toHaveBeenCalledTimes(1)
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove a hero method', () => {
    fixture.detectChanges()
    const spyDelete = spyOn(component, 'delete'); 
    const listHeroes = fixture.debugElement.queryAll(By.css('li'));
    const deleteButton = fixture.debugElement.queryAll(By.css('.delete'))[0];
    deleteButton.triggerEventHandler('click', null)
    const newlistHeroes = fixture.debugElement.queryAll(By.css('li'));
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(newlistHeroes.length).toEqual(listHeroes.length - 1)
  });


  it('should call add() method ', () => {

    const spyAdd = spyOn(component, 'add');
    const compiled = fixture.nativeElement;
    const addButton = compiled.querySelector('button')
    addButton.click()
    expect(spyAdd).toHaveBeenCalledTimes(1)
  })


});
