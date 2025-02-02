<template>
  <v-container fluid class="h-100 pa-4">
    <v-row align="center" justify="center" class="h-100">
      <v-sheet class="flex-1-1 px-6 py-8" rounded="lg" max-width="420px">
        <div class="text-h4 text-center mb-8 font-weight-bold">Giriş Yap</div>
        <v-form @submit.prevent="submit">
          <v-text-field
            rounded="lg"
            validate-on="blur"
            center-affix
            autofocus
            variant="outlined"
            density="comfortable"
            placeholder="ornek@gmail.com"
            label="E-Mail"
            type="email"
            clearable
            class="mb-3"
            :readonly="loading"
            v-model="email"
            v-bind="emailProps"
          ></v-text-field>
          <v-text-field
            rounded="lg"
            center-affix
            variant="outlined"
            density="comfortable"
            placeholder="Şifrenizi giriniz"
            label="Şifre"
            clearable
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
            :readonly="loading"
            v-model="password"
            v-bind="passwordProps"
          ></v-text-field>

          <div
            class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between ml-n2 mb-2"
          >
            <v-checkbox
              label="Beni Hatırla"
              hide-details
              color="primary"
              v-model="remember"
            />
            <NuxtLink
              class="text-body-2 text-decoration-none text-primary font-weight-semibold"
              to="/auth/forgot-password"
              >Şifremi Unuttum</NuxtLink
            >
          </div>

          <v-btn
            block
            flat
            size="large"
            color="primary"
            type="submit"
            variant="elevated"
            rounded="lg"
            class="text-none text-subtitle-1 font-weight-bold"
            :loading="loading"
            >Giriş Yap</v-btn
          >
        </v-form>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script setup>
import { bool, object, string } from "yup";
import { toTypedSchema } from "@vee-validate/yup";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const { login } = useJwtAuth();
const route = useRoute();
const { $toast } = useNuxtApp();

const showPassword = ref(false);
const loading = ref(false);

const { setErrors, handleSubmit, defineField } = useForm({
  initialValues: {
    email: route.query?.email?.toString() || "",
    password: "",
  },
  validationSchema: toTypedSchema(
    object({
      email: string()
        .email("Geçersiz eposta")
        .required("E-Mail alanı zorunludur."),
      password: string().required("Şifre alanı zorunludur."),
      remember: bool(),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [email, emailProps] = defineField("email", vuetifyConfig);
const [password, passwordProps] = defineField("password", vuetifyConfig);
const [remember] = defineField("remember");

const submit = handleSubmit((values) => {
  loading.value = true;
  login(values)
    .catch((e) => {
      const error = useApiError(e);

      if (error.isValidationError) {
        setErrors(error.bag);

        return;
      }

      if (e.response?._data) {
        $toast.error(e.response._data.message);
      } else {
        $toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    })
    .finally(() => (loading.value = false));
});
</script>

<style></style>
