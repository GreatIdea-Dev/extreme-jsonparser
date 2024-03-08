import GreatIdeaBulb from "../../assets/GreatIdeaBulb/GreatIdeaBulb";

export default function FooterLogoLine() {
  return (
    <div class="w-screen h-px bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center">
      <a
        href="https://greatidea.dev/"
        target="_blank"
        class="bg-neutral-100 dark:bg-neutral-900 p-4 text-purple-500"
      >
        <GreatIdeaBulb />
      </a>
    </div>
  );
}
