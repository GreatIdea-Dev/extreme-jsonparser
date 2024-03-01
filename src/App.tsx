import { Entry, useAppState } from "./state";
import "./App.css";
import { JSX, createSignal } from "solid-js";

function App() {
  const [appState, setAppState] = useAppState();
  const [tableData, setTableData] = createSignal<JSX.Element>();

  const state = appState as Entry;
  const entries = state.data;

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
    setTableData(
      entries
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
    setTableData(
      entries
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
    setTableData(
      entries
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
    setTableData(
      entries
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
    setTableData(
      entries
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

    console.log(filterType, filterValue);
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

  return (
    <div class="flex flex-col justify-center items-center w-full h-full">
      <div class="w-full h-auto my-4 flex justify-center items-center">
        <h1>
          Welcome! Please specify the correct information below to continue
        </h1>
      </div>
      <div class="w-full flex flex-col justify-center items-center gap-4">
        <form>
          <div>
            <label for="ipInput">Switch IP:</label>
            <input type="text" id="ipInput" placeholder="172.0.0.1" />
          </div>
          <div>
            <label for="keyInput">Key Value:</label>
            <input type="text" id="keyInput" placeholder="DP_VALUE" />
          </div>
          <div>
            <label for="pathInput">API Path:</label>
            <input
              class="w-full"
              type="text"
              id="pathInput"
              placeholder="/api/info/about/switch/with/key"
            />
          </div>
        </form>
        <div class="flex flex-row gap-4">
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
        <table class="w-full">
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
  );
}

export default App;
