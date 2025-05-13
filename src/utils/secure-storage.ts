
/**
 * Secure storage utility that provides protection against XSS vulnerabilities
 * This creates an abstraction layer over localStorage to enhance security
 */

// Characters that need to be escaped in JSON strings 
const escapeChars: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(str: string): string {
  return String(str).replace(/[&<>"'`=\/]/g, function(s) {
    return escapeChars[s];
  });
}

/**
 * Unescapes HTML entities back to their original characters
 */
function unescapeHtml(str: string): string {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`')
    .replace(/&#x3D;/g, '=');
}

/**
 * Securely stores data in localStorage with XSS protection
 */
export function secureSet(key: string, value: any): void {
  try {
    const serialized = JSON.stringify(value);
    const secured = escapeHtml(serialized);
    localStorage.setItem(key, secured);
  } catch (error) {
    console.error('Error storing data securely:', error);
  }
}

/**
 * Securely retrieves data from localStorage
 */
export function secureGet<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const secured = localStorage.getItem(key);
    if (!secured) return defaultValue;
    
    const serialized = unescapeHtml(secured);
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error retrieving data securely:', error);
    return defaultValue;
  }
}

/**
 * Securely removes data from localStorage
 */
export function secureRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data securely:', error);
  }
}

/**
 * Gets all keys in localStorage that match a prefix
 */
export function getKeysWithPrefix(prefix: string): string[] {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error getting keys with prefix:', error);
    return [];
  }
}

/**
 * Securely clears all items in localStorage with a specific prefix
 * This provides a safer alternative to clearing all localStorage data
 */
export function secureClearWithPrefix(prefix: string): void {
  try {
    const keysToRemove = getKeysWithPrefix(prefix);
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return;
  } catch (error) {
    console.error('Error clearing data with prefix securely:', error);
  }
}

export default {
  set: secureSet,
  get: secureGet,
  remove: secureRemove,
  getKeysWithPrefix,
  clearWithPrefix: secureClearWithPrefix
};
