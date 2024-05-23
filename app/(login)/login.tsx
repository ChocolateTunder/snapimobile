import React, {useState} from 'react';
import { router } from "expo-router";
import { Text, StyleSheet, View, Image, ScrollView, TextInput, Button, Pressable } from "react-native";

export default function Page() {
  const [username, setUsername] = useState('');

//   useEffect(() => {
//     let payload = {
        
//     }
//     let axiosConfig = {
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     };
//     axios.post(token_url, {
//         username: "QUT",
//         password: "##QUT##",
//         grant_type: "password"
//         //refresh_token: "49eb10af-28ef-4679-85a6-5916aa5d092e",
//         //grant_type: "refresh_token",
//     }, axiosConfig)
//     .then(function(response){
//         console.log(response)
//     })
//     .catch(function (error){
//         console.error("Error in verifying token: ", error);
//     });
// }, []);

  return (
    <View style={styles.login}>
      <TextInput
      style={styles.input}
      placeholder="Username"
      onChangeText={newText => setUsername(newText)}
      />

      <TextInput
      secureTextEntry={true}
      style={styles.input}
      placeholder="Password"
      />

      <Pressable onPress={() => router.push("/home")}>

        <Text>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  login: {
    //backgroundColor: "green", 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});
