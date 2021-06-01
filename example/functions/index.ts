import { IResponseSQLiteHelper } from '../helpers';
import { IPerson } from '../hooks';

export function removePerson(sqlite: IResponseSQLiteHelper, id: number) {
    return new Promise((resolve: (value: boolean) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery('DELETE FROM People WHERE id=?', id)
            .then((result) => {
                resolve(result.rowsAffected > 0);
            }).catch((error: Error) => reject(error));
    });
}

export function addPerson(sqlite: IResponseSQLiteHelper, person: IPerson) {
    return new Promise((resolve: (value: boolean) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery('INSERT INTO People(name, age) VALUES(?,?)', person.name, person.age)
            .then((result) => {
                resolve(result.rowsAffected > 0);
            }).catch((error: Error) => reject(error));
    });
}