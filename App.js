import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const initialContacts = [
  {
    id: '1',
    name: 'Amy amiga',
    email: 'amy@gmail.com',
    phone: '(11) 99999-9999',
    avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7SgpEZGTQEXXRiwi1tOE3JcFtzxzPLJp7Hg&s',
    position: 'Vice President'
  },
  {
    id: '2',
    name: 'Chris Jackson colega',
    email: 'chris@gmail.com',
    phone: '(11) 98888-8888',
    avatar_url: 'https://www.agendartecultura.com.br/wp-content/uploads/2022/12/meneson.jpg',
    position: 'Vice Chairman'
  }
];

function LoginScreen({ navigation }) {  
  return (
    <View style={styles.container}>
      <Avatar
        rounded
        source={{
          uri: 'https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png',
        }}
      />
      <Input placeholder='Login' />
      <Input placeholder='Senha' secureTextEntry={true} />
      <Button 
        title="Login" 
        onPress={() => navigation.navigate('ListaContatos')}
      />
      <Button 
        title="cadastre-se" 
        type="clear" 
        onPress={() => navigation.navigate('CadastroUsuario')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function CadastroUsuarioScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      <Input placeholder='Nome completo' />
      <Input placeholder='E-mail' />
      <Input placeholder='Login' />
      <Input placeholder='Senha' secureTextEntry={true} />
      <Input placeholder='Confirme a senha' secureTextEntry={true} />
      <Button 
        title="Cadastrar" 
        onPress={() => navigation.goBack()}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function ListContatosScreen({ navigation }) {
  const [contacts, setContacts] = useState(initialContacts);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon 
          name="plus" 
          size={24} 
          color="black" 
          onPress={() => navigation.navigate('NovoContato', { setContacts })}
          style={{ marginRight: 15 }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.listContainer}>
      {
        contacts.map((contact, i) => (
          <ListItem 
            key={contact.id} 
            bottomDivider
            onPress={() => navigation.navigate('DetalhesContato', { 
              contact,
              setContacts,
              contacts 
            })}
          >
            <Avatar source={{uri: contact.avatar_url}} />
            <ListItem.Content>
              <ListItem.Title>{contact.name}</ListItem.Title>
              <ListItem.Subtitle>{contact.position}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))
      }
      <StatusBar style="auto" />
    </View>
  );
}

function DetalhesContatoScreen({ route, navigation }) {
  const { contact, contacts, setContacts } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState({...contact});

  const handleDelete = () => {
    Alert.alert(
      "Excluir Contato",
      `Deseja realmente excluir ${contact.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Excluir", 
          onPress: () => {
            const updatedContacts = contacts.filter(c => c.id !== contact.id);
            setContacts(updatedContacts);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleSave = () => {
    const updatedContacts = contacts.map(c => 
      c.id === contact.id ? editedContact : c
    );
    setContacts(updatedContacts);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <Avatar
        size="xlarge"
        rounded
        source={{ uri: contact.avatar_url }}
        containerStyle={styles.avatar}
      />
      
      {isEditing ? (
        <>
          <Input
            label="Nome"
            value={editedContact.name}
            onChangeText={(text) => setEditedContact({...editedContact, name: text})}
          />
          <Input
            label="E-mail"
            value={editedContact.email}
            onChangeText={(text) => setEditedContact({...editedContact, email: text})}
          />
          <Input
            label="Telefone"
            value={editedContact.phone}
            onChangeText={(text) => setEditedContact({...editedContact, phone: text})}
          />
          <Input
            label="Cargo"
            value={editedContact.position}
            onChangeText={(text) => setEditedContact({...editedContact, position: text})}
          />
          <Button
            title="Salvar"
            onPress={handleSave}
            buttonStyle={styles.saveButton}
          />
        </>
      ) : (
        <>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactDetail}>E-mail: {contact.email}</Text>
          <Text style={styles.contactDetail}>Telefone: {contact.phone}</Text>
          <Text style={styles.contactDetail}>Cargo: {contact.position}</Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Alterar"
              onPress={() => setIsEditing(true)}
              buttonStyle={styles.editButton}
            />
            <Button
              title="Excluir"
              onPress={handleDelete}
              buttonStyle={styles.deleteButton}
            />
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

function NovoContatoScreen({ navigation, route }) {
  const { setContacts } = route.params;
  const [newContact, setNewContact] = useState({
    id: Math.random().toString(36).substring(7),
    name: '',
    email: '',
    phone: '',
    position: '',
    avatar_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  });

  const handleSave = () => {
    setContacts(prevContacts => [...prevContacts, newContact]);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Contato</Text>
      <Input
        placeholder='Nome'
        value={newContact.name}
        onChangeText={(text) => setNewContact({...newContact, name: text})}
      />
      <Input
        placeholder='E-mail'
        value={newContact.email}
        onChangeText={(text) => setNewContact({...newContact, email: text})}
      />
      <Input
        placeholder='Telefone'
        value={newContact.phone}
        onChangeText={(text) => setNewContact({...newContact, phone: text})}
      />
      <Input
        placeholder='Cargo'
        value={newContact.position}
        onChangeText={(text) => setNewContact({...newContact, position: text})}
      />
      <Button 
        title="Salvar Contato" 
        onPress={handleSave}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuarioScreen} 
          options={{ title: 'Cadastro de Usuário' }} />
        <Stack.Screen name="ListaContatos" component={ListContatosScreen} 
          options={{ title: 'Lista de Contatos' }} />
        <Stack.Screen name="DetalhesContato" component={DetalhesContatoScreen} 
          options={{ title: 'Detalhes do Contato' }} />
        <Stack.Screen name="NovoContato" component={NovoContatoScreen} 
          options={{ title: 'Novo Contato' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatar: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactDetail: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    width: 150,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    width: 150,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    marginTop: 20,
  },
});

export default App;