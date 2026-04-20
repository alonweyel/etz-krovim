// src/data/mock-data.ts
var FAMILY_DATA = [
  {
    "id": 3928788,
    "tz": "12015111",
    "name": "\u05D9\u05D5\u05E1\u05E3 \u05DE\u05D5\u05E8\u05D9\u05E5 \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("1948-06-16"),
    "address": "\u05D4\u05E0\u05D1\u05D9\u05D0\u05D9\u05DD 13, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "spouses": [9061375],
    "children": [15825351, 5008702, 2528413, 2068315]
  },
  {
    "id": 9061375,
    "tz": "47707617",
    "name": "\u05E4\u05DC\u05D5\u05E8\u05D4 \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("1950-12-25"),
    "address": "\u05D4\u05E0\u05D1\u05D9\u05D0\u05D9\u05DD 13, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "spouses": [3928788],
    "children": [15825351, 5008702, 2528413, 2068315]
  },
  {
    "id": 15825351,
    "tz": "27121029",
    "name": "\u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("1974-02-01"),
    "address": "\u05D2\u05E8\u05E9\u05D5\u05DD 15, \u05E8\u05DE\u05EA \u05D2\u05DF, 5228643",
    "parent1": 3928788,
    "parent2": 9061375
  },
  {
    "id": 5008702,
    "tz": "27394139",
    "name": "\u05E1\u05D2\u05DC\u05D9\u05EA \u05E7\u05DC\u05E8\u05D4 \u05E8\u05D0\u05D5\u05D1\u05DF \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("1975-02-12"),
    "address": "\u05DE\u05E9\u05D4 \u05E1\u05E0\u05D4 14, \u05D3\u05D9\u05E8\u05D4 5, \u05E4\u05EA\u05D7 \u05EA\u05E7\u05D5\u05D5\u05D4, 4922353",
    "spouses": [830009],
    "children": [12987572, 13944190],
    "parent1": 3928788,
    "parent2": 9061375
  },
  {
    "id": 830009,
    "tz": "38648200",
    "name": "\u05E0\u05D0\u05D5\u05E8 \u05E8\u05D0\u05D5\u05D1\u05DF",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("1976-02-27"),
    "address": "\u05DE\u05E9\u05D4 \u05E1\u05E0\u05D4 14, \u05D3\u05D9\u05E8\u05D4 5, \u05E4\u05EA\u05D7 \u05EA\u05E7\u05D5\u05D5\u05D4, 4922353",
    "spouses": [5008702],
    "children": [12987572, 13944190]
  },
  {
    "id": 12987572,
    "tz": "215889999",
    "name": "\u05E2\u05D9\u05D3\u05DF \u05E8\u05D0\u05D5\u05D1\u05DF \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("2006-05-19"),
    "address": "\u05DE\u05E9\u05D4 \u05E1\u05E0\u05D4 14, \u05D3\u05D9\u05E8\u05D4 5, \u05E4\u05EA\u05D7 \u05EA\u05E7\u05D5\u05D5\u05D4, 4922353",
    "parent1": 5008702,
    "parent2": 830009
  },
  {
    "id": 13944190,
    "tz": "218210003",
    "name": "\u05E2\u05DE\u05D9\u05EA \u05E8\u05D0\u05D5\u05D1\u05DF \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("2009-05-08"),
    "address": "\u05DE\u05E9\u05D4 \u05E1\u05E0\u05D4 14, \u05D3\u05D9\u05E8\u05D4 5, \u05E4\u05EA\u05D7 \u05EA\u05E7\u05D5\u05D5\u05D4, 4922353",
    "parent1": 5008702,
    "parent2": 830009
  },
  {
    "id": 2528413,
    "tz": "34118265",
    "name": "\u05E2\u05E8\u05DF \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("1977-06-03"),
    "address": "\u05DE\u05DC\u05D0\u05DB\u05D9 \u05D4\u05E0\u05D1\u05D9\u05D0 10, \u05D3\u05D9\u05E8\u05D4 27, \u05D1\u05D9\u05EA \u05E9\u05DE\u05E9, 9914121",
    "spouses": [12973026],
    "children": [13226922, 13583789],
    "parent1": 3928788,
    "parent2": 9061375
  },
  {
    "id": 12973026,
    "tz": "328745377",
    "name": "\u05DE\u05E8\u05D9\u05D0\u05DC\u05D4 \u05EA\u05DE\u05E8 \u05D1\u05E8\u05E0\u05E9\u05D8\u05D9\u05D9\u05DF \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("1975-12-17"),
    "address": "\u05DE\u05DC\u05D0\u05DB\u05D9 \u05D4\u05E0\u05D1\u05D9\u05D0 10, \u05D3\u05D9\u05E8\u05D4 27, \u05D1\u05D9\u05EA \u05E9\u05DE\u05E9, 9914121",
    "spouses": [2528413],
    "children": [13226922, 13583789]
  },
  {
    "id": 13226922,
    "tz": "216797274",
    "name": "\u05D3\u05D5\u05D3 \u05D0\u05DC\u05E2\u05D0\u05D9 \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("2007-03-20"),
    "address": "\u05DE\u05DC\u05D0\u05DB\u05D9 \u05D4\u05E0\u05D1\u05D9\u05D0 10, \u05D3\u05D9\u05E8\u05D4 27, \u05D1\u05D9\u05EA \u05E9\u05DE\u05E9, 9914121",
    "parent1": 2528413,
    "parent2": 12973026
  },
  {
    "id": 13583789,
    "tz": "217645910",
    "name": "\u05D4\u05D3\u05E1 \u05D2\u05D9\u05D8\u05DC \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("2008-04-20"),
    "address": "\u05DE\u05DC\u05D0\u05DB\u05D9 \u05D4\u05E0\u05D1\u05D9\u05D0 10, \u05D3\u05D9\u05E8\u05D4 27, \u05D1\u05D9\u05EA \u05E9\u05DE\u05E9, 9914121",
    "parent1": 2528413,
    "parent2": 12973026
  },
  {
    "id": 2068315,
    "tz": "38155073",
    "name": "\u05D0\u05DC\u05D5\u05DF \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("1986-01-25"),
    "address": "\u05D4\u05E0\u05D1\u05D9\u05D0\u05D9\u05DD 13, \u05D3\u05D9\u05E8\u05D4 16, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "spouses": [6744884],
    "children": [15260362, 16477946, 20649572],
    "parent1": 3928788,
    "parent2": 9061375
  },
  {
    "id": 6744884,
    "tz": "32533937",
    "name": "\u05DC\u05D9-\u05D8\u05DC \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("1986-08-10"),
    "address": "\u05D4\u05E0\u05D1\u05D9\u05D0\u05D9\u05DD 13, \u05D3\u05D9\u05E8\u05D4 16, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "spouses": [2068315],
    "children": [15260362, 16477946, 20649572],
    "parent1": 1111,
    "parent2": 2222
  },
  {
    "id": 15260362,
    "tz": "337157770",
    "name": "\u05D9\u05E2\u05DC \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("2013-03-11"),
    "address": "\u05D4\u05E0\u05D1\u05D9\u05D0\u05D9\u05DD 13, \u05D3\u05D9\u05E8\u05D4 16, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "parent1": 2068315,
    "parent2": 6744884
  },
  {
    "id": 16477946,
    "tz": "222772444",
    "name": "\u05E0\u05D5\u05E2\u05D4 \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("2014-09-06"),
    "address": "\u05D4\u05E0\u05D1\u05D9\u05D0\u05D9\u05DD 13, \u05D3\u05D9\u05E8\u05D4 16, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "parent1": 2068315,
    "parent2": 6744884
  },
  {
    "id": 20649572,
    "tz": "233840008",
    "name": "\u05D0\u05D9\u05EA\u05DF \u05D5\u05D9\u05D9\u05DC",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("2020-08-17"),
    "address": "\u05D4\u05E0\u05D1\u05D9\u05D0\u05D9\u05DD 13, \u05D3\u05D9\u05E8\u05D4 16, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "parent1": 2068315,
    "parent2": 6744884
  },
  {
    "id": 1111,
    "tz": "1111",
    "name": "\u05D9\u05E2\u05E7\u05D1 \u05DE\u05D5\u05D1\u05E9\u05D5\u05D1\u05D9\u05E5",
    "gender": "\u05D6\u05DB\u05E8",
    "birthDate": /* @__PURE__ */ new Date("1950-08-10"),
    "address": "\u05D4\u05E0, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "spouses": [2222],
    "children": [6744884]
  },
  {
    "id": 2222,
    "tz": "2222",
    "name": "\u05E8\u05D9\u05E0\u05D4 \u05DE\u05D5\u05D1\u05E9\u05D1\u05D5\u05D1\u05D9\u05E5",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("1950-08-10"),
    "address": "\u05D4\u05E0, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "spouses": [1111],
    "children": [6744884]
  },
  {
    "id": 3333,
    "tz": "3333",
    "name": "\u05DE\u05E2\u05D9\u05DF",
    "gender": "\u05E0\u05E7\u05D1\u05D4",
    "birthDate": /* @__PURE__ */ new Date("1986-08-10"),
    "address": "\u05D4\u05E0\u05D1\u05D9\u05D0\u05D9\u05DD 13, \u05D3\u05D9\u05E8\u05D4 16, \u05E8\u05DE\u05EA \u05D2\u05DF, 5225513",
    "spouses": [],
    "children": [],
    "parent1": 1111,
    "parent2": 2222
  }
];

