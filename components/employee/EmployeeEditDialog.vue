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
          <v-text-field
            variant="outlined"
            density="comfortable"
            label="Çalışan Adı"
            v-model="firstName"
            v-bind="firstNameProps"
          />
          <v-text-field
            variant="outlined"
            density="comfortable"
            label="Çalışan Soyadı"
            v-model="lastName"
            v-bind="lastNameProps"
          />
          <v-text-field
            variant="outlined"
            density="comfortable"
            label="Telefon Numarası"
            v-model="phone"
            v-bind="phoneProps"
          />
          <v-select
            variant="outlined"
            density="comfortable"
            label="Rol"
            v-model="role"
            v-bind="roleProps"
            :items="roles"
            item-title="name"
            item-value="id"
          />
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
import { object, string } from "yup";
import { toTypedSchema } from "@vee-validate/yup";

const emit = defineEmits(["saved"]);

const client = useJwtClient();
const $toast = useToast();

const dialog = ref(false);
const id = ref();
const isEditModel = computed(() => !!id.value);
const dialogTitle = computed(() =>
  isEditModel.value ? "Çalışan Düzenle" : "Çalışan Ekle"
);

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  initialValues: {
    status: "active",
  },
  validationSchema: toTypedSchema(
    object({
      first_name: string().required("Çalışan adı zorunludur."),
      last_name: string().required("Çalışan soyadı zorunludur."),
      phone: string().required("Telefon numarası zorunludur."),
      role_id: string().required("Rol zorunludur."),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [firstName, firstNameProps] = defineField("first_name", vuetifyConfig);
const [lastName, lastNameProps] = defineField("last_name", vuetifyConfig);
const [phone, phoneProps] = defineField("phone", vuetifyConfig);
const [role, roleProps] = defineField("role_id", vuetifyConfig);

const submit = handleSubmit((values) => {
  client({
    url: isEditModel.value ? `/employees/${id.value}` : "/employees",
    method: isEditModel.value ? "put" : "post",
    data: values,
  }).then((res) => {
    emit("saved", res.data?.data, isEditModel.value);

    if (isEditModel.value) {
      $toast.success("Çalışan başarıyla güncellendi.");
    } else {
      $toast.success("Çalışan başarıyla eklendi.");
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
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      role_id: data.role_id,
    });
  }
}

defineExpose({ open });

const { data: roles } = await useLazyAsyncData(
  () =>
    client.get("/roles", {
      params: {
        type: "employee",
      },
    }),
  {
    transform: (res) => res.data?.data,
    default: () => [],
  }
);
</script>
