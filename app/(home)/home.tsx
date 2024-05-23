import { View, Text, StyleSheet } from "react-native";

export default function Page() {

    return (
      <View style={styles.login}>
        <Text>Welcome</Text>
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
  });