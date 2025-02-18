<template>
  <v-dialog v-model="dialog" max-width="400" scrollable>
    <template #activator="{ props }">
      <slot name="activator" :props="props" />
    </template>

    <v-card rounded="lg" v-if="item">
      <v-card-title class="d-flex justify-space-between align-center pr-2">
        Miktar Güncelle
        <v-btn variant="plain" icon="mdi-close" @click="dialog = false"
      /></v-card-title>
      <v-card-text>
        <v-list-item border rounded="lg" class="py-3 mb-5">
          <v-list-item-title>
            {{ item.material.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ item.material.sap_no }} | {{ item.warehouse.name }} |
            {{ item.quantity }}
            {{ item.material.uom.symbol }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-btn-toggle
          density="compact"
          variant="outlined"
          divided
          class="mb-5"
          mandatory
          v-model="operation"
        >
          <v-btn prepend-icon="mdi-pencil" color="primary" value="update">
            Değiştir
          </v-btn>
          <v-btn prepend-icon="mdi-plus" color="success" value="increse">
            Arttir
          </v-btn>
          <v-btn prepend-icon="mdi-minus" color="error" value="decrese">
            Azalt
          </v-btn>
        </v-btn-toggle>
        <v-text-field
          variant="outlined"
          density="comfortable"
          :label="`Miktar (${item.material.uom.symbol})`"
          type="number"
          v-model="quantity"
          rounded="lg"
          :min="0"
          :rules="rules"
        >
          <template #append-inner>
            <v-btn
              color="primary"
              flat
              variant="text"
              size="small"
              @click="quantity = item.quantity"
            >
              MAX
            </v-btn>
          </template>
        </v-text-field>
        <v-list-item border rounded="lg" class="py-3 mb-5" color="grey" active>
          <v-list-item-title> Kalan Miktar </v-list-item-title>
          <template #append>
            <div class="font-weight-medium">
              {{ isNaN(newQuantity) ? "-" : newQuantity }}
              {{ item.material.uom.symbol }}
            </div>
          </template>
        </v-list-item>

        <v-textarea
          label="İşlem Notu"
          variant="outlined"
          rounded="lg"
          v-model="note"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="dialog = false">İptal</v-btn>
        <v-btn color="primary" flat @click="submit">Onayla</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const emit = defineEmits(["saved"]);

const client = useJwtClient();
const $toast = useToast();

const dialog = ref(false);
const quantity = ref("");
const operation = ref("");
const note = ref("");
const item = ref();

const newQuantity = computed(() => {
  const qty = parseFloat(quantity.value);

  if (operation.value === "update") {
    return qty;
  }

  if (operation.value === "increse") {
    return item.value.quantity + qty;
  }

  return item.value.quantity - qty;
});

const rules = [
  (value) => {
    if (newQuantity.value < 0 || value <= 0) {
      return "Geçersiz miktar";
    }

    return true;
  },
];

const submit = () => {
  if (newQuantity.value < 0 || quantity.value <= 0) {
    return;
  }

  client
    .patch(`/inventory/items/${item.value.id}/quantity`, {
      quantity: newQuantity.value,
      operation: operation.value,
      note: note.value,
    })
    .then(() => {
      dialog.value = false;
      $toast.success("Miktar başarıyla güncellendi.");
      emit("saved");
    });
};

function open(inventoryItem, op = "update") {
  dialog.value = true;
  item.value = inventoryItem;
  operation.value = op;
  quantity.value = "";
  note.value = "";
}

defineExpose({
  open,
});
</script>
