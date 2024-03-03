export default function Home() {
  return (
    <div class="flex flex-col justify-center items-center px-8">
      <div class="w-full h-auto my-4 flex flex-col justify-center items-center">
        <h1>Extreme Networks API JSON Parser</h1>
        <p class="w-2/3">
          Ths web app assists in parsing the JSON output of the Extreme Networks
          switch APIs into a readable table output. Current endpoints supported:
        </p>
        <ul class="w-2/3 text-start list-disc list-inside py-4">
          <li>FDB Info (Forwarding Database)</li>
          <li>LDAP Info</li>
        </ul>
      </div>
    </div>
  );
}
