- **Setup issues:**  
  - `vite` expects `index.html` at project root; missing/incorrect file prevents the starter page from showing.  
  - ShadCN CLI sometimes fails with `bunx`; falling back to `npx` worked.  
  - Need to restart dev server after Tailwind config edits, otherwise classes don’t apply.  

- **Tailwind observations:**  
  - Directives must fully replace `index.css`, otherwise old CSS overrides.  
  - Updating `tailwind.config.js` `content` paths is crucial — forgetting `./src/components/**/*` means ShadCN styles won’t compile.  

- **ShadCN UI observations:**  
  - CLI scaffolds `src/components/ui/*` files; forgetting to add the alias `@` in `tsconfig.json` + `vite.config.ts` causes “cannot resolve import './ui/card'” errors.  
  - Components are nicely styled out of the box, but still use Tailwind utilities so you can tweak easily.  
  - Adding `button`, `card`, `input` gave a good starter palette for building reusable UIs.  

