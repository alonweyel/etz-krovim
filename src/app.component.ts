import { Component, signal, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FamilyTreeComponent } from './components/family-tree/family-tree.component';
import { FamilyMember, FAMILY_DATA, MALE_ONLY_DATA } from './data/mock-data';
import { FamilyService } from './services/family.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FamilyTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  private familyService = inject(FamilyService);
  
  currentData = signal<FamilyMember | null>(null);
  searchedTz = signal<string | null>(null);
  viewMode = signal<'all' | 'males'>('all');
  isLoading = signal(false);
  
  searchControl = new FormControl('');

  onSearch() {
    const tz = this.searchControl.value?.trim();
    if (!tz) return;

    this.isLoading.set(true);
    // פנייה לשרת החיצוני (כרגע מוקינג)
    this.familyService.getFamilyTreeByTz(tz).subscribe({
      next: (data) => {
        this.currentData.set(data);
        this.searchedTz.set(tz);
        this.viewMode.set('all');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('שגיאה בשליפת נתונים', err);
        this.isLoading.set(false);
      }
    });
  }

  switchData(mode: 'all' | 'males') {
    this.viewMode.set(mode);
    if (mode === 'all') {
      this.currentData.set(FAMILY_DATA);
    } else {
      this.currentData.set(MALE_ONLY_DATA);
    }
  }
}