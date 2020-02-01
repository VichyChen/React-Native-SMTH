
const Realm = require('realm');

const BoardSchema = {
    name: 'newsmth_board',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
    }
};

export default class BoardModel {

    static open() {
        return new Promise(function (resolve, reject) {
            Realm.open({
                path: 'newsmth_board.realm',
                schema: [BoardSchema]
            })
                .then(realm => {
                    resolve(realm);
                })
                .catch((error) => {
                    reject(error);
                });

        });
    }

    static create(id, name) {
        if (global.configures.boards[id] != null) {
            return;
        }
        return new Promise(function (resolve, reject) {
            BoardModel.open().then(realm => {
                realm.write(() => {
                    realm.create(BoardSchema.name, {
                        id: id,
                        name: name,
                    });
                    global.configures.boards[id] = name;
                });
                console.log('BoardModel.create() success');
                resolve();
            }).catch((error) => {
                console.log('BoardModel.create() error = ' + error);
                // reject(error);
            });
        });
    }

    static read() {
        return new Promise(function (resolve, reject) {
            BoardModel.open().then(realm => {
                let array = realm.objects(BoardSchema.name);
                console.log('BoardModel.read() success');
                resolve(array);
            }).catch((error) => {
                console.log('BoardModel.read() error = ' + error);
                reject(error);
            });
        });
    }
}