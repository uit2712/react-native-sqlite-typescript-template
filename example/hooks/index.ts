import React from "react";
import { IResponseSQLiteHelper } from "../helpers";
import { keys } from 'ts-transformer-keys';

export interface IPerson {
    id: number;
    name: string;
    age: number;
}

export function useGetPeople(sqlite: IResponseSQLiteHelper) {
    const [list, setList] = React.useState<IPerson[]>([]);
    const [errorMessage, setErrorMessage] = React.useState('');
    React.useEffect(() => {
        if (sqlite.isDatabaseOpened === true || sqlite.isShouldRefresh === true) {
            sqlite.executeQuery<IPerson>('SELECT * FROM People')
                .then((result) => {
                    setList(result.list);
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