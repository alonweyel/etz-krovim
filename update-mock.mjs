import fs from 'fs';

let content = fs.readFileSync('src/data/mock-data.ts', 'utf-8');

const newItemsStr = `
  { "id": 1000001, "tz": "1000001", "name": "דן וייל", "gender": "זכר", "birthDate": "1990-01-01", "address": "הכבאים 13, רמת גן", "parent1": 3928788, "parent2": 9061375, "Level": -1 },
  { "id": 1000002, "tz": "1000002", "name": "מאיה וייל", "gender": "נקבה", "birthDate": "1992-05-05", "address": "הכבאים 13, רמת גן", "parent1": 3928788, "parent2": 9061375, "Level": -1 },
  { "id": 1000101, "tz": "1000101", "name": "משה מושקוביץ", "gender": "זכר", "birthDate": "1980-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000102 }], "children": [{ "id": 1000111, "parent": 1 }, { "id": 1000112, "parent": 1 }, { "id": 1000113, "parent": 1 }, { "id": 1000114, "parent": 1 }, { "id": 1000115, "parent": 1 }] },
  { "id": 1000102, "tz": "1000102", "name": "שרה מושקוביץ", "gender": "נקבה", "birthDate": "1981-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000101 }] },
  { "id": 1000111, "tz": "1000111", "name": "ילד 1 למשה", "gender": "זכר", "birthDate": "2005-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },
  { "id": 1000112, "tz": "1000112", "name": "ילד 2 למשה", "gender": "נקבה", "birthDate": "2006-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },
  { "id": 1000113, "tz": "1000113", "name": "ילד 3 למשה", "gender": "זכר", "birthDate": "2007-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },
  { "id": 1000114, "tz": "1000114", "name": "ילד 4 למשה", "gender": "נקבה", "birthDate": "2008-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },
  { "id": 1000115, "tz": "1000115", "name": "ילד 5 למשה", "gender": "זכר", "birthDate": "2009-01-01", "address": "רמת גן", "parent1": 1000101, "Level": 0 },

  { "id": 1000201, "tz": "1000201", "name": "דוד מושקוביץ", "gender": "זכר", "birthDate": "1982-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000202 }], "children": [{ "id": 1000211, "parent": 1 }, { "id": 1000212, "parent": 1 }, { "id": 1000213, "parent": 1 }, { "id": 1000214, "parent": 1 }, { "id": 1000215, "parent": 1 }] },
  { "id": 1000202, "tz": "1000202", "name": "רחל מושקוביץ", "gender": "נקבה", "birthDate": "1983-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000201 }] },
  { "id": 1000211, "tz": "1000211", "name": "ילד 1 לדוד", "gender": "זכר", "birthDate": "2006-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },
  { "id": 1000212, "tz": "1000212", "name": "ילד 2 לדוד", "gender": "נקבה", "birthDate": "2007-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },
  { "id": 1000213, "tz": "1000213", "name": "ילד 3 לדוד", "gender": "זכר", "birthDate": "2008-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },
  { "id": 1000214, "tz": "1000214", "name": "ילד 4 לדוד", "gender": "נקבה", "birthDate": "2009-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },
  { "id": 1000215, "tz": "1000215", "name": "ילד 5 לדוד", "gender": "זכר", "birthDate": "2010-01-01", "address": "רמת גן", "parent1": 1000201, "Level": 0 },

  { "id": 1000301, "tz": "1000301", "name": "יעל לוי (מושקוביץ)", "gender": "נקבה", "birthDate": "1985-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000302 }], "children": [{ "id": 1000311, "parent": 2 }, { "id": 1000312, "parent": 2 }, { "id": 1000313, "parent": 2 }, { "id": 1000314, "parent": 2 }, { "id": 1000315, "parent": 2 }] },
  { "id": 1000302, "tz": "1000302", "name": "אבי לוי", "gender": "זכר", "birthDate": "1984-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000301 }] },
  { "id": 1000311, "tz": "1000311", "name": "ילד 1 ליעל", "gender": "זכר", "birthDate": "2010-01-01", "address": "רמת גן", "parent1": 1000301, "Level": 0 },
  { "id": 1000312, "tz": "1000312", "name": "ילד 2 ליעל", "gender": "נקבה", "birthDate": "2011-01-01", "address": "רמת גן", "parent1": 1000301, "Level": 0 },
  { "id": 1000313, "tz": "1000313", "name": "ילד 3 ליעל", "gender": "זכר", "birthDate": "2012-01-01", "address": "רמת גן", "parent1": 1000301, "Level": 0 },
  { "id": 1000314, "tz": "1000314", "name": "ילד 4 ליעל", "gender": "נקבה", "birthDate": "2013-01-01", "address": "רמת גן", "parent1": 1000301, "Level": 0 },
  { "id": 1000315, "tz": "1000315", "name": "ילד 5 ליעל", "gender": "זכר", "birthDate": "2014-01-01", "address": "רמת גן", "parent1": 1000301, "Level": 0 },

  { "id": 1000401, "tz": "1000401", "name": "מיכל כהן (מושקוביץ)", "gender": "נקבה", "birthDate": "1992-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000402 }], "children": [{ "id": 1000411, "parent": 2 }, { "id": 1000412, "parent": 2 }, { "id": 1000413, "parent": 2 }, { "id": 1000414, "parent": 2 }, { "id": 1000415, "parent": 2 }] },
  { "id": 1000402, "tz": "1000402", "name": "בן כהן", "gender": "זכר", "birthDate": "1990-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000401 }] },
  { "id": 1000411, "tz": "1000411", "name": "ילד 1 למיכל", "gender": "זכר", "birthDate": "2015-01-01", "address": "רמת גן", "parent1": 1000401, "Level": 0 },
  { "id": 1000412, "tz": "1000412", "name": "ילד 2 למיכל", "gender": "נקבה", "birthDate": "2016-01-01", "address": "רמת גן", "parent1": 1000401, "Level": 0 },
  { "id": 1000413, "tz": "1000413", "name": "ילד 3 למיכל", "gender": "זכר", "birthDate": "2017-01-01", "address": "רמת גן", "parent1": 1000401, "Level": 0 },
  { "id": 1000414, "tz": "1000414", "name": "ילד 4 למיכל", "gender": "נקבה", "birthDate": "2018-01-01", "address": "רמת גן", "parent1": 1000401, "Level": 0 },
  { "id": 1000415, "tz": "1000415", "name": "ילד 5 למיכל", "gender": "זכר", "birthDate": "2019-01-01", "address": "רמת גן", "parent1": 1000401, "Level": 0 },

  { "id": 1000501, "tz": "1000501", "name": "תומר מושקוביץ", "gender": "זכר", "birthDate": "1996-01-01", "address": "רמת גן", "parent1": 9680526, "parent2": 8840116, "Level": -1, "spouses": [{ "id": 1000502 }], "children": [{ "id": 1000511, "parent": 1 }, { "id": 1000512, "parent": 1 }, { "id": 1000513, "parent": 1 }, { "id": 1000514, "parent": 1 }, { "id": 1000515, "parent": 1 }] },
  { "id": 1000502, "tz": "1000502", "name": "דנה מושקוביץ", "gender": "נקבה", "birthDate": "1997-01-01", "address": "רמת גן", "Level": -1, "spouses": [{ "id": 1000501 }] },
  { "id": 1000511, "tz": "1000511", "name": "ילד 1 לתומר", "gender": "זכר", "birthDate": "2020-01-01", "address": "רמת גן", "parent1": 1000501, "Level": 0 },
  { "id": 1000512, "tz": "1000512", "name": "ילד 2 לתומר", "gender": "נקבה", "birthDate": "2021-01-01", "address": "רמת גן", "parent1": 1000501, "Level": 0 },
  { "id": 1000513, "tz": "1000513", "name": "ילד 3 לתומר", "gender": "זכר", "birthDate": "2022-01-01", "address": "רמת גן", "parent1": 1000501, "Level": 0 },
  { "id": 1000514, "tz": "1000514", "name": "ילד 4 לתומר", "gender": "נקבה", "birthDate": "2023-01-01", "address": "רמת גן", "parent1": 1000501, "Level": 0 },
  { "id": 1000515, "tz": "1000515", "name": "ילד 5 לתומר", "gender": "זכר", "birthDate": "2024-01-01", "address": "רמת גן", "parent1": 1000501, "Level": 0 },
`;

