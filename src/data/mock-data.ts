export interface FamilyMemberDTO {
  id: number;
  tz?: string; // תעודת זהות
  name: string;
  gender: 'זכר' | 'נקבה';
  birthDate: Date | string;
  address: string;
  photo?: string;
  hobbies?: string[];
  dna?: boolean; // Indicates if DNA data exists
  ta?: boolean; // Indicates if Fingerprint (Tvia Etzba) exists
  spouses?: pointerAdam[];//FamilyMember[]; // Spouses are now full FamilyMember objects
  children?: pointerAdam[];//FamilyMember[];
  parent1?: number;
  parent2?: number;
  Level?: number;
}

export interface pointerAdam{
  id: number;
  parent?: number;
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
    "id": 1,
    "tz": "000000001",
    "name": "סבא",
    "gender": "זכר",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 2 } ],
    "children": [
      { "id": 3, "parent": 1 },      
      { "id": 4, "parent": 1 },    
    ],
    "Level": -1
  },
    {
    "id": 2,
    "tz": "000000002",
    "name": "סבתא",
    "gender": "נקבה",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 1 } ],
    "children": [
      { "id": 3, "parent": 2 },      
      { "id": 4, "parent": 2 },    
    ],
    "Level": -1
  },
   {
    "id": 3,
    "tz": "000000003",
    "name": "אח 1",
    "gender": "זכר",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 33 } ],
    "children": [
      { "id": 5, "parent": 1 },      
      { "id": 6, "parent": 1 },    
    ],
    "parent1":1,
    "parent2":2,
    "Level": -1
  },
   {
    "id": 31,
    "tz": "000000031",
    "name": "אבא של אשת אח 1",
    "gender": "זכר",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 32 } ],
    "children": [
      { "id": 33, "parent": 1 },  
      ],
    "Level": -1
  },
   {
    "id": 32,
    "tz": "000000032",
    "name": "אמא של אשת אח 1",
    "gender": "נקבה",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 31 } ],
    "children": [
      { "id": 33, "parent": 2 },        
    ],
    "Level": -1
  },
     {
    "id": 33,
    "tz": "000000033",
    "name": "אשת אח 1",
    "gender": "נקבה",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 3 } ],
    "children": [
      { "id": 5, "parent": 2 },      
      { "id": 6, "parent": 2 },    
    ],
    "parent1": 31,
    "parent2": 32,
    "Level": -1
  },
     {
    "id": 4,
    "tz": "000000004",
    "name": "אח 2",
    "gender": "זכר",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "children": [
      { "id": 7, "parent": 1 },      
      { "id": 8, "parent": 1 },    
    ],
    "parent1":1,
    "parent2":2,
    "Level": -1
  },
  {
    "id": 5,
    "tz": "000000005",
    "name": "בן אח 1",
    "gender": "זכר",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 7 } ],
    "parent1":3,
    "parent2":33,
    "Level": -1
  },
    {
    "id": 6,
    "tz": "000000006",
    "name": "בן 2 אח 1",
    "gender": "זכר",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 8 } ],
    "parent1":3,
    "parent2":33,
    "Level": -1
  },
    {
    "id": 7,
    "tz": "000000007",
    "name": "בת אח 2",
    "gender": "נקבה",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 5 } ],
    "parent1":4,
    "Level": -1
  },
    {
    "id": 8,
    "tz": "000000008",
    "name": "בת 2 אח 2",
    "gender": "נקבה",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "spouses": [ { "id": 6 } ],
    "parent1":4,
     "Level": -1
  },
      {
    "id": 10,
    "tz": "000000010",
    "name": "בת אח 1",
    "gender": "נקבה",
    "birthDate": "1960-10-18",
    "address": "המלך יוסף 46, רמת גן",
    "parent1":3,
    "Level": -1
  },
]

// export const FAMILY_DATA: FamilyMemberDTO[] = 
// [
//   { "id": 1000001, "tz": "1000001", "name": "דן וייל", "gender": "זכר", "birthDate": "1990-01-01", "address": "הכבאים 13, רמת גן", "parent1": 3928788, "parent2": 9061375, "Level": -1 },
//   { "id": 1000002, "tz": "1000002", "name": "מאיה וייל", "gender": "נקבה", "birthDate": "1992-05-05", "address": "הכבאים 13, רמת גן", "parent1": 3928788, "parent2": 9061375, "Level": -1 },

