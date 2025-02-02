<template>
  <v-dialog v-model="dialog" max-width="400" scrollable>
    <template #activator="{ props }">
      <slot name="activator" :props="props" />
    </template>

    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center pr-2">
        {{ dialogTitle }}
        <v-btn variant="plain" icon="mdi-close" @click="dialog = false"
      /></v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-select
            variant="outlined"
            density="comfortable"
            v-model="role"
            v-bind="roleProps"
            :items="roles"
            label="Rol"
            dense
            outlined
          />
          <v-text-field
            variant="outlined"
            density="comfortable"
            label="Ad Soyad"
            v-model="fullName"
            v-bind="fullNameProps"
          />
          <v-text-field
            variant="outlined"
            density="comfortable"
            label="E-Posta"
            v-model="email"
            v-bind="emailProps"
          />
          <v-text-field
            variant="outlined"
            density="comfortable"
            label="Şifre"
            :type="passwordVisible ? 'text' : 'password'"
            @click:append-inner="passwordVisible = !passwordVisible"
            append-inner-icon="mdi-eye"
            v-model="password"
            v-bind="passwordProps"
          />
          <v-switch
            label="Aktif"
            v-model="isActive"
            v-bind="isActiveProps"
            color="primary"
          ></v-switch>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="dialog = false">İptal</v-btn>
        <v-btn color="primary" @click="submit">Kaydet</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { object, string, bool } from "yup";
import { toTypedSchema } from "@vee-validate/yup";

const emit = defineEmits(["saved"]);

const client = useJwtClient();
const $toast = useToast();

const passwordVisible = ref(false);
const dialog = ref(false);
const id = ref();
const isEditModel = computed(() => !!id.value);
const dialogTitle = computed(() =>
  isEditModel.value ? "Kullanıcı Düzenle" : "Kullanıcı Ekle"
);

const roles = [
  {
    title: "Yönetici",
    value: "admin",
  },
  {
    title: "Mühendis",
    value: "engineer",
  },
  {
    title: "Depo Sorumlusu",
    value: "warehouse",
  },
  {
    title: "Taşeron",
    value: "contractor",
  },
];

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  initialValues: {
    is_active: true,
  },
  validationSchema: toTypedSchema(
    object({
      full_name: string().required("Ad Soyad alanı zorunludur."),
      email: string()
        .email("Geçersiz eposta")
        .required("E-Mail alanı zorunludur."),
      password: string(),
      role: string().required("Rol alanı zorunludur."),
      is_active: bool(),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [fullName, fullNameProps] = defineField("full_name", vuetifyConfig);
const [email, emailProps] = defineField("email", vuetifyConfig);
const [password, passwordProps] = defineField("password", vuetifyConfig);
const [role, roleProps] = defineField("role", vuetifyConfig);
const [isActive, isActiveProps] = defineField("is_active", vuetifyConfig);

const submit = handleSubmit((values) => {
  client({
    url: isEditModel.value ? `/users/${id.value}` : "/users",
    method: isEditModel.value ? "put" : "post",
    data: {
      ...values,
      password: values.password || undefined,
    },
  }).then((res) => {
    emit("saved", res.data?.data, isEditModel.value);

    if (isEditModel.value) {
      $toast.success("Kullanıcı başarıyla güncellendi.");
    } else {
      $toast.success("Kullanıcı başarıyla eklendi.");
    }

    dialog.value = false;
  });
});

function open(data) {
  resetForm();
  dialog.value = true;
  id.value = data?.id;

  if (data) {
    setValues({
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      is_active: data.is_active,
    });
  }
}

defineExpose({ open });
</script>
