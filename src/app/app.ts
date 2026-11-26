import { Component } from '@angular/core';
import { Quiz } from './quiz/quiz';

@Component({
  selector: 'app-root',
  imports: [Quiz],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
