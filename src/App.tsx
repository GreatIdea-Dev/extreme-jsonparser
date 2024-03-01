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

function getCookie(cname: any) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const setInitialCookie = () => {
  const ip = getCookie("apiIp");
  const networkInstance = getCookie("networkInstance");

  if (!ip) {
    document.cookie = `apiIp=172.16.60.2;`;
  }
  if (!networkInstance) {
    document.cookie = `networkInstance=VR-Default;`;
  }
};

//"https://172.16.60.2/rest/restconf/data/openconfig-network-instance:network-instances/network-instance=VR-Default/fdb?formatted=true"

function App() {
  setInitialCookie();
  const [tableData, setTableData] = createSignal<JSX.Element>();
  const [entryData, setEntryData] = createSignal<EntryData[]>([defaultData]);
  const [apiToken, setApiToken] = createSignal(getCookie("api-token"));
  const [endpointIp, setEndpointIp] = createSignal(getCookie("apiIp"));
  const [networkInstance, setNetworkInstance] = createSignal(
    getCookie("networkInstance")
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

  const handlRetrieveNetworkInstance = async () => {
    const url = `https://${endpointIp()}/rest/restconf/data/openconfig-network-instance:network-instances/`;

    await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `x-authtoken=${apiToken()}`,
      },
      method: "GET",
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);

        window.alert(
          "John needs the data this button returns in the console log in order to allow proper network instance retrieval!!!"
        );
      });
  };

  const handleUpdateUrl = () => {
    const ip = (document.querySelector("#ipInput") as HTMLInputElement).value;
    const instance = (document.querySelector("#keyInput") as HTMLInputElement)
      .value;

    if (ip && !instance) {
      setEndpointIp(ip);
      document.cookie = `apiIp=${ip};`;
      window.alert("IP updated to " + ip);
    } else if (instance && !ip) {
      setNetworkInstance(instance);
      document.cookie = `networkInstance=${instance};`;
      window.alert("Network Instance updated to " + instance);
    } else if (ip && instance) {
      setEndpointIp(ip);
      document.cookie = `apiIp=${ip};`;
      setNetworkInstance(instance);
      document.cookie = `networkInstance=${instance};`;
      window.alert(
        "URL updated to " + ip + " and Network Instance updated to " + instance
      );
    } else {
      window.alert("URL not updated due to missing information.");
    }
  };

  const handleApiCall = async () => {
    const url = `https://${endpointIp()}/restconf/data/openconfig-network-instance:network-instances/network-instance=${networkInstance()}/fdb?formatted=true`;
    console.log(url, {
      headers: {
        "Content-Type": "application/json",
        Cookie: ` x-authtoken=${apiToken()}`,
      },
      method: "GET",
    });
    await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `x-authtoken=${apiToken()}`,
      },
      method: "GET",
    })
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
  const handleUpdateToken = async () => {
    const user = (document.querySelector("#userInput") as HTMLInputElement)
      .value;
    const pass = (document.querySelector("#passInput") as HTMLInputElement)
      .value;
    const url = `https://${endpointIp()}/auth/token`;
    console.log(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    });
    await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setApiToken(data.token);
        const token = apiToken();
        document.cookie = `api-token=${token};`;
        window.alert("New Token: " + token);
      });
  };

  return (
    <div class="flex flex-col justify-center items-center w-screen h-full p-4 md:p-8 lg:p-16">
      <div class="w-full h-auto my-4 flex flex-col justify-center items-center">
        <h1>Extreme Network Instance API</h1>
        <p class="text-xl">Enter information to update the API endpoint.</p>
      </div>
      <div class="w-full flex flex-col justify-center items-start gap-4 py-4">
        <div class="flex w-full justify-start items-center flex-col">
          <p class="w-full text-start italic text-neutral-400 dark:text-neutral-600">
            Username and password will reset upon each page reload, but token
            will be saved in browser.
          </p>
          <div class="apiForm">
            <div class="flex flex-col justify-center items-start gap-2 w-2/5 min-w-56">
              <label for="userInput">Username:</label>
              <input
                class="apiFormInput"
                type="text"
                id="userInput"
                placeholder="Username"
              />
            </div>
            <div class="flex flex-col justify-center items-start gap-2 w-2/5 min-w-56">
              <label for="passInput">Password:</label>
              <input
                class="apiFormInput"
                type="text"
                id="passInput"
                placeholder="@ssword"
              />
            </div>
          </div>
          <div class="w-full flex flex-row justify-start items-center">
            <div class="w-56 gap-3 flex flex-row justify-center items-center">
              <button class="apiButton" onClick={handleUpdateToken}>
                Update API Token
              </button>
            </div>
          </div>
          <div class="flex flex-row justify-start items-center w-full py-4">
            <div class="flex flex-row justify-center items-center">
              <p class="py-1 italic text-sm text-neutral-200">
                API Token Status:&nbsp;
              </p>
              {apiToken() ? (
                <p class="py-1 italic text-sm text-green-500">Token Set</p>
              ) : (
                <p class="py-1 italic text-sm text-red-500">Token Not Set</p>
              )}
            </div>
          </div>
          <div class="apiForm">
            <p class="w-full text-start italic text-neutral-400 dark:text-neutral-600">
              Switch IP and Instance Value will be stored in browser, but may
              reset upon browser close.
            </p>
            <div class="flex flex-col justify-center items-start gap-2 w-2/5 min-w-56">
              <label for="ipInput">Switch IP:</label>
              <input
                class="apiFormInput"
                type="text"
                id="ipInput"
                value={endpointIp()}
                placeholder={endpointIp()}
              />
            </div>
            <div class="flex flex-col justify-center items-start gap-2 w-2/5 min-w-56">
              <label for="keyInput">Network Instance:</label>
              <input
                class="apiFormInput"
                type="text"
                id="keyInput"
                value={networkInstance()}
                placeholder={networkInstance()}
              />
            </div>
          </div>
          <div class="w-full flex flex-row justify-start items-center gap-3">
            <div class="w-auto min-w-56 gap-3 flex flex-row justify-center items-center">
              <button class="apiButton" onClick={handleUpdateUrl}>
                Update URL
              </button>
            </div>
            <div class="w-auto min-w-56  gap-3 flex flex-row justify-center items-center">
              <button class="apiButton" onClick={handlRetrieveNetworkInstance}>
                Get Network Instance
              </button>
            </div>
          </div>
          <div class="flex flex-col justify-center items-start w-full py-4">
            <p class="py-1 italic text-sm text-neutral-200">
              Current Endpoint URL:
            </p>
            <p class="py-1 italic text-sm text-neutral-500">
              {
                `https://${endpointIp()}/restconf/data/openconfig-network-instance:network-instances/network-instance=${networkInstance()}/fdb?formatted=true` as unknown as string
              }
            </p>
          </div>
          <div class="w-full my-4 flex flex-row justify-start items-center">
            <button
              disabled={!apiToken()}
              class="apiButton"
              onClick={handleApiCall}
            >
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
