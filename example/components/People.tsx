import * as React from 'react';
import {
    FlatList,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    ToastAndroid
} from 'react-native';
import { SQLiteContext } from '../helpers';
import { IPerson, useGetPeople } from '../hooks';
import { Button, Input, ListItem, } from 'react-native-elements';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { addPerson, removePerson } from '../functions';

function People() {
    const sqlite = React.useContext(SQLiteContext);
    const people = useGetPeople(sqlite);

    function renderItem({ item }: { item: IPerson }) {
        return (
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.age}</ListItem.Subtitle>
                </ListItem.Content>
                <FontistoIcon
                    name='trash'
                    size={30}
                    onPress={() => removePerson(sqlite, item.id)}
                />
            </ListItem>
        )
    }

    return (
        <>
            <PeopleAddition/>
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={people.list}
                renderItem={renderItem}
            />
        </>
    )
}

type PeopleAdditionType = {
    type: 'UPDATE_NAME' | 'UPDATE_AGE',
    payload: string,
};

type PeopleAdditionStateType = {
    name: string;
    ageStr: string;
}

function PeopleAddition() {
    const sqlite = React.useContext(SQLiteContext);
    const [state, dispatch] = React.useReducer((state: PeopleAdditionStateType, action: PeopleAdditionType) => {
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
            addPerson(sqlite, { age: Number(state.ageStr), name: state.name })
                .then(() => {
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

export default People;