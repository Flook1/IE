import { create } from "zustand";

export type tTestZustState = {
  testVal1: string;
  testVal2: string;
};

export type tTestZustAction = {
  updateTestVal1: (testVal1: tTestZustState["testVal1"]) => void;
  updateTestVal2: (testVal2: tTestZustState["testVal2"]) => void;
};

export const useTestStore = create<tTestZustState & tTestZustAction>()((set) => ({
  testVal1: "",
  testVal2: "",

  //    functions
  updateTestVal1: (testVal1) => set(() => ({ testVal1: testVal1 })),
  updateTestVal2: (testVal2) => set(() => ({ testVal1: testVal2 })),
}));
