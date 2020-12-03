import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from '../hero.service';
import { HEROES } from '../mock-heroes';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Hero } from '../hero';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  const testHero: Hero = HEROES[0]
  const heroesService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj('HeroService', ['getHero', 'deleteHero', 'addHero', 'updateHero']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroDetailComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FormsModule],
      providers: [{provide: HeroService, useValue: heroesService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    heroesService.getHero.and.callFake(() => {
      return of(testHero)
    })
    heroesService.updateHero.and.callFake(() => {
      return of(testHero)
    })
    fixture.detectChanges(); 

  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component).toBeDefined()
  });

  it('should call goBack()', () => {
    const buttonBack = fixture.nativeElement.querySelectorAll('button')[0]
    const spyGoBack = spyOn(component, 'goBack').and.callThrough()
    buttonBack.click()
    expect(spyGoBack).toHaveBeenCalledTimes(1)
  })

  it('should call updateHero() from heroService', () => {
    const compiled = fixture.nativeElement;
    const buttonSave = compiled.querySelectorAll('button')[1]
    const spyUpdate = spyOn(component, 'save').and.callThrough()
    buttonSave.click()
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })
});
