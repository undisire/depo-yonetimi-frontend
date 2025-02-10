<template>
  <v-card flat border rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      Çalışanlar
      <ProjectEmployeeAddDialog :project-id="id" @saved="refresh">
        <template #activator="{ props }">
          <v-btn
            color="primary"
            rounded="lg"
            flat
            prepend-icon="mdi-plus"
            v-bind="props"
          >
            Ekle
          </v-btn>
        </template>
      </ProjectEmployeeAddDialog>
    </v-card-title>
    <v-divider />
    <v-data-table
      :items="data"
      :headers="headers"
      :items-per-page="-1"
      hide-default-footer
      density="comfortable"
    >
      <template #item.full_name="{ item }">
        {{ item.first_name }} {{ item.last_name }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          size="small"
          density="comfortable"
          color="red"
          variant="plain"
          icon="mdi-delete"
          @click="handleDelete(item.id)"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
const { id } = useRoute().params;

const client = useJwtClient();
const confirm = useConfirm();
const toast = useToast();

const { data, refresh } = await useLazyAsyncData(
  () => client.get(`/projects/${id}/employees`).then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

const headers = [
  {
    title: "#",
    value: "id",
  },
  {
    title: "İsim",
    value: "full_name",
  },
  {
    title: "Rol",
    value: "role.name",
  },
  {
    title: "İşlemler",
    value: "actions",
    align: "end",
  },
];

const loadingConfirm = ref(false);

const handleDelete = (userId) => {
  confirm.open({
    title: "Çalışanı Sil",
    description: "Çalışanı silmek istediğinize emin misiniz?",
    loading: loadingConfirm,
    onConfirm: async () => {
      try {
        await client.delete(`/projects/${id}/employees/${userId}`);
        await refresh();
        confirm.close();
        toast.success("Çalışan başarıyla silindi.");
      } finally {
        loadingConfirm.value = false;
      }
    },
  });
};
</script>
