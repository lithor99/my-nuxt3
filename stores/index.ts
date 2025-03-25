export const useMainStore = defineStore("main", {
    state: () => ({
        queryServerSide: false,
        drawer: false,
        rail: false,
        order: -1,
    }),
    getters: {
        isQueryServerSide: (state) => state.queryServerSide,
        isDrawer: (state) => state.drawer,
        isRail: (state) => state.rail,
        isOrder: (state) => state.order,
    },
    actions: {
        setQueryServerSide(val: boolean) {
            this.queryServerSide = val;
        },
        setRail(val: boolean) {
            this.rail = val;
        },
        setDrawer(val: boolean) {
            this.drawer = val;
        },
        setOrder(val: number) {
            if (val === -1) {
                this.order = 1;
            } else {
                this.order = -1;
            }
        },
    },
});
