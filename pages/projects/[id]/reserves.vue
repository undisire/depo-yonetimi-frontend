<template>
  <v-card flat border rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      Rezerv Edilen Malzemeler
      <v-btn color="primary" rounded="lg" flat prepend-icon="mdi-plus">
        Ekle
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-data-table
      :items="data"
      :headers="headers"
      density="comfortable"
      :items-per-page="-1"
      hide-default-footer
    >
      <template #item.material.name="{ item }">
        {{ item.material.name }}
        <v-chip
          label
          size="x-small"
          class="font-weight-medium ml-1"
          v-if="item?.inventory?.item_type == 'part'"
          >Parça</v-chip
        >
      </template>
      <template #item.quantity="{ item }">
        {{ item.quantity }} {{ item?.material?.uom?.symbol }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
const { id } = useRoute().params;
const client = useJwtClient();
const confirm = useConfirm();
const toast = useToast();

const { data, refresh, error } = await useLazyAsyncData(
  () => client.get(`/projects/${id}/reserves`).then((x) => x.data),
  {
    transform: (res) => res.data,
    default: () => [],
  }
);

const headers = [
  {
    title: "Malzeme",
    value: "material.name",
  },
  {
    title: "Depo",
    value: "warehouse.name",
  },
  {
    title: "Miktar",
    value: "quantity",
  },
  {
    title: "Durum",
    value: "status",
  },
  {
    title: "İşlem",
    value: "actions",
  },
];
</script>