// src/services/tree-builder.ts
function buildTreeFromFlat(members, searchedTz) {
  if (members.length === 0) return null;
  const memberMap = /* @__PURE__ */ new Map();
  members.forEach((m) => memberMap.set(m.id, m));
  let searchedMember;
  if (searchedTz) {
    searchedMember = members.find((m) => m.tz === searchedTz);
  }
  if (!searchedMember) {
    searchedMember = members[0];
  }
  let currentRoot = searchedMember;
  let visited = /* @__PURE__ */ new Set();
  while (true) {
    visited.add(currentRoot.id);
    let parent = null;
    if (currentRoot.parent1 && memberMap.has(currentRoot.parent1) && !visited.has(currentRoot.parent1)) {
      parent = memberMap.get(currentRoot.parent1);
    } else if (currentRoot.parent2 && memberMap.has(currentRoot.parent2) && !visited.has(currentRoot.parent2)) {
      parent = memberMap.get(currentRoot.parent2);
    }
    if (parent) {
      currentRoot = parent;
    } else {
      break;
    }
  }
  const createdNodes = /* @__PURE__ */ new Map();
  function hydrate(member, visitedIds) {
    if (createdNodes.has(member.id)) {
      return createdNodes.get(member.id);
    }
    const node = {
      id: member.id,
      name: member.name,
      tz: member.tz,
      gender: member.gender,
      birthDate: member.birthDate,
      address: member.address,
      photo: member.photo,
      hobbies: member.hobbies,
      dna: member.dna,
      ta: member.ta,
      spouses: [],
      children: [],
      parents: []
    };
    createdNodes.set(member.id, node);
    visitedIds.add(member.id);
    let p2_node = member.parent2 ? memberMap.get(member.parent2) : void 0;
    let p1_node = member.parent1 ? memberMap.get(member.parent1) : void 0;
    if (p2_node && p2_node.gender === "\u05E0\u05E7\u05D1\u05D4") {
      node.otherParentId = p2_node.id;
    } else if (p1_node && p1_node.gender === "\u05E0\u05E7\u05D1\u05D4") {
      node.otherParentId = p1_node.id;
    } else if (p2_node) {
      node.otherParentId = p2_node.id;
    } else if (p1_node) {
      node.otherParentId = p1_node.id;
    }
    const parentMembers = [];
    if (member.parent1 && memberMap.has(member.parent1)) parentMembers.push(memberMap.get(member.parent1));
    if (member.parent2 && memberMap.has(member.parent2)) parentMembers.push(memberMap.get(member.parent2));
    parentMembers.forEach((pm) => {
      if (!visitedIds.has(pm.id)) {
        const parentNode = hydrate(pm, new Set(visitedIds));
        node.parents.push(parentNode);
      } else {
        if (createdNodes.has(pm.id)) {
          node.parents.push(createdNodes.get(pm.id));
        }
      }
    });
    const childrenMembers = members.filter((m) => m.parent1 === member.id || m.parent2 === member.id);
    childrenMembers.forEach((childMember) => {
      if (!visitedIds.has(childMember.id)) {
        const childNode = hydrate(childMember, new Set(visitedIds));
        node.children.push(childNode);
      }
    });
    if (member.spouses && member.spouses.length > 0) {
      member.spouses.forEach((spouseId) => {
        if (!visitedIds.has(spouseId) && memberMap.has(spouseId)) {
          const spouseMember = memberMap.get(spouseId);
          const spouseNode = hydrate(spouseMember, new Set(visitedIds));
          node.spouses.push(spouseNode);
        }
      });
    }
    return node;
  }
  const rootNode = hydrate(currentRoot, /* @__PURE__ */ new Set());
  return rootNode;
}

// test.ts
var root = buildTreeFromFlat(FAMILY_DATA, "38155073");
function findNode(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.spouses) {
    for (const spouse of node.spouses) {
      if (spouse.id === id) return spouse;
    }
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}
var alon = findNode(root, 2068315);
var lital = alon?.spouses?.[0];
console.log("Li-Tal parents:", lital?.parents?.map((p) => ({ id: p.id, name: p.name, children: p.children?.map((c) => c.name) })));
