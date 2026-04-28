import { Component, ElementRef, ViewChild, AfterViewInit, input, effect, OnDestroy, ViewEncapsulation, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as d3 from 'd3';
import { FamilyMember } from '../../data/mock-data';

// --- ממשקים (Interfaces) ---

// הרחבת הממשק הסטנדרטי של D3 עבור צמתים (Nodes)
// זה מאפשר לנו להוסיף שדות שאינם קיימים בברירת המחדל, כמו מיקום קודם (עבור אנימציות)
interface HierarchyNode extends d3.HierarchyNode<FamilyMember> {
  x0?: number; // מיקום X קודם (לאנימציה)
  y0?: number; // מיקום Y קודם (לאנימציה)
  x?: number;  // מיקום X נוכחי
  y?: number;  // מיקום Y נוכחי
  allChildNodes?: HierarchyNode[]; // רשימת כל הילדים (כולל מוסתרים)
  collapsedSpouseIds?: Set<string>; // סט המכיל מזהים של בני זוג שהילדים שלהם מוסתרים כרגע
}

@Component({
  selector: 'app-family-tree',
  imports: [DatePipe],
  templateUrl: './family-tree.component.html',
  styleUrl: './family-tree.component.scss',
  encapsulation: ViewEncapsulation.None // מאפשר ל-CSS להשפיע על אלמנטים שנוצרים דינמית ע"י D3
})
export class FamilyTreeComponent implements AfterViewInit, OnDestroy {
  // קלט (Input) שמקבל את שורש עץ המשפחה
  rootData = input.required<FamilyMember>();
  
  // תעודת הזהות שחיפשו
  searchedTz = input<string | null>(null);
  
  // סיגנל שמחזיק את האדם שנבחר כרגע (להצגה בסרגל הצד)
  selectedPerson = signal<FamilyMember | null>(null);

  // סט משפחות בני זוג מורחבות
  expandedSpouseFamilies: Set<number> = new Set();
  
  // ספירת הופעות של מזהים כדי לדעת איזה אדם מופיע יותר מפעם אחת
  globalIdCount = new Map<number | string, number>();

  // מטמון לשמירת ההיררכיה של העצים המשניים (כדי לשמור על מצב כיווץ/הרחבה)
  private miniTreeHierarchies = new Map<number, any[]>();

  // חישוב שם האדם שחיפשו
  searchedPersonName = computed(() => {
    const tz = this.searchedTz();
    if (!tz) return null;
    
    // פונקציית עזר לחיפוש בעץ
    const findName = (node: FamilyMember): string | null => {
      if (node.tz?.trim() === tz) return node.name;
      if (node.spouses) {
        for (const spouse of node.spouses) {
          if (spouse.tz?.trim() === tz) return spouse.name;
        }
      }
      if (node.children) {
        for (const child of node.children) {
          const found = findName(child);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findName(this.rootData());
  });

  // גישה לאלמנט ה-DOM שבו נצייר את הגרף
  @ViewChild('chartContainer') private containerRef!: ElementRef<HTMLDivElement>;
  
  // משתני D3 ומשתני מצב פנימיים
  private svg: any;          // אלמנט ה-SVG הראשי
  private g: any;            // קבוצה (Group) ראשית שמכילה את כל הציור (לצורך הזזה וזום)
  private root: any;         // שורש עץ הנתונים המעובד
  private treeLayout: any;   // אלגוריתם סידור העץ של D3
  private zoomBehavior: any; // התנהגות הזום והגרירה
  private width = 0;
  private height = 0;
  private duration = 500;    // משך האנימציה (במילישניות)
  private i = 0;             // מונה ליצירת מזהים ייחודיים לצמתים
  private links: any[] = []; // רשימת החיבורים (קווים) בין הצמתים

  // הגדרות עיצוב לכרטיס
  private rectW = 80;       // רוחב הכרטיס
  private rectH = 150;       // גובה הכרטיס
  private cardGap = 20;      // רווח בין כרטיסים סמוכים (למשל בין בני זוג)
  
  // הוספת מרווח להתנגשויות ב-Mini Trees
  private NODE_WIDTH = 100;
  private NODE_HEIGHT = 200;

  constructor() {
    // אפקט שמגיב לחיפוש חדש או למידע חדש
    effect(() => {
      const data = this.rootData();
      const tz = this.searchedTz(); // המעקב אחרי שינוי בחיפוש יפעיל את האפקט
      
      if (this.svg && data) {
        // סגירת חלונית צד על כל חיפוש או טעינה מחדש
        this.closeDetails();
        // ניקוי משפחות בני זוג פתוחות
        this.expandedSpouseFamilies.clear();
        
        // יצירה וציור מחדש משורש כדי לוודא שאינטראקציות קודמות מתאפסות
        this.initializeTree(data);
      }
    });
  }

  // --- מחזור חיים (Lifecycle Hooks) ---

  ngAfterViewInit() {
    // המתנה קצרה כדי לוודא שה-DOM מוכן והמימדים מחושבים נכון
    setTimeout(() => {
      if (this.rootData()) {
        this.initializeTree(this.rootData());
      }
    }, 100);
    // האזנה לשינוי גודל החלון כדי לצייר מחדש
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy() {
    // ניקוי מאזינים למניעת דליפת זיכרון
    window.removeEventListener('resize', this.handleResize);
  }

  // סגירת חלונית הפרטים
  closeDetails() {
    this.selectedPerson.set(null);
  }

  getPhotoUrl(member: FamilyMember): string {
      const defaultMalePhoto = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e3f2fd"/><circle cx="50" cy="35" r="22" fill="%2390caf9"/><path d="M15 100 Q 50 60 85 100 Z" fill="%2390caf9"/></svg>';
      const defaultFemalePhoto = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fce4ec"/><circle cx="50" cy="35" r="22" fill="%23f48fb1"/><path d="M15 100 Q 50 60 85 100 Z" fill="%23f48fb1"/></svg>';
      return member.photo ? member.photo : (member.gender === 'זכר' ? defaultMalePhoto : defaultFemalePhoto);
  }

  // חישוב גיל
  calculateAge(birthDate: Date | undefined): number | string {
    if (!birthDate) return '';
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  }

  // טיפול בשינוי גודל מסך
  private handleResize = () => {
    if (this.rootData()) {
      this.initializeTree(this.rootData());
    }
  }

  // --- עיבוד והעשרת נתונים (Data Processing) ---

  // פונקציה זו עוברת על כל העץ ומוסיפה קישורים בין הורים לילדים,
  // ומסדרת את הילדים כך שיופיעו מתחת להורה הנכון (במקרה של ריבוי בני זוג)
  private enrichData(node: FamilyMember, parents: FamilyMember[] = [], visited = new Set<number>()) {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    // קישור הורים לאובייקט הילד
    if (parents.length > 0) node.parents = parents;

    // מיון ילדים: חשוב כדי שהקווים לא יצטלבו.
    // ילדים של בן זוג א' יהיו בצד אחד, וילדים של בן זוג ב' יהיו בצד שני.
    if (node.children && node.children.length > 0) {
        const parentIds = [node.id, ...(node.spouses?.map(s => s.id) || [])];
        node.children.sort((a, b) => {
            const indexA = parentIds.indexOf(a.otherParentId as any);
            const indexB = parentIds.indexOf(b.otherParentId as any);
            const effectiveA = indexA === -1 ? 0 : indexA;
            const effectiveB = indexB === -1 ? 0 : indexB;
            return effectiveA - effectiveB;
        });
    }

    let currentParents: FamilyMember[] = [node];

    // טיפול בבני זוג
    if (node.spouses && node.spouses.length > 0) {
      node.spouses.forEach(spouse => {
        visited.add(spouse.id); // למנוע לולאה אינסופית מדורות קודמים או קשרים צולבים
        spouse.spouses = [node]; // קישור דו-כיווני
        // שיוך ילדים ספציפיים לבן הזוג הזה (לצורך תצוגה בלבד)
        if (node.children) {
            spouse.children = node.children.filter(child => child.parent1 === spouse.id || child.parent2 === spouse.id);
        }
        currentParents.push(spouse);

        // העשרת משפחת המקור של בן הזוג (אם קיימת)
        if (spouse.parents && spouse.parents.length > 0) {
            spouse.parents.forEach(parent => {
                this.enrichData(parent, [], visited);
            });
        }
      });
    }

    // רקורסיה: מעבר על כל הילדים והפעלת הפונקציה גם עליהם
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        let childSpecificParents = currentParents.filter(p => p.id === child.parent1 || p.id === child.parent2);
        
        if (childSpecificParents.length === 0) {
            const mainParent = node;
            const spouseParent = child.otherParentId ? currentParents.find(p => p.id === child.otherParentId) : null;
            childSpecificParents = (spouseParent && spouseParent.id !== mainParent.id) ? [mainParent, spouseParent] : [mainParent];
        }

        this.enrichData(child, childSpecificParents, visited);
      });
    }
  }

  // --- אתחול העץ (Initialization) ---

  private initializeTree(data: FamilyMember) {
    if (!this.containerRef) return;
    
    // עיבוד המידע לפני הציור
    this.enrichData(data);

    // ניקוי ציור קודם (אם קיים)
    d3.select(this.containerRef.nativeElement).selectAll('*').remove();

    this.width = this.containerRef.nativeElement.clientWidth;
    this.height = this.containerRef.nativeElement.clientHeight;

    // הגנה מפני קריסה אם המימדים הם 0
    if (this.width === 0 || this.height === 0) return;

    // הגדרת התנהגות הזום (Zoom & Pan)
    this.zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 3]) // גבולות הזום
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      });

    // יצירת ה-SVG
    this.svg = d3.select(this.containerRef.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .call(this.zoomBehavior)
      .on('dblclick.zoom', null); // ביטול זום בלחיצה כפולה

    this.g = this.svg.append('g');

    // מיקום התחלתי של העץ (באמצע ולמעלה)
    const initialTransform = d3.zoomIdentity.translate(this.width / 2, 50).scale(1);
    this.svg.call(this.zoomBehavior.transform, initialTransform);

    // --- הגדרת פריסת העץ (Layout) ---
    this.treeLayout = d3.tree<FamilyMember>()
      .nodeSize([105, 250]) // הוקטן עוד ל-105 כדי למשוך את האחים קרוב ככל הניתן
      .separation((a, b) => {
        // פונקציה שמחשבת את המרחק האופקי בין שני צמתים
        const aSpouses = a.data.spouses?.length || 0;
        const bSpouses = b.data.spouses?.length || 0;
        
        // ענפים עם מספר לא מאוזן של כרטיסים
        const aWidth = 1 + (aSpouses * 0.9);
        const bWidth = 1 + (bSpouses * 0.9);
        
        const sep = (aWidth + bWidth) / 2;
        
        // אחים מקבלים מרחק מינימלי, בני דודים מקבלים תוספת ריווח 
        return a.parent === b.parent ? sep : sep + 0.5;
      });

    // המרת המידע למבנה היררכי של D3
    this.root = d3.hierarchy<FamilyMember>(data, (d) => d.children) as HierarchyNode;
    
    // ניקוי וספירה מחדש של כפילויות
    this.globalIdCount.clear();
    this.root.descendants().forEach((d: HierarchyNode) => {
        if (d.data.id) {
            this.globalIdCount.set(d.data.id, (this.globalIdCount.get(d.data.id) || 0) + 1);
        }
        if (d.data.spouses) {
            d.data.spouses.forEach(s => {
                if (s.id) {
                    this.globalIdCount.set(s.id, (this.globalIdCount.get(s.id) || 0) + 1);
                }
            });
        }
    });

    const tz = this.searchedTz();
    let searchedNode: HierarchyNode | undefined;
    
    if (tz) {
      searchedNode = this.root.descendants().find((d: HierarchyNode) => {
        if (d.data.tz?.trim() === tz) return true;
        if (d.data.spouses) {
          return d.data.spouses.some(s => s.tz?.trim() === tz);
        }
        return false;
      });
    }

    // יצירת סט של מזהי צמתים (ומזהי בני זוג) שצריכים להיות פתוחים
    const expandedPaths = new Map<HierarchyNode, Set<string>>();
    
    if (searchedNode) {
        // האדם שחיפשו - נפתח את כל בני הזוג שלו
        const searchedSpouses = new Set<string>();
        const totalMembers = [searchedNode.data, ...(searchedNode.data.spouses || [])];
        totalMembers.forEach(m => searchedSpouses.add(m.id ? String(m.id) : 'main'));
        expandedPaths.set(searchedNode, searchedSpouses);
        
        // הורים וסבים - נפתח רק את הנתיב שמוביל לאדם שחיפשו
        let current = searchedNode;
        while (current.parent) {
            const parent = current.parent;
            const childData = current.data as FamilyMember;
            
            // מזהה בן הזוג של ההורה שדרכו הגענו לילד
            let parentTrackId = childData.otherParentId ? String(childData.otherParentId) : (parent.data.id ? String(parent.data.id) : 'main');
            
            if (!expandedPaths.has(parent)) {
                expandedPaths.set(parent, new Set<string>());
            }
            expandedPaths.get(parent)!.add(parentTrackId);
            
            current = parent;
        }
    } else {
        // אם לא חיפשו אף אחד, נפתח את השורש
        const rootSpouses = new Set<string>();
        const totalMembers = [this.root.data, ...(this.root.data.spouses || [])];
        totalMembers.forEach(m => rootSpouses.add(m.id ? String(m.id) : 'main'));
        expandedPaths.set(this.root, rootSpouses);
    }

    // אתחול משתנים לכל צומת וסגירת צמתים שלא בנתיב
    this.root.descendants().forEach((d: HierarchyNode) => {
        d.allChildNodes = d.children ? (d.children as HierarchyNode[]) : [];
        d.collapsedSpouseIds = new Set<string>();
        
        const spousesToExpand = expandedPaths.get(d) || new Set<string>();
        
        const spouses = d.data.spouses || [];
        const totalMembers = [d.data, ...spouses];
        
        totalMembers.forEach((member, index) => {
             const hasChildren = d.allChildNodes!.some((childNode: any) => {
                const childData = childNode.data as FamilyMember;
                if (childData.otherParentId === member.id) return true;
                if (!childData.otherParentId && index === 0) return true;
                return false;
            });
            if (hasChildren) {
                const trackId = member.id ? String(member.id) : 'main';
                if (!spousesToExpand.has(trackId)) {
                    d.collapsedSpouseIds!.add(trackId);
                }
            }
        });
        
        // סינון הילדים שצריכים להיות מוצגים כרגע
        if (d.allChildNodes.length > 0) {
            const visibleChildren = d.allChildNodes.filter((childNode: any) => {
                const childData = childNode.data as FamilyMember;
                let parentId = childData.otherParentId ? String(childData.otherParentId) : '';
                if (!parentId) {
                    parentId = d.data.id ? String(d.data.id) : 'main'; 
                }
                return !d.collapsedSpouseIds!.has(parentId);
            });
            console.log("visibleChildren count for", d.data.id, " =", visibleChildren.length);
            d.children = visibleChildren.length > 0 ? visibleChildren : undefined;
        }
    });

    this.root.x0 = 0;
    this.root.y0 = 0;

    // קריאה לפונקציית העדכון הראשונית
    this.update(this.root);

    // מירכוז על האדם שחיפשו
    if (searchedNode) {
      setTimeout(() => {
        this.centerOnNode(searchedNode!);
      }, 100);
    }
  }

  // --- אינטראקציה (Interaction) ---

  // פונקציה למירכוז המסך על צומת שנבחר
  private centerOnNode(d: HierarchyNode) {
    if (!this.svg || !this.zoomBehavior) return;

    const scale = 1.3;
    const sidebarWidth = 400; // לוקחים בחשבון את רוחב סרגל הצד

    const centerX = (this.width - sidebarWidth) / 2;
    const centerY = this.height / 2;

    // חישוב המיקום החדש
    const transform = d3.zoomIdentity
      .translate(centerX, centerY) 
      .scale(scale)
      .translate(-d.x!, -d.y!);

    // אנימציה למעבר חלק
    this.svg.transition()
      .duration(750)
      .call(this.zoomBehavior.transform, transform);
  }

  // --- ליבת הציור (Core Update Loop) ---
  // זו הפונקציה המרכזית של D3 שמטפלת בציור האלמנטים, אנימציות כניסה/יציאה ועדכון מיקומים
  private update(source: any) {
    // חישוב המיקומים החדשים של כל הצמתים והקווים בעץ הראשי
    const treeData = this.treeLayout(this.root);
    let nodes = treeData.descendants();
    let linksData = treeData.links();

    const NODE_WIDTH = 220; // מרווח ביטחון אופקי
    const NODE_HEIGHT = 120; // מרווח ביטחון אנכי

    // הוספת משפחות של בני זוג (אם הורחבו)
    nodes.forEach((node: any) => {
        const spouses = node.data.spouses || [];
        spouses.forEach((spouse: FamilyMember, index: number) => {
            if (spouse.id && this.expandedSpouseFamilies.has(spouse.id) && spouse.parents && spouse.parents.length > 0) {
                const spousesCount = spouses.length + 1;
                const totalWidth = (spousesCount * this.rectW) + ((spousesCount - 1) * this.cardGap);
                const startX = -(totalWidth / 2);
                const spouseXOffset = startX + ((index + 1) * (this.rectW + this.cardGap)) + (this.rectW / 2);

                const spouseAbsX = node.x + spouseXOffset;
                const spouseAbsY = node.y;

                const dummySpouseNode = {
                    x: spouseAbsX,
                    y: spouseAbsY,
                    id: 'dummy-' + spouse.id,
                    data: spouse,
                    mainNode: node
                };

                let cachedHierarchies = this.miniTreeHierarchies.get(spouse.id!);
                if (!cachedHierarchies) {
                    const uniqueParents: FamilyMember[] = [];
                    const renderedIds = new Set<number>();
                    spouse.parents.forEach((p: FamilyMember) => {
                        if (!renderedIds.has(p.id)) {
                             uniqueParents.push(p);
                             renderedIds.add(p.id);
                             if (p.spouses) {
                                 p.spouses.forEach(s => renderedIds.add(s.id));
                             }
                        }
                    });

                    cachedHierarchies = uniqueParents.map((parentData: FamilyMember) => {
                        const parentHierarchy = d3.hierarchy<FamilyMember>(parentData, d => {
                             if (!d.children) return null;
                             return d.children.filter(c => c.id !== spouse.id);
                        }) as HierarchyNode;
                        // אתחול משתנים עבור כפתורי הרחבה/צמצום בעץ המשני
                        parentHierarchy.descendants().forEach((d: any) => {
                            d.allChildNodes = d.children ? (d.children as HierarchyNode[]) : [];
                            if (!d.collapsedSpouseIds) {
                                d.collapsedSpouseIds = new Set<string>();
                            }

                            // ברירת מחדל: לסגור את הילדים של האחים (כלומר שרק האחים יוצגו, והשאר סגור)
                            if (d !== parentHierarchy) {
                                const spouses = d.data.spouses || [];
                                const totalMembers = [d.data, ...spouses];
                                totalMembers.forEach((member: any) => {
                                     const trackId = member.id ? String(member.id) : 'main';
                                     d.collapsedSpouseIds.add(trackId);
                                });
                            }

                            // עדכון ה-children שיוצגו בפועל
                            if (d.allChildNodes.length > 0) {
                                const visibleChildren = d.allChildNodes.filter((childNode: any) => {
                                    const childData = childNode.data as FamilyMember;
                                    let parentId = childData.otherParentId ? String(childData.otherParentId) : '';
                                    if (!parentId) {
                                        parentId = d.data.id ? String(d.data.id) : 'main'; 
                                    }
                                    return !d.collapsedSpouseIds.has(parentId);
                                });
                                d.children = visibleChildren.length > 0 ? visibleChildren : undefined;
                            }
                        });
                        return parentHierarchy;
                    });
                    this.miniTreeHierarchies.set(spouse.id!, cachedHierarchies);
                }

                cachedHierarchies.forEach((parentHierarchy: HierarchyNode) => {
                    const miniTree = d3.tree<FamilyMember>()
                        .nodeSize([105, 250])
                        .separation((a, b) => {
                            const aSpouses = a.data.spouses?.length || 0;
                            const bSpouses = b.data.spouses?.length || 0;
                            const aWidth = 1 + (aSpouses * 0.9);
                            const bWidth = 1 + (bSpouses * 0.9);
                            const sep = (aWidth + bWidth) / 2;
                            return a.parent === b.parent ? sep : sep + 0.5;
                        })(parentHierarchy);

                    const miniNodes = miniTree.descendants();

                    // קביעת כיוון ההזזה (ימינה אם אנחנו בצד ימין של העץ, שמאלה אם בשמאל)
                    const direction = node.x >= 0 ? 1 : -1;
                    let dx = spouseAbsX - miniTree.x;
                    const dy = spouseAbsY - 260; // הוגדל מ-200 ל-260 כדי להתרחק מהאדם הנוכחי

                    // מנגנון מניעת התנגשויות (Collision Resolution) הגדלתי את מרחקי הבדיקה
                    let collision = true;
                    let attempts = 0;
                    while (collision && attempts < 50) {
                        collision = false;
                        for (const mNode of miniNodes) {
                            const mX = mNode.x + dx;
                            const mY = mNode.y + dy;

                            // בדיקה מול כל הצמתים שכבר מוקמו (כולל העץ הראשי ועצים משניים קודמים)
                            for (const eNode of nodes) {                                
                                if (Math.abs(mY - eNode.y) < this.NODE_HEIGHT * 1.5) { 
                                    // מרווח ביטחון אופקי משמעותי כדי שמשפחת המקור לא תעלה על ענפים אחרים
                                    if (Math.abs(mX - eNode.x) < (this.NODE_WIDTH * 3.5)) { 
                                        collision = true;
                                        break;
                                    }
                                }
                            }
                            if (collision) break;
                        }
                        if (collision) {
                            dx += direction * 350; // הוגדל מ-250 ל-350 כדי לתת דחיפה משמעותית הצידה
                            attempts++;
                        }
                    }

                    // החלת המיקום הסופי
                    miniNodes.forEach((d: any) => {
                        d.x += dx;
                        d.y += dy; 
                        
                        d.id = 'spouse-fam-' + spouse.id + '-' + (d.data.id || d.data.name);
                        d.isSpouseFamily = true;
                        
                        if (d.x0 === undefined) {
                            d.x0 = spouseAbsX;
                            d.y0 = spouseAbsY;
                        }
                    });

                    nodes = nodes.concat(miniNodes);

                    const mLinks = miniTree.links();
                    mLinks.forEach((l: any) => {
                        linksData.push({
                            source: l.source,
                            target: l.target,
                            isSpouseFamilyLink: true
                        });
                    });

                    linksData.push({
                        source: miniTree,
                        target: dummySpouseNode,
                        isSpouseFamilyLink: true,
                        isSpouseToParentLink: true
                    });
                });
            }
        });
    });

    this.links = linksData;

    // ------------------- טיפול בצמתים (Nodes) -------------------
    
    // בחירת כל הצמתים הקיימים ושיוך מידע
    const node = this.g.selectAll('g.node')
      .data(nodes, (d: any) => d.id || (d.id = ++this.i));

    const component = this;

    // ENTER: יצירת אלמנטים חדשים עבור צמתים חדשים
    // שילוב לוגיקת גרירה ולחיצה (Click/Drag) למניעת התנגשויות
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${source.x0},${source.y0})`) // מתחילים מהמיקום של ההורה (לאפקט צמיחה)
      .call(d3.drag() 
        .on('start', function(event: any, d: any) {
           d3.select(this).raise(); 
           // שמירת מיקום התחלתי לזיהוי "קליק מרושל" (Sloppy Click)
           // אם המשתמש הזיז את העכבר מעט מאוד, נחשיב זאת כלחיצה ולא כגרירה
           d.__initialX = event.x;
           d.__initialY = event.y;
           d.__isDrag = false;
        }) 
        .on('drag', function(event: any, d: any) {
           // חישוב מרחק תזוזה
           const dx = event.x - d.__initialX;
           const dy = event.y - d.__initialY;
           
           // סף רגישות: רק אם זז יותר מ-3 פיקסלים, נסמן זאת כגרירה אמיתית
           if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
               d.__isDrag = true;
           }

           d.x = event.x;
           d.y = event.y;
           d3.select(this).attr('transform', `translate(${d.x},${d.y})`);
           component.updateLinks(); // עדכון הקווים בזמן גרירה
        })
        .on('end', function(event: any, d: any) {
            // אם לא הייתה תזוזה משמעותית, נתייחס לזה כאל לחיצה (Click)
            if (!d.__isDrag) {
                const targetElement = event.sourceEvent.target as Element;
                
                // התעלם מלחיצות על כפתורי הרחבה/צמצום וכפתורי משפחת מקור
                const familyBtn = targetElement.closest('.family-btn');
                if (familyBtn) {
                    const memberId = Number(familyBtn.getAttribute('data-id'));
                    component.toggleSpouseFamily(memberId);
                    delete d.__isDrag;
                    delete d.__initialX;
                    delete d.__initialY;
                    return;
                }

                const toggleBtn = targetElement.closest('.toggle-btn');
                if (toggleBtn) {
                    const trackId = toggleBtn.getAttribute('data-id')!;
                    component.toggleSpouseChildren(d, trackId);
                    delete d.__isDrag;
                    delete d.__initialX;
                    delete d.__initialY;
                    return;
                }

                // מוצאים את הקבוצה הספציפית של הכרטיס שנלחץ (כולל בני זוג)
                const cardGroup = targetElement.closest('.member-card-group');
                
                if (cardGroup) {
                  // שולפים את המידע הספציפי שקושר לקבוצה זו
                  const memberData = d3.select(cardGroup).datum() as FamilyMember;
                  if (memberData) {
                      component.selectedPerson.set(memberData);
                      component.centerOnNode(d);
                  }
                }
            }
            
            // ניקוי משתנים זמניים
            delete d.__isDrag;
            delete d.__initialX;
            delete d.__initialY;
        })
      );

    // הערה: הסרנו את nodeEnter.on('click') כי הטיפול בלחיצה עבר לתוך אירוע ה-end של הגרירה
    // זה פותר את הבעיה שבה תזוזה מיקרוסקופית של העכבר מתפרשת כגרירה ומבטלת את הלחיצה ("צריך ללחוץ פעמיים")

    // ציור התוכן הפנימי של כל צומת (כרטיס, תמונה, טקסט)
    nodeEnter.each(function(this: any, d: HierarchyNode) {
        const group = d3.select(this);
        const spouses = d.data.spouses || [];
        const totalMembers = [d.data, ...spouses]; // המערך כולל את האדם הראשי + בני הזוג
        const count = totalMembers.length;
        
        // חישוב רוחב כולל כדי למרכז את הקבוצה
        const totalWidth = (count * component.rectW) + ((count - 1) * component.cardGap);
        const startX = -(totalWidth / 2);

        // קו מחבר מעל בני הזוג (אם יש יותר מאחד)
        if (count > 1) {
            group.append('line')
                .attr('class', 'connector-line')
                .attr('x1', startX + component.rectW / 2)
                .attr('x2', startX + totalWidth - component.rectW / 2)
                .attr('y1', 0)
                .attr('y2', 0);
        }

        // לולאה ליצירת כרטיס עבור כל אדם (ראשי + בני זוג) באותו צומת
        totalMembers.forEach((member: FamilyMember, index: number) => {
            const cardX = startX + (index * (component.rectW + component.cardGap));
            const cardY = -component.rectH / 2;

            const cardGroup = group.append('g')
                .attr('class', 'member-card-group') // זיהוי לקליק
                .attr('transform', `translate(${cardX}, 0)`)
                .attr('data-person-id', member.id || '')
                .datum(member) // קשירת המידע הספציפי לכרטיס הזה!
                .on('mouseenter', function() {
                    if (member.id) {
                        const duplicates = d3.selectAll(`.member-card-group[data-person-id="${member.id}"]`);
                        if (duplicates.size() > 1) {
                            duplicates.select('rect.person-card').classed('duplicate-highlight', true);
                        }
                    }
                })
                .on('mouseleave', function() {
                    if (member.id) {
                        d3.selectAll(`.member-card-group[data-person-id="${member.id}"] rect.person-card`)
                          .classed('duplicate-highlight', false);
                    }
                });

            // 1. ציור המלבן (הכרטיס)
            cardGroup.append('rect')
                .attr('width', component.rectW)
                .attr('height', component.rectH)
                .attr('x', 0)
                .attr('y', cardY)
                .attr('rx', 8) // פינות עגולות
                .attr('ry', 8)
                .attr('class', () => {
                    const genderClass = member.gender === 'זכר' ? 'male' : 'female';
                    const highlightClass = member.tz?.trim() === component.searchedTz() ? ' highlighted' : '';
                    return `person-card ${genderClass}${highlightClass}`;
                });

            // אינדיקציה לכפילות (מופיע תמיד אם האדם קיים יותר מפעם אחת בעץ המלא)
            if (member.id && (component.globalIdCount.get(member.id) || 0) > 1) {
                // אייקון המסמל כפילות (אנשים חופפים - Material Icons 'people')
                cardGroup.append('path')
                    .attr('d', 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z')
                    .attr('transform', `translate(6, ${cardY + 6}) scale(0.8)`)
                    .attr('fill', '#4caf50') // צבע ירוק תואם להדגשה
                    .style('pointer-events', 'none')
                    .append('title').text('אדם זה מופיע יותר מפעם אחת בעץ');
            }

            // 2. תמונת הפרופיל
            const imgRadius = 26;
            const imgCx = component.rectW / 2;
            const imgCy = -component.rectH / 2 + 15 + imgRadius; 
            const uniqueClipId = `clip-${member.id || Math.random().toString(36).substr(2,9)}`;

            // יצירת מסכה עגולה לתמונה (Clip Path)
            const defs = cardGroup.append('defs');
            defs.append('clipPath')
                .attr('id', uniqueClipId)
                .append('circle')
                .attr('cx', imgCx)
                .attr('cy', imgCy)
                .attr('r', imgRadius);

            const photoUrl = component.getPhotoUrl(member);

            cardGroup.append('image')
                .attr('href', photoUrl)
                .attr('x', imgCx - imgRadius)
                .attr('y', imgCy - imgRadius)
                .attr('width', imgRadius * 2)
                .attr('height', imgRadius * 2)
                .attr('preserveAspectRatio', 'xMidYMid slice')
                .attr('clip-path', `url(#${uniqueClipId})`)
                .style('pointer-events', 'none');

            // מסגרת לתמונה
            cardGroup.append('circle')
                .attr('cx', imgCx)
                .attr('cy', imgCy)
                .attr('r', imgRadius)
                .attr('fill', 'none')
                .attr('stroke', member.gender === 'זכר' ? '#90caf9' : '#f48fb1')
                .attr('stroke-width', 2)
                .style('pointer-events', 'none');

            // 3. טקסט (שם ותאריך) באמצעות ForeignObject
            const foWidth = component.rectW - 4;
            const foHeight = 65;
            const foX = 2; 
            const foY = imgCy + imgRadius + 5;

            const fo = cardGroup.append('foreignObject')
                .attr('x', foX)
                .attr('y', foY)
                .attr('width', foWidth)
                .attr('height', foHeight)
                .style('overflow', 'visible')
                .style('pointer-events', 'none');

            fo.append('xhtml:div')
                .attr('dir', 'rtl') // כיוון כתיבה מימין לשמאל
                .style('width', '100%')
                .style('height', '100%')
                .style('display', 'flex')
                .style('flex-direction', 'column')
                .style('justify-content', 'flex-start')
                .style('align-items', 'center')
                .style('text-align', 'center')
                .style('font-family', 'Roboto, sans-serif')
                .style('line-height', '1.2')
                .html(`
                    <div style="font-weight: 700; font-size: 13px; color: #374151; margin-bottom: 2px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${member.name}">
                        ${member.name}
                    </div>
                    ${member.tz ? '<div style="font-size: 10px; color: #4b5563; margin-bottom: 2px;">' + member.tz + '</div>' : ''}
                    <div style="font-size: 11px; color: #6b7280;">
                        ${member.birthDate ? new Date(member.birthDate).getFullYear() : ''}
                    </div>
                `);

            // 4. תגיות (Badges)
            
            // תגית DNA
            if (member.dna) {
               const dnaX = member.ta ? component.rectW / 2 - 14 : component.rectW / 2;
               const dnaY = component.rectH / 2 - 18;

               cardGroup.append('rect')
                 .attr('x', dnaX - 13)
                 .attr('y', dnaY - 8)
                 .attr('width', 26)
                 .attr('height', 14)
                 .attr('rx', 4)
                 .attr('class', 'badge-rect dna');

               cardGroup.append('text')
                 .attr('x', dnaX)
                 .attr('y', dnaY + 3)
                 .attr('text-anchor', 'middle')
                 .text('DNA')
                 .attr('class', 'badge-text');
            }

            // תגית TA (טביעת אצבע)
            if (member.ta) {
               const taX = member.dna ? component.rectW / 2 + 14 : component.rectW / 2;
               const taY = component.rectH / 2 - 18;

               cardGroup.append('rect')
                 .attr('x', taX - 13)
                 .attr('y', taY - 8)
                 .attr('width', 26)
                 .attr('height', 14)
                 .attr('rx', 4)
                 .attr('class', 'badge-rect ta');

               cardGroup.append('text')
                 .attr('x', taX)
                 .attr('y', taY + 3)
                 .attr('text-anchor', 'middle')
                 .text('TA')
                 .attr('class', 'badge-text');
            }

            // 5. כפתור הרחבה/צמצום (Toggle Button)
            // מופיע רק אם יש ילדים רלוונטיים
            const hasChildren = d.allChildNodes && d.allChildNodes.some((childNode: any) => {
                const childData = childNode.data as FamilyMember;
                if (childData.otherParentId === member.id) return true;
                if (!childData.otherParentId && index === 0) return true;
                return false;
            });

            if (hasChildren) {
                const trackId = member.id ? String(member.id) : 'main';
                const isCollapsed = d.collapsedSpouseIds?.has(trackId);

                const btnGroup = cardGroup.append('g')
                    .attr('class', 'toggle-btn')
                    .attr('style', 'cursor: pointer')
                    .attr('data-id', trackId)
                    .attr('transform', `translate(${component.rectW / 2}, ${component.rectH / 2})`);
                
                btnGroup.append('circle')
                  .attr('r', 8);

                btnGroup.append('text')
                  .attr('dy', 3)
                  .attr('text-anchor', 'middle')
                  .text(isCollapsed ? '+' : '-');
            }

            // 6. כפתור הצגת משפחת מקור (Spouse Family)
            // מציגים רק עבור בני זוג (index > 0) ולא עבור האדם המרכזי בשושלת
            let showSpouseBtn = false;
            if (index > 0 && member.parents && member.parents.length > 0) {
                const searchedTz = component.searchedTz();
                if (searchedTz) {
                    // Check if member or d.data (the main person) has a child that is the searched person
                    const isParentOfSearched = member.children?.some(c => c.tz?.trim() === searchedTz) || 
                                               d.data.children?.some((c:any) => c.tz?.trim() === searchedTz);
                    
                    if (isParentOfSearched) {
                        showSpouseBtn = true;
                    }
                } else {
                    // No search active, show for all spouses with parents (default previous behavior)
                    showSpouseBtn = true;
                }
            }

            if (showSpouseBtn) {
                const isExpanded = component.expandedSpouseFamilies.has(member.id);
                const familyBtnX = component.rectW / 2;
                const familyBtnY = -component.rectH / 2; // Above the card

                const familyBtnGroup = cardGroup.append('g')
                    .attr('class', 'family-btn')
                    .attr('style', 'cursor: pointer')
                    .attr('data-id', member.id)
                    .attr('transform', `translate(${familyBtnX}, ${familyBtnY})`);
                
                familyBtnGroup.append('circle')
                  .attr('r', 8);

                familyBtnGroup.append('text')
                  .attr('dy', 3)
                  .attr('text-anchor', 'middle')
                  .text(isExpanded ? '-' : '+');
            }
        });
    });

    // MERGE: איחוד בין הצמתים החדשים לקיימים ועדכון מיקומם
    const nodeUpdate = node.merge(nodeEnter);

    // אנימציה למיקום החדש
    nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    // עדכון הטקסט בכפתורים (+/-) לפי המצב הנוכחי ועדכון מחלקות (classes)
    nodeUpdate.each(function(this: any, d: HierarchyNode) {
         const group = d3.select(this);
         
         // עדכון מחלקת highlighted לכרטיסים
         group.selectAll('.member-card-group').each(function(this: any) {
             const cardGroup = d3.select(this);
             const member = cardGroup.datum() as FamilyMember;
             
             cardGroup.select('rect').attr('class', () => {
                 const genderClass = member.gender === 'זכר' ? 'male' : 'female';
                 const highlightClass = member.tz?.trim() === component.searchedTz() ? ' highlighted' : '';
                 return `person-card ${genderClass}${highlightClass}`;
             });
         });

         // עדכון כפתורי toggle
         group.selectAll('.toggle-btn').each(function(this: any) {
             const btn = d3.select(this);
             const spouseId = btn.attr('data-id');
             if (spouseId) {
                const isCollapsed = d.collapsedSpouseIds?.has(spouseId);
                btn.select('text').text(isCollapsed ? '+' : '-');
             }
         });

         // עדכון כפתורי משפחת מקור
         group.selectAll('.family-btn').each(function(this: any) {
             const btn = d3.select(this);
             const memberId = Number(btn.attr('data-id'));
             if (memberId) {
                const isExpanded = component.expandedSpouseFamilies.has(memberId);
                btn.select('text').text(isExpanded ? '-' : '+');
             }
         });
    });

    // EXIT: הסרת צמתים שכבר לא קיימים בנתונים (או שהוסתרו)
    const nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', (d: any) => `translate(${source.x},${source.y})`) // מתכווצים חזרה להורה
      .remove();

    nodeExit.select('rect').attr('width', 0).attr('height', 0);
    nodeExit.style('opacity', 0);

    // ------------------- טיפול בקווים (Links) -------------------
    this.updateLinks(source, this.links);

    // שמירת המיקום הנוכחי כמיקום ה"ישן" עבור האנימציה הבאה
    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // לוגיקה להצגה/הסתרה של חלק מהילדים
  private toggleSpouseChildren(d: HierarchyNode, spouseId: string) {
    if (!d.allChildNodes || !d.collapsedSpouseIds) return;

    // הפיכת המצב (מוסתר <-> מוצג)
    if (d.collapsedSpouseIds.has(spouseId)) {
        d.collapsedSpouseIds.delete(spouseId);
    } else {
        d.collapsedSpouseIds.add(spouseId);
    }

    // סינון הילדים שצריכים להיות מוצגים כרגע
    if (d.allChildNodes.length > 0) {
        const visibleChildren = d.allChildNodes.filter((childNode: any) => {
            const childData = childNode.data as FamilyMember;
            let parentId = childData.otherParentId ? String(childData.otherParentId) : '';
            if (!parentId) {
                parentId = d.data.id ? String(d.data.id) : 'main'; 
            }
            // הצגת הילד רק אם ההורה הרלוונטי אינו במצב "מוסתר"
            return !d.collapsedSpouseIds!.has(parentId);
        });
        
        d.children = visibleChildren.length > 0 ? visibleChildren : null;
    }

    this.update(this.root); // ציור מחדש מהשורש כדי לטפל גם בעצים משניים
  }

  // פעולות כלליות
  expandAll() {
    if (!this.root) return;

    const traverseAndExpand = (d: HierarchyNode) => {
      if (d.allChildNodes) {
        d.collapsedSpouseIds?.clear();
        d.children = d.allChildNodes.length > 0 ? [...d.allChildNodes] : undefined;
        d.allChildNodes.forEach(child => traverseAndExpand(child));
      }
    };

    traverseAndExpand(this.root);

    this.miniTreeHierarchies.forEach(trees => {
      trees.forEach(tree => {
        traverseAndExpand(tree);
      });
    });

    this.update(this.root);
  }

  collapseAll() {
    if (!this.root) return;

    const traverseAndCollapse = (d: HierarchyNode) => {
      if (d.allChildNodes && d.allChildNodes.length > 0) {
        if (!d.collapsedSpouseIds) d.collapsedSpouseIds = new Set<string>();
        
        const spouses = d.data.spouses || [];
        const totalMembers = [d.data, ...spouses];
        
        totalMembers.forEach(member => {
          const trackId = member.id ? String(member.id) : 'main';
          d.collapsedSpouseIds!.add(trackId);
        });
        
        d.children = undefined;
        d.allChildNodes.forEach(child => traverseAndCollapse(child));
      }
    };

    traverseAndCollapse(this.root);

    this.miniTreeHierarchies.forEach(trees => {
      trees.forEach(tree => {
        traverseAndCollapse(tree);
      });
    });

    this.update(this.root);
  }

  // לוגיקה להצגה/הסתרה של משפחת המקור של בן/בת הזוג
  private toggleSpouseFamily(spouseId: number) {
    if (this.expandedSpouseFamilies.has(spouseId)) {
      this.expandedSpouseFamilies.delete(spouseId);
    } else {
      this.expandedSpouseFamilies.add(spouseId);
    }
    this.update(this.root);
  }

  // פונקציה לציור הקווים המקשרים
  private updateLinks(source?: any, linksData?: any) {
    if (!linksData) linksData = this.links;
    
    const cardHalfH = this.rectH / 2;
    const verticalGap = 40;

    // פונקציית עזר למציאת ה-Offset (הזזה) הנכון של הקו
    // מכיוון שיש מספר כרטיסים בצומת אחד (בני זוג), הקו צריך לצאת מהכרטיס הנכון
    const getMemberOffset = (nodeData: FamilyMember, memberId?: number) => {
        if (!nodeData) return 0;
        const spouses = nodeData.spouses || [];
        const totalMembers = [nodeData, ...spouses];
        const count = totalMembers.length;
        const totalWidth = (count * this.rectW) + ((count - 1) * this.cardGap);
        const startX = -(totalWidth / 2);

        let index = 0;
        if (memberId) {
            const foundIndex = totalMembers.findIndex(m => m.id === memberId);
            if (foundIndex !== -1) index = foundIndex;
        }
        return startX + (index * (this.rectW + this.cardGap)) + (this.rectW / 2);
    };

    // חישוב מסלול הקו (Curve)
    const diagonal = (s: any, d: any, linkData: any) => {
        let sOffset = 0;
        let tOffset = 0;

        let sX = s.x;
        let sY = s.y;
        let tX = d.x;
        let tY = d.y;

        if (linkData.isSpouseToParentLink && d.mainNode) {
            // חישוב מחדש של מיקום בן הזוג במקרה שהצומת הראשי נגרר
            const mainNode = d.mainNode;
            const spouses = mainNode.data.spouses || [];
            const index = spouses.findIndex((sp: any) => sp.id === d.data.id);
            if (index !== -1) {
                const spousesCount = spouses.length + 1;
                const totalWidth = (spousesCount * this.rectW) + ((spousesCount - 1) * this.cardGap);
                const startX = -(totalWidth / 2);
                const spouseXOffset = startX + ((index + 1) * (this.rectW + this.cardGap)) + (this.rectW / 2);
                tX = mainNode.x + spouseXOffset;
                tY = mainNode.y;
            }
            // חישוב יציאה מההורה הנכון
            const parentMemberId = d.data?.otherParentId;
            sOffset = getMemberOffset(s.data, parentMemberId);
            sX += sOffset;
        } else {
            const parentMemberId = d.data?.otherParentId;
            sOffset = getMemberOffset(s.data, parentMemberId); // חישוב יציאה מההורה הנכון
            tOffset = getMemberOffset(d.data, d.data?.id);      // חישוב כניסה לילד
            sX += sOffset;
            tX += tOffset;
        }

        // יצירת מסלול Bezier Curve מותאם אישית
        return `M ${sX} ${sY + cardHalfH}
                V ${sY + cardHalfH + 15}
                C ${sX} ${sY + cardHalfH + verticalGap},
                  ${tX} ${tY - cardHalfH - verticalGap},
                  ${tX} ${tY - cardHalfH}`;
    };

    // בחירת כל הקווים
    const link = this.g.selectAll('path.link')
      .data(linksData, (d: any) => d.target.id);

    // ENTER: יצירת קווים חדשים
    const linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const o = { x: source?.x0 || this.root.x0, y: source?.y0 || this.root.y0 };
        return `M ${o.x} ${o.y} C ${o.x} ${o.y}, ${o.x} ${o.y}, ${o.x} ${o.y}`;
      });

    const linkUpdate = link.merge(linkEnter);
    
    // UPDATE: אנימציה למיקום החדש
    if (source) {
       linkUpdate.transition()
        .duration(this.duration)
        .attr('d', (d: any) => diagonal(d.source, d.target, d));
    } else {
       linkUpdate.attr('d', (d: any) => diagonal(d.source, d.target, d));
    }

    // EXIT: הסרת קווים
    if (source) {
        link.exit().transition()
        .duration(this.duration)
        .attr('d', (d: any) => {
            const o = { x: source.x, y: source.y };
            return `M ${o.x} ${o.y} C ${o.x} ${o.y}, ${o.x} ${o.y}, ${o.x} ${o.y}`;
        })
        .remove();
    } else {
        link.exit().remove();
    }
  }
}