import { IResponseSQLiteHelper } from '../helpers';

export function removePerson(sqlite: IResponseSQLiteHelper, id: number) {
    return new Promise((resolve: (value: boolean) => void, reject: (value?: Error) => void) => {
        sqlite.executeQuery('DELETE FROM People WHERE id=?', id)
            .then((result) => {
                resolve(result.rowsAffected > 0);
            }).catch((error: Error) => reject(error));
    });
}