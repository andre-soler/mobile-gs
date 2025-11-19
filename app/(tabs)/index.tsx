import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Entry = {
  id: string;
  text: string;
};

export default function Index() {
  const [entry, setEntry] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await AsyncStorage.getItem("wellness");
    if (data) setHistory(JSON.parse(data));
  };

  const saveEntry = async () => {
    if (!entry.trim()) return;

    const newHistory = [...history, { id: Date.now().toString(), text: entry }];
    setHistory(newHistory);

    await AsyncStorage.setItem("wellness", JSON.stringify(newHistory));
    setEntry("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diário de Bem-Estar</Text>

      <TextInput
        style={styles.input}
        placeholder="Como você está hoje?"
        value={entry}
        onChangeText={setEntry}
      />

      <Button title="Salvar" onPress={saveEntry} />

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>• {item.text}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#121212", // fundo escuro
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffffff",            // título branco
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffffff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",  // campo branco
    color: "#000000",            // texto preto no input
  },
  item: {
    padding: 8,
    fontSize: 16,
    color: "#ffffff",            // texto das entradas branco
  },
});

