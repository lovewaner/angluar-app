import { Injectable } from '@angular/core';

import { Hero } from './hero';
import { HEROES } from './moke-heros';

@Injectable()

export class HeroService{
    getHeroes(): Promise<Hero[]> {
        return Promise.resolve(HEROES);
    }
}