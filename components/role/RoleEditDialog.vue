<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card rounded="lg">
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="name"
            v-bind="nameProps"
            label="Rol Adı"
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

const props = defineProps({
  type: {
    type: String,
    default: "user",
  },
});

const emit = defineEmits(["saved"]);

const client = useJwtClient();
const $toast = useToast();

const dialog = ref(false);
const id = ref();
const isEditModel = computed(() => !!id.value);
const dialogTitle = computed(() =>
  isEditModel.value ? "Rol Düzenle" : "Rol Ekle"
);

const { setErrors, handleSubmit, defineField, resetForm, setValues } = useForm({
  initialValues: {
    type: props.type,
  },
  validationSchema: toTypedSchema(
    object({
      name: string().required("Rol adı zorunludur."),
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
    url: isEditModel.value ? `/roles/${id.value}` : "/roles",
    method: isEditModel.value ? "put" : "post",
    data: values,
  }).then((res) => {
    emit("saved", res.data?.data, isEditModel.value);

    if (isEditModel.value) {
      $toast.success("Rol güncellendi.");
    } else {
      $toast.success("Rol eklendi.");
    }

    dialog.value = false;
  });
});

function open(data) {
  resetForm();
  id.value = data?.id;

  if (data) {
    setValues({
      type: data.type,
      name: data.name,
    });
  }

  dialog.value = true;
}

defineExpose({
  open,
});
</script>
