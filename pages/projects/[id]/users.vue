<template>
  <v-card flat border rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      Çalışanlar
      <v-btn
        color="primary"
        rounded="lg"
        flat
        prepend-icon="mdi-plus"
        @click="dialog = true"
      >
        Ekle
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-data-table
      :items="data"
      :headers="headers"
      :items-per-page="-1"
      hide-default-footer
      density="comfortable"
    >
      <template #item.actions="{ item }">
        <v-btn
          size="small"
          density="comfortable"
          color="red"
          variant="plain"
          icon="mdi-delete"
          @click="removeUser(item.id)"
        />
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card rounded="lg">
      <v-card-title>
        <span class="text-h5">Çalışan Ekle</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-autocomplete
            v-model="selectedUser"
            :items="users"
            item-title="full_name"
            item-value="id"
            label="Kullanıcı"
            variant="outlined"
            required
          ></v-autocomplete>
          <v-select
            :disabled="!selectedUser"
            v-model="selectedRole"
            :items="roles"
            label="Rol"
            variant="outlined"
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">İptal</v-btn>
        <v-btn color="primary" @click="addUser">Ekle</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const { id } = useRoute().params;

const client = useJwtClient();
const confirm = useConfirm();

const { data, refresh } = await useLazyAsyncData(
  () => client.get(`/projects/${id}/users`).then((x) => x.data),
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
    value: "ProjectUser.role",
  },
  {
    title: "İşlemler",
    value: "actions",
    align: "end",
  },
];

const loadingConfirm = ref(false);
const dialog = ref(false);
const selectedUser = ref(null);
const selectedRole = ref(null);
const users = ref([]);
const roles = ref([
  {
    title: "Mühendis",
    value: "engineer",
  },
  {
    title: "Taşeron",
    value: "contractor",
  },
]);

const fetchUsers = async () => {
  const response = await client.get("/users");
  users.value = response.data.data;
};

const addUser = async () => {
  if (selectedUser.value && selectedRole.value) {
    await client.post(`/projects/${id}/users`, {
      user_id: selectedUser.value,
      role: selectedRole.value,
    });
    dialog.value = false;
    // Refresh the data
    await refresh();
  }
};

watch(dialog, () => {
  if (dialog.value) {
    selectedUser.value = null;
    selectedRole.value = null;
  }
});
watch(selectedUser, () => updateRole(selectedUser.value));

const updateRole = (userId) => {
  const user = users.value.find((u) => u.id === userId);
  if (user) {
    if (user.role === "admin") {
      selectedRole.value = "engineer";
    } else {
      selectedRole.value = user.role;
    }
  }
};

const removeUser = async (userId) => {
  confirm.open({
    title: "Çalışanı Sil",
    description: "Çalışanı silmek istediğinize emin misiniz?",
    loading: loadingConfirm,
    onConfirm: async () => {
      try {
        await client.delete(`/projects/${id}/users/${userId}`);
        // Refresh the data
        await refresh();
        confirm.close();
      } finally {
        loadingConfirm.value = false;
      }
    },
  });
};

onMounted(fetchUsers);
</script>
