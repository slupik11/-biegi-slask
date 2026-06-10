// Uruchom: npx tsx scripts/fetch-biegi.ts
import { fetchAll } from "../src/lib/fetch-all";

fetchAll()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
