<template>
  <v-card rounded="lg" flat border>
    <v-card-text>
      <InventoryAutocomplete
        label="Envanter seçiniz"
        variant="outlined"
        density="compact"
        @select="onSelectInventory"
        v-model="item.inventory_id"
      />
      <v-text-field
        type="number"
        label="Rezerv edilecek miktarı giriniz"
        variant="outlined"
        density="compact"
        hide-details="auto"
        :disabled="!inventoryItem"
        :min="1"
        :max="inventoryItem?.quantity"
        v-model="item.quantity"
        :rules="rules"
      >
        <template #prepend-inner>
          {{ inventoryItem?.uom?.symbol }}
        </template>
        <template #append-inner>
          <v-btn
            color="primary"
            flat
            variant="text"
            size="small"
            @click="selectMax"
          >
            MAX
          </v-btn>
        </template>
      </v-text-field>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const rules = [
  (value) => {
    if (value >= 1 && value <= inventoryItem.value?.quantity) {
      return true;
    }

    if (value <= 0) {
      return `Geçersiz miktar. En az 1 ${inventoryItem.value?.uom?.symbol} rezerv edebilirsiniz.`;
    }

    return `Geçersiz miktar. En fazla ${inventoryItem.value?.quantity} ${inventoryItem.value?.uom?.symbol} rezerv edebilirsiniz.`;
  },
];

const inventoryItem = ref();

function onSelectInventory(item) {
  inventoryItem.value = item;
}

function selectMax() {
  props.item.quantity = inventoryItem.value?.quantity;
}
</script>