//   { "id": 1000101, "tz": "1000101", "name": "משה מושקוביץ", "gender": "זכר", "birthDate": "1980-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000102 }], "children": [{ "id": 1000111, "parent": 1 }, { "id": 1000112, "parent": 1 }, { "id": 1000113, "parent": 1 }, { "id": 1000114, "parent": 1 }, { "id": 1000115, "parent": 1 }] },
//   { "id": 1000102, "tz": "1000102", "name": "שרה מושקוביץ", "gender": "נקבה", "birthDate": "1981-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000101 }] },
//   { "id": 1000111, "tz": "1000111", "name": "ילד 1 למשה", "gender": "זכר", "birthDate": "2005-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },
//   { "id": 1000112, "tz": "1000112", "name": "ילד 2 למשה", "gender": "נקבה", "birthDate": "2006-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },
//   { "id": 1000113, "tz": "1000113", "name": "ילד 3 למשה", "gender": "זכר", "birthDate": "2007-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },
//   { "id": 1000114, "tz": "1000114", "name": "ילד 4 למשה", "gender": "נקבה", "birthDate": "2008-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },
//   { "id": 1000115, "tz": "1000115", "name": "ילד 5 למשה", "gender": "זכר", "birthDate": "2009-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },

//   { "id": 1000201, "tz": "1000201", "name": "דוד מושקוביץ", "gender": "זכר", "birthDate": "1982-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000202 }, { "id": 1000203 }], "children": [{ "id": 1000211, "parent": 1 }, { "id": 1000212, "parent": 1 }, { "id": 1000213, "parent": 1 }, { "id": 1000214, "parent": 1 }, { "id": 1000215, "parent": 1 }] },
//   { "id": 1000202, "tz": "1000202", "name": "רחל מושקוביץ", "gender": "נקבה", "birthDate": "1983-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000201 }] },
//   { "id": 1000203, "tz": "1000203", "name": "דינה מושקוביץ", "gender": "נקבה", "birthDate": "1985-05-05", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000201 }] },
//   { "id": 1000211, "tz": "1000211", "name": "ילד 1 לדוד", "gender": "זכר", "birthDate": "2006-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },
//   { "id": 1000212, "tz": "1000212", "name": "ילד 2 לדוד", "gender": "נקבה", "birthDate": "2007-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },
//   { "id": 1000213, "tz": "1000213", "name": "ילד 3 לדוד", "gender": "זכר", "birthDate": "2008-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },
//   { "id": 1000214, "tz": "1000214", "name": "ילד 4 לדוד", "gender": "נקבה", "birthDate": "2009-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },
//   { "id": 1000215, "tz": "1000215", "name": "ילד 5 לדוד", "gender": "זכר", "birthDate": "2010-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },

//   { "id": 1000301, "tz": "1000301", "name": "יעל לוי (מושקוביץ)", "gender": "נקבה", "birthDate": "1985-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000302 }], "children": [{ "id": 1000311, "parent": 2 }, { "id": 1000312, "parent": 2 }, { "id": 1000313, "parent": 2 }, { "id": 1000314, "parent": 2 }, { "id": 1000315, "parent": 2 }] },
//   { "id": 1000302, "tz": "1000302", "name": "אבי לוי", "gender": "זכר", "birthDate": "1984-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000301 }] },
//   { "id": 1000311, "tz": "1000311", "name": "ילד 1 ליעל", "gender": "זכר", "birthDate": "2010-01-01", "address": "רמת גן", "parent1": 1000301, "parent2": 1000302, "Level": 0 },
//   { "id": 1000312, "tz": "1000312", "name": "ילד 2 ליעל", "gender": "נקבה", "birthDate": "2011-01-01", "address": "רמת גן", "parent1": 1000301, "parent2": 1000302, "Level": 0 },
//   { "id": 1000313, "tz": "1000313", "name": "ילד 3 ליעל", "gender": "זכר", "birthDate": "2012-01-01", "address": "רמת גן", "parent1": 1000301, "parent2": 1000302, "Level": 0 },
//   { "id": 1000314, "tz": "1000314", "name": "ילד 4 ליעל", "gender": "נקבה", "birthDate": "2013-01-01", "address": "רמת גן", "parent1": 1000301, "parent2": 1000302, "Level": 0 },
//   { "id": 1000315, "tz": "1000315", "name": "ילד 5 ליעל", "gender": "זכר", "birthDate": "2014-01-01", "address": "רמת גן", "parent1": 1000301, "parent2": 1000302, "Level": 0 },

