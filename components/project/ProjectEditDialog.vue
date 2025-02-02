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
            label="Proje Adı"
            v-model="name"
            v-bind="nameProps"
          />
          <v-textarea
            variant="outlined"
            density="comfortable"
            label="Açıklama"
            v-model="description"
            v-bind="descriptionProps"
          />
          <v-select
            variant="outlined"
            density="comfortable"
            v-model="status"
            v-bind="statusProps"
            :items="statuses"
            label="Durum"
            dense
            outlined
          />
          <v-text-field
            type="date"
            variant="outlined"
            density="comfortable"
            label="Başlangıç Tarihi"
            clearable
            v-model="startDate"
            v-bind="startDateProps"
          />
          <v-text-field
            type="date"
            variant="outlined"
            density="comfortable"
            label="Bitiş Tarihi"
            clearable
            v-model="endDate"
            v-bind="endDateProps"
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
import { object, string, bool } from "yup";
import { toTypedSchema } from "@vee-validate/yup";

const emit = defineEmits(["saved"]);

const client = useJwtClient();
const $toast = useToast();

const statuses = [
  {
    title: "Aktif",
    value: "active",
  },
  {
    title: "İptal",
    value: "cancelled",
  },
  {
    title: "Tamamlandı",
    value: "completed",
  },
];

const passwordVisible = ref(false);
const dialog = ref(false);
const id = ref();
const isEditModel = computed(() => !!id.value);
const dialogTitle = computed(() =>
  isEditModel.value ? "Proje Düzenle" : "Proje Ekle"
);

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  initialValues: {
    status: "active",
  },
  validationSchema: toTypedSchema(
    object({
      name: string().required("Proje adı zorunludur."),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [name, nameProps] = defineField("name", vuetifyConfig);
const [description, descriptionProps] = defineField(
  "description",
  vuetifyConfig
);
const [status, statusProps] = defineField("status", vuetifyConfig);
const [startDate, startDateProps] = defineField("start_date", vuetifyConfig);
const [endDate, endDateProps] = defineField("end_date", vuetifyConfig);

const submit = handleSubmit((values) => {
  client({
    url: isEditModel.value ? `/projects/${id.value}` : "/projects",
    method: isEditModel.value ? "put" : "post",
    data: values,
  }).then((res) => {
    emit("saved", res.data?.data, isEditModel.value);

    if (isEditModel.value) {
      $toast.success("Proje başarıyla güncellendi.");
    } else {
      $toast.success("Proje başarıyla eklendi.");
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
