<template>
  <v-container>
    <v-btn
      :to="{
        name: 'auth-login',
      }"
      >Giris Yap</v-btn
    >
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "auth",
  middleware: "guest",
});
</script>
