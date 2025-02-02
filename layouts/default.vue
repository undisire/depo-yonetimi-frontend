<template>
  <v-navigation-drawer>
    <v-list-item title="Depo Yonetimi" height="56"></v-list-item>
    <v-divider></v-divider>
    <v-list nav density="compact">
      <v-list-item
        v-for="(item, idx) in filteredMenu"
        :key="idx"
        :prepend-icon="item.icon"
        :to="item.to"
        :title="item.title"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="logout" color="black"> Çıkış Yap </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-main>
    <NuxtPage />
  </v-main>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const { logout, user } = useJwtAuth();

const menu = [
  { icon: "mdi-view-dashboard", title: "Anasayfa", to: "/dashboard" },
  {
    icon: "mdi-account-group",
    title: "Kullanıcılar",
    to: "/users",
    roles: ["admin"],
  },
  { icon: "mdi-warehouse", title: "Depolar", to: "/warehouses" },
  { icon: "mdi-package-variant-closed", title: "Projeler", to: "/projects" },
  { icon: "mdi-package", title: "Malzemeler", to: "/materials" },
];

const filteredMenu = computed(() =>
  menu.filter((x) => {
    if (!x.roles) return true;
    return x.roles.includes(user.value.role);
  })
);
</script>
