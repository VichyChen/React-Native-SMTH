
const Realm = require('realm');

const ScanRecordSchema = {
    name: 'new_scanrecord',
    primaryKey: 'id',
    properties: {
        type: 'string',
        username: 'string',
        id: 'string',
        board_id: 'string',
        subject: 'string',
        author: 'string',
        time: 'string',
        scanTime: 'date',
    }
};

export default class ScanRecordModel {

    static open() {
        return new Promise(function (resolve, reject) {
            Realm.open({
                path: 'new_scanrecord.realm',
                schema: [ScanRecordSchema]
            })
                .then(realm => {
                    resolve(realm);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    static create(type, id, board_id, subject, author, time) {
        return new Promise(function (resolve, reject) {
            ScanRecordModel.open().then(realm => {
                realm.write(() => {
                    realm.create(ScanRecordSchema.name, {
                        type: type,
                        username: global.current.username,
                        id: id.toString(),
                        board_id: board_id,
                        subject: subject,
                        author: author,
                        time: time,
                        scanTime: new Date(),
                    }, true);
                });
                console.log('ScanRecordModel.create() success');
                resolve();
            }).catch((error) => {
                console.log('ScanRecordModel.create() error = ' + error);
                reject(error);
            });
        });
    }

    static read() {
        return new Promise(function (resolve, reject) {
            ScanRecordModel.open().then(realm => {
                let array = realm.objects(ScanRecordSchema.name).sorted('scanTime', true).slice(0, 100);
                console.log('ScanRecordModel.read() success');
                resolve(array);
            }).catch((error) => {
                console.log('ScanRecordModel.read() error = ' + error);
                reject(error);
            });
        });
    }
}