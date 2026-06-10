// Uruchom: npx tsx scripts/debug-dostartu.ts
// Playwright otwiera przeglądarkę, przechwytuje requesty API i HTML po renderowaniu

async function debug() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    locale: "pl-PL",
  });

  const apiRequests: string[] = [];

  context.on("request", (req) => {
    const url = req.url();
    if (req.resourceType() === "fetch" || req.resourceType() === "xhr") {
      apiRequests.push(`${req.method()} ${url}`);
    }
  });

  const page = await context.newPage();

  console.log("Ładuję stronę główną...");
  await page.goto("https://dostartu.pl", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log("\n=== REQUESTY API ===");
  apiRequests.slice(0, 20).forEach(r => console.log(" ", r));

  console.log("\n=== TEKST STRONY (pierwsze 2000 znaków) ===");
  const text = await page.innerText("body");
  console.log(text.slice(0, 2000));

  // Spróbuj znaleźć linki do zawodów
  const links = await page.$$eval("a[href]", els =>
    els.map(el => ({ href: (el as HTMLAnchorElement).href, text: el.textContent?.trim().slice(0, 60) }))
       .filter(l => l.href.includes("dostartu") && !l.href.includes("#") && l.text)
       .slice(0, 20)
  );
  console.log("\n=== LINKI DO ZAWODÓW ===");
  links.forEach(l => console.log(`  "${l.text}" → ${l.href}`));

  // Sprawdź konkretne URL dla listy zawodów
  console.log("\nSprawdzam /zawody-lista...");
  try {
    await page.goto("https://dostartu.pl/zawody-lista", { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(2000);
    const text2 = await page.innerText("body");
    console.log(text2.slice(0, 1000));
  } catch (e) {
    console.log("Błąd:", (e as Error).message);
  }

  await browser.close();
}

debug().catch(console.error);
