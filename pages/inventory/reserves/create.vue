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
        <h1 class="text-h5 text-md-h4 ps-1">Rezerv Ekle</h1>
        <div class="d-flex ga-2 align-center"></div>
      </div>
    </section>

    <v-row>
      <v-col cols="12" md="6">
        <v-card rounded="lg" flat border class="mb-4">
          <v-card-text>
            <ProjectAutocomplete label="Proje seçiniz" variant="outlined" />

            <v-btn color="primary" flat> Rezerv Ekle </v-btn>
          </v-card-text>
        </v-card>

        <div class="d-flex flex-column ga-4">
          <h3 class="text-h6 text-md-h5">Rezerve Edilecek Malzemeler</h3>
          <ReserveCreateInventoryItem
            v-for="item in data"
            :key="item.id"
            :item="item"
          />
        </div>

        <v-btn
          block
          flat
          color="primary"
          class="my-3"
          rounded="lg"
          @click="addInventoryItem"
          >Öğe Ekle</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const items = [
  {
    title: "Anasayfa",
    disabled: false,
    to: "/dashboard",
  },
  {
    title: "Rezervler",
    disabled: false,
    to: "/inventory/items",
  },
  {
    title: "Ekle",
    disabled: true,
  },
];

function addInventoryItem() {
  data.value.push({
    inventory_id: null,
    quantity: null,
  });
}

const data = ref([
  {
    inventory_id: null,
    quantity: null,
  },
]);

const headers = [
  {
    title: "Malzeme",
    sortable: false,
    value: "material",
  },
  { title: "Miktar", value: "quantity" },
  { title: "Rezerve Edilen Miktar", value: "reserved_quantity" },
  { title: "İşlemler", value: "actions", sortable: false },
];
</script>
