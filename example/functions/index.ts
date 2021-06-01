import { IResponseSQLiteHelper } from '../helpers';
import { IPerson } from '../hooks';

export function getPeople(sqlite: IResponseSQLiteHelper) {
    return new Promise((resolve: (value: IPerson[]) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery<IPerson>('SELECT * FROM People')
            .then((result) => {
                resolve(result.list);
            }).catch((error: Error) => reject(error));
    });
}

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

export function updatePerson(sqlite: IResponseSQLiteHelper, person: IPerson) {
    return new Promise((resolve: (value: boolean) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery(`UPDATE People SET name='${person.name}', age=${person.age} WHERE id=${person.id}`)
            .then((result) => {
                resolve(result.rowsAffected > 0);
            }).catch((error: Error) => reject(error));
    });
}