<template>
  <v-container>
    <section class="mb-5">
      <v-breadcrumbs
        :items="items"
        divider="›"
        class="px-0 pb-0 text-body-2 mb-2"
      ></v-breadcrumbs>
      <div
        class="d-flex justify-space-between align-center flex-wrap ga-4 mb-2"
      >
        <h1 class="text-h5 text-md-h4 ps-1">Kullanıcılar</h1>
        <div class="d-flex ga-2 align-center">
          <v-btn
            color="primary"
            rounded="lg"
            flat
            @click="editDialog.open()"
            prepend-icon="mdi-plus"
            >Yeni Ekle</v-btn
          >
        </div>
      </div>
    </section>

    <v-card border flat rounded="lg">
      <v-data-table
        density="comfortable"
        :headers="headers"
        :items="data"
        :loading="status === 'loading'"
        hide-default-footer
        :items-per-page="-1"
        :no-data-text="
          status === 'success'
            ? 'Kullanıcı bulunamadı'
            : 'Kullanıcılar yükleniyor...'
        "
      >
        <template #item.role="{ value }">
          {{ roleDisplayTexts?.[value] || value }}
        </template>
        <template #item.last_login="{ value }">
          {{
            value ? $datefns.format(new Date(value), "dd.MM.yyyy HH:mm") : "-"
          }}
        </template>
        <template #item.is_active="{ value }">
          <div
            class="d-flex align-center ga-2 font-weight-medium"
            :class="[value ? 'text-success' : 'text-error']"
          >
            <v-icon size="18">mdi-circle</v-icon>
            {{ value ? "Aktif" : "Pasif" }}
          </div>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            @click="editDialog.open(item)"
            color="primary"
            size="x-small"
            variant="text"
            class="mr-2"
          />
          <v-btn
            icon="mdi-delete"
            @click="handleDelete(item)"
            color="error"
            size="x-small"
            variant="text"
          />
        </template>
      </v-data-table>
    </v-card>

    <UserEditDialog ref="editDialog" @saved="refresh" />
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const client = useJwtClient();
const $toast = useToast();
const confirm = useConfirm();

const loadingConfirm = ref(false);
const editDialog = ref(null);
const roleDisplayTexts = {
  admin: "Yönetici",
  engineer: "Mühendis",
  warehouse: "Depo Sorumlusu",
  contractor: "Taşeron",
};

const items = [
  {
    title: "Anasayfa",
    disabled: false,
    to: "/dashboard",
  },
  {
    title: "Liste",
    disabled: true,
  },
];

const headers = [
  {
    title: "#",
    value: "id",
  },
  {
    title: "Ad Soyad",
    value: "full_name",
  },
  {
    title: "E-posta",
    value: "email",
  },
  {
    title: "Rol",
    value: "role",
  },
  {
    title: "Son Giriş",
    value: "last_login",
  },
  {
    title: "Durum",
    value: "is_active",
  },
  {
    title: "İşlemler",
    value: "actions",
    align: "end",
  },
];

const { data, status, refresh } = useLazyAsyncData(
  () => client.get("/users").then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

function handleDelete(item) {
  confirm.open({
    title: "Kullanıcı Sil",
    description: `Kullanıcı silinecek: ${item.full_name}`,
    onConfirm: () => {
      loadingConfirm.value = true;
      client
        .delete(`/users/${item.id}`)
        .then(() => {
          $toast.success("Kullanıcı başarıyla silindi.");
          refresh();
          confirm.close();
        })
        .catch((e) => {
          $toast.error("Kullanıcı silinirken bir hata oluştu.");
        })
        .finally(() => {
          loadingConfirm.value = false;
        });
    },
  });
}
</script>
