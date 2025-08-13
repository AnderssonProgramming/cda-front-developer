// Pruebas para RatingCalculator
const fs = require('fs');
const path = require('path');

// Leer y ejecutar el archivo rating
const ratingPath = path.join(__dirname, '../js/rating.js');
const ratingCode = fs.readFileSync(ratingPath, 'utf8');
eval(ratingCode);

describe('RatingCalculator Tests', () => {

  const createMockRecipe = (overrides = {}) => ({
    id: '1',
    name: 'Test Recipe',
    timesCooked: 0,
    favorite: false,
    createdAt: new Date('2024-01-01'),
    lastCooked: null,
    manualRating: 3,
    ...overrides
  });

  describe('calculateAutoRating', () => {
    
    test('calculates rating for new recipe', () => {
      const recipe = createMockRecipe();
      const rating = RatingCalculator.calculateAutoRating(recipe);
      
      expect(rating).toBeGreaterThanOrEqual(1);
      expect(rating).toBeLessThanOrEqual(5);
      expect(Number.isInteger(rating)).toBe(true);
    });

    test('gives higher rating for frequently cooked recipes', () => {
      const lowFreqRecipe = createMockRecipe({ timesCooked: 1 });
      const highFreqRecipe = createMockRecipe({ timesCooked: 10 });
      
      const lowRating = RatingCalculator.calculateAutoRating(lowFreqRecipe);
      const highRating = RatingCalculator.calculateAutoRating(highFreqRecipe);
      
      expect(highRating).toBeGreaterThanOrEqual(lowRating);
    });

    test('boosts rating for favorite recipes', () => {
      const normalRecipe = createMockRecipe({ timesCooked: 5 });
      const favoriteRecipe = createMockRecipe({ timesCooked: 5, favorite: true });
      
      const normalRating = RatingCalculator.calculateAutoRating(normalRecipe);
      const favoriteRating = RatingCalculator.calculateAutoRating(favoriteRecipe);
      
      expect(favoriteRating).toBeGreaterThan(normalRating);
    });

    test('considers recency of cooking', () => {
      const recentlyCooked = createMockRecipe({
        lastCooked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        timesCooked: 3
      });
      
      const oldCooked = createMockRecipe({
        lastCooked: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        timesCooked: 3
      });
      
      const recentRating = RatingCalculator.calculateAutoRating(recentlyCooked);
      const oldRating = RatingCalculator.calculateAutoRating(oldCooked);
      
      expect(recentRating).toBeGreaterThanOrEqual(oldRating);
    });

  });

  describe('calculateFinalRating', () => {
    
    test('calculates weighted average (70% manual, 30% auto)', () => {
      const manualRating = 4;
      const autoRating = 2;
      
      const finalRating = RatingCalculator.calculateFinalRating(manualRating, autoRating);
      const expected = Math.round(manualRating * 0.7 + autoRating * 0.3);
      
      expect(finalRating).toBe(expected);
    });

    test('handles edge cases', () => {
      expect(RatingCalculator.calculateFinalRating(1, 1)).toBe(1);
      expect(RatingCalculator.calculateFinalRating(5, 5)).toBe(5);
    });

  });

  describe('updateRecipeRatings', () => {
    
    test('updates both auto and final ratings', () => {
      const recipe = createMockRecipe({
        timesCooked: 5,
        favorite: true,
        manualRating: 4
      });
      
      const updatedRecipe = RatingCalculator.updateRecipeRatings(recipe);
      
      expect(updatedRecipe.autoRating).toBeDefined();
      expect(updatedRecipe.finalRating).toBeDefined();
      expect(updatedRecipe.autoRating).toBeGreaterThanOrEqual(1);
      expect(updatedRecipe.autoRating).toBeLessThanOrEqual(5);
      expect(updatedRecipe.finalRating).toBeGreaterThanOrEqual(1);
      expect(updatedRecipe.finalRating).toBeLessThanOrEqual(5);
    });

  });

});
