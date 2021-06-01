import React from 'react';
import { getPeople } from '../functions';
import { IResponseSQLiteHelper } from '../helpers';

export interface IPerson {
    id?: number;
    name: string;
    age: number;
}

export function useGetPeople(sqlite: IResponseSQLiteHelper) {
    const [list, setList] = React.useState<IPerson[]>([]);
    const [errorMessage, setErrorMessage] = React.useState('');
    React.useEffect(() => {
        if (sqlite.isDatabaseOpened === true || sqlite.isShouldRefresh === true) {
            getPeople(sqlite)
                .then((result) => {
                    setList(result);
                    sqlite.doneRefresh();
                }).catch((error: Error) => {
                    setErrorMessage(error.message);
                });
        }
    }, [sqlite]);

    return {
        list,
        errorMessage,
    };
}