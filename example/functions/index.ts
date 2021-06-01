import { IResponseSQLiteHelper } from '../helpers';
import { IPerson } from '../hooks';

export function getPeople({
    sqlite,
    onSuccess,
    onError
}: {
    sqlite: IResponseSQLiteHelper,
    onSuccess?: () => void,
    onError?: () => void
}) {
    return new Promise((resolve: (value: IPerson[]) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery<IPerson>('SELECT * FROM People')
            .then((result) => {
                onSuccess && onSuccess();
                resolve(result.list);
            }).catch((error: Error) => {
                onError && onError();
                reject(error)
            });
    });
}

export function removePerson({
    sqlite,
    id,
    onSuccess,
    onError
}: {
    sqlite: IResponseSQLiteHelper,
    id: number,
    onSuccess?: () => void,
    onError?: () => void
}) {
    return new Promise((resolve: (value: boolean) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery('DELETE FROM People WHERE id=?', id)
            .then((result) => {
                onSuccess && onSuccess();
                resolve(result.rowsAffected > 0);
            }).catch((error: Error) => {
                onError && onError();
                reject(error);
            });
    });
}

export function addPerson({
    sqlite,
    person,
    onSuccess,
    onError
}: {
    sqlite: IResponseSQLiteHelper,
    person: IPerson,
    onSuccess?: () => void,
    onError?: () => void
}) {
    return new Promise((resolve: (value: boolean) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery('INSERT INTO People(name, age) VALUES(?,?)', person.name, person.age)
            .then((result) => {
                onSuccess && onSuccess();
                resolve(result.rowsAffected > 0);
            }).catch((error: Error) => {
                onError && onError();
                reject(error);
            });
    });
}

export function updatePerson({
    sqlite,
    person,
    onSuccess,
    onError
}: {
    sqlite: IResponseSQLiteHelper,
    person: IPerson,
    onSuccess?: () => void,
    onError?: () => void
}) {
    return new Promise((resolve: (value: boolean) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery(`UPDATE People SET name=?, age=? WHERE id=?`, person.name, person.age, person.id)
            .then((result) => {
                onSuccess && onSuccess();
                resolve(result.rowsAffected > 0);
            }).catch((error: Error) => {
                onError && onError();
                reject(error);
            });
    });
}