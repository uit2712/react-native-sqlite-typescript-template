/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import People from './components/People';
import { PeopleContext } from './context-api/people-context-api';
import { SQLiteContext, useSQLiteHelper } from './helpers';
import { useGetPeople } from './hooks';

function App() {
    const sqlite = useSQLiteHelper({
        name: 'test.db',
        aliasName: 'abc.db',
    });

    const people = useGetPeople(sqlite);

    return (
        <SQLiteContext.Provider value={sqlite}>
            <PeopleContext.Provider value={people}>
                <People/>
            </PeopleContext.Provider>
        </SQLiteContext.Provider>
    );
};

export default App;