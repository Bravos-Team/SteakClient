import { TypeCheckedStoreBackEnd } from "../electron_store";

export const configStore = new TypeCheckedStoreBackEnd(
  "configStore",
  {
    cwd: "store",
    name: "config-store",
  },
);

