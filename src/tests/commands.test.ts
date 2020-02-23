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
    expect(getStockCode('/stonck=goog.us')).toBeFalsy();
    expect(getStockCode('/stocks= goog.us')).toBeFalsy();
    expect(getStockCode('stock =goog.us')).toBeFalsy();
    expect(getStockCode('hellow there')).toBeFalsy();
    expect(getStockCode('How are you?')).toBeFalsy();
    expect(getStockCode('/stock=  ')).toBeFalsy();
    expect(getStockCode('/stock  =  ')).toBeFalsy();
    expect(getStockCode('/stock=')).toBeFalsy();
  });
});
