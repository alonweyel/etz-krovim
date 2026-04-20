import { FamilyMemberDTO, FamilyMember } from '../data/mock-data';

export function buildTreeFromFlat(members: FamilyMemberDTO[], searchedTz: string): FamilyMember | null {
  if (members.length === 0) return null;

  const memberMap = new Map<number, FamilyMemberDTO>();
  members.forEach(m => memberMap.set(m.id, m));

  // Find the searched person
  let searchedMember: FamilyMemberDTO | undefined;
  if (searchedTz) {
    searchedMember = members.find(m => m.tz === searchedTz);
  }
  if (!searchedMember) {
    searchedMember = members[0]; // fallback
  }

  // Find root by climbing up parent1 or parent2 repeatedly
  let currentRoot = searchedMember;
  let visited = new Set<number>();
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
      // Maybe check spouses for a parent that has parents?
      // For simplicity, we just stop here.
      break;
    }
  }

  // We have a root person. Now build the hierarchy starting from this root.
  // Wait, if currentRoot is a female, maybe we should pick her male spouse as the structural root if they exist, to align with typical tree layout. (Optional)
  
  const createdNodes = new Map<number, FamilyMember>();

  function hydrate(member: FamilyMemberDTO, visitedIds: Set<number>): FamilyMember {
    if (createdNodes.has(member.id)) {
      return createdNodes.get(member.id)!;
    }

    const node: FamilyMember = {
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

    let p2_node = member.parent2 ? memberMap.get(member.parent2) : undefined;
    let p1_node = member.parent1 ? memberMap.get(member.parent1) : undefined;
    if (p2_node && p2_node.gender === 'נקבה') {
        node.otherParentId = p2_node.id;
    } else if (p1_node && p1_node.gender === 'נקבה') {
        node.otherParentId = p1_node.id;
    } else if (p2_node) {
        node.otherParentId = p2_node.id;
    } else if (p1_node) {
        node.otherParentId = p1_node.id;
    }

    // Hydrate parents
    const parentMembers = [];
    if (member.parent1 && memberMap.has(member.parent1)) parentMembers.push(memberMap.get(member.parent1)!);
    if (member.parent2 && memberMap.has(member.parent2)) parentMembers.push(memberMap.get(member.parent2)!);
    
    parentMembers.forEach(pm => {
        if (!visitedIds.has(pm.id)) {
            // Hydrate the parent fully so family of origin works (mini-trees)
            const parentNode = hydrate(pm, new Set(visitedIds));
            node.parents!.push(parentNode);
        } else {
            // Already visited, just push the reference if it exists in createdNodes
            if(createdNodes.has(pm.id)){
               node.parents!.push(createdNodes.get(pm.id)!);
            }
        }
    });

    // Hydrate children FIRST
    // Ensure we find children targeting this member as a parent
    const childrenMembers = members.filter(m => m.parent1 === member.id || m.parent2 === member.id);
    childrenMembers.forEach(childMember => {
      if (!visitedIds.has(childMember.id)) {
        const childNode = hydrate(childMember, new Set(visitedIds));
        node.children!.push(childNode);
      } else if (createdNodes.has(childMember.id)) {
        node.children!.push(createdNodes.get(childMember.id)!);
      }
    });

    // Hydrate spouses
    if (member.spouses && member.spouses.length > 0) {
      member.spouses.forEach(spouseId => {
        if (!visitedIds.has(spouseId) && memberMap.has(spouseId)) {
          const spouseMember = memberMap.get(spouseId)!;
          const spouseNode = hydrate(spouseMember, new Set(visitedIds));
          
          // Spouse children? In our visual tree, children are usually attached to the primary parent.
          node.spouses!.push(spouseNode);
        } else if (createdNodes.has(spouseId)) {
          node.spouses!.push(createdNodes.get(spouseId)!);
        }
      });
    }

    return node;
  }

  const rootNode = hydrate(currentRoot, new Set<number>());

  return rootNode;
}
