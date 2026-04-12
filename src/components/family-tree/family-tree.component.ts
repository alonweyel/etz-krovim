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

  constructor() {
    // אפקט שמגיב לשינויים במידע הנכנס (rootData) ומצייר מחדש את העץ
    effect(() => {
      const data = this.rootData();
      // מוודא שה-SVG כבר קיים לפני שמנסים לצייר
      if (this.svg && data) {
        this.initializeTree(data);
      }
    });

    // אפקט שמגיב לחיפוש תעודת זהות חדשה
    effect(() => {
      const tz = this.searchedTz();
      if (this.svg && this.root && tz) {
        
        // מציאת הצומת (כולל חיפוש בילדים מוסתרים)
        let searchedNode: HierarchyNode | undefined;
        
        const findNode = (node: HierarchyNode) => {
          if (node.data.tz?.trim() === tz) {
            searchedNode = node;
            return;
          }
          if (node.data.spouses && node.data.spouses.some(s => s.tz?.trim() === tz)) {
            searchedNode = node;
            return;
          }
          if (node.allChildNodes) {
            for (const child of node.allChildNodes) {
              findNode(child);
              if (searchedNode) return;
            }
          }
        };
        
        findNode(this.root);

        if (searchedNode) {
          // פתיחת כל ההורים המוסתרים בדרך לצומת
          let current = searchedNode.parent;
          while (current) {
            if (current.collapsedSpouseIds && current.collapsedSpouseIds.size > 0) {
               current.collapsedSpouseIds.clear();
               current.children = current.allChildNodes;
            }
            current = current.parent;
          }
        }

        // רענון העץ כדי להחיל את המחלקה המודגשת ולפתוח צמתים אם צריך
        this.update(this.root);

        if (searchedNode) {
          setTimeout(() => {
            this.centerOnNode(searchedNode!);
          }, 100);
        }
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
    const birthDateObj = birthDate;
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
  private enrichData(node: FamilyMember, parents: FamilyMember[] = []) {
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
        spouse.spouses = [node]; // קישור דו-כיווני
        // שיוך ילדים ספציפיים לבן הזוג הזה (לצורך תצוגה בלבד)
        if (node.children) {
            spouse.children = node.children.filter(child => child.otherParentId === spouse.id);
        }
        currentParents.push(spouse);
      });
    }

    // רקורסיה: מעבר על כל הילדים והפעלת הפונקציה גם עליהם
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        let childSpecificParents = currentParents;
        // מציאת ההורים הספציפיים של הילד (ההורה הראשי + בן הזוג הרלוונטי)
        if (child.otherParentId) {
            const mainParent = node;
            const spouseParent = currentParents.find(p => p.id === child.otherParentId);
            if (spouseParent) {
                childSpecificParents = [mainParent, spouseParent];
            }
        }
        this.enrichData(child, childSpecificParents);
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
      .nodeSize([120, 200]) // המרחק הבסיסי בין צמתים [רוחב, גובה]
      .separation((a, b) => {
        // פונקציה שמחשבת את המרחק האופקי בין שני צמתים
        const aSpouses = a.data.spouses?.length || 0;
        const bSpouses = b.data.spouses?.length || 0;
        
        // חישוב רוחב בהתאם לכמות בני הזוג (כדי שהם לא יעלו אחד על השני)
        const aWidth = 1 + (aSpouses * 0.9);
        const bWidth = 1 + (bSpouses * 0.9);
        
        const sep = (aWidth + bWidth) / 2 + 0.15;
        
        // הוספת רווח נוסף אם מדובר בבני דודים (הורים שונים)
        return a.parent === b.parent ? sep : sep + 0.2;
      });

    // המרת המידע למבנה היררכי של D3
    this.root = d3.hierarchy<FamilyMember>(data, (d) => d.children) as HierarchyNode;
    
    // אתחול משתנים לכל צומת
    this.root.descendants().forEach((d: HierarchyNode) => {
        if (d.children) {
            d.allChildNodes = d.children as HierarchyNode[];
            d.collapsedSpouseIds = new Set<string>();
        } else {
            d.allChildNodes = [];
            d.collapsedSpouseIds = new Set<string>();
        }
    });

    this.root.x0 = 0;
    this.root.y0 = 0;

    // קריאה לפונקציית העדכון הראשונית
    this.update(this.root);

    // מירכוז על האדם שחיפשו
    const tz = this.searchedTz();
    if (tz) {
      const searchedNode = this.root.descendants().find((d: HierarchyNode) => {
        if (d.data.tz?.trim() === tz) return true;
        if (d.data.spouses) {
          return d.data.spouses.some(s => s.tz?.trim() === tz);
        }
        return false;
      });

      if (searchedNode) {
        setTimeout(() => {
          this.centerOnNode(searchedNode);
        }, 100);
      }
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
    // חישוב המיקומים החדשים של כל הצמתים והקווים
    const treeData = this.treeLayout(this.root);
    const nodes = treeData.descendants();
    this.links = treeData.links();

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
        .filter((event: any) => !event.target.closest('.toggle-btn')) // לא לאפשר גרירה מכפתור הפלוס/מינוס
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
                .datum(member); // קשירת המידע הספציפי לכרטיס הזה!

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
            const foHeight = 50;
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
                    .attr('transform', `translate(${component.rectW / 2}, ${component.rectH / 2})`)
                    .on('click', (event: any) => {
                        event.stopPropagation(); // מניעת הפעלת הלחיצה על הכרטיס
                        component.toggleSpouseChildren(d, trackId);
                    });
                
                btnGroup.append('circle')
                  .attr('r', 8);

                btnGroup.append('text')
                  .attr('dy', 3)
                  .attr('text-anchor', 'middle')
                  .text(isCollapsed ? '+' : '-');
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

  // לוגיקה להצגה/הסתרה של ילדים (Collapsing)
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

    this.update(d); // ציור מחדש
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
    const diagonal = (s: any, d: any) => {
        const parentMemberId = d.data.otherParentId;
        const sOffset = getMemberOffset(s.data, parentMemberId); // חישוב יציאה מההורה הנכון
        const tOffset = getMemberOffset(d.data, d.data.id);      // חישוב כניסה לילד

        const sX = s.x + sOffset;
        const tX = d.x + tOffset;

        // יצירת מסלול Bezier Curve מותאם אישית
        return `M ${sX} ${s.y + cardHalfH}
                V ${s.y + cardHalfH + 15}
                C ${sX} ${s.y + cardHalfH + verticalGap},
                  ${tX} ${d.y - cardHalfH - verticalGap},
                  ${tX} ${d.y - cardHalfH}`;
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
        .attr('d', (d: any) => diagonal(d.source, d.target));
    } else {
       linkUpdate.attr('d', (d: any) => diagonal(d.source, d.target));
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