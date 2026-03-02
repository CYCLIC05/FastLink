import { fetchNewsByCategory } from './src/lib/data';

(async () => {
  const cat = 'Entertainment';
  console.log('calling fetchNewsByCategory for', cat);
  const result = await fetchNewsByCategory(cat);
  console.log('result length', result.length);
})();
