import AsyncStorage from '@react-native-async-storage/async-storage';

// Thin JSON-serializing wrapper around AsyncStorage.
// All methods swallow storage errors and log them — callers treat
// a failed read as "not set" rather than crashing the app.
const storage = {
  async get(key) {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(`storage.get("${key}") failed`, error);
      return null;
    }
  },

  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`storage.set("${key}") failed`, error);
      return false;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`storage.remove("${key}") failed`, error);
      return false;
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.warn('storage.clear() failed', error);
      return false;
    }
  },
};

export default storage;
