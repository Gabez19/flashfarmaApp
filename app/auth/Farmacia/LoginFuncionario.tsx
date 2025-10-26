import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
const LOGO_IMAGE = require('../../../assets/images/logo-flashfarma.png');

export default function LoginFuncionario() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* LOGO */}
      <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Acesso da Farmácia</Text>

      <TextInput
        placeholder="Digite sua matrícula"
        style={styles.input}
        keyboardType="default"
      />
      <TextInput
        placeholder="Digite sua senha"
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/farmacia/funcionario")}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.smallLink}>Esqueceu a senha?</Text>

      <TouchableOpacity onPress={() => router.push("../Farmacia/LoginFarmacia")}>
        <Text style={styles.smallLink}>Sou Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomLinkContainer}
        onPress={() => router.push("../Farmacia/LoginFarmacia")}
      >
        <Text style={styles.bottomLink}>Primeiro Acesso? Cadastre sua Farmácia</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    marginTop: -80,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 25,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    backgroundColor: "#F3F3F3",
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#24BF38",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  smallLink: {
    marginTop: 12,
    fontSize: 14,
    color: "#4C4C4C",
  },
  bottomLinkContainer: {
    position: "absolute",
    bottom: 30,
  },
  bottomLink: {
    fontSize: 14,
    color: "#808080",
  },
});
