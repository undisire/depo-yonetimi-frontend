export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useJwtAuth();

  if (isAuthenticated.value) {
    return;
  }

  const endpoint = "/auth/login";

  if (endpoint === false) {
    throw createError({ statusCode: 403 });
  }

  return navigateTo(endpoint, { replace: true });
});
