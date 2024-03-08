import { JSX, createSignal } from "solid-js";

export type EntryData = {
  "openconfig-lldp:interfaces": {
    interface: TableData[];
  };
};

export type NeighborType = {
  state: {
    "chassis-id": string;

    "system-description": string;

    age: number;

    "management-address": string;

    "port-id-type": string;

    "port-id": number;

    "chassis-id-type": string;

    "last-update": number;

    "port-description": string;

    id: string;

    "system-name": string;
  };

  "custom-tlvs": {
    tlv: TlvType[];
  };

  capabilities: {
    capability: CapabilityType[];
  };

  id: string;
};

export type TlvType = {
  oui: string;
  "oui-subtype": string;
  type: string;
  state: {
    oui: string;
    "oui-subtype": string;
    type: number;
    value: string;
  };
};

export type CapabilityType = {
  state: {
    enabled: boolean;
    name: string;
  };
  name: string;
};

export type CountersType = {
  "tlv-discard": number;

  "tlv-unknown": number;

  "frame-error-in": number;

  "last-clear": string;

  "frame-discard": number;

  "frame-out": number;

  "frame-error-out": number;

  "frame-in": number;
};

export type TableData = {
  neighbors?: {
    neighbor: NeighborType[];
  };

  state?: {
    enabled: boolean;

    name: string;

    counters: CountersType;
  };

  config?: {
    enabled: boolean;

    name: string;
  };

  name?: string;
};

export type ouiData = {
  macPrefix: string;
  vendorName: string;
  private: false;
  blockType: string;
  lastUpdate: string;
};

