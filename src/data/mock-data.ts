export interface FamilyMember {
  id: number;
  tz?: string; // תעודת זהות
  name: string;
  gender: 'זכר' | 'נקבה';
  birthDate: Date;
  address: string;
  photo?: string;
  hobbies: string[];
  dna?: boolean; // Indicates if DNA data exists
  ta?: boolean; // Indicates if Fingerprint (Tvia Etzba) exists
  spouses?: FamilyMember[]; // Spouses are now full FamilyMember objects
  children?: FamilyMember[];
  parents?: FamilyMember[]; // Back reference to parents
  _children?: FamilyMember[]; // For D3 collapsing state
  otherParentId?: number; // ID of the specific second parent (e.g. mother) for visual linking
}

export const FAMILY_DATA: FamilyMember = {
  id: 1,
  tz: '300000001',
  name: 'אברהם כהן', // Great Grandparent
  gender: 'זכר',
  birthDate: new Date('1930-05-15'),
  address: 'ירושלים, ישראל',
  photo: 'https://randomuser.me/api/portraits/men/1.jpg',
  hobbies: ['שחמט', 'גינון', 'היסטוריה'],
  dna: true,
  ta: true,
  spouses: [
    {
      id: 101,
      tz: '300000002',
      name: 'שרה כהן',
      gender: 'נקבה',
      birthDate: new Date('1932-04-10'),
      address: 'ירושלים, ישראל',
      photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      hobbies: ['סריגה', 'אפייה'],
      dna: true,
      ta: false
    },
    {
      id: 102,
      tz: '300000003',
      name: 'הגר',
      gender: 'נקבה',
      birthDate: new Date('1935-01-01'),
      address: 'מצרים',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      hobbies: ['רכיבה', 'בישול']
    }
  ],
  children: [
    {
      id: 2,
      tz: '300000004',
      name: 'יצחק כהן', // Grandparent 1
      gender: 'זכר',
      birthDate: new Date('1955-08-20'),
      address: 'תל אביב, ישראל',
      //photo: 'https://randomuser.me/api/portraits/men/2.jpg',
      hobbies: ['בישול', 'טיולים'],
      otherParentId: 101, // Child of Sarah
      dna: true,
      ta: true,
      spouses: [
        {
          id: 103,
          tz: '300000005',
          name: 'רבקה כהן',
          gender: 'נקבה',
          birthDate: new Date('1958-09-01'),
          address: 'תל אביב, ישראל',
          photo: 'https://randomuser.me/api/portraits/women/3.jpg',
          hobbies: ['יוגה', 'ציור'],
          ta: true
        }
      ],
      children: [
        {
          id: 3,
          tz: '300000006',
          name: 'יעקב כהן', // Parent 1
          gender: 'זכר',
          birthDate: new Date('1980-02-10'),
          address: 'חיפה, ישראל',
          photo: 'https://randomuser.me/api/portraits/men/3.jpg',
          hobbies: ['כדורגל', 'קריאה'],
          otherParentId: 103, // Child of Rivka
          dna: true,
          ta: true,
          spouses: [
            {
              id: 104,
              tz: '300000007',
              name: 'רחל כהן',
              gender: 'נקבה',
              birthDate: new Date('1982-05-05'),
              address: 'חיפה, ישראל',
              photo: 'https://randomuser.me/api/portraits/women/4.jpg',
              hobbies: ['ריצה'],
              dna: true
            },
            {
              id: 105,
              tz: '300000008',
              name: 'לאה כהן',
              gender: 'נקבה',
              birthDate: new Date('1983-06-06'),
              address: 'חיפה, ישראל',
              photo: 'https://randomuser.me/api/portraits/women/5.jpg',
              hobbies: ['שחייה'],
              ta: true
            }
          ],
          children: [
            // Children of Rachel (s3)
            {
              id: 4,
              tz: '300000009',
              name: 'יוסף כהן', // Child 1
              gender: 'זכר',
              birthDate: new Date('2005-11-30'),
              address: 'חיפה, ישראל',
              photo: 'https://randomuser.me/api/portraits/men/4.jpg',
              hobbies: ['גיימינג', 'ציור'],
              otherParentId: 104,
              dna: true,
              children: []
            },
            {
              id: 5,
              tz: '300000010',
              name: 'דינה כהן', // Child 2
              gender: 'נקבה',
              birthDate: new Date('2008-06-15'),
              address: 'חיפה, ישראל',
              photo: 'https://randomuser.me/api/portraits/women/6.jpg',
              hobbies: ['ריקוד', 'מוזיקה'],
              otherParentId: 104,
              children: []
            },
            {
              id: 12,
              tz: '300000011',
              name: 'בנימין כהן', // Child 3 (Rachel)
              gender: 'זכר',
              birthDate: new Date('2015-02-20'),
              address: 'חיפה, ישראל',
              photo: 'https://randomuser.me/api/portraits/men/5.jpg',
              hobbies: ['מכוניות', 'ציור'],
              otherParentId: 104,
              children: []
            },
            // Children of Leah (s4)
            {
              id: 13,
              tz: '300000012',
              name: 'ראובן כהן',
              gender: 'זכר',
              birthDate: new Date('2006-01-15'),
              address: 'חיפה, ישראל',
              photo: 'https://randomuser.me/api/portraits/men/6.jpg',
              hobbies: ['כדורסל'],
              otherParentId: 105,
              dna: false,
              children: []
            },
            {
              id: 14,
              tz: '300000013',
              name: 'שמעון כהן',
              gender: 'זכר',
              birthDate: new Date('2007-03-22'),
              address: 'חיפה, ישראל',
              photo: 'https://randomuser.me/api/portraits/men/7.jpg',
              hobbies: ['נגינה'],
              otherParentId: 105,
              children: []
            }
          ]
        },
        {
          id: 6,
          tz: '300000014',
          name: 'עשו כהן', // Parent 2
          gender: 'זכר',
          birthDate: new Date('1982-01-01'),
          address: 'אילת, ישראל',
          photo: 'https://randomuser.me/api/portraits/men/8.jpg',
          hobbies: ['ציד', 'ספורט אתגרי'],
          otherParentId: 103, // Child of Rivka
          ta: true,
          children: [
            {
              id: 7,
              tz: '300000015',
              name: 'אליפז כהן',
              gender: 'זכר',
              birthDate: new Date('2010-03-20'),
              address: 'אילת, ישראל',
              photo: 'https://randomuser.me/api/portraits/men/9.jpg',
              hobbies: ['שחייה'],
              // otherParentId: 108 removed because spouse s5 does not exist
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 8,
      tz: '300000016',
      name: 'ישמעאל דניאל כהן', // Grandparent 2 - Son of Hagar
      gender: 'זכר',
      birthDate: new Date('1958-12-05'),
      address: 'באר שבע, ישראל',
      photo: 'https://randomuser.me/api/portraits/men/10.jpg',
      hobbies: ['קשתות', 'רכיבה'],
      otherParentId: 102, // LINKED TO HAGAR
      dna: true,
      children: [
        {
          id: 9,
          tz: '300000017',
          name: 'נביות כהן',
          gender: 'זכר',
          birthDate: new Date('1985-07-22'),
          address: 'באר שבע, ישראל',
          photo: 'https://randomuser.me/api/portraits/men/11.jpg',
          hobbies: ['חקלאות'],
          spouses: [
             {
              id: 106,
              tz: '300000018',
              name: 'מחלת',
              gender: 'נקבה',
              birthDate: new Date('1988-08-08'),
              address: 'באר שבע, ישראל',
              // photo: 'https://randomuser.me/api/portraits/women/8.jpg',
              hobbies: ['רכיבה']
            }
          ],
          children: [
             {
              id: 10,
              tz: '300000019',
              name: 'קידר כהן', // Child Gen 4
              gender: 'זכר',
              birthDate: new Date('2012-09-09'),
              address: 'באר שבע, ישראל',
              photo: 'https://randomuser.me/api/portraits/men/12.jpg',
              hobbies: ['לגו'],
              otherParentId: 106,
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 11,
      tz: '300000020',
      name: 'מרים כהן', // Daughter for Gen 2 - Daughter of Sarah
      gender: 'נקבה',
      birthDate: new Date('1960-03-15'),
      address: 'נתניה, ישראל',
      photo: 'https://randomuser.me/api/portraits/women/9.jpg',
      hobbies: ['מוזיקה', 'ציור'],
      otherParentId: 101, // Child of Sarah
      spouses: [
        {
          id: 107,
          tz: '300000021',
          name: 'דוד לוי',
          gender: 'זכר',
          birthDate: new Date('1959-11-20'),
          address: 'נתניה, ישראל',
          photo: 'https://randomuser.me/api/portraits/men/13.jpg',
          hobbies: ['נגרות', 'דיג']
        }
      ],
      children: []
    }
  ]
};

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

export const MALE_ONLY_DATA = filterMalesOnly(FAMILY_DATA)!;