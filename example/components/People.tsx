import * as React from 'react';
import { FlatList, } from 'react-native';
import { SQLiteContext } from '../helpers';
import { IPerson, useGetPeople } from '../hooks';
import { ListItem, } from 'react-native-elements';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { removePerson } from '../functions';

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
        <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={people.list}
            renderItem={renderItem}
        />
    )
}

export default People;