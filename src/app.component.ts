import { Component, signal, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FamilyTreeComponent } from './components/family-tree/family-tree.component';
import { FamilyMember } from './data/mock-data';
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
  FAMILY_DATA = signal<FamilyMember | null>(null);
  MALE_ONLY_DATA = signal<FamilyMember | null>(null);
  searchedTz = signal<string | null>(null);
  viewMode = signal<'all' | 'males'>('all');
  isLoading = signal(false);
  
  searchControl = new FormControl('');

  onSearch() {
    if(this.searchControl.value?.startsWith('0')){
      this.searchControl.patchValue(this.searchControl.value.substring(1));
    }
    const tz = this.searchControl.value?.trim();
    if (!tz) return;

    this.isLoading.set(true);
    // פנייה לשרת החיצוני (כרגע מוקינג)
    this.familyService.getFamilyTreeByTz(tz).subscribe({
      next: (data) => {
        this.currentData.set(data);
        this.FAMILY_DATA.set(data);
        if(data != null){
          this.MALE_ONLY_DATA.set(filterMalesOnly(data));
        }
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
      this.currentData.set(this.FAMILY_DATA());
    } else {
      this.currentData.set(this.MALE_ONLY_DATA());
    }
  }
}

// Helper function to create male-only tree
function filterMalesOnly(node: FamilyMember): FamilyMember | null {
  if (node.gender !== 'זכר') {
    return null;
  }

  // 1. Filter spouses (remove females)
  const filteredSpouses = node.spouses ? node.spouses.filter(s => s.gender === 'זכר') : [];

  // 2. Filter children recursively
  const filteredChildren = node.children 
      ? node.children
          .map(child => filterMalesOnly(child))
          .filter((child): child is FamilyMember => child !== null)
      : [];

  // 3. Re-assign children ownership
  // If the spouse a child belonged to is removed, assign child to the main father (remove otherParentId)
  // This ensures the visualization correctly attributes these children to the father in the absence of the mother,
  // enabling the collapse/expand toggle button.
  const currentSpouseIds = new Set(filteredSpouses.map(s => s.id));
  
  filteredChildren.forEach(child => {
      // If child has an otherParentId, but that parent is NOT in the current spouses list
      if (child.otherParentId && !currentSpouseIds.has(child.otherParentId)) {
          child.otherParentId = undefined; // Reset ownership to main parent
      }
  });

  const newNode: FamilyMember = {
    ...node,
    spouses: filteredSpouses,
    children: filteredChildren
  };

  return newNode;
}
