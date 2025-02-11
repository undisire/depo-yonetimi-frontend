<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card rounded="lg">
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="name"
            v-bind="nameProps"
            label="Ölçü birimi adı"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="symbol"
            v-bind="symbolProps"
            label="Sembol"
            variant="outlined"
            density="comfortable"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">İptal</v-btn>
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
  isEditModel.value ? "Ölçü Birimi Düzenle" : "Ölçü Birimi Ekle"
);

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(
    object({
      name: string().required("Ölçü birimi adı zorunludur."),
      symbol: string().required("Sembol zorunludur."),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [name, nameProps] = defineField("name", vuetifyConfig);
const [symbol, symbolProps] = defineField("symbol", vuetifyConfig);

const submit = handleSubmit((values) => {
  client({
    url: isEditModel.value ? `/uoms/${id.value}` : "/uoms",
    method: isEditModel.value ? "put" : "post",
    data: values,
  }).then((res) => {
    emit("saved", res.data?.data, isEditModel.value);

    if (isEditModel.value) {
      $toast.success("Ölçü birimi güncellendi.");
    } else {
      $toast.success("Ölçü birimi eklendi.");
    }

    dialog.value = false;
  });
});

function open(data) {
  resetForm();
  id.value = data?.id;

  if (data) {
    setValues({
      name: data.name,
      symbol: data.symbol,
    });
  }

  dialog.value = true;
}

defineExpose({
  open,
});
</script>