export default function LLDP() {
  const [tableData, setTableData] = createSignal<JSX.Element>();
  const [entryData, setEntryData] = createSignal<TableData[]>(
    JSON.parse(localStorage.getItem("lldpEntries") as string) as TableData[]
  );
  const [neighborsData, setNeighborsData] = createSignal();
  const [openModal, setOpenModal] = createSignal(false);

  //01hrej2xmhkzt2ppqm2wz749kq01hrej3q4c28g58h4pym5fca962xwq0iuyjagk

  const lookupMAC = async (mac: string) => {
    const macPrefix = mac.split(":").join("");
    await fetch(`http://api.maclookup.app/v2/macs/${macPrefix}/company/name`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        apiKey:
          "01hrej2xmhkzt2ppqm2wz749kq01hrej3q4c28g58h4pym5fca962xwq0iuyjagk",
      },
    }).then((response) => {
      console.log(response);
      return response.json();
    });
  };

  const setDefaultTableData = () => {
    if (!entryData()) return;
    setTableData(
      entryData().map((entry) => {
        return (
          <tr>
            <td>{entry.name}</td>
            <td>{entry.config?.name}</td>
            <td
              class={entry.config?.enabled ? `text-green-500` : `text-red-500`}
            >
              {entry.config?.enabled ? "true" : "false"}
            </td>
            <td
              class={entry.state?.enabled ? `text-green-500` : `text-red-500`}
            >
              {entry.state?.enabled ? "true" : "false"}
            </td>
            <td
              onClick={() =>
                entry.neighbors && handleModalData(entry.neighbors.neighbor)
              }
              class={
                entry.neighbors
                  ? `cursor-pointer text-purple-500 italic hover:underline`
                  : `text-gray-500 italic`
              }
            >
              {entry.neighbors ? "View Neighbors" : "No Neighbors"}
            </td>
          </tr>
        ) as JSX.Element;
      })
    );
  };

  setDefaultTableData();

  const handleEntryData = () => {
    const data = JSON.parse(
      (document.querySelector("#jsonEntry") as HTMLInputElement).value
    ) as EntryData;

    const newEntries = data["openconfig-lldp:interfaces"].interface;

    setEntryData(newEntries);

    localStorage.setItem("lldpEntries", JSON.stringify(newEntries));

    setTableData(
      newEntries.map((entry) => {
        return (
          <tr>
            <td>{entry.name}</td>
            <td>{entry.config?.name}</td>
            <td
              class={entry.config?.enabled ? `text-green-500` : `text-red-500`}
            >
              {entry.config?.enabled ? "true" : "false"}
            </td>
            <td
              class={entry.state?.enabled ? `text-green-500` : `text-red-500`}
            >
              {entry.state?.enabled ? "true" : "false"}
            </td>
            <td
              onClick={() =>
                entry.neighbors && handleModalData(entry.neighbors.neighbor)
              }
              class={
                entry.neighbors
                  ? `cursor-pointer text-purple-500 italic hover:underline`
                  : `text-gray-500 italic`
              }
            >
              {entry.neighbors ? "View Neighbors" : "No Neighbors"}
            </td>
          </tr>
        ) as JSX.Element;
      })
    );
  };

  const handleModalData = (neighbors: NeighborType[]) => {
    setNeighborsData(
      neighbors.map((neighbor) => {
        return (
          <tr>
            <td>{neighbor.state["chassis-id"]}</td>
            <td>{neighbor.state["system-name"]}</td>
            <td>{neighbor.state["system-description"]}</td>
            <td>{neighbor.state.age}</td>
            <td>{neighbor.state["management-address"]}</td>
            <td>{neighbor.state["port-id-type"]}</td>
            <td>{neighbor.state["port-id"]}</td>
            <td>{neighbor.state["chassis-id-type"]}</td>
            <td>{neighbor.state["port-description"]}</td>
            <td
              class={
                neighbor["custom-tlvs"] ? `text-xs` : `text-gray-500 italic`
              }
            >
              <div class="flex flex-col gap-1">
                {neighbor["custom-tlvs"]?.tlv.map((tlv) => {
                  const vendor = lookupMAC(tlv.state.value);
                  return (
                    <div class="flex flex-row gap-2 justify-start items-center">
                      <p>{tlv.oui}</p>
                      <p>{tlv["oui-subtype"]}</p>
                      <p>{tlv.type}</p>
                      <p>{vendor as unknown as string}</p>
                    </div>
                  ) as JSX.Element;
                })}
              </div>
            </td>
            <td
              class={
                neighbor.capabilities
                  ? `cursor-pointer text-purple-500 italic hover:underline`
                  : `text-gray-500 italic`
              }
            >
              <div class="flex flex-col gap-1">
                {neighbor.capabilities?.capability.map((capability) => {
                  return (
                    <div class="flex flex-row justify-between items-center">
                      <p
                        class={
                          capability.state.enabled
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {capability.state.name}
                      </p>
                    </div>
                  ) as JSX.Element;
                })}
              </div>
            </td>
          </tr>
        ) as JSX.Element;
      })
    );
    setOpenModal(true);
  };

  return (
    <>
      <div
        class={
          openModal()
            ? `modal fixed w-full h-full top-0 left-0 flex items-center justify-center`
            : `hidden`
        }
      >
        <div class="modal-container bg-neutral-200 dark:bg-neutral-900 w-screen h-screen overflow-x-scroll overflow-y-scroll rounded shadow-lg p-16">
          <div class="modal-content text-left p-6 flex flex-col justify-start items-center overflow-hidden">
            <div class="flex justify-between items-center pb-3 w-full">
              <p class="text-2xl font-bold">Neighbor Data</p>
              <div class="flex justify-end w-56">
                <button class="apiButton" onClick={() => setOpenModal(false)}>
                  Close
                </button>
              </div>
            </div>

            <div class="w-full h-full overflow-scroll">
              <table class="w-auto h-auto">
                <thead>
                  <tr>
                    <th>Neighbor Chassis ID</th>
                    <th class="px-32">System Name</th>
                    <th class="px-32">System Description</th>
                    <th class="px-16">Current TTL Age</th>
                    <th>Management Address</th>
                    <th>Neighbor Port Type</th>
                    <th class="px-16">Neighbor Port</th>
                    <th>Chassis ID Type</th>
                    <th>Port Description</th>
                    <th>Custom TLVS</th>
                    <th>Capabilities</th>
                  </tr>
                </thead>
                <tbody>{neighborsData as unknown as JSX.Element}</tbody>
              </table>
            </div>

            <div class="flex justify-end pt-2 w-56">
              <button class="apiButton" onClick={() => setOpenModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class={
          openModal()
            ? `hidden`
            : `flex flex-col justify-start items-center w-screen h-full px-4 sm:px-8 md:px-16`
        }
      >
        <div class="w-full h-auto my-4 flex flex-col justify-center items-center">
          <h1>LLDP API JSON Parser</h1>
          <p class="text-xl">
            Paste Data as JSON from Postman to update table.
          </p>
          <p class="text-sm italic text-neutral-400 dark:text-neutral-700">
            http://&lt;IPADDRESS&gt;/rest/restconf/data/openconfig-lldp:lldp/interfaces
          </p>
        </div>
        <div class="flex flex-row justify-center items-center w-full">
          <div class="flex w-full justify-start items-center flex-col">
            <div class="apiForm">
              <div class="flex flex-col justify-center items-start gap-2 w-full">
                <textarea
                  class="apiFormInput"
                  id="jsonEntry"
                  placeholder={"Paste JSON Here"}
                />
              </div>
            </div>
            <div class="w-full flex flex-row justify-start items-center gap-3">
              <div class="w-full my-4 flex flex-row justify-start items-center">
                <button class="apiButton" onClick={handleEntryData}>
                  Update Table Data
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex flex-col justify-center items-start gap-4 py-4">
          <div class="hidden flex-row flex-start items-center w-full">
            <div class="flex flex-row gap-3 justify-start items-center">
              <div class="filter">
                <select id="filterDropdown" class="filterInput">
                  <option value="mac">Name</option>
                  <option value="vlan">Config Name</option>
                  <option value="entryType">Config Enabled?</option>
                  <option value="subinterface">State Enabled?</option>
                </select>
                <textarea
                  class="filterInput"
                  id="filterInput"
                  placeholder="Enter Value"
                />
                <button class="filterButton">Filter</button>
              </div>
            </div>
          </div>
          <div class="w-full overflow-x-scroll flex flex-row justify-center items-center">
            <table class="w-auto relative min-w-full">
              <thead>
                <tr>
                  <th>Switch Port</th>
                  <th>Config Name</th>
                  <th>Config Enabled?</th>
                  <th>LLDP Enabled?</th>
                  <th>Neighbors</th>
                </tr>
              </thead>
              <tbody>{tableData as unknown as JSX.Element}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
