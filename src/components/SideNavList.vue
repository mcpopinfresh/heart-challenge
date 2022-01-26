<template>
    <v-list
        nav

    >
        <v-list-item-group
        v-model="group"
        active-class="accent--text text--darken4"
        
        >
        <v-container v-for="item in items" :key="item.name">
            <v-list-item  
                v-if="item.visible"
                router :to="item.path"
            >
                <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{item.name}}</v-list-item-title>
            </v-list-item>
        </v-container>
        </v-list-item-group>
    </v-list>
</template>

<script>

export default {
    name: 'SideNavList',
    created() {
        this.$router.options.routes.forEach(route => {
            this.items.push({
                name: route.name,
                path: route.path,
                icon: route.icon,
                visible: route.visible,
            })
        })
    }
    , data() {
        return {
            items: [],
            group: null,
        }
    }
}
</script>

