export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useJwtAuth();

  if (!isAuthenticated.value) {
    return;
  }

  const endpoint = "/dashboard";

  if (endpoint === false) {
    throw createError({ statusCode: 403 });
  }

  return navigateTo(endpoint, { replace: true });
});