//   { "id": 1000401, "tz": "1000401", "name": "מיכל כהן (מושקוביץ)", "gender": "נקבה", "birthDate": "1992-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000402 }], "children": [{ "id": 1000411, "parent": 2 }, { "id": 1000412, "parent": 2 }, { "id": 1000413, "parent": 2 }, { "id": 1000414, "parent": 2 }, { "id": 1000415, "parent": 2 }] },
//   { "id": 1000402, "tz": "1000402", "name": "בן כהן", "gender": "זכר", "birthDate": "1990-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000401 }] },
//   { "id": 1000411, "tz": "1000411", "name": "ילד 1 למיכל", "gender": "זכר", "birthDate": "2015-01-01", "address": "רמת גן", "parent1": 1000401, "parent2": 1000402, "Level": 0 },
//   { "id": 1000412, "tz": "1000412", "name": "ילד 2 למיכל", "gender": "נקבה", "birthDate": "2016-01-01", "address": "רמת גן", "parent1": 1000401, "parent2": 1000402, "Level": 0 },
//   { "id": 1000413, "tz": "1000413", "name": "ילד 3 למיכל", "gender": "זכר", "birthDate": "2017-01-01", "address": "רמת גן", "parent1": 1000401, "parent2": 1000402, "Level": 0 },
//   { "id": 1000414, "tz": "1000414", "name": "ילד 4 למיכל", "gender": "נקבה", "birthDate": "2018-01-01", "address": "רמת גן", "parent1": 1000401, "parent2": 1000402, "Level": 0 },
//   { "id": 1000415, "tz": "1000415", "name": "ילד 5 למיכל", "gender": "זכר", "birthDate": "2019-01-01", "address": "רמת גן", "parent1": 1000401, "parent2": 1000402, "Level": 0 },

//   { "id": 1000501, "tz": "1000501", "name": "תומר מושקוביץ", "gender": "זכר", "birthDate": "1996-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000502 }], "children": [{ "id": 1000511, "parent": 1 }, { "id": 1000512, "parent": 1 }, { "id": 1000513, "parent": 1 }, { "id": 1000514, "parent": 1 }, { "id": 1000515, "parent": 1 }] },
//   { "id": 1000502, "tz": "1000502", "name": "דנה מושקוביץ", "gender": "נקבה", "birthDate": "1997-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000501 }] },
//   { "id": 1000511, "tz": "1000511", "name": "ילד 1 לתומר", "gender": "זכר", "birthDate": "2020-01-01", "address": "רמת גן", "parent1": 1000501, "parent2": 1000502, "Level": 0 },
//   { "id": 1000512, "tz": "1000512", "name": "ילד 2 לתומר", "gender": "נקבה", "birthDate": "2021-01-01", "address": "רמת גן", "parent1": 1000501, "parent2": 1000502, "Level": 0 },
//   { "id": 1000513, "tz": "1000513", "name": "ילד 3 לתומר", "gender": "זכר", "birthDate": "2022-01-01", "address": "רמת גן", "parent1": 1000501, "parent2": 1000502, "Level": 0 },
//   { "id": 1000514, "tz": "1000514", "name": "ילד 4 לתומר", "gender": "נקבה", "birthDate": "2023-01-01", "address": "רמת גן", "parent1": 1000501, "parent2": 1000502, "Level": 0 },
//   { "id": 1000515, "tz": "1000515", "name": "ילד 5 לתומר", "gender": "זכר", "birthDate": "2024-01-01", "address": "רמת גן", "parent1": 1000501, "parent2": 1000502, "Level": 0 },
  
