<template>
  <v-dialog v-model="dialog" max-width="400" scrollable>
    <template #activator="{ props }">
      <slot name="activator" :props="props" />
    </template>

    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center pr-2">
        Çalışan Ekle
        <v-btn variant="plain" icon="mdi-close" @click="dialog = false"
      /></v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-autocomplete
            variant="outlined"
            density="comfortable"
            label="Çalışanlar"
            v-model="employee"
            v-bind="employeeProps"
            :items="employees"
            item-title="full_name"
            item-value="id"
            :loading="status === 'pending'"
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

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["saved"]);

const client = useJwtClient();
const $toast = useToast();

const dialog = ref(false);

const {
  data: employees,
  status,
  refresh,
} = await useLazyAsyncData(() => client.get("/employees"), {
  immediate: false,
  transform: (res) =>
    res.data?.data.map((x) => ({
      ...x,
      full_name: `${x.first_name} ${x.last_name} (${x.role.name})`,
    })),
  default: () => [],
});

const { setErrors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(
    object({
      employee_id: string().required("Çalışan zorunludur."),
    })
  ),
});

const vuetifyConfig = (state) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [employee, employeeProps] = defineField("employee_id", vuetifyConfig);

const submit = handleSubmit((values) => {
  client.post(`/projects/${props.projectId}/employees`, values).then((res) => {
    emit("saved", res.data?.data);

    $toast.success("Çalışan başarıyla eklendi.");

    dialog.value = false;
  });
});

watch(dialog, (value) => {
  if (value) {
    resetForm();
    refresh();
  }
});
</script>
