import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
interface HookahProduct {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroSectionComponent,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  products: HookahProduct[] = [
    {
      id: 1,
      title: 'Blue Hookah with silver',
      description:
        'The Best Hookah at Unbeatable Prices with some gold touches',
      imageUrl: 'assets/images/pngwing-com-3-116.png',
      featured: true,
    },
    {
      id: 2,
      title: 'Blue Hookah with silver',
      description:
        'The Best Hookah at Unbeatable Prices with some gold touches',
      imageUrl: 'assets/images/pngwing-com-3-116.png',
      featured: true,
    },
    {
      id: 3,
      title: 'Blue Hookah with silver',
      description:
        'The Best Hookah at Unbeatable Prices with some gold touches',
      imageUrl: 'assets/images/pngwing-com-3-116.png',
      featured: true,
    },
    {
      id: 4,
      title: 'Blue Hookah with silver',
      description:
        'The Best Hookah at Unbeatable Prices with some gold touches',
      imageUrl: 'assets/images/pngwing-com-3-116.png',
      featured: true,
    },
  ];

  expandedIndex = -1;
}
