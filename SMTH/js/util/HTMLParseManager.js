
import cio from 'cheerio-without-node-native';

export default class HTMLParseManager {

  static parseNewSearchAccount(html, name, id) {
    this.$ = cio.load(html, { decodeEntities: false });
    this.$ = cio.load(this.$('div[class=row]').html());
    this.$('div[class=account-summary]').each(function (i, elem) {
        this.$ = cio.load(elem);
        if (this.$('a[class=name]').text() == name) {
            id(this.$('a[class=name]').attr('href').split('/')[2]);
        }
    });
  }
}
