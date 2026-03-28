import { FULL_DATASET, searchDataset } from './buddhist-dataset.js';

export function lookupWisdom(params = {}) {
  const { category, tradition, topic, count } = params;

  const results = searchDataset(topic || '', {
    category,
    tradition,
    limit: count || 1,
  });

  if (results.length === 0) {
    // Fallback: random wisdom
    const random = FULL_DATASET[Math.floor(Math.random() * FULL_DATASET.length)];
    return { type: 'wisdom', results: [random] };
  }

  return { type: 'wisdom', results };
}

export function getDatasetStats() {
  const categories = {};
  const traditions = {};
  for (const item of FULL_DATASET) {
    categories[item.category] = (categories[item.category] || 0) + 1;
    traditions[item.tradition] = (traditions[item.tradition] || 0) + 1;
  }
  return { total: FULL_DATASET.length, categories, traditions };
}
