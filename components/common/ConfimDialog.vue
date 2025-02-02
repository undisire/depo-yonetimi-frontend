<template>
  <v-dialog v-model="model" :max-width="width" :persistent="props.loading">
    <v-card rounded="lg">
      <v-card-text>
        <div class="font-weight-medium text-h6">{{ title }}</div>
        <div class="opacity-50">
          {{ description }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="cancel" color="red" :disabled="loading">{{
          cancelButtonText
        }}</v-btn>
        <v-btn
          @click="confirm"
          color="primary"
          variant="tonal"
          :loading="loading"
          >{{ confirmButtonText }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const model = defineModel({
  default: false,
});

const props = defineProps({
  title: {
    type: String,
    default: "Emin misiniz?",
  },
  description: {
    type: String,
    default: "",
  },
  confirmButtonText: {
    type: String,
    default: "Evet",
  },
  cancelButtonText: {
    type: String,
    default: "Hayır",
  },
  width: {
    type: [String, Number],
    default: 400,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  confirmOnClose: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["confirm", "cancel"]);

function confirm() {
  emit("confirm");
  if (props.confirmOnClose) {
    model.value = false;
  }
}

function cancel() {
  emit("cancel");
  model.value = false;
}
</script>
