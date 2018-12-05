
const Realm = require('realm');

const FavouriteThreadSchema = {
    name: 'new_favouritethread',
    primaryKey: 'id',
    properties: {
        type: 'string',
        username: 'string',
        id: 'string',
        board_id: 'string',
        subject: 'string',
        author: 'string',
        createTime: 'date',
    }
};

export default class FavouriteThreadModel {

    static open() {
        return new Promise(function (resolve, reject) {
            Realm.open({
                path: 'new_favouritethread.realm',
                schema: [FavouriteThreadSchema]
            })
                .then(realm => {
                    resolve(realm);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    static create(type, id, board_id, subject, author) {
        return new Promise(function (resolve, reject) {
            FavouriteThreadModel.open().then(realm => {
                realm.write(() => {
                    realm.create(FavouriteThreadSchema.name, {
                        type: type,
                        username: global.current.username,
                        id: id.toString(),
                        board_id: board_id,
                        subject: subject,
                        author: author,
                        createTime: new Date(),
                    }, true);
                });
                console.log('FavouriteThreadModel.create() success');
                resolve();
            }).catch((error) => {
                console.log('FavouriteThreadModel.create() error = ' + error);
                reject(error);
            });
        });
    }

    static read() {
        return new Promise(function (resolve, reject) {
            FavouriteThreadModel.open().then(realm => {
                let array = realm.objects(FavouriteThreadSchema.name).sorted('createTime', true).slice(0, 100);
                console.log('FavouriteThreadModel.read() success');
                resolve(array);
            }).catch((error) => {
                console.log('FavouriteThreadModel.read() error = ' + error);
                reject(error);
            });
        });
    }

    static delete(id) {
        return new Promise(function (resolve, reject) {
            FavouriteThreadModel.open().then(realm => {
                realm.write(() => {
                    let objects = realm.objects(FavouriteThreadSchema.name).filtered('id="' + id + '"');
                    if (objects.length > 0) {
                        realm.delete(objects);
                        console.log('FavouriteThreadModel.delete() success');
                    } else {
                        console.log('FavouriteThreadModel.delete() not found');
                    }
                    resolve();
                })
            }).catch((error) => {
                console.log('FavouriteThreadModel.delete() error = ' + error);
                reject(error);
            });
        });
    }
}