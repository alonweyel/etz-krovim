export interface FamilyMemberDTO {
  id: number;
  tz?: string; // תעודת זהות
  name: string;
  gender: 'זכר' | 'נקבה';
  birthDate: Date;
  address: string;
  photo?: string;
  hobbies?: string[];
  dna?: boolean; // Indicates if DNA data exists
  ta?: boolean; // Indicates if Fingerprint (Tvia Etzba) exists
  spouses?: number[];//FamilyMember[]; // Spouses are now full FamilyMember objects
  children?: number[];//FamilyMember[];
  parent1?: number;
  parent2?: number;
}

export interface FamilyMember extends Omit<FamilyMemberDTO, 'children' | 'spouses'> {
  spouses?: FamilyMember[];
  children?: FamilyMember[];
  parents?: FamilyMember[];
  _children?: FamilyMember[];
  otherParentId?: number;
}


export const FAMILY_DATA: FamilyMemberDTO[] = [
  {
    "id": 3928788,
    "tz": "12015111",
    "name": "יוסף מוריץ וייל",
    "gender": "זכר",
    "birthDate": new Date('1948-06-16'),
    "address": "הנביאים 13, רמת גן, 5225513",
    "spouses": [9061375],
    "children": [15825351, 5008702, 2528413, 2068315],

  },

  {
    "id": 9061375,
    "tz": "47707617",
    "name": "פלורה וייל",
    "gender": "נקבה",
    "birthDate": new Date('1950-12-25'),
    "address": "הנביאים 13, רמת גן, 5225513",
    "spouses": [3928788],
    "children": [15825351, 5008702, 2528413, 2068315],
  },

  {
    "id": 15825351,
    "tz": "27121029",
    "name": "וייל",
    "gender": "זכר",
    "birthDate": new Date("1974-02-01"),
    "address": "גרשום 15, רמת גן, 5228643",
    "parent1": 3928788,
    "parent2": 9061375,
  },
  {
    "id": 5008702,
    "tz": "27394139",
    "name": "סגלית קלרה ראובן וייל",
    "gender": "נקבה",
    "birthDate": new Date("1975-02-12"),
    "address": "משה סנה 14, דירה 5, פתח תקווה, 4922353",
    "spouses": [830009],
    "children": [12987572, 13944190],
    "parent1": 3928788,
    "parent2": 9061375,
  },

  {
    "id": 830009,
    "tz": "38648200",
    "name": "נאור ראובן",
    "gender": "זכר",
    "birthDate": new Date("1976-02-27"),
    "address": "משה סנה 14, דירה 5, פתח תקווה, 4922353",
    "spouses": [5008702],
    "children": [12987572, 13944190],

  },
  {
    "id": 12987572,
    "tz": "215889999",
    "name": "עידן ראובן וייל",
    "gender": "זכר",
    "birthDate": new Date("2006-05-19"),
    "address": "משה סנה 14, דירה 5, פתח תקווה, 4922353",
    "parent1": 5008702,
    "parent2": 830009,
  },
  {
    "id": 13944190,
    "tz": "218210003",
    "name": "עמית ראובן וייל",
    "gender": "זכר",
    "birthDate": new Date("2009-05-08"),
    "address": "משה סנה 14, דירה 5, פתח תקווה, 4922353",
    "parent1": 5008702,
    "parent2": 830009,
  },
  {
    "id": 2528413,
    "tz": "34118265",
    "name": "ערן וייל",
    "gender": "זכר",
    "birthDate": new Date("1977-06-03"),
    "address": "מלאכי הנביא 10, דירה 27, בית שמש, 9914121",
    "spouses": [12973026],
    "children": [13226922, 13583789],
    "parent1": 3928788,
    "parent2": 9061375,
  },
  {
    "id": 12973026,
    "tz": "328745377",
    "name": "מריאלה תמר ברנשטיין וייל",
    "gender": "נקבה",
    "birthDate": new Date("1975-12-17"),
    "address": "מלאכי הנביא 10, דירה 27, בית שמש, 9914121",
    "spouses": [2528413],
    "children": [13226922, 13583789],
  },
  {
    "id": 13226922,
    "tz": "216797274",
    "name": "דוד אלעאי וייל",
    "gender": "זכר",
    "birthDate": new Date("2007-03-20"),
    "address": "מלאכי הנביא 10, דירה 27, בית שמש, 9914121",
    "parent1": 2528413,
    "parent2": 12973026,
  },
  {
    "id": 13583789,
    "tz": "217645910",
    "name": "הדס גיטל וייל",
    "gender": "נקבה",
    "birthDate": new Date("2008-04-20"),
    "address": "מלאכי הנביא 10, דירה 27, בית שמש, 9914121",
    "parent1": 2528413,
    "parent2": 12973026,
  },
  {
    "id": 2068315,
    "tz": "38155073",
    "name": "אלון וייל",
    "gender": "זכר",
    "birthDate": new Date("1986-01-25"),
    "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
    "spouses": [6744884],
    "children": [15260362, 16477946, 20649572],
    "parent1": 3928788,
    "parent2": 9061375,
  },
  {
    "id": 6744884,
    "tz": "32533937",
    "name": "לי-טל וייל",
    "gender": "נקבה",
    "birthDate": new Date("1986-08-10"),
    "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
    "spouses": [2068315],
    "children": [15260362, 16477946, 20649572],
    "parent1": 1111,
    "parent2": 2222,
  },
  {
    "id": 15260362,
    "tz": "337157770",
    "name": "יעל וייל",
    "gender": "נקבה",
    "birthDate": new Date("2013-03-11"),
    "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
    "parent1": 2068315,
    "parent2": 6744884,
  },
  {
    "id": 16477946,
    "tz": "222772444",
    "name": "נועה וייל",
    "gender": "נקבה",
    "birthDate": new Date("2014-09-06"),
    "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
    "parent1": 2068315,
    "parent2": 6744884,
  },
  {
    "id": 20649572,
    "tz": "233840008",
    "name": "איתן וייל",
    "gender": "זכר",
    "birthDate": new Date("2020-08-17"),
    "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
    "parent1": 2068315,
    "parent2": 6744884,
  },
  {
    "id": 1111,
    "tz": "1111",
    "name": "יעקב מובשוביץ",
    "gender": "זכר",
    "birthDate": new Date("1950-08-10"),
    "address": "הנ, רמת גן, 5225513",
    "spouses": [2222],
    "children": [6744884, 3333],
  },
  {
    "id": 2222,
    "tz": "2222",
    "name": "רינה מובשבוביץ",
    "gender": "נקבה",
    "birthDate": new Date("1950-08-10"),
    "address": "הנ, רמת גן, 5225513",
    "spouses": [1111],
    "children": [6744884, 3333],
  },
  {
    "id": 3333,
    "tz": "3333",
    "name": "מעין",
    "gender": "נקבה",
    "birthDate": new Date("1986-08-10"),
    "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
    "spouses": [],
    "children": [],
    "parent1": 1111,
    "parent2": 2222, 
  }, 
]


