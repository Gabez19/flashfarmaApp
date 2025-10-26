import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const LOGO_IMAGE = require("../../../assets/images/logo-flashfarma.png");

export default function CadastroFarmacia() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <View style={styles.container}>
      <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Cadastre sua Farmácia</Text>
      <Text style={styles.stepText}>etapa {step} de 2</Text>

      {step === 1 ? (
        <>
          <TextInput placeholder="Nome Completo do Administrador" style={styles.input} />
          <TextInput placeholder="E-mail" style={styles.input} keyboardType="email-address" />
          <TextInput placeholder="Senha" style={styles.input} secureTextEntry />
          <TextInput placeholder="Repita a senha" style={styles.input} secureTextEntry />

          <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>próxima etapa</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput placeholder="Razão social" style={styles.input} />
          <TextInput placeholder="CNPJ" style={styles.input} />
          <TextInput placeholder="Endereço" style={styles.input} />
          <TextInput placeholder="Telefone" style={styles.input} keyboardType="phone-pad" />

          <TouchableOpacity
            style={[styles.button, styles.greenButton]}
            onPress={() => router.push("/farmacia/admin")}
          >
            <Text style={styles.buttonText}>cadastrar</Text>
          </TouchableOpacity>
        </>
      )}
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
    marginBottom: 5,
    color: "#333",
  },
  stepText: {
    fontSize: 13,
    color: "#777",
    marginBottom: 20,
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
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  blueButton: {
    backgroundColor: "#007AFF",
  },
  greenButton: {
    backgroundColor: "#24BF38",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
