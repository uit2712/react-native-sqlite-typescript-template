import React from 'react';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
function openDatabase(request: IRequestSQLiteHelper) {
    return new Promise((resolve: (value: SQLite.SQLiteDatabase) => void, reject: (value: Error) => void) => {
        if (!request || !request.name) {
            reject({
                name: 'Invalid parameter',
                message: "Parameter 'name' is null or undefined",
            })
            return;
        }

        SQLite.openDatabase({
            name: request.aliasName,
            createFromLocation: `~${request.name}`,
            location: request.location,
        }).then((result: SQLite.SQLiteDatabase) => {
            resolve(result);
        }).catch((error: Error) => {
            reject(error);
        });
    });
}

export interface IResponseSQLiteHelper {
    isDatabaseOpened: boolean;
    errorMessage: string;
    isShouldRefresh: boolean;
    closeDatabase: () => void;
    executeQuery: <T>(query: string, ...args: any[]) => Promise<IExecuteQueryResult<T>>;
    doneRefresh: () => void;
}

export interface IExecuteQueryResult<T> {
    insertedId: number;
    rowsAffected: number;
    list: T[],
}

export interface IRequestSQLiteHelper {
    name: string;
    aliasName: string;
    location?: SQLite.Location;
}

export function useSQLiteHelper(request: IRequestSQLiteHelper): IResponseSQLiteHelper {
    const [database, setDatabase] = React.useState<SQLite.SQLiteDatabase>();
    const [errorMessage, setErrorMessage] = React.useState('');
    React.useEffect(() => {
        openDatabase(request)
            .then((db) => setDatabase(db))
            .catch((error: Error) => setErrorMessage(error.message));
    }, []);

    function closeDatabase() {
        database.close();
        setDatabase(null);
    }

    const [isShouldRefresh, setIsShouldRefresh] = React.useState(false);
    function executeQuery<T>(query: string, ...args: any[]) {
        return new Promise((resolve: (value?: IExecuteQueryResult<T>) => void, reject: (value?: Error) => void) => {
            if (database && query) {
                database.transaction((tx: SQLite.Transaction) => {
                    tx.executeSql(query, args)
                        .then((result: [SQLite.Transaction, SQLite.ResultSet]) => {
                            let list: T[] = [];
                            for (let i = 0; i < result[1].rows.length; i++) {
                                list.push(result[1].rows.item(i));
                            }

                            if (result[1].rowsAffected > 0 || result[1].insertId > 0) {
                                setIsShouldRefresh(true);
                            }

                            resolve({
                                insertedId: result[1].insertId,
                                rowsAffected: result[1].rowsAffected,
                                list,
                            });
                        }).catch((error: Error) => setErrorMessage(error.message));
                }).then(() => {})
                .catch((error: Error) => {
                    reject({
                        name: '',
                        message: error.message,
                    })
                })
            } else {
                reject({
                    name: 'Error',
                    message: 'Error when execute query'
                })
            }
        });
    }

    return {
        isDatabaseOpened: database !== null && database !== undefined,
        errorMessage,
        closeDatabase,
        executeQuery,
        doneRefresh: () => setIsShouldRefresh(false),
        isShouldRefresh,
    }
}

export const SQLiteContext = React.createContext<IResponseSQLiteHelper>({
    isDatabaseOpened: false,
    errorMessage: '',
    isShouldRefresh: false,
    closeDatabase: () => {},
    executeQuery: <T>(query: string) => new Promise((resolve: (value?: IExecuteQueryResult<T>) => void) => resolve({
        insertedId: 0,
        rowsAffected: 0,
        list: [],
    })),
    doneRefresh: () => {},
});