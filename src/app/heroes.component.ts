import { Component, OnInit } from '@angular/core';

import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
 selector: 'my-heroes',
 template: `
   <h2>My Heroes</h2>
   <ul class="heroes">
     <li *ngFor="let hero of heroes"
       [class.selected]="hero === selectedHero"
       (click)="onSelect(hero)">
       <span class="badge">{{hero.id}}</span> {{hero.name}}
     </li>
   </ul>
   <hero-detail [hero]="selectedHero"></hero-detail>
 `,
 styles: [`
   .selected {
     background-color: #CFD8DC !important;
     color: white;
   }
   .heroes {
     list-style-type: none;
     padding: 0;
     width: 15em;
     width: 100%;
   }
   .heroes li {
     cursor: pointer;
     background-color: #EEE;
     height: 40px;
     border-radius: 4px;
     margin: 0.5em 0;
   }
   .heroes .text {
     position: relative;
     top: -3px;
   }
   .heroes .badge {
     display: inline-block;
     font-size: small;
     color: white;
     background-color: #607D8B;
     width:40px;
     line-height: 40px;
     height: 40px;
     border-radius: 4px 0 0 4px;
     text-align: center;
   }
 `],
})
export class HeroesComponent implements OnInit {
 heroes: Hero[];
 selectedHero: Hero;

 constructor(private heroService: HeroService) { }

 getHeroes(): void {
   this.heroService.getHeroes().then(heroes => this.heroes = heroes);
 }

 ngOnInit(): void {
   this.getHeroes();
 }

 onSelect(hero: Hero): void {
   this.selectedHero = hero;
 }
}