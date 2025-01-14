import {create} from 'zustand';

interface TableStoreState {
    refreshTable1: boolean;
    refreshTable2: boolean;
}

interface TableStoreActions {
    toggleRefreshTable1: () => void;
    toggleRefreshTable2: () => void;
}

export const useTableStore = create<TableStoreState & TableStoreActions>((set) => ({
    refreshTable1: false,
    refreshTable2: false,
    toggleRefreshTable1: () =>
        set((state) => ({ refreshTable1: !state.refreshTable1 })),
    toggleRefreshTable2: () =>
        set((state) => ({ refreshTable2: !state.refreshTable2 })),
}));
