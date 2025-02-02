export async function getUsers() {
  const response = await fetch("/api/users?msg=test");
  if (!response.ok) {
    throw new Error("Error al recuperar usuarios: " + response.status);
  }

  return await response.text();
}
