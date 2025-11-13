/**
 * Development utilities for authentication bypass
 * Only use in development environment
 */

export function setDevToken() {
  if (process.env.NODE_ENV !== "development") {
    console.warn("Dev token can only be set in development environment");
    return;
  }

  // Create a dummy token for development
  const devToken = "dev_token_bypass_auth";
  
  localStorage.setItem("access_token", devToken);
  setCookie("access_token", devToken, 7);
  
  console.log("✅ Dev token set. Refresh the page to continue.");
}

export function clearDevToken() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  console.log("✅ Dev token cleared. Refresh the page.");
}

function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Expose to window in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).setDevToken = setDevToken;
  (window as any).clearDevToken = clearDevToken;
  console.log("🔧 Dev tools available: setDevToken(), clearDevToken()");
}
