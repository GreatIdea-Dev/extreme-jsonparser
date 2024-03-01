import resData from "../../data/response.json";
import { createStore } from "solid-js/store";

export type EntryData = {
  "mac-address": string;
  config: {
    "mac-address": string;
    vlan: number;
  };
  state: {
    "mac-address": string;
    vlan: number;
    "entry-type": string;
  };
  interface: {
    "interface-ref": {
      config: {
        interface: string;
        subinterface: number;
      };
      state: {
        interface: string;
        subinterface: number;
      };
    };
  };
};

export type Entry = {
  data: EntryData[];
  endpointInfo: {
    ipAddress: string;
    path: string;
    key: string;
  };
};

const [appState, setAppState] = createStore({
  data: resData["openconfig-network-instance:fdb"]["mac-table"].entries
    .entry as unknown as EntryData[],
  endpointInfo: {
    ipAddress: "172.0.0.1",
    path: "/api/info/about/switch/with/key",
    key: "test-key",
  },
});

export const useAppState = () => [appState, setAppState];
