/* @flow */

import {
  __scrapeResults,
  __filterResults,
  __bestIdFromResultsHtml,
} from '../getMovieId';
import connector from '../connector';

const query = {
  title: 'Звёздные войны: Пробуждение силы',
};

describe('getMovieId', () => {
  let results: string;

  beforeAll(async () => {
    results = await connector.htmlGet('search', { text: query.title });
  });

  it('scrapes results', () => {
    expect(__scrapeResults(results)).toMatchSnapshot();
  });

  it('filters results', () => {
    expect(__filterResults({ title: 'foo' }, [
      null,
      undefined,
      { id: 1, title: 'foo', countries: [], year: 2016 },
    ])).toMatchSnapshot();

    expect(__filterResults({ title: 'Звёздные войны' }, [
      { id: 1, title: 'Звёздные войны', countries: [], year: 2015 },
      { id: 2, title: 'Звездные войны', countries: [], year: 2016 },
      { id: 3, title: 'Звёздная пыль', countries: [], year: 2014 },
      { id: 4, title: 'Звёздный путь', countries: [], year: 2016 },
    ])).toMatchSnapshot();

    expect(__filterResults({ title: 'foo', year: 2016 }, [
      { id: 1, title: 'foo', countries: [], year: 2015 },
      { id: 2, title: 'foo', countries: [], year: 2016 },
      { id: 3, title: 'foo', countries: [], year: 2014 },
      { id: 4, title: 'foo', countries: [], year: 2016 },
    ])).toMatchSnapshot();

    expect(__filterResults({ title: 'foo', countries: ['США', 'Россия'] }, [
      { id: 1, title: 'foo', countries: ['США'], year: 2016 },
      // eslint-disable-next-line max-len
      { id: 2, title: 'foo', countries: ['США', 'Россия', 'Германия'], year: 2016 },
      { id: 3, title: 'foo', countries: ['Россия'], year: 2016 },
      { id: 4, title: 'foo', countries: ['США', 'Россия'], year: 2016 },
    ])).toMatchSnapshot();
  });

  it('finds best movie id from given results', async () => {
    expect(__bestIdFromResultsHtml(query, results)).toMatchSnapshot();
  });
});