content = content.replace(
  /"children": \\s*\\[\\s*\\{\\s*"id": \\s*2068315,\\s*"parent": \\s*1\\s*\\}/,
  '"children": [\n      { "id": 1000001, "parent": 1 },\n      { "id": 1000002, "parent": 1 },\n      { "id": 2068315, "parent": 1 }'
);

content = content.replace(
  /"children": \\s*\\[\\s*\\{\\s*"id": \\s*2068315,\\s*"parent": \\s*2\\s*\\}/,
  '"children": [\n      { "id": 1000001, "parent": 2 },\n      { "id": 1000002, "parent": 2 },\n      { "id": 2068315, "parent": 2 }'
);

content = content.replace(
  /"children": \\s*\\[\\s*\\{\\s*"id": \\s*3743747,\\s*"parent": \\s*2\\s*\\}/,
  '"children": [\n      { "id": 1000101, "parent": 2 },\n      { "id": 1000201, "parent": 2 },\n      { "id": 1000301, "parent": 2 },\n      { "id": 1000401, "parent": 2 },\n      { "id": 1000501, "parent": 2 },\n      { "id": 3743747, "parent": 2 }'
);

content = content.replace(
  /"children": \\s*\\[\\s*\\{\\s*"id": \\s*3743747,\\s*"parent": \\s*1\\s*\\}/,
  '"children": [\n      { "id": 1000101, "parent": 1 },\n      { "id": 1000201, "parent": 1 },\n      { "id": 1000301, "parent": 1 },\n      { "id": 1000401, "parent": 1 },\n      { "id": 1000501, "parent": 1 },\n      { "id": 3743747, "parent": 1 }'
);

content = content.replace(
  /export const FAMILY_DATA: FamilyMemberDTO\\[\\] = \\s*\\[/,
  'export const FAMILY_DATA: FamilyMemberDTO[] = \\n[\\n' + newItemsStr
);

fs.writeFileSync('src/data/mock-data.ts', content, 'utf-8');
console.log("Written!");
