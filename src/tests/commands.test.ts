import { getStockCode } from '../controllers/chat';

describe('Command Function', () => {
    it('returns goog.us', () => {
        expect(getStockCode('/stock=goog.us')).toBe('goog.us');
        expect(getStockCode('/stock= goog.us')).toBe('goog.us');
        expect(getStockCode('/stock =goog.us')).toBe('goog.us');
        expect(getStockCode('/stock = goog.us')).toBe('goog.us');
        expect(getStockCode('/stock  =goog.us')).toBe('goog.us');
        expect(getStockCode('/stock =  goog.us')).toBe('goog.us');
        expect(getStockCode('/stock  =  goog.us')).toBe('goog.us');
        expect(getStockCode('/stock goog.us')).toBe('goog.us');
        expect(getStockCode('/stock      goog.us')).toBe('goog.us');
    });
    it('returns undefined', () => {
        expect(getStockCode('/stonck=goog.us')).toBe(undefined);
        expect(getStockCode('/stocks= goog.us')).toBe(undefined);
        expect(getStockCode('stock =goog.us')).toBe(undefined);
        expect(getStockCode('hellow there')).toBe(undefined);
        expect(getStockCode('How are you?')).toBe(undefined);
        expect(getStockCode('/stock=  ')).toBe(undefined);
        expect(getStockCode('/stock  =  ')).toBe(undefined);
        expect(getStockCode('/stock=')).toBe(undefined);
    });
})