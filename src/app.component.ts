import { Component, signal, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FamilyTreeComponent } from './components/family-tree/family-tree.component';
import { FamilyMember, FamilyMemberDTO } from './data/mock-data';
import { FamilyService } from './services/family.service';
import { buildTreeFromFlat } from './services/tree-builder';

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
  FEMALE_ONLY_DATA = signal<FamilyMember | null>(null);
  searchedTz = signal<string | null>(null);
  viewMode = signal<'all' | 'males' | 'females'>('all');
  isLoading = signal(false);
  
  searchControl = new FormControl('');

  onSearch() {
    if(this.searchControl.value?.length < 9){
      this.searchControl.patchValue(this.searchControl.value?.padStart(9,'0'));
    }
    const tz = this.searchControl.value?.trim();
    if (!tz) return;

    this.isLoading.set(true);
    // פנייה לשרת החיצוני (כרגע מוקינג)
    this.familyService.getFamilyTreeByTz(tz).subscribe({
      next: (data) => {
        let treeData: FamilyMember | null = null;
        if (data && Array.isArray(data)) {
           treeData = buildTreeFromFlat(data, tz);
        } else if (data) {
           treeData = buildTreeFromFlat([data as unknown as FamilyMemberDTO], tz);
        }

        this.currentData.set(treeData);
        this.FAMILY_DATA.set(treeData);
        if(treeData != null){
          this.MALE_ONLY_DATA.set(getMalesOnlyTree(treeData, tz));
          this.FEMALE_ONLY_DATA.set(getFemalesOnlyTree(treeData, tz));
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

  switchData(mode: 'all' | 'males' | 'females') {
    this.viewMode.set(mode);
    if (mode === 'all') {
      this.currentData.set(this.FAMILY_DATA());
    } else if (mode === 'males') {
      this.currentData.set(this.MALE_ONLY_DATA());
    } else {
      this.currentData.set(this.FEMALE_ONLY_DATA());
    }
  }
}

// Helper functions to create male-only tree based on searched TZ
function getMalesOnlyTree(root: FamilyMember, searchedTz: string): FamilyMember | null {
  // 1. Find path to searchedTz
  const path = findPathToTz(root, searchedTz);
  
  if (!path || path.length === 0) {
    // Fallback if not found: just filter from root
    return buildMaleTree(root, searchedTz);
  }

  let rootIndex = path.length - 1;
  const searchedPerson = path[rootIndex];
  
  let isSpouse = false;
  let mainNodeForSpouse: FamilyMember | null = null;

  if (rootIndex > 0) {
    const parent = path[rootIndex - 1];
    if (parent.spouses?.some(s => s.tz?.trim() === searchedTz)) {
      isSpouse = true;
      mainNodeForSpouse = parent;
    }
  }

  if (isSpouse && mainNodeForSpouse) {
    // 1. Check if the spouse has parents (family of origin)
    if (searchedPerson.parents && searchedPerson.parents.length > 0) {
      const maleParent = searchedPerson.parents.find(p => p.gender === 'זכר');
      if (maleParent) {
        let spouseChildren: FamilyMember[] = [];
        // If the spouse is male, get his children from the main tree
        if (searchedPerson.gender === 'זכר') {
           const spouseIndex = mainNodeForSpouse.spouses!.findIndex(s => s.tz?.trim() === searchedTz);
           spouseChildren = mainNodeForSpouse.children?.filter(c => {
               if (c.otherParentId) {
                   return c.otherParentId === searchedPerson.id;
               } else {
                   return spouseIndex === 0;
               }
           }) || [];
        }
        
        const spouseNodeInNewTree: FamilyMember = {
           ...searchedPerson,
           children: spouseChildren
        };
        
        // Clone maleParent to avoid mutating original data
        const clonedMaleParent = { ...maleParent, children: maleParent.children ? [...maleParent.children] : [] };
        
        // Inject searchedPerson if not already in children
        if (!clonedMaleParent.children.some(c => c.id === searchedPerson.id)) {
            clonedMaleParent.children.push(spouseNodeInNewTree);
        } else {
            // Replace the existing one with our enriched one
            clonedMaleParent.children = clonedMaleParent.children.map(c => 
                c.id === searchedPerson.id ? spouseNodeInNewTree : c
            );
        }
        
        return buildMaleTree(clonedMaleParent, searchedTz);
      }
    }

    // 2. Fallback if no parents (or no male parent)
    // אם חיפשנו בת זוג (אישה), נציג רק אותה (ללא ילדים או בני זוג) כי שושלת גברית לא ממשיכה דרך נקבה
    if (searchedPerson.gender === 'נקבה') {
      return {
        ...searchedPerson,
        spouses: [],
        children: []
      };
    }
    // The searched person is a spouse. They are the root of their own male lineage.
    const spouseIndex = mainNodeForSpouse.spouses!.findIndex(s => s.tz?.trim() === searchedTz);
    const spouseChildren = mainNodeForSpouse.children?.filter(c => {
        if (c.otherParentId) {
            return c.otherParentId === searchedPerson.id;
        } else {
            return spouseIndex === 0;
        }
    }) || [];
    
    const spouseRoot: FamilyMember = {
      ...searchedPerson,
      children: spouseChildren
    };
    
    return buildMaleTree(spouseRoot, searchedTz);
  }

  let currentPerson = path[rootIndex];
  
  // 2. Find the oldest male ancestor in the continuous male line
  while (rootIndex > 0) {
    const parent = path[rootIndex - 1];
    if (parent.gender === 'זכר') {
      rootIndex--;
      currentPerson = path[rootIndex];
    } else {
      // parent is female. Does currentPerson have a male father among parent's spouses?
      let fatherSpouse: FamilyMember | undefined;
      let spouseIndex = -1;
      if (currentPerson.otherParentId) {
        spouseIndex = parent.spouses?.findIndex(s => s.id === currentPerson.otherParentId) ?? -1;
      } else {
        spouseIndex = 0;
      }
      
      if (spouseIndex >= 0 && parent.spouses && parent.spouses[spouseIndex].gender === 'זכר') {
        fatherSpouse = parent.spouses[spouseIndex];
      }
      
      if (fatherSpouse) {
        const fatherChildren = parent.children?.filter(c => {
            if (c.otherParentId) {
                return c.otherParentId === fatherSpouse!.id;
            } else {
                return spouseIndex === 0;
            }
        }) || [];
        
        const fatherRoot: FamilyMember = {
          ...fatherSpouse,
          children: fatherChildren
        };
        
        if (fatherSpouse.parents && fatherSpouse.parents.length > 0) {
          const maleParent = fatherSpouse.parents.find(p => p.gender === 'זכר');
          if (maleParent) {
            const clonedMaleParent = { ...maleParent, children: maleParent.children ? [...maleParent.children] : [] };
            if (!clonedMaleParent.children.some(c => c.id === fatherRoot.id)) {
                clonedMaleParent.children.push(fatherRoot);
            } else {
                clonedMaleParent.children = clonedMaleParent.children.map(c => 
                    c.id === fatherRoot.id ? fatherRoot : c
                );
            }
            return buildMaleTree(clonedMaleParent, searchedTz);
          }
        }
        
        return buildMaleTree(fatherRoot, searchedTz);
      } else {
        break;
      }
    }
  }
  
  const newRoot = path[rootIndex];

  // 3. Build the tree from newRoot
  return buildMaleTree(newRoot, searchedTz);
}

function findPathToTz(node: FamilyMember, tz: string, currentPath: FamilyMember[] = []): FamilyMember[] | null {
  const path = [...currentPath, node];
  if (node.tz?.trim() === tz) {
    return path;
  }
  if (node.spouses) {
    for (const spouse of node.spouses) {
      if (spouse.tz?.trim() === tz) {
        return [...path, spouse];
      }
    }
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findPathToTz(child, tz, path);
      if (found) return found;
    }
  }
  return null;
}

function buildMaleTree(node: FamilyMember, searchedTz: string): FamilyMember | null {
  const isSearched = node.tz?.trim() === searchedTz;
  
  if (node.gender !== 'זכר' && !isSearched) {
    return null;
  }

  // אם הגענו לאישה שחיפשנו (שהיא חלק משושלת של אבא), נציג אותה אבל בלי הילדים ובני הזוג שלה
  if (node.gender === 'נקבה' && isSearched) {
    return {
      ...node,
      spouses: [],
      children: []
    };
  }

  const filteredSpouses = node.spouses 
    ? node.spouses.filter(s => s.gender === 'זכר' || s.tz?.trim() === searchedTz) 
    : [];

  const filteredChildren = node.children 
      ? node.children
          .map(child => buildMaleTree(child, searchedTz))
          .filter((child): child is FamilyMember => child !== null)
      : [];

  const currentSpouseIds = new Set(filteredSpouses.map(s => s.id));
  
  filteredChildren.forEach(child => {
      if (child.otherParentId && !currentSpouseIds.has(child.otherParentId)) {
          child.otherParentId = undefined;
      }
  });

  return {
    ...node,
    spouses: filteredSpouses,
    children: filteredChildren
  };
}

// Helper functions to create female-only tree based on searched TZ
function getFemalesOnlyTree(root: FamilyMember, searchedTz: string): FamilyMember | null {
  const path = findPathToTz(root, searchedTz);
  
  if (!path || path.length === 0) {
    return buildFemaleTree(root, searchedTz);
  }

  let rootIndex = path.length - 1;
  const searchedPerson = path[rootIndex];
  
  let isSpouse = false;
  let mainNodeForSpouse: FamilyMember | null = null;

  if (rootIndex > 0) {
    const parent = path[rootIndex - 1];
    if (parent.spouses?.some(s => s.tz?.trim() === searchedTz)) {
      isSpouse = true;
      mainNodeForSpouse = parent;
    }
  }

  if (isSpouse && mainNodeForSpouse) {
    if (searchedPerson.parents && searchedPerson.parents.length > 0) {
      let femaleParent = searchedPerson.parents.find(p => p.gender === 'נקבה');
      
      if (!femaleParent) {
        const maleParent = searchedPerson.parents.find(p => p.gender === 'זכר');
        if (maleParent && maleParent.spouses) {
          const foundSpouse = maleParent.spouses.find(s => s.gender === 'נקבה');
          if (foundSpouse) {
            const motherChildren = maleParent.children?.filter(c => c.otherParentId === foundSpouse.id) || [];
            femaleParent = {
              ...foundSpouse,
              children: motherChildren
            };
          }
        }
      }

      if (femaleParent) {
        let spouseChildren: FamilyMember[] = [];
        if (searchedPerson.gender === 'נקבה') {
           const spouseIndex = mainNodeForSpouse.spouses!.findIndex(s => s.tz?.trim() === searchedTz);
           spouseChildren = mainNodeForSpouse.children?.filter(c => {
               if (c.otherParentId) {
                   return c.otherParentId === searchedPerson.id;
               } else {
                   return spouseIndex === 0;
               }
           }) || [];
        }
        
        const spouseNodeInNewTree: FamilyMember = {
           ...searchedPerson,
           children: spouseChildren
        };
        
        const clonedFemaleParent = { ...femaleParent, children: femaleParent.children ? [...femaleParent.children] : [] };
        
        if (!clonedFemaleParent.children.some(c => c.id === searchedPerson.id)) {
            clonedFemaleParent.children.push(spouseNodeInNewTree);
        } else {
            clonedFemaleParent.children = clonedFemaleParent.children.map(c => 
                c.id === searchedPerson.id ? spouseNodeInNewTree : c
            );
        }
        
        return buildFemaleTree(clonedFemaleParent, searchedTz);
      }
    }

    if (searchedPerson.gender === 'זכר') {
      return {
        ...searchedPerson,
        spouses: [],
        children: []
      };
    }
    
    const spouseIndex = mainNodeForSpouse.spouses!.findIndex(s => s.tz?.trim() === searchedTz);
    const spouseChildren = mainNodeForSpouse.children?.filter(c => {
        if (c.otherParentId) {
            return c.otherParentId === searchedPerson.id;
        } else {
            return spouseIndex === 0;
        }
    }) || [];
    
    const spouseRoot: FamilyMember = {
      ...searchedPerson,
      children: spouseChildren
    };
    
    return buildFemaleTree(spouseRoot, searchedTz);
  }

  let currentPerson = path[rootIndex];

  while (rootIndex > 0) {
    const parent = path[rootIndex - 1];
    if (parent.gender === 'נקבה') {
      rootIndex--;
      currentPerson = path[rootIndex];
    } else {
      // parent is male. Does currentPerson have a female mother among parent's spouses?
      let motherSpouse: FamilyMember | undefined;
      let spouseIndex = -1;
      if (currentPerson.otherParentId) {
        spouseIndex = parent.spouses?.findIndex(s => s.id === currentPerson.otherParentId) ?? -1;
      } else {
        spouseIndex = 0;
      }
      
      if (spouseIndex >= 0 && parent.spouses && parent.spouses[spouseIndex].gender === 'נקבה') {
        motherSpouse = parent.spouses[spouseIndex];
      }
      
      if (motherSpouse) {
        // The mother is a spouse. We construct her node with her children.
        const motherChildren = parent.children?.filter(c => {
            if (c.otherParentId) {
                return c.otherParentId === motherSpouse!.id;
            } else {
                return spouseIndex === 0;
            }
        }) || [];
        
        const motherRoot: FamilyMember = {
          ...motherSpouse,
          children: motherChildren
        };
        
        // Does the mother have parents?
        if (motherSpouse.parents && motherSpouse.parents.length > 0) {
          let femaleParent = motherSpouse.parents.find(p => p.gender === 'נקבה');
          
          if (!femaleParent) {
            const maleParent = motherSpouse.parents.find(p => p.gender === 'זכר');
            if (maleParent && maleParent.spouses) {
              const foundSpouse = maleParent.spouses.find(s => s.gender === 'נקבה');
              if (foundSpouse) {
                const motherChildren = maleParent.children?.filter(c => c.otherParentId === foundSpouse.id) || [];
                femaleParent = {
                  ...foundSpouse,
                  children: motherChildren
                };
              }
            }
          }

          if (femaleParent) {
            const clonedFemaleParent = { ...femaleParent, children: femaleParent.children ? [...femaleParent.children] : [] };
            if (!clonedFemaleParent.children.some(c => c.id === motherRoot.id)) {
                clonedFemaleParent.children.push(motherRoot);
            } else {
                clonedFemaleParent.children = clonedFemaleParent.children.map(c => 
                    c.id === motherRoot.id ? motherRoot : c
                );
            }
            return buildFemaleTree(clonedFemaleParent, searchedTz);
          }
        }
        
        // If no parents, she is the root.
        return buildFemaleTree(motherRoot, searchedTz);
      } else {
        // No female mother found. Stop climbing.
        break;
      }
    }
  }
  
  const newRoot = path[rootIndex];

  return buildFemaleTree(newRoot, searchedTz);
}

function buildFemaleTree(node: FamilyMember, searchedTz: string): FamilyMember | null {
  const isSearched = node.tz?.trim() === searchedTz;
  
  // זכרים קוטעים את השושלת הנקבית - הם מוצגים אבל ללא בני זוג וללא ילדים
  if (node.gender === 'זכר') {
    return {
      ...node,
      spouses: [],
      children: []
    };
  }
  
  const filteredSpouses = node.spouses 
    ? node.spouses.filter(s => s.gender === 'נקבה' || s.tz?.trim() === searchedTz) 
    : [];

  let filteredChildren: FamilyMember[] = [];
  
  if (node.gender === 'נקבה') {
    filteredChildren = node.children 
        ? node.children
            .map(child => buildFemaleTree(child, searchedTz))
            .filter((child): child is FamilyMember => child !== null)
        : [];
  }

  const currentSpouseIds = new Set(filteredSpouses.map(s => s.id));
  
  filteredChildren.forEach(child => {
      if (child.otherParentId && !currentSpouseIds.has(child.otherParentId)) {
          child.otherParentId = undefined;
      }
  });

  return {
    ...node,
    spouses: filteredSpouses,
    children: filteredChildren
  };
}