//   {
//     "id": 3928788,
//     "tz": "12015111",
//     "name": "יוסף מוריץ וייל",
//     "gender": "זכר",
//     "birthDate": "1948-06-16",
//     "address": "הכבאים 13, רמת גן",
//     "spouses": [ { "id": 9061375 } ],
//     "children": [
//       { "id": 1000001, "parent": 1 },
//       { "id": 1000002, "parent": 1 },
//       { "id": 2068315, "parent": 1 },
//       { "id": 2528413, "parent": 1 },
//       { "id": 5008702, "parent": 1 },
//       { "id": 15825351, "parent": 1 }
//     ],
//     "Level": -2
//   },
//   {
//     "id": 9061375,
//     "tz": "47707617",
//     "name": "פלורה וייל",
//     "gender": "נקבה",
//     "birthDate": "1950-12-25",
//     "address": "הכבאים 13, רמת גן",
//     "spouses": [ { "id": 3928788 } ],
//     "children": [
//       { "id": 1000001, "parent": 2 },
//       { "id": 1000002, "parent": 2 },
//       { "id": 2068315, "parent": 2 },
//       { "id": 2528413, "parent": 2 },
//       { "id": 5008702, "parent": 2 },
//       { "id": 15825351, "parent": 2 }
//     ],
//     "Level": -2
//   },
//   {
//     "id": 8840116,
//     "tz": "56690258",
//     "name": "רינה מושקוביץ",
//     "gender": "נקבה",
//     "birthDate": "1960-10-18",
//     "address": "המלך יוסף 46, רמת גן",
//     "spouses": [ { "id": 9680526 } ],
//     "children": [
//       { "id": 1000101, "parent": 2 },
//       { "id": 1000201, "parent": 2 },
//       { "id": 1000301, "parent": 2 },
//       { "id": 1000401, "parent": 2 },
//       { "id": 1000501, "parent": 2 },
//       { "id": 3743747, "parent": 2 },
//       { "id": 4244330, "parent": 2 },
//       { "id": 6744884, "parent": 2 },
//       { "id": 8287415, "parent": 2 }
//     ],
//     "Level": -2
//   },
//   {
//     "id": 9680526,
//     "tz": "56757297",
//     "name": "יעקב מושקוביץ",
//     "gender": "זכר",
//     "birthDate": "1960-12-17",
//     "address": "המלך יוסף 46, דירה 1, רמת גן",
//     "spouses": [ { "id": 8840116 } ],
//     "children": [
//       { "id": 1000101, "parent": 1 },
//       { "id": 1000201, "parent": 1 },
//       { "id": 1000301, "parent": 1 },
//       { "id": 1000401, "parent": 1 },
//       { "id": 1000501, "parent": 1 },
//       { "id": 3743747, "parent": 1 },
//       { "id": 4244330, "parent": 1 },
//       { "id": 6744884, "parent": 1 },
//       { "id": 8287415, "parent": 1 }
//     ],
//     "Level": -2
//   },
//   {
//     "id": 15825351,
//     "tz": "27121029",
//     "name": "וייל",
//     "gender": "זכר",
//     "birthDate": "1974-02-01",
//     "address": "גרשום 15, רמת גן",
//     "parent1": 3928788,
//     "parent2": 9061375,
//     "Level": -1
//   },
//   {
//     "id": 5008702,
//     "tz": "27394139",
//     "name": "סגלית קלרה ראובן וייל",
//     "gender": "נקבה",
//     "birthDate": "1975-02-12",
//     "address": "משה סנה 14, דירה 5, פתח תקווה",
//     "spouses": [ { "id": 8300009 } ],
//     "children": [
//       { "id": 12987572, "parent": 1 },
//       { "id": 13944190, "parent": 1 }
//     ],
//     "parent1": 3928788,
//     "parent2": 9061375,
//     "Level": -1
//   },
//    {
//     "id": 2068315,
//     "tz": "038155073",
//     "name": "אלון וייל",
//     "gender": "זכר",
//     "birthDate": "1986-01-25",
//     "address": "הכבאים 13, דירה 16, רמת גן",
//     "spouses": [ { "id": 6744884 } ],
//     "children": [
//       { "id": 15260362, "parent": 1 },
//       { "id": 16477946, "parent": 1 },
//       { "id": 20649572, "parent": 1 }
//     ],
//     "parent1": 3928788,
//     "parent2": 9061375,
//     "Level": -1
//   },
//   {
//     "id": 6744884,
//     "tz": "32533937",
//     "name": "לי-טל וייל",
//     "gender": "נקבה",
//     "birthDate": "1986-08-10",
//     "address": "הכבאים 13, דירה 16, רמת גן",
//     "spouses": [ { "id": 2068315 } ],
//     "children": [
//       { "id": 15260362, "parent": 2 },
//       { "id": 16477946, "parent": 2 },
//       { "id": 20649572, "parent": 2 }
//     ],
//     "parent1": 9680526,
//     "parent2": 8840116,
//     "Level": -1
//   },
//   {
//     "id": 12973026,
//     "tz": "328745377",
//     "name": "מיריאלה תמר ברנשטיין וייל",
//     "gender": "נקבה",
//     "birthDate": "1975-12-17",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "spouses": [ { "id": 2528413 } ],
//     "Level": -1
//   },
//   {
//     "id": 8300009,
//     "tz": "38648200",
//     "name": "נאור ראובן",
//     "gender": "זכר",
//     "birthDate": "1976-02-27",
//     "address": "משה סנה 14, דירה 5, פתח תקווה",
//     "spouses": [ { "id": 5008702 } ],
//     "Level": -1
//   },
//   {
//     "id": 2528413,
//     "tz": "34118265",
//     "name": "ערן וייל",
//     "gender": "זכר",
//     "birthDate": "1977-06-03",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "spouses": [ { "id": 12973026 } ],
//     "children": [
//       { "id": 13226922, "parent": 1 },
//       { "id": 13583789, "parent": 1 },
//       { "id": 14214699, "parent": 1 },
//       { "id": 14778197, "parent": 1 },
//       { "id": 16210048, "parent": 1 },
//       { "id": 17215614, "parent": 1 },
//       { "id": 18028579, "parent": 1 }
//     ],
//     "parent1": 3928788,
//     "parent2": 9061375,
//     "Level": -1
//   },
//   {
//     "id": 8689438,
//     "tz": "52678539",
//     "name": "יעקב טימסית",
//     "gender": "זכר",
//     "birthDate": "1981-11-20",
//     "address": "הנדיב 25, בנימינה גבעת עדה",
//     "spouses": [ { "id": 8287415 } ],
//     "Level": -1
//   },
//   {
//     "id": 8287415,
//     "tz": "66647256",
//     "name": "מעין טימסית",
//     "gender": "נקבה",
//     "birthDate": "1984-04-30",
//     "address": "הנדיב 25, בנימינה גבעת עדה",
//     "spouses": [ { "id": 8689438 } ],
//     "children": [
//       { "id": 14467662, "parent": 1 },
//       { "id": 15064816, "parent": 1 },
//       { "id": 16390515, "parent": 1 },
//       { "id": 24698466, "parent": 1 }
//     ],
//     "parent1": 9680526,
//     "parent2": 8840116,
//     "Level": -1
//   },
 
