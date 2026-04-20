import { FAMILY_DATA } from './src/data/mock-data';
import { buildTreeFromFlat } from './src/services/tree-builder';

// Search for Alon Weil (he has Li-Tal as spouse) or Li-Tal directly
const tree = buildTreeFromFlat(FAMILY_DATA, '38155073'); // Alon Tz
console.log('Alon:', tree?.name, 'spouses:', tree?.spouses?.map(s => s.name));
const lital = tree?.spouses?.[0];
console.log('Li-Tal otherParentId:', lital?.otherParentId);
console.log('Li-Tal parents:', lital?.parents?.map(p => ({ id: p.id, name: p.name })));

// Let's also check Li-Tal's direct structure when searched
const litalTree = buildTreeFromFlat(FAMILY_DATA, '32533937'); // Li-Tal Tz
console.log('Li-Tal (as root) otherParentId:', litalTree?.otherParentId);

