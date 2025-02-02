<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <NuxtLoadingIndicator />
    <NuxtLayout />
    <ConfirmDialog v-model="isOpen" v-bind="props" />
  </v-app>
</template>

<script setup>
import ConfirmDialog from "@/components/common/ConfimDialog.vue";

const { isDark } = useCustomTheme();
const { props, isOpen } = useConfirm();
</script>
