import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { FamilyMember, FAMILY_DATA } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  constructor() {}

  /**
   * מחפש עץ משפחה לפי תעודת זהות.
   * כרגע עושה מוקינג ומחזיר את העץ הקיים תמיד.
   * בהמשך תוחלף הפנייה לקריאת HTTP אמיתית.
   * @param tz תעודת זהות לחיפוש
   */
  getFamilyTreeByTz(tz: string): Observable<FamilyMember | null> {
    // סימולציה של פנייה לשרת (השהייה של חצי שנייה)
    // מחזיר את המוקינג הקיים בלי קשר ל-TZ שהוזן
    return of(FAMILY_DATA).pipe(delay(500));
  }
}
