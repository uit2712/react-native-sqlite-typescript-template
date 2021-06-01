import * as React from 'react';
import {
    FlatList,
    ToastAndroid
} from 'react-native';
import { SQLiteContext } from '../helpers';
import { IPerson, useGetPeople } from '../hooks';
import { Button, Input, ListItem, } from 'react-native-elements';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addPerson, removePerson, updatePerson } from '../functions';
import { PeopleContext } from '../context-api/people-context-api';

function People() {
    const sqlite = React.useContext(SQLiteContext);
    const people = React.useContext(PeopleContext);
    const [updatingItem, setUpdatingItem] = React.useState<IPerson>();

    function renderItem({ item }: { item: IPerson }) {
        return (
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.age}</ListItem.Subtitle>
                </ListItem.Content>
                {
                    !updatingItem && (
                        <MaterialCommunityIcon
                            name='account-edit'
                            size={30}
                            onPress={() => setUpdatingItem(item)}
                        />
                    )
                }
                {
                    !updatingItem && (
                        <FontistoIcon
                            name='trash'
                            size={30}
                            onPress={() => removePerson({
                                sqlite,
                                id: item.id,
                                onSuccess: people.refresh,
                            })}
                        />
                    )
                }
            </ListItem>
        )
    }

    return (
        <>
            {
                updatingItem ? (
                    <PeopleUpdate
                        person={updatingItem}
                        onCancel={() => setUpdatingItem(null)}
                    />
                ) : (<PeopleAddition/>)
            }
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={people.list}
                renderItem={renderItem}
            />
        </>
    )
}

type PeopleActionType = {
    type: 'UPDATE_NAME' | 'UPDATE_AGE',
    payload: string,
};

type PeopleStateType = {
    name: string;
    ageStr: string;
}

function PeopleAddition() {
    const sqlite = React.useContext(SQLiteContext);
    const people = React.useContext(PeopleContext);
    const [state, dispatch] = React.useReducer((state: PeopleStateType, action: PeopleActionType) => {
        switch(action.type) {
            default: return state;
            case 'UPDATE_NAME':
                return {
                    ...state,
                    name: action.payload,
                }
            case 'UPDATE_AGE':
                return {
                    ...state,
                    ageStr: action.payload,
                }
        }
    }, {
        name: '',
        ageStr: '',
    });

    function add() {
        if (!state.name || !state.ageStr || Number(state.ageStr) <= 0) {
            ToastAndroid.show('Invalid params', ToastAndroid.SHORT);
        } else {
            addPerson({
                sqlite,
                person: { age: Number(state.ageStr), name: state.name },
                onSuccess: people.refresh,
            }).then(() => {
                ToastAndroid.show('Add new person successful!', ToastAndroid.SHORT);
            }).catch((error: Error) => {
                ToastAndroid.show(`Add new person failed: ${error.message}`, ToastAndroid.SHORT);
            });
        }
    }

    return (
        <>
            <Input
                value={state.name}
                placeholder='Name'
                onChangeText={(text: string) => dispatch({ type: 'UPDATE_NAME', payload: text })}
            />
            <Input
                keyboardType='numeric'
                value={state.ageStr}
                placeholder='Age'
                onChangeText={(text: string) => dispatch({ type: 'UPDATE_AGE', payload: text })}
            />
            <Button
                title='Add'
                type='solid'
                style={{
                    marginHorizontal: 10,
                }}
                onPress={add}
            />
        </>
    )
}

function PeopleUpdate({ person, onCancel }: { person: IPerson, onCancel: () => void }) {
    const sqlite = React.useContext(SQLiteContext);
    const people = React.useContext(PeopleContext);
    const [state, dispatch] = React.useReducer((state: PeopleStateType, action: PeopleActionType) => {
        switch(action.type) {
            default: return state;
            case 'UPDATE_NAME':
                return {
                    ...state,
                    name: action.payload,
                }
            case 'UPDATE_AGE':
                return {
                    ...state,
                    ageStr: action.payload,
                }
        }
    }, {
        name: person.name,
        ageStr: String(person.age),
    });

    function update() {
        if (!state.name || !state.ageStr || Number(state.ageStr) <= 0) {
            ToastAndroid.show('Invalid params', ToastAndroid.SHORT);
        } else {
            updatePerson({
                sqlite,
                person: { id: person.id, age: Number(state.ageStr), name: state.name },
                onSuccess: people.refresh,
            }).then(() => {
                ToastAndroid.show('Update person successful!', ToastAndroid.SHORT);
                onCancel();
            }).catch((error: Error) => {
                ToastAndroid.show(`'Update person failed: ${error.message}`, ToastAndroid.SHORT);
            });
        }
    }

    return (
        <>
            <Input
                value={state.name}
                placeholder='Name'
                onChangeText={(text: string) => dispatch({ type: 'UPDATE_NAME', payload: text })}
            />
            <Input
                keyboardType='numeric'
                value={state.ageStr}
                placeholder='Age'
                onChangeText={(text: string) => dispatch({ type: 'UPDATE_AGE', payload: text })}
            />
            <Button
                title='Update'
                type='solid'
                style={{
                    marginHorizontal: 10,
                }}
                onPress={update}
            />
            <Button
                title='Cancel'
                type='outline'
                style={{
                    marginHorizontal: 10,
                    borderWidth: 3,
                }}
                onPress={onCancel}
            />
        </>
    )
}

export default People;