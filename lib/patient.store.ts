import { getPatients } from "../../api";
import { IFilters, IPatient, IPatientsStore } from "../../models";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const initialFilters = {
  age: "-1",
  gender: "All",
  query: "",
  isInitial: true,
  sort: {
    field: "patient_id",
    order: "asc",
  },
} as IFilters;

const usePatientsStore = create<IPatientsStore>()(
  devtools(
    persist(
      (set, get) => ({
        clearFilters: async () => {
          const patientsData = await getPatients(initialFilters);
          set({ patients: patientsData });
          localStorage.removeItem("patient-storage");
        },
        filters: initialFilters,
        setFilters: (filters) => {
          set({ filters });
        },
        patients: [],
        setPatients: (patients: IPatient[]) => set({ patients }),
        filteredPatients: [],
        setFilteredPatients: (filteredPatients: IPatient[]) =>
          set({ filteredPatients }),
        removePatient: (id: number) => {
          localStorage.removeItem("patient-storage");
          const patients = get().patients.filter((p) => p.patient_id !== id);
          set({ ...get(), patients }, true);
        },
        initiate: (patients: IPatient[]) => {
          set({ ...get(), patients });
        },
      }),
      {
        name: "patient-storage",
      }
    )
  )
);

export default usePatientsStore;
