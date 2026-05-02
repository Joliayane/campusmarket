import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const QUICK_ACTIONS = [
  { icon: '📦', label: 'Browse Listings', color: '#1E4D8C', screen: 'Listings' },
  { icon: '➕', label: 'Post an Item', color: '#2D7A4F', screen: 'PostItem' },
  { icon: '🛒', label: 'My Orders', color: '#7A3E2D', screen: 'Orders' },
  { icon: '💬', label: 'Messages', color: '#5C2D91', screen: 'Messages' },
  { icon: '⭐', label: 'Saved Items', color: '#7A6A2D', screen: 'Saved' },
  { icon: '👤', label: 'My Profile', color: '#2D5C7A', screen: 'Profile' },
];

export default function DashboardScreen({ navigation }) {
  const { user, userProfile, logout } = useAuth();

const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  const handleAction = (screen) => {
    if (navigation.getState().routeNames.includes(screen)) {
      navigation.navigate(screen);
    } else {
      Alert.alert('Coming Soon', `${screen} will be available soon!`);
    }
  };

  const displayName = userProfile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Student';
  const initials = displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good day 👋</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => handleAction('Profile')}>
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Campus Marketplace</Text>
            <Text style={styles.heroSub}>Buy, sell & trade with students on your campus.</Text>
            <TouchableOpacity style={styles.heroCta} onPress={() => handleAction('Listings')}>
              <Text style={styles.heroCtaText}>Explore Listings →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroEmoji}>🛍️</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {QUICK_ACTIONS.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={[styles.actionTile, { backgroundColor: item.color + '33', borderColor: item.color + '66' }]}
                onPress={() => handleAction(item.screen)}
                activeOpacity={0.75}
              >
                <Text style={styles.actionIcon}>{item.icon}</Text>
                <Text style={styles.actionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="✉" label="Email" value={user?.email} />
            <InfoRow icon="🆔" label="User ID" value={user?.uid?.slice(0, 12) + '...'} last />
          </View>
        </View>

        <View style={[styles.section, { paddingBottom: 48 }]}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D0D' },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 8,
  },
  greeting: { fontSize: 13, color: '#888', marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: '700', color: '#F5F0EB', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#E85D26',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  heroBanner: {
    marginHorizontal: 24, marginTop: 24, borderRadius: 20,
    backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A',
    padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: 18, fontWeight: '700', color: '#F5F0EB', marginBottom: 6 },
  heroSub: { fontSize: 13, color: '#888', lineHeight: 18, marginBottom: 14 },
  heroCta: {
    alignSelf: 'flex-start', backgroundColor: '#E85D26',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  heroCtaText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  heroEmoji: { fontSize: 52, marginLeft: 8 },

  section: { paddingHorizontal: 24, marginTop: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#F5F0EB', marginBottom: 16, letterSpacing: 0.3 },

  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionTile: {
    width: '47%', borderRadius: 16, borderWidth: 1,
    padding: 18, alignItems: 'center', gap: 10,
  },
  actionIcon: { fontSize: 28 },
  actionLabel: { color: '#DDD', fontSize: 13, fontWeight: '600', textAlign: 'center' },

  infoCard: { backgroundColor: '#181818', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A2A', overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#222' },
  infoIcon: { fontSize: 18, marginRight: 14 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#CCC', fontWeight: '500' },

  logoutBtn: {
    borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#3A1A1A', backgroundColor: '#1A0A0A',
  },
  logoutText: { color: '#E85D26', fontSize: 15, fontWeight: '600' },
});