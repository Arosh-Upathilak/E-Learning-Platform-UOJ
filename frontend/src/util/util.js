export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


export function humanFileSize(bytes) {
  if (!bytes && bytes !== 0) return "0 B";
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export function shortName(name, limit = 40) {
  if (!name) return "";
  return name.length > limit ? name.slice(0, limit - 3) + "..." : name;
}

