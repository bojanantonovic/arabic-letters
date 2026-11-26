import { ITEMS } from '../data/letters';
import { lautHinweis, umschrift, variantenName } from './inhalt';

describe('Inhalt', () => {
  it('givenAlleAufgaben_whenEnglisch_thenBeschriftungUndHinweisVorhanden', () => {
    // when
    const texte = ITEMS.flatMap((i) => [variantenName(i, 'en'), lautHinweis(i, 'en')]);

    // then
    expect(texte.every((t) => !!t)).toBe(true);
  });

  it('givenDeutsch_whenBeschriftet_thenTexteAusDemBuch', () => {
    // given
    const item = ITEMS[0];

    // then
    expect(variantenName(item, 'de')).toBe(item.variantLabel);
    expect(lautHinweis(item, 'de')).toBe(item.hint);
  });

  it('givenLangesA_whenUmschrift_thenJeNachSprache', () => {
    // given
    const lesung = 'bä’';

    // then
    expect(umschrift(lesung, 'de')).toBe('bä’');
    expect(umschrift(lesung, 'en')).toBe('bā’');
  });
});
