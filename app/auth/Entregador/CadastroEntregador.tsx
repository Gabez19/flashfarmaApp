import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

const LOGO_IMAGE = require('../../../assets/images/logo-flashfarma.png');

export default function CadastroEntregador() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = () => {
    // Lógica real de cadastro (salvar no AsyncStorage / API)
    router.push('./LoginEntregador'); // volta pro login
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Cadastro do Entregador</Text>

      <TextInput
        placeholder="Nome completo"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={(v) => handleChange('nome', v)}
      />
      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={(v) => handleChange('email', v)}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
        onChangeText={(v) => handleChange('senha', v)}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('./LoginEntregador')}>
        <Text style={styles.linkText}>Já tem conta? Fazer login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#24BF38',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#24BF38',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    color: '#24BF38',
    marginTop: 16,
    fontSize: 14,
  },
});
