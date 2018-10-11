
const Realm = require('realm');

const BoardListSchema = {
    name: 'BoardList',
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

export default class BoardListModel {

    static open() {
        return new Promise(function (resolve, reject) {
            Realm.open({
                path: 'boardListRealm.realm',
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

    static create(type, id, board_id, subject, author) {
        return new Promise(function (resolve, reject) {
            BoardListModel.open().then(realm => {
                realm.write(() => {
                    realm.create(BoardListSchema.name, {
                        type: type,
                        username: global.current.username,
                        id: id.toString(),
                        board_id: board_id,
                        subject: subject,
                        author: author,
                        createTime: new Date(),
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

    static read() {
        return new Promise(function (resolve, reject) {
            BoardListModel.open().then(realm => {
                let array = realm.objects(BoardListSchema.name).slice(0, 100);
                console.log('BoardListModel.read() success');
                resolve(array);
            }).catch((error) => {
                console.log('BoardListModel.read() error = ' + error);
                reject(error);
            });
        });
    }
}