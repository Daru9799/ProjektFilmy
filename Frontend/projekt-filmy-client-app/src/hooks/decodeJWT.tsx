export function decodeJWT(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

//Funkcja do dekodowania tokenu
export function getDecodedToken(): any {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return decodeJWT(token);
  } catch (error) {
    console.error("Błąd dekodowania tokenu:", error);
    return null;
  }
}

//Funkcja do sprawdzania czy user jest modem
export function isUserMod(): boolean {
  const decoded = getDecodedToken();
  return decoded?.role === "Mod" || false;
}

//Funkcja do zwracania ID zalogowanego usera z jego tokenu
export function getLoggedUserId(): string | null {
  const decoded = getDecodedToken();
  return decoded?.nameid ?? null;
}