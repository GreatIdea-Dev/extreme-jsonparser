import "./App.css";
import { JSX, createSignal } from "solid-js";

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

const defaultData: EntryData = {
  "mac-address": "00:00:00:00:00:00",
  config: {
    "mac-address": "00:00:00:00:00:00",
    vlan: 0,
  },
  state: {
    "mac-address": "00:00:00:00:00:00",
    vlan: 0,
    "entry-type": "static",
  },
  interface: {
    "interface-ref": {
      config: {
        interface: "eth0",
        subinterface: 0,
      },
      state: {
        interface: "eth0",
        subinterface: 0,
      },
    },
  },
};

function App() {
  const [tableData, setTableData] = createSignal<JSX.Element>();
  const [entryData, setEntryData] = createSignal<EntryData[]>([defaultData]);
  const [endpointUrl, setEndpointUrl] = createSignal(
    "https://172.16.60.2/rest/restconf/data/openconfig-network-instance:network-instances/network-instance=VR-Default/fdb?formatted=true"
  );

  const entries = entryData();

  setTableData(
    entries.map((entry) => {
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

  const handleUpdateUrl = () => {
    const ip = (document.querySelector("#ipInput") as HTMLInputElement).value;
    const key = (document.querySelector("#keyInput") as HTMLInputElement).value;
    const path = (document.querySelector("#pathInput") as HTMLInputElement)
      .value;

    if (ip && key && path) {
      const apiPath = `http://${ip}${path}?${key}`;
      setEndpointUrl(apiPath);
      const url = endpointUrl();
      window.alert("New URL: " + url);
    } else {
      window.alert("URL not updated due to missing information.");
    }
  };

  const handleApiCall = async () => {
    const url = endpointUrl();
    await fetch(url)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        const entries =
          data["openconfig-network-instance:fdb"]["mac-table"].entries.entry;
        setEntryData(entries);
        setTableData(
          entries.map((entry: EntryData) => {
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
      });
  };

  return (
    <div class="flex flex-col justify-center items-center w-screen h-full p-4 md:p-8 lg:p-16">
      <div class="w-full h-auto my-4 flex flex-col justify-center items-center">
        <h1>API Configuration</h1>
        <p>Enter information to update the API endpoint.</p>
      </div>
      <div class="w-full flex flex-col justify-center items-start gap-4">
        <div class="flex w-full justify-center items-center flex-col">
          <div class="flex flex-col justify-center items-start">
            <p class="py-1 italic text-sm text-neutral-200">
              Current Endpoint URL:
            </p>
            <p class="py-1 italic text-sm text-neutral-500">
              {endpointUrl as unknown as string}
            </p>
          </div>
          <div class="apiForm">
            <div class="flex flex-col justify-center items-start gap-2 w-1/4 min-w-56">
              <label for="ipInput">Switch IP:</label>
              <input
                class="apiFormInput"
                type="text"
                id="ipInput"
                placeholder="172.0.0.1"
              />
            </div>
            <div class="flex flex-col justify-center items-start gap-2 w-1/4 min-w-56">
              <label for="keyInput">Key Value:</label>
              <input
                class="apiFormInput"
                type="text"
                id="keyInput"
                placeholder="DP_VALUE"
              />
            </div>
            <div class="flex flex-col justify-center items-start gap-2 flex-1 min-w-56">
              <label for="pathInput">API Path:</label>
              <input
                class="apiFormInput"
                type="text"
                id="pathInput"
                placeholder="/api/info/about/switch/with/key"
              />
            </div>
          </div>
          <div class="w-full gap-3 flex flex-row justify-center items-center">
            <button class="apiButton" onClick={handleUpdateUrl}>
              Update URL
            </button>
            <button class="apiButton" onClick={handleApiCall}>
              Update Table from API
            </button>
          </div>
        </div>
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
              <input
                class="filterInput"
                type="text"
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

export default App;
