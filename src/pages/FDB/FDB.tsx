import { JSX, createSignal } from "solid-js";

export type EntryData = {
  "openconfig-network-instance:fdb": {
    config: {
      "mac-learning": boolean;
      "maximum-entries": number;
      "mac-aging-time": number;
    };
    state: {
      "mac-learning": boolean;
      "maximum-entries": number;
      "mac-aging-time": number;
    };
    "mac-table": {
      entries: {
        entry: [
          {
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
          }
        ];
      };
    };
  };
};

export type TableData = {
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

export default function FDB() {
  const [tableData, setTableData] = createSignal<JSX.Element>();
  const [entryData, setEntryData] = createSignal<TableData[]>(
    JSON.parse(localStorage.getItem("fdbEntries") as string) as TableData[]
  );

  const setDefaultTableData = () => {
    if (!entryData()) return;
    setTableData(
      entryData().map((entry) => {
        return (
          <tr>
            <td>{entry["mac-address"]}</td>
            <td>{entry.config.vlan}</td>
            <td>{entry.state["entry-type"]}</td>
            <td>{entry.interface["interface-ref"].config.interface}</td>
            <td>{entry.interface["interface-ref"].config.subinterface}</td>
          </tr>
        ) as JSX.Element;
      })
    );
  };
  setDefaultTableData();

  const filterByVlan = (vlan: number) => {
    const filterEntries = entryData();
    setTableData(
      filterEntries
        .filter((entry) => entry.config.vlan === vlan)
        .map((entry) => {
          return (
            <tr>
              <td>{entry["mac-address"]}</td>
              <td>{entry.config.vlan}</td>
              <td>{entry.state["entry-type"]}</td>
              <td>{entry.interface["interface-ref"].config.interface}</td>
              <td>{entry.interface["interface-ref"].config.subinterface}</td>
            </tr>
          ) as JSX.Element;
        })
    );
  };

  const filterByMac = (mac: string) => {
    const filterEntries = entryData();
    setTableData(
      filterEntries
        .filter((entry) => entry["mac-address"].includes(mac))
        .map((entry) => {
          return (
            <tr>
              <td>{entry["mac-address"]}</td>
              <td>{entry.config.vlan}</td>
              <td>{entry.state["entry-type"]}</td>
              <td>{entry.interface["interface-ref"].config.interface}</td>
              <td>{entry.interface["interface-ref"].config.subinterface}</td>
            </tr>
          ) as JSX.Element;
        })
    );
  };

  const filterByInterface = (interfaceName: string) => {
    const filterEntries = entryData();
    setTableData(
      filterEntries
        .filter((entry) =>
          entry.interface["interface-ref"].config.interface.includes(
            interfaceName
          )
        )
        .map((entry) => {
          return (
            <tr>
              <td>{entry["mac-address"]}</td>
              <td>{entry.config.vlan}</td>
              <td>{entry.state["entry-type"]}</td>
              <td>{entry.interface["interface-ref"].config.interface}</td>
              <td>{entry.interface["interface-ref"].config.subinterface}</td>
            </tr>
          ) as JSX.Element;
        })
    );
  };

  const filterBySubinterface = (interfaceName: string) => {
    const filterEntries = entryData();
    setTableData(
      filterEntries
        .filter((entry) =>
          entry.interface["interface-ref"].config.subinterface
            .toString()
            .includes(interfaceName)
        )
        .map((entry) => {
          return (
            <tr>
              <td>{entry["mac-address"]}</td>
              <td>{entry.config.vlan}</td>
              <td>{entry.state["entry-type"]}</td>
              <td>{entry.interface["interface-ref"].config.interface}</td>
              <td>{entry.interface["interface-ref"].config.subinterface}</td>
            </tr>
          ) as JSX.Element;
        })
    );
  };

  const filterByEntryType = (interfaceName: string) => {
    const filterEntries = entryData();
    setTableData(
      filterEntries
        .filter((entry) =>
          entry.state["entry-type"]
            .toLowerCase()
            .includes(interfaceName.toLowerCase())
        )
        .map((entry) => {
          return (
            <tr>
              <td>{entry["mac-address"]}</td>
              <td>{entry.config.vlan}</td>
              <td>{entry.state["entry-type"]}</td>
              <td>{entry.interface["interface-ref"].config.interface}</td>
              <td>{entry.interface["interface-ref"].config.subinterface}</td>
            </tr>
          ) as JSX.Element;
        })
    );
  };

  const handleFilter = () => {
    const filterType = (
      document.querySelector("#filterDropdown") as HTMLSelectElement
    ).value;
    const filterValue = (
      document.querySelector("#filterInput") as HTMLSelectElement
    ).value
      .toLowerCase()
      .trim();
    switch (filterType) {
      case "mac":
        filterByMac(filterValue);
        break;
      case "vlan":
        filterByVlan(parseInt(filterValue));
        break;
      case "interface":
        filterByInterface(filterValue);
        break;
      case "entryType":
        filterByEntryType(filterValue);
        break;
      case "subinterface":
        filterBySubinterface(filterValue);
        break;
      default:
        break;
    }
  };

  const handleEntryData = () => {
    const data = JSON.parse(
      (document.querySelector("#jsonEntry") as HTMLInputElement).value
    ) as EntryData;

    const newEntries = data[
      "openconfig-network-instance:fdb" as keyof EntryData
    ]["mac-table"].entries.entry as TableData[];

    setEntryData(newEntries);

    localStorage.setItem("fdbEntries", JSON.stringify(newEntries));

    setTableData(
      newEntries.map((entry) => {
        return (
          <tr>
            <td>{entry["mac-address"]}</td>
            <td>{entry.config.vlan}</td>
            <td>{entry.state["entry-type"]}</td>
            <td>{entry.interface["interface-ref"].config.interface}</td>
            <td>{entry.interface["interface-ref"].config.subinterface}</td>
          </tr>
        ) as JSX.Element;
      })
    );
  };

  return (
    <div class="flex flex-col justify-start items-center w-screen h-full px-4 sm:px-8 md:px-16">
      <div class="w-full h-auto my-4 flex flex-col justify-center items-center">
        <h1>Forwarding Database API JSON Parser</h1>
        <p class="text-xl">Paste Data as JSON from Postman to update table.</p>
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
        <div class="flex flex-row flex-start items-center w-full">
          <div class="flex flex-row gap-3 justify-start items-center">
            <div class="filter">
              <select id="filterDropdown" class="filterInput">
                <option value="mac">MAC Address</option>
                <option value="vlan">VLAN</option>
                <option value="entryType">Entry Type</option>
                <option value="interface">Interface</option>
                <option value="subinterface">Subinterface</option>
              </select>
              <textarea
                class="filterInput"
                id="filterInput"
                placeholder="Enter Value"
              />
              <button class="filterButton" onClick={handleFilter}>
                Filter
              </button>
            </div>
          </div>
        </div>
        <div class="w-full overflow-x-scroll flex flex-row justify-center items-center">
          <table class="w-auto  min-w-full">
            <thead>
              <tr>
                <th>MAC Address</th>
                <th>VLAN</th>
                <th>Entry Type</th>
                <th>Interface</th>
                <th>Subinterface</th>
              </tr>
            </thead>
            <tbody>{tableData as unknown as JSX.Element}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
