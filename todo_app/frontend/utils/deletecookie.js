
export default function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  }
  