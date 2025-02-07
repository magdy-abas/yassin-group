import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  testimonials = [
    {
      name: 'Magdi Abas',
      image: 'assets/images/customer1.jpg',
      feedback:
        "I have been using the hookah glass from this company for several months, and I am truly satisfied with its quality. The glass is durable, doesn't easily warp with heat.",
    },
    {
      name: 'Ahmed Elsayed',
      image: 'assets/images/customer2.jpg',
      feedback:
        'The customer service was excellent, and I received my order quickly. The product was exactly as expected. The glass is smooth and flawless, and I haven’t had any issues during use.',
    },
    {
      name: 'Maged Ayman',
      image: 'assets/images/customer3.jpg',
      feedback:
        'I loved the variety of designs this company offers; each piece reflects a unique and exquisite taste. I will definitely continue purchasing your products.',
    },
  ];
  expandedIndex = -1;
}
