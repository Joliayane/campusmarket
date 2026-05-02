// src/screens/app/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Platform, StatusBar, Image, Alert,
} from 'react-native';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, userProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setAvatarBase64(userProfile.avatarBase64 || null);
    } else if (user) {
      setFullName(user.displayName || '');
    }
  }, [userProfile, user]);

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  const handlePickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please allow access to your photo library.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (!asset.base64) {
          Alert.alert('Error', 'Could not read image data.');
          return;
        }

        setUploading(true);
        const base64String = `data:image/jpeg;base64,${asset.base64}`;

        await updateDoc(doc(db, 'users', user.uid), {
          avatarBase64: base64String,
          updatedAt: serverTimestamp(),
        });

        setAvatarBase64(base64String);
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      Alert.alert('Invalid Name', 'Full name must be at least 2 characters.');
      return;
    }
    setSaving(true);
    try {
      await Promise.all([
        updateDoc(doc(db, 'users', user.uid), {
          fullName: fullName.trim(),
          updatedAt: serverTimestamp(),
        }),
        updateProfile(auth.currentUser, { displayName: fullName.trim() }),
      ]);
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {avatarBase64 ? (
              <Image source={{ uri: avatarBase64 }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={handlePickImage}
              disabled={uploading}
              activeOpacity={0.8}
            >
              {uploading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.cameraIcon}>📷</Text>
              }
            </TouchableOpacity>
          </View>
          {uploading && <Text style={styles.uploadProgress}>Saving photo...</Text>}
          <Text style={styles.avatarHint}>Tap the camera icon to change your photo</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Your full name"
                  placeholderTextColor="#555"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrap, styles.inputReadOnly]}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={[styles.input, { color: '#666' }]}
                  value={user?.email || ''}
                  editable={false}
                />
                <Text style={styles.readOnlyBadge}>locked</Text>
              </View>
              <Text style={styles.fieldHint}>Email cannot be changed</Text>
            </View>

            <View style={[styles.fieldGroup, { marginBottom: 0 }]}>
              <Text style={styles.label}>User ID</Text>
              <View style={[styles.inputWrap, styles.inputReadOnly]}>
                <Text style={styles.inputIcon}>🆔</Text>
                <TextInput
                  style={[styles.input, { color: '#555', fontSize: 12 }]}
                  value={user?.uid || ''}
                  editable={false}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.btnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveBtnText}>Save Changes</Text>
            }
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile?.totalReviews || 0}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile?.rating?.toFixed(1) || '0.0'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile?.role || 'student'}</Text>
              <Text style={styles.statLabel}>Role</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16,
  },
  backBtn: { width: 60 },
  backText: { color: '#E85D26', fontSize: 15, fontWeight: '600' },
  headerTitle: {
    fontSize: 18, fontWeight: '700', color: '#F5F0EB',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  avatarSection: { alignItems: 'center', paddingVertical: 32 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatarImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#E85D26' },
  avatarPlaceholder: {
    width: 110, height: 110, borderRadius: 55, backgroundColor: '#E85D26',
    justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#E85D26',
  },
  avatarInitials: { fontSize: 40, fontWeight: '700', color: '#fff' },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#333', borderWidth: 2, borderColor: '#0D0D0D',
    justifyContent: 'center', alignItems: 'center',
  },
  cameraIcon: { fontSize: 18 },
  uploadProgress: { color: '#E85D26', fontSize: 13, marginBottom: 8 },
  avatarHint: { color: '#555', fontSize: 12 },
  formSection: { paddingHorizontal: 24, paddingBottom: 48 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#F5F0EB', marginBottom: 16 },
  card: {
    backgroundColor: '#181818', borderRadius: 20,
    borderWidth: 1, borderColor: '#2A2A2A', padding: 20, marginBottom: 20,
  },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#AAA', marginBottom: 8, letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#222',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#333', paddingHorizontal: 14, height: 52,
  },
  inputReadOnly: { borderColor: '#222', backgroundColor: '#161616' },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, color: '#F5F0EB', fontSize: 15 },
  readOnlyBadge: {
    fontSize: 10, color: '#444', backgroundColor: '#222',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#333',
  },
  fieldHint: { color: '#444', fontSize: 11, marginTop: 5, marginLeft: 4 },
  saveBtn: {
    backgroundColor: '#E85D26', borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    shadowColor: '#E85D26', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  btnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#181818',
    borderRadius: 16, borderWidth: 1, borderColor: '#2A2A2A', padding: 20, alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#F5F0EB', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666' },
  statDivider: { width: 1, height: 40, backgroundColor: '#2A2A2A' },
});