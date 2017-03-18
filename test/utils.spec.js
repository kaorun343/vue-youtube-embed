import assert from 'power-assert'
import { getIdFromURL, getTimeFromURL } from '../src/utils'

// fork from https://github.com/brandly/angular-youtube-embed
describe('getIdFromURL', () => {
  it('should handle regular query strings', () => {
    const url = 'https://www.youtube.com/watch?v=nViWpVc1x_4&feature=youtu.be'
    const id = 'nViWpVc1x_4'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle attribution_link', () => {
    const url = 'http://www.youtube.com/attribution_link?a=pxa6goHqzaA&amp;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare'
    const id = 'dPdgx30w9sU'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle almost a query string', () => {
    const url = 'http://www.youtube.com/watch?feature=player_detailpage&amp;v=93LvTKF_jW0#t=1'
    const id = '93LvTKF_jW0'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle "&amp;feature=youtu.be"', () => {
    const url = 'https://www.youtube.com/watch?v=VbNF9X1waSc&amp;feature=youtu.be'
    const id = 'VbNF9X1waSc'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle http://youtu.be', () => {
    const url = 'https://youtu.be/3FY4MRdQOdE'
    const id = '3FY4MRdQOdE'
    assert.equal(getIdFromURL(url), id)
  })

  it('should handle "edit" links from video manager page', () => {
    const url = 'https://www.youtube.com/edit?o=U&video_id=3k2ZBu3kuiE'
    const id = '3k2ZBu3kuiE'
    assert.equal(getIdFromURL(url), id)
  })
})

// fork from https://github.com/brandly/angular-youtube-embed
describe('getTimeFromURL', () => {
  it('should return 0 when time is not defined', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo'
    assert.equal(getTimeFromURL(url), 0)
  })

  it('should handle the url that contains "m" and "s"', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4m20s'
    assert.equal(getTimeFromURL(url), 20 + 4 * 60)
  })

  it('should handle the url that does not contain "s"', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4m'
    assert.equal(getTimeFromURL(url), 4 * 60)
  })

  it('should handle the url that does not contain "m"', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4s'
    assert.equal(getTimeFromURL(url), 4)
  })

  it('should handle the url that does not contain both "s" and "s"', () => {
    const url = 'https://www.youtube.com/watch?v=3MteSlpxCpo&feature=youtu.be&t=4'
    assert.equal(getTimeFromURL(url), 4)
  })
})
