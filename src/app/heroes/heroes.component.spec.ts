import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';
import { Hero } from '../hero'

import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  const testHeroes = HEROES
  const heroToDelete = testHeroes[0]
  const heroToAdd = "ShibaMan"
  const heroesService = jasmine.createSpyObj('HeroService', ['getHeroes', 'deleteHero', 'addHero']);
  const getHeroes = heroesService.getHeroes.and.returnValue(of(testHeroes));


  beforeEach(async () => {
    
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

  it('should call delete() method and remove a hero', () => {
    const numberOfHeroes = component.heroes.length
    const spyDelete = spyOn(component, 'delete').and.callThrough(); 
    heroesService.deleteHero.and.callFake(() => {
      return of(heroToDelete);
    })
    const deleteButton = fixture.debugElement.queryAll(By.css('.delete'))[0];
    deleteButton.triggerEventHandler('click', null)
    fixture.detectChanges()
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(component.heroes.length).toEqual(numberOfHeroes - 1)
  });
 

  it('should call add() method and add a hero', () => {

    const numberOfHeroes = component.heroes.length
    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input')
    input.value = heroToAdd
    input.dispatchEvent(new Event('input'))

    const spyAdd = spyOn(component, 'add').and.callThrough();

    heroesService.addHero.and.callFake(() => {
      return of(heroToAdd);}) // Just to pass the subscribe
    
    const addButton = compiled.querySelector('button')
    addButton.click()
    expect(spyAdd).toHaveBeenCalledTimes(1)
    expect(component.heroes.length).toEqual(numberOfHeroes + 1)
  })

  it('should do nothing if name parameter in add() is empty', () => {
    const numberOfHeroes = component.heroes.length
    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input')
    input.value = ''
    input.dispatchEvent(new Event('input'))
    const spyAdd = spyOn(component, 'add').and.callThrough();
    const addButton = compiled.querySelector('button')
    addButton.click()
    expect(spyAdd).toHaveBeenCalledTimes(1)
    expect(component.heroes.length).toEqual(numberOfHeroes)
  })


});
