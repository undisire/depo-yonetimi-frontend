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
            label="Depo Kodu"
            v-model="code"
            v-bind="codeProps"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            density="comfortable"
            label="Depo Adı"
            v-model="name"
            v-bind="nameProps"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            density="comfortable"
            label="Konum"
            v-model="location"
            v-bind="locationProps"
          ></v-text-field>
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

const dialog = ref(false);
const id = ref();
const isEditModel = computed(() => !!id.value);
const dialogTitle = computed(() =>
  isEditModel.value ? "Depo Düzenle" : "Depo Ekle"
);

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  initialValues: {
    is_active: true,
  },
  validationSchema: toTypedSchema(
    object({
      code: string().required("Depo kodu zorunludur."),
      name: string().required("Depo adı zorunludur."),
      location: string().required("Konum zorunludur."),
      is_active: bool(),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [code, codeProps] = defineField("code", vuetifyConfig);
const [name, nameProps] = defineField("name", vuetifyConfig);
const [location, locationProps] = defineField("location", vuetifyConfig);
const [isActive, isActiveProps] = defineField("is_active", vuetifyConfig);

const submit = handleSubmit((values) => {
  client({
    url: isEditModel.value ? `/warehouses/${id.value}` : "/warehouses",
    method: isEditModel.value ? "put" : "post",
    data: values,
  }).then((res) => {
    emit("saved", res.data?.data, isEditModel.value);

    if (isEditModel.value) {
      $toast.success("Depo başarıyla güncellendi.");
    } else {
      $toast.success("Depo başarıyla eklendi.");
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
      code: data.code,
      name: data.name,
      location: data.location,
      is_active: data.is_active,
    });
  }
}

defineExpose({ open });
</script>
