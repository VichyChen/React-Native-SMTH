
const Realm = require('realm');

const BoardListSchema = {
    name: 'newsmth_boardlist',
    primaryKey: 'id',
    properties: {
        id: 'string',
        json: 'string',
    }
};

export default class BoardListModel {

    static open() {
        return new Promise(function (resolve, reject) {
            Realm.open({
                path: 'newsmth_boardlist.realm',
                schema: [BoardListSchema]
            })
                .then(realm => {
                    resolve(realm);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    static create(id, json) {
        return new Promise(function (resolve, reject) {
            BoardListModel.open().then(realm => {
                realm.write(() => {
                    realm.create(BoardListSchema.name, {
                        id: id.toString(),
                        json: json,
                    }, true);
                });
                console.log('BoardListModel.create() success');
                resolve();
            }).catch((error) => {
                console.log('BoardListModel.create() error = ' + error);
                reject(error);
            });
        });
    }

    static read(id) {
        return new Promise(function (resolve, reject) {
            BoardListModel.open().then(realm => {
                let object = realm.objectForPrimaryKey(BoardListSchema.name, id);
                console.log('BoardListModel.read() success');
                resolve(object);
            }).catch((error) => {
                console.log('BoardListModel.read() error = ' + error);
                reject(error);
            });
        });
    }
}