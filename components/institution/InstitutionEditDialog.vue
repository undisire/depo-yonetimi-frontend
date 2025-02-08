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
            label="Kurum Adı"
            v-model="name"
            v-bind="nameProps"
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
  isEditModel.value ? "Kurum Düzenle" : "Kurum Ekle"
);

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  initialValues: {
    status: "active",
  },
  validationSchema: toTypedSchema(
    object({
      name: string().required("Kurum adı zorunludur."),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [name, nameProps] = defineField("name", vuetifyConfig);

const submit = handleSubmit((values) => {
  client({
    url: isEditModel.value ? `/institutions/${id.value}` : "/institutions",
    method: isEditModel.value ? "put" : "post",
    data: values,
  }).then((res) => {
    emit("saved", res.data?.data, isEditModel.value);

    if (isEditModel.value) {
      $toast.success("Kurum başarıyla güncellendi.");
    } else {
      $toast.success("Kurum başarıyla eklendi.");
    }

    dialog.value = false;
  });
});

function open(data) {
  resetForm();
  dialog.value = true;
  id.value = data?.id;

  if (data) {
    setValues(data);
  }
}

defineExpose({ open });
</script>