//   {
//     "id": 4244330,
//     "tz": "200331304",
//     "name": "מטר מושקוביץ",
//     "gender": "זכר",
//     "birthDate": "1988-04-30",
//     "address": "אחים קיבוץ 18, דירה 10, רחובות",
//     "spouses": [ { "id": 10482465 } ],
//     "children": [
//       { "id": 19130231, "parent": 1 },
//       { "id": 24849710, "parent": 1 }
//     ],
//     "parent1": 9680526,
//     "parent2": 8840116,
//     "Level": -1
//   },
//   {
//     "id": 10482465,
//     "tz": "200823920",
//     "name": "דניאל צחור מושקוביץ",
//     "gender": "נקבה",
//     "birthDate": "1989-07-05",
//     "address": "אחים קיבוץ 18, דירה 10, רחובות",
//     "spouses": [ { "id": 4244330 } ],
//     "Level": -1
//   },
//   {
//     "id": 3743747,
//     "tz": "305028193",
//     "name": "ניר חי מושקוביץ",
//     "gender": "זכר",
//     "birthDate": "1990-09-26",
//     "address": "נווה אלון 15, דירה 15, רחובות",
//     "spouses": [ { "id": 7380045 } ],
//     "children": [
//       { "id": 25536053, "parent": 1 }
//     ],
//     "parent1": 9680526,
//     "parent2": 8840116,
//     "Level": -1
//   },
//   {
//     "id": 7380045,
//     "tz": "311579270",
//     "name": "נוי בר דוד מושקוביץ",
//     "gender": "נקבה",
//     "birthDate": "1994-04-11",
//     "address": "נווה אלון 15, דירה 15, רחובות",
//     "spouses": [ { "id": 3743747 } ],
//     "Level": -1
//   },
//   {
//     "id": 12987572,
//     "tz": "215899999",
//     "name": "עידן ראובן וייל",
//     "gender": "זכר",
//     "birthDate": "2006-05-19",
//     "address": "משה סנה 14, דירה 5, פתח תקווה",
//     "parent1": 5008702,
//     "Level": 0
//   },
//   {
//     "id": 13226922,
//     "tz": "216797274",
//     "name": "דוד אלעאי וייל",
//     "gender": "זכר",
//     "birthDate": "2007-03-20",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "parent1": 2528413,
//     "Level": 0
//   },
//   {
//     "id": 13583789,
//     "tz": "217645910",
//     "name": "הדס גיטל וייל",
//     "gender": "נקבה",
//     "birthDate": "2008-04-20",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "parent1": 2528413,
//     "Level": 0
//   },
//   {
//     "id": 13944190,
//     "tz": "218210003",
//     "name": "עמית ראובן וייל",
//     "gender": "זכר",
//     "birthDate": "2009-05-08",
//     "address": "משה סנה 14, דירה 5, פתח תקווה",
//     "parent1": 5008702,
//     "Level": 0
//   },
//   {
//     "id": 14214699,
//     "tz": "334625415",
//     "name": "מיכל שמחה וייל",
//     "gender": "נקבה",
//     "birthDate": "2010-02-18",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "parent1": 2528413,
//     "Level": 0
//   },
//   {
//     "id": 14467662,
//     "tz": "220342000",
//     "name": "גפן כרמל טימסית",
//     "gender": "נקבה",
//     "birthDate": "2010-11-18",
//     "address": "הנדיב 25, בנימינה גבעת עדה",
//     "parent1": 8287415,
//     "Level": 0
//   },
//   {
//     "id": 14778197,
//     "tz": "335460994",
//     "name": "יוסף חיים וייל",
//     "gender": "זכר",
//     "birthDate": "2011-09-18",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "parent1": 2528413,
//     "Level": 0
//   },
//   {
//     "id": 15064816,
//     "tz": "336875703",
//     "name": "בן ישראל טימסית",
//     "gender": "זכר",
//     "birthDate": "2012-08-17",
//     "address": "הנדיב 25, בנימינה גבעת עדה",
//     "parent1": 8287415,
//     "Level": 0
//   },
//   {
//     "id": 15260362,
//     "tz": "337157770",
//     "name": "יעל וייל",
//     "gender": "נקבה",
//     "birthDate": "2013-03-11",
//     "address": "הכבאים 13, דירה 16, רמת גן",
//     "parent1": 2068315,
//     "parent2": 6744884,
//     "Level": 0
//   },
//   {
//     "id": 16210048,
//     "tz": "222645327",
//     "name": "יעקב מאיר וייל",
//     "gender": "זכר",
//     "birthDate": "2013-10-23",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "parent1": 2528413,
//     "Level": 0
//   },
//   {
//     "id": 16390515,
//     "tz": "330131426",
//     "name": "פלג ירדן טימסית",
//     "gender": "זכר",
//     "birthDate": "2013-12-22",
//     "address": "הנדיב 25, בנימינה גבעת עדה",
//     "parent1": 8287415,
//     "Level": 0
//   },
//   {
//     "id": 16477946,
//     "tz": "222772444",
//     "name": "נועה וייל",
//     "gender": "נקבה",
//     "birthDate": "2014-09-06",
//     "address": "הכבאים 13, דירה 16, רמת גן",
//     "parent1": 2068315,
//     "parent2": 6744884,
//     "Level": 0
//   },
//   {
//     "id": 17215614,
//     "tz": "340695683",
//     "name": "אביגיל וייל",
//     "gender": "נקבה",
//     "birthDate": "2015-08-07",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "parent1": 2528413,
//     "Level": 0
//   },
//   {
//     "id": 18028579,
//     "tz": "343670048",
//     "name": "נעמה פרימט וייל",
//     "gender": "נקבה",
//     "birthDate": "2017-10-06",
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש",
//     "parent1": 2528413,
//     "Level": 0
//   },
//   {
//     "id": 24698466,
//     "tz": "237718077",
//     "name": "אליענה טימסית",
//     "gender": "נקבה",
//     "birthDate": "2018-09-30",
//     "address": "הנדיב 25, בנימינה גבעת עדה",
//     "parent1": 8287415,
//     "Level": 0
//   },
//   {
//     "id": 19130231,
//     "tz": "229453311",
//     "name": "נועם שלמה מושקוביץ",
//     "gender": "זכר",
//     "birthDate": "2019-12-15",
//     "address": "אחים קיבוץ 18, דירה 10, רחובות",
//     "parent1": 4244330,
//     "Level": 0
//   },
//   {
//     "id": 20649572,
//     "tz": "233840008",
//     "name": "איתן וייל",
//     "gender": "זכר",
//     "birthDate": "2020-08-17",
//     "address": "הכבאים 13, דירה 16, רמת גן",
//     "parent1": 2068315,
//     "parent2": 6744884,
//     "Level": 0
//   },
//   {
//     "id": 24849710,
//     "tz": "238988018",
//     "name": "ניב מושקוביץ",
//     "gender": "נקבה",
//     "birthDate": "2023-09-21",
//     "address": "אחים קיבוץ 18, דירה 10, רחובות",
//     "parent1": 4244330,
//     "Level": 0
//   },
//   {
//     "id": 25536053,
//     "tz": "240664946",
//     "name": "אלה מושקוביץ",
//     "gender": "נקבה",
//     "birthDate": "2025-02-28",
//     "address": "נווה אלון 15, דירה 15, רחובות",
//     "parent1": 3743747,
//     "Level": 0
//   }
// ]

