import axios from "axios";

function createHttpClient() {
  const config = useRuntimeConfig();

  const httpClient = axios.create({
    baseURL: config.public.baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    // withCredentials: true,
  });

  httpClient.interceptors.request.use(
    (config) => {
      const token = useAccessToken().value;
      if (token) {
        config.headers
          ? (config.headers.Authorization = `Bearer ${token}`)
          : (config.headers = config.headers || `Bearer ${token}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        useAccessToken().value = null;
        useJwtUser().value = null;
        navigateTo("/auth/login");
      }
      return Promise.reject(error);
    }
  );

  return httpClient;
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const client = createHttpClient();

  const user = useJwtUser();

  const identityFetchedOnInit = useState("identity_loaded", () => false);

  if (user.value === null && !identityFetchedOnInit.value) {
    identityFetchedOnInit.value = true;

    try {
      await client
        .get("/auth/user")
        .then((x) => x.data)
        .then((res) => {
          user.value = res.data;
        });
    } catch (e) {
      console.log("User is not authenticated on plugin initialization, status");
    }
  }

  nuxtApp.provide("httpClient", client);
});
