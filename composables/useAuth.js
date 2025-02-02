import { useStorage } from "@vueuse/core";

export const useAccessToken = () => {
  return useStorage("dy_access_token");
};

export const useJwtClient = () => {
  const { $httpClient } = useNuxtApp();
  return $httpClient;
};

export const useJwtUser = () => {
  return useState("user", () => null);
};

export const useJwtAuth = () => {
  const user = useJwtUser();
  const client = useJwtClient();

  const isAuthenticated = computed(() => {
    return user.value !== null;
  });

  const isIdentityLoaded = useState("identity_loaded", () => false);

  async function login(credentials) {
    const response = await client
      .post("/auth/login", credentials)
      .then((x) => x.data);

    useAccessToken().value = response.data.token;

    await refreshIdentity();

    navigateTo("/dashboard");
  }

  async function refreshIdentity() {
    user.value = await client.get("/auth/user").then((x) => x.data?.data);
  }

  async function init() {
    if (isIdentityLoaded.value) {
      return;
    }

    isIdentityLoaded.value = true;
    await refreshIdentity();
  }

  async function logout() {
    if (!isAuthenticated.value) {
      throw new Error("User is not authenticated");
    }

    await client.post("/auth/logout");

    user.value = null;

    useAccessToken().value = null;

    navigateTo("/auth/login");
  }

  return {
    user,
    isAuthenticated,
    init,
    login,
    logout,
    refreshIdentity,
  };
};