// export const FAMILY_DATA: FamilyMemberDTO[] = [
//   {
//     "id": 3928788,
//     "tz": "12015111",
//     "name": "יוסף מוריץ וייל",
//     "gender": "זכר",
//     "birthDate": new Date('1948-06-16'),
//     "address": "הנביאים 13, רמת גן, 5225513",
//     "spouses": [9061375],
//     "children": [15825351, 5008702, 2528413, 2068315],

//   },

//   {
//     "id": 9061375,
//     "tz": "47707617",
//     "name": "פלורה וייל",
//     "gender": "נקבה",
//     "birthDate": new Date('1950-12-25'),
//     "address": "הנביאים 13, רמת גן, 5225513",
//     "spouses": [3928788],
//     "children": [15825351, 5008702, 2528413, 2068315],
//   },

//   {
//     "id": 15825351,
//     "tz": "27121029",
//     "name": "וייל",
//     "gender": "זכר",
//     "birthDate": new Date("1974-02-01"),
//     "address": "גרשום 15, רמת גן, 5228643",
//     "parent1": 3928788,
//     "parent2": 9061375,
//   },
//   {
//     "id": 5008702,
//     "tz": "27394139",
//     "name": "סגלית קלרה ראובן וייל",
//     "gender": "נקבה",
//     "birthDate": new Date("1975-02-12"),
//     "address": "משה סנה 14, דירה 5, פתח תקווה, 4922353",
//     "spouses": [830009],
//     "children": [12987572, 13944190],
//     "parent1": 3928788,
//     "parent2": 9061375,
//   },

