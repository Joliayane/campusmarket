import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
  StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../config/firebase';

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const validatePassword = (p) => p.length >= 6;
const validateName = (n) => n.trim().length >= 2;

const getFriendlyError = (code) => {
  switch (code) {
    case 'auth/email-already-in-use': return 'This email is already registered. Try logging in.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/weak-password': return 'Password is too weak. Use at least 6 characters.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default: return 'Registration failed. Please try again.';
  }
};

export default function RegisterScreen({ navigation }) {
const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!validateName(form.fullName)) e.fullName = 'Full name must be at least 2 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!validateEmail(form.email)) e.email = 'Enter a valid email address.';
    if (!validatePassword(form.password)) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);

      await updateProfile(user, { displayName: form.fullName.trim() });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        role: 'student',              
        avatarUrl: null,              
        rating: 0,
        totalReviews: 0,
        isVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

    } catch (error) {
      Alert.alert('Registration Failed', getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoIcon}>🏪</Text>
          </View>
          <Text style={styles.appName}>CampusMarket</Text>
          <Text style={styles.tagline}>Join your campus community</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create an account</Text>
          <Text style={styles.cardSubtitle}>It's free. It's easy. Start trading.</Text>

          <Field label="Full Name" icon="👤" error={errors.fullName}>
            <TextInput
              style={styles.input} placeholder="Juan dela Cruz" placeholderTextColor="#555"
              value={form.fullName} onChangeText={(t) => update('fullName', t)}
              autoCapitalize="words" returnKeyType="next"
            />
          </Field>

          <Field label="Email Address" icon="✉" error={errors.email}>
            <TextInput
              style={styles.input} placeholder="you@university.edu" placeholderTextColor="#555"
              value={form.email} onChangeText={(t) => update('email', t)}
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="next"
            />
          </Field>

          <Field label="Password" icon="🔒" error={errors.password} trailingIcon={
            <TouchableOpacity onPress={() => setShowPw((v) => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.toggle}>{showPw ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          }>
            <TextInput
              style={styles.input} placeholder="At least 6 characters" placeholderTextColor="#555"
              value={form.password} onChangeText={(t) => update('password', t)}
              secureTextEntry={!showPw} returnKeyType="next"
            />
          </Field>

          <Field label="Confirm Password" icon="🔒" error={errors.confirmPassword} trailingIcon={
            <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.toggle}>{showConfirm ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          }>
            <TextInput
              style={styles.input} placeholder="Repeat your password" placeholderTextColor="#555"
              value={form.confirmPassword} onChangeText={(t) => update('confirmPassword', t)}
              secureTextEntry={!showConfirm} returnKeyType="done" onSubmitEditing={handleRegister}
            />
          </Field>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister} disabled={loading} activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>already have an account?</Text>
            <View style={styles.dividerLine} />
          </View>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
            <Text style={styles.outlineBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          By creating an account, you agree to use this platform responsibly within your campus community.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, icon, error, trailingIcon, children }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && styles.inputError]}>
        <Text style={styles.inputIcon}>{icon}</Text>
        {children}
        {trailingIcon}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D0D' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 48 },

  header: { alignItems: 'center', marginBottom: 28 },
  logoMark: {
    width: 64, height: 64, borderRadius: 18, backgroundColor: '#E85D26',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    shadowColor: '#E85D26', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  logoIcon: { fontSize: 32 },
  appName: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 28, fontWeight: '700', color: '#F5F0EB', letterSpacing: 0.5 },
  tagline: { fontSize: 13, color: '#888', marginTop: 4, letterSpacing: 0.8 },

  card: { backgroundColor: '#181818', borderRadius: 24, padding: 28, borderWidth: 1, borderColor: '#2A2A2A' },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#F5F0EB', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#777', marginBottom: 24 },

  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#AAA', marginBottom: 8, letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#222', borderRadius: 12, borderWidth: 1.5, borderColor: '#333',
    paddingHorizontal: 14, height: 52,
  },
  inputError: { borderColor: '#E85D26' },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, color: '#F5F0EB', fontSize: 15 },
  toggle: { fontSize: 18, paddingLeft: 8 },
  errorText: { color: '#E85D26', fontSize: 12, marginTop: 5, marginLeft: 4 },

  btn: {
    backgroundColor: '#E85D26', borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
    shadowColor: '#E85D26', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  outlineBtn: { borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#333' },
  outlineBtnText: { color: '#AAA', fontSize: 15, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2A2A2A' },
  dividerText: { color: '#555', fontSize: 12, marginHorizontal: 12 },

  disclaimer: { color: '#444', fontSize: 11, textAlign: 'center', marginTop: 20, lineHeight: 16 },
});