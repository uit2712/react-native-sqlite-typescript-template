import React from 'react';
import { getPeople } from '../functions';
import { IResponseSQLiteHelper } from '../helpers';

export interface IPerson {
    id?: number;
    name: string;
    age: number;
}

export interface IResponseGetPeople {
    list: IPerson[];
    errorMessage: string;
    refresh: () => void;
}

export function useGetPeople(sqlite: IResponseSQLiteHelper): IResponseGetPeople {
    const [list, setList] = React.useState<IPerson[]>([]);
    const [errorMessage, setErrorMessage] = React.useState('');
    React.useEffect(() => {
        if (sqlite.isDatabaseOpened === true) {
            get();
        }
    }, [sqlite]);

    function get() {
        getPeople({
            sqlite
        }).then((result) => {
            setList(result);
        }).catch((error: Error) => {
            setErrorMessage(error.message);
        });
    }

    return {
        list,
        errorMessage,
        refresh: get,
    };
}