//   {
//     "id": 830009,
//     "tz": "38648200",
//     "name": "נאור ראובן",
//     "gender": "זכר",
//     "birthDate": new Date("1976-02-27"),
//     "address": "משה סנה 14, דירה 5, פתח תקווה, 4922353",
//     "spouses": [5008702],
//     "children": [12987572, 13944190],

//   },
//   {
//     "id": 12987572,
//     "tz": "215889999",
//     "name": "עידן ראובן וייל",
//     "gender": "זכר",
//     "birthDate": new Date("2006-05-19"),
//     "address": "משה סנה 14, דירה 5, פתח תקווה, 4922353",
//     "parent1": 5008702,
//     "parent2": 830009,
//   },
//   {
//     "id": 13944190,
//     "tz": "218210003",
//     "name": "עמית ראובן וייל",
//     "gender": "זכר",
//     "birthDate": new Date("2009-05-08"),
//     "address": "משה סנה 14, דירה 5, פתח תקווה, 4922353",
//     "parent1": 5008702,
//     "parent2": 830009,
//   },
//   {
//     "id": 2528413,
//     "tz": "34118265",
//     "name": "ערן וייל",
//     "gender": "זכר",
//     "birthDate": new Date("1977-06-03"),
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש, 9914121",
//     "spouses": [12973026],
//     "children": [13226922, 13583789],
//     "parent1": 3928788,
//     "parent2": 9061375,
//   },
//   {
//     "id": 12973026,
//     "tz": "328745377",
//     "name": "מריאלה תמר ברנשטיין וייל",
//     "gender": "נקבה",
//     "birthDate": new Date("1975-12-17"),
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש, 9914121",
//     "spouses": [2528413],
//     "children": [13226922, 13583789],
//   },
//   {
//     "id": 13226922,
//     "tz": "216797274",
//     "name": "דוד אלעאי וייל",
//     "gender": "זכר",
//     "birthDate": new Date("2007-03-20"),
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש, 9914121",
//     "parent1": 2528413,
//     "parent2": 12973026,
//   },
//   {
//     "id": 13583789,
//     "tz": "217645910",
//     "name": "הדס גיטל וייל",
//     "gender": "נקבה",
//     "birthDate": new Date("2008-04-20"),
//     "address": "מלאכי הנביא 10, דירה 27, בית שמש, 9914121",
//     "parent1": 2528413,
//     "parent2": 12973026,
//   },
//   {
//     "id": 2068315,
//     "tz": "38155073",
//     "name": "אלון וייל",
//     "gender": "זכר",
//     "birthDate": new Date("1986-01-25"),
//     "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
//     "spouses": [6744884],
//     "children": [15260362, 16477946, 20649572],
//     "parent1": 3928788,
//     "parent2": 9061375,
//   },
//   {
//     "id": 6744884,
//     "tz": "32533937",
//     "name": "לי-טל וייל",
//     "gender": "נקבה",
//     "birthDate": new Date("1986-08-10"),
//     "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
//     "spouses": [2068315],
//     "children": [15260362, 16477946, 20649572],
//     "parent1": 1111,
//     "parent2": 2222,
//   },
//   {
//     "id": 15260362,
//     "tz": "337157770",
//     "name": "יעל וייל",
//     "gender": "נקבה",
//     "birthDate": new Date("2013-03-11"),
//     "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
//     "parent1": 2068315,
//     "parent2": 6744884,
//   },
//   {
//     "id": 16477946,
//     "tz": "222772444",
//     "name": "נועה וייל",
//     "gender": "נקבה",
//     "birthDate": new Date("2014-09-06"),
//     "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
//     "parent1": 2068315,
//     "parent2": 6744884,
//   },
//   {
//     "id": 20649572,
//     "tz": "233840008",
//     "name": "איתן וייל",
//     "gender": "זכר",
//     "birthDate": new Date("2020-08-17"),
//     "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
//     "parent1": 2068315,
//     "parent2": 6744884,
//   },
//   {
//     "id": 1111,
//     "tz": "1111",
//     "name": "יעקב מובשוביץ",
//     "gender": "זכר",
//     "birthDate": new Date("1950-08-10"),
//     "address": "הנ, רמת גן, 5225513",
//     "spouses": [2222],
//     "children": [6744884, 3333],
//   },
//   {
//     "id": 2222,
//     "tz": "2222",
//     "name": "רינה מובשבוביץ",
//     "gender": "נקבה",
//     "birthDate": new Date("1950-08-10"),
//     "address": "הנ, רמת גן, 5225513",
//     "spouses": [1111],
//     "children": [6744884, 3333],
//   },
//   {
//     "id": 3333,
//     "tz": "3333",
//     "name": "מעין",
//     "gender": "נקבה",
//     "birthDate": new Date("1986-08-10"),
//     "address": "הנביאים 13, דירה 16, רמת גן, 5225513",
//     "spouses": [],
//     "children": [],
//     "parent1": 1111,
//     "parent2": 2222, 
//   }, 
// ]


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
