import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
const LOGO_IMAGE = require('../../../assets/images/logo-flashfarma.png');

export default function LoginFarmacia() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* LOGO */}
      <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Acesso do Admin</Text>

      <TextInput
        placeholder="Digite o Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Digite sua senha"
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/farmacia/admin")}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.smallLink}>Esqueceu a senha?</Text>

      <TouchableOpacity onPress={() => router.push("../Farmacia/LoginFuncionario")}>
        <Text style={styles.smallLink}>Sou Funcionário</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomLinkContainer}
        onPress={() => router.push("../Farmacia/CadastroFarmacia")}
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
    marginTop: -80, // sobe a logo um pouco para ficar igual a imagem
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