// export const FAMILY_DATA: FamilyMember = {
//   id: 1,
//   tz: '300000001',
//   name: 'אברהם כהן', // Great Grandparent
//   gender: 'זכר',
//   birthDate: new Date('1930-05-15'),
//   address: 'ירושלים, ישראל',
//   photo: 'https://randomuser.me/api/portraits/men/1.jpg',
//   hobbies: ['שחמט', 'גינון', 'היסטוריה'],
//   dna: true,
//   ta: true,
//   spouses: [
//     {
//       id: 101,
//       tz: '300000002',
//       name: 'שרה כהן',
//       gender: 'נקבה',
//       birthDate: new Date('1932-04-10'),
//       address: 'ירושלים, ישראל',
//       photo: 'https://randomuser.me/api/portraits/women/1.jpg',
//       hobbies: ['סריגה', 'אפייה'],
//       dna: true,
//       ta: false
//     },
//     {
//       id: 102,
//       tz: '300000003',
//       name: 'הגר',
//       gender: 'נקבה',
//       birthDate: new Date('1935-01-01'),
//       address: 'מצרים',
//       photo: 'https://randomuser.me/api/portraits/women/2.jpg',
//       hobbies: ['רכיבה', 'בישול']
//     }
//   ],
//   children: [
//     {
//       id: 2,
//       tz: '300000004',
//       name: 'יצחק כהן', // Grandparent 1
//       gender: 'זכר',
//       birthDate: new Date('1955-08-20'),
//       address: 'תל אביב, ישראל',
//       //photo: 'https://randomuser.me/api/portraits/men/2.jpg',
//       hobbies: ['בישול', 'טיולים'],
//       otherParentId: 101, // Child of Sarah
//       dna: true,
//       ta: true,
//       spouses: [
//         {
//           id: 103,
//           tz: '300000005',
//           name: 'רבקה כהן',
//           gender: 'נקבה',
//           birthDate: new Date('1958-09-01'),
//           address: 'תל אביב, ישראל',
//           photo: 'https://randomuser.me/api/portraits/women/3.jpg',
//           hobbies: ['יוגה', 'ציור'],
//           ta: true
//         }
//       ],
//       children: [
//         {
//           id: 3,
//           tz: '300000006',
//           name: 'יעקב כהן', // Parent 1
//           gender: 'זכר',
//           birthDate: new Date('1980-02-10'),
//           address: 'חיפה, ישראל',
//           photo: 'https://randomuser.me/api/portraits/men/3.jpg',
//           hobbies: ['כדורגל', 'קריאה'],
//           otherParentId: 103, // Child of Rivka
//           dna: true,
//           ta: true,
//           spouses: [
//             {
//               id: 104,
//               tz: '300000007',
//               name: 'רחל כהן',
//               gender: 'נקבה',
//               birthDate: new Date('1982-05-05'),
//               address: 'חיפה, ישראל',
//               photo: 'https://randomuser.me/api/portraits/women/4.jpg',
//               hobbies: ['ריצה'],
//               otherParentId: 7702,
//               dna: true,
//               parents: [
//                 {
//                   id: 201,
//                   name: 'אבא של רחל',
//                   gender: 'זכר',
//                   birthDate: new Date('1950-01-01'),
//                   address: 'תל אביב',
//                   hobbies: [],
//                   spouses:[
//                     {
//                       id: 7702,
//                       name: 'אמא של רחל',
//                       gender: 'נקבה',
//                       birthDate: new Date('1951-01-01'),
//                       address: 'תל אביב',
//                       hobbies: [],
//                     }
//                   ],
//                   children: [
//                     {
//                       id: 202,
//                       name: 'אח של רחל',
//                       gender: 'זכר',
//                       birthDate: new Date('1985-01-01'),
//                       address: 'תל אביב',
//                       hobbies: [],
//                       otherParentId: 7702,
//                       children: [
//                         {
//                           id: 203,
//                           name: 'אחיין של רחל',
//                           gender: 'זכר',
//                           birthDate: new Date('2010-01-01'),
//                           address: 'תל אביב',
//                           hobbies: []
//                         }
//                       ]
//                     }
//                   ]
//                 }
//               ]
//             },
//             {
//               id: 105,
//               tz: '300000008',
//               name: 'לאה כהן',
//               gender: 'נקבה',
//               birthDate: new Date('1983-06-06'),
//               address: 'חיפה, ישראל',
//               photo: 'https://randomuser.me/api/portraits/women/5.jpg',
//               hobbies: ['שחייה'],
//               ta: true
//             }
//           ],
//           children: [
//             // Children of Rachel (s3)
//             {
//               id: 4,
//               tz: '300000009',
//               name: 'יוסף כהן', // Child 1
//               gender: 'זכר',
//               birthDate: new Date('2005-11-30'),
//               address: 'חיפה, ישראל',
//               photo: 'https://randomuser.me/api/portraits/men/4.jpg',
//               hobbies: ['גיימינג', 'ציור'],
//               otherParentId: 104,
//               dna: true,
//               children: []
//             },
//             {
//               id: 5,
//               tz: '300000010',
//               name: 'דינה כהן', // Child 2
//               gender: 'נקבה',
//               birthDate: new Date('2008-06-15'),
//               address: 'חיפה, ישראל',
//               photo: 'https://randomuser.me/api/portraits/women/6.jpg',
//               hobbies: ['ריקוד', 'מוזיקה'],
//               otherParentId: 104,
//               children: []
//             },
//             {
//               id: 12,
//               tz: '300000011',
//               name: 'בנימין כהן', // Child 3 (Rachel)
//               gender: 'זכר',
//               birthDate: new Date('2015-02-20'),
//               address: 'חיפה, ישראל',
//               photo: 'https://randomuser.me/api/portraits/men/5.jpg',
//               hobbies: ['מכוניות', 'ציור'],
//               otherParentId: 104,
//               children: []
//             },
//             // Children of Leah (s4)
//             {
//               id: 13,
//               tz: '300000012',
//               name: 'ראובן כהן',
//               gender: 'זכר',
//               birthDate: new Date('2006-01-15'),
//               address: 'חיפה, ישראל',
//               photo: 'https://randomuser.me/api/portraits/men/6.jpg',
//               hobbies: ['כדורסל'],
//               otherParentId: 105,
//               dna: false,
//               children: []
//             },
//             {
//               id: 14,
//               tz: '300000013',
//               name: 'שמעון כהן',
//               gender: 'זכר',
//               birthDate: new Date('2007-03-22'),
//               address: 'חיפה, ישראל',
//               photo: 'https://randomuser.me/api/portraits/men/7.jpg',
//               hobbies: ['נגינה'],
//               otherParentId: 105,
//               children: []
//             }
//           ]
//         },
//         {
//           id: 6,
//           tz: '300000014',
//           name: 'עשו כהן', // Parent 2
//           gender: 'זכר',
//           birthDate: new Date('1982-01-01'),
//           address: 'אילת, ישראל',
//           photo: 'https://randomuser.me/api/portraits/men/8.jpg',
//           hobbies: ['ציד', 'ספורט אתגרי'],
//           otherParentId: 103, // Child of Rivka
//           ta: true,
//           children: [
//             {
//               id: 7,
//               tz: '300000015',
//               name: 'אליפז כהן',
//               gender: 'זכר',
//               birthDate: new Date('2010-03-20'),
//               address: 'אילת, ישראל',
//               photo: 'https://randomuser.me/api/portraits/men/9.jpg',
//               hobbies: ['שחייה'],
//               // otherParentId: 108 removed because spouse s5 does not exist
//               children: []
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 8,
//       tz: '300000016',
//       name: 'ישמעאל דניאל כהן', // Grandparent 2 - Son of Hagar
//       gender: 'זכר',
//       birthDate: new Date('1958-12-05'),
//       address: 'באר שבע, ישראל',
//       photo: 'https://randomuser.me/api/portraits/men/10.jpg',
//       hobbies: ['קשתות', 'רכיבה'],
//       otherParentId: 102, // LINKED TO HAGAR
//       dna: true,
//       children: [
//         {
//           id: 9,
//           tz: '300000017',
//           name: 'נביות כהן',
//           gender: 'זכר',
//           birthDate: new Date('1985-07-22'),
//           address: 'באר שבע, ישראל',
//           photo: 'https://randomuser.me/api/portraits/men/11.jpg',
//           hobbies: ['חקלאות'],
//           spouses: [
//              {
//               id: 106,
//               tz: '300000018',
//               name: 'מחלת',
//               gender: 'נקבה',
//               birthDate: new Date('1988-08-08'),
//               address: 'באר שבע, ישראל',
//               // photo: 'https://randomuser.me/api/portraits/women/8.jpg',
//               hobbies: ['רכיבה']
//             }
//           ],
//           children: [
//              {
//               id: 10,
//               tz: '300000019',
//               name: 'קידר כהן', // Child Gen 4
//               gender: 'זכר',
//               birthDate: new Date('2012-09-09'),
//               address: 'באר שבע, ישראל',
//               photo: 'https://randomuser.me/api/portraits/men/12.jpg',
//               hobbies: ['לגו'],
//               otherParentId: 106,
//               children: []
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 11,
//       tz: '300000020',
//       name: 'מרים כהן', // Daughter for Gen 2 - Daughter of Sarah
//       gender: 'נקבה',
//       birthDate: new Date('1960-03-15'),
//       address: 'נתניה, ישראל',
//       photo: 'https://randomuser.me/api/portraits/women/9.jpg',
//       hobbies: ['מוזיקה', 'ציור'],
//       otherParentId: 101, // Child of Sarah
//       spouses: [
//         {
//           id: 107,
//           tz: '300000021',
//           name: 'דוד לוי',
//           gender: 'זכר',
//           birthDate: new Date('1959-11-20'),
//           address: 'נתניה, ישראל',
//           photo: 'https://randomuser.me/api/portraits/men/13.jpg',
//           hobbies: ['נגרות', 'דיג']
//         }
//       ],
//       children: []
//     }
//   ]
// };
