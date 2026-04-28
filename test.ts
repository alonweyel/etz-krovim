import { buildTreeFromFlat } from './src/services/tree-builder';
import { FAMILY_DATA } from './src/data/mock-data';

const tree = buildTreeFromFlat(FAMILY_DATA, '27394139'); // Sagalit

const sagalit = tree;
console.log('Sagalit children:', sagalit.children.map(c => c.name));

const idan = sagalit.children.find(c => c.id === 12987572);
console.log('Idan parents:', idan.parents.map(p => p.name));

const naor = idan.parents.find(p => p.id === 8300009);
console.log('Naor children:', naor.children.map(c => c.name));
