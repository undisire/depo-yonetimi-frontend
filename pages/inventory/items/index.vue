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
        <h1 class="text-h5 text-md-h4 ps-1">Envanter</h1>
        <div class="d-flex ga-2 align-center">
          <v-btn
            color="primary"
            rounded="lg"
            flat
            prepend-icon="mdi-plus"
            :to="{ name: 'inventory-items-create' }"
            >Yeni Ekle</v-btn
          >
        </div>
      </div>
    </section>

    <v-card border flat rounded="lg">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :items-length="data.meta.total"
        density="comfortable"
        :headers="headers"
        :items="data.data"
        :loading="status === 'pending'"
        @update:options="execute"
      >
        <template #item.material.name="{ item }">
          {{ item.material.name }}
          <v-chip
            label
            size="x-small"
            class="font-weight-medium ml-1"
            v-if="item.item_type == 'part'"
            >Parça</v-chip
          >
        </template>
        <template #item.quantity="{ item }">
          {{ item.quantity }} {{ item?.uom?.symbol }}
        </template>
        <template #item.reserved_quantity="{ item }">
          {{ item.reserved_quantity }} {{ item?.uom?.symbol }}
        </template>
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-dots-horizontal"
                variant="plain"
                size="small"
                class="ml-2"
                density="comfortable"
              />
            </template>
            <v-list rounded="lg" slim density="compact" lines="one">
              <v-list-item
                @click="handleEditQuantity(item)"
                title="Miktar Düzenle"
              >
                <template #prepend>
                  <v-icon size="20"> mdi-pencil </v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table-server>
    </v-card>

    <InventoryQuantityEditDialog ref="editQuantityDialog" @saved="refresh" />
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
const itemsPerPage = ref(50);
const currentPage = ref(1);
const editQuantityDialog = ref();
const selectedItem = ref(null);
const selectedOperation = ref("update");

const { data, status, refresh, execute } = useLazyAsyncData(
  () =>
    client
      .get("/inventory/items", {
        params: {
          page: currentPage.value,
          limit: itemsPerPage.value,
        },
      })
      .then((x) => x.data),
  {
    immediate: false,
    default: () => {
      return {
        data: [],
        meta: {
          total: 0,
        },
      };
    },
  }
);

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
    title: "Sap No",
    value: "material.sap_no",
  },
  {
    title: "Malzeme",
    value: "material.name",
  },
  {
    title: "Depo",
    value: "warehouse.name",
  },
  {
    title: "Kurum",
    value: "institution.name",
  },
  {
    title: "Miktar",
    value: "quantity",
  },
  {
    title: "Rezerv Edilen",
    value: "reserved_quantity",
  },
  {
    title: "İşlemler",
    value: "actions",
    align: "end",
  },
];

function handleEditQuantity(item) {
  editQuantityDialog.value.open(item, "update");
}
</script>
