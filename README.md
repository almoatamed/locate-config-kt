# locate-config-kt

A lightweight Node.js utility for reliably locating and reading configuration files from your project’s root, `src`, or `config` directories.  
Includes built-in caching and async file resolution support.

---

## 📦 Installation

```bash
npm install locate-config-kt find-root-kt
# or
yarn add locate-config-kt find-root-kt
```

---

## 🚀 Usage

```ts
import { getConfig, clearConfigCache } from "locate-config-kt";

const config = await getConfig({
  configFileNameWithExtension: "config.json",
});

if (config) {
  console.log("Config loaded:", config.toString());
} else {
  console.log("No config file found!");
}
```

---

## 🧠 How It Works

`locate-config-kt` searches for a configuration file in the following order:

1. **Project root** → `/<projectRoot>/<filename>`
2. **Root `src` folder** → `/<projectRoot>/src/<filename>`
3. **Config folder** → `/<projectRoot>/config/<filename>`
4. **Config under src** → `/<projectRoot>/src/config/<filename>`

It uses [`find-root-kt`](https://www.npmjs.com/package/find-root-kt) to determine the actual project root dynamically.

---

## ⚙️ API Reference

### `getConfig(options): Promise<string | null>`

Asynchronously searches and reads a configuration file.  
If found, returns its contents (as a UTF-8 string by default).  
If not found, returns `null`.

#### **Parameters**

| Name | Type | Default | Description |
|------|------|----------|-------------|
| `configFileNameWithExtension` | `string` | **required** | The name of the configuration file, e.g. `"tsconfig.json"`. |
| `cache` | `boolean` | `true` | Enables in-memory caching for faster subsequent reads. |
| `srcDirName` | `string` | `"src"` | Name of your source directory to check for configs. |
| `encoding` | `"ascii" \| "utf8" \| "utf-8" \| "utf16le" \| "utf-16le" \| "ucs2" \| "ucs-2" \| "base64"` | `"utf-8"` | File encoding when reading the configuration. |

#### **Example**

```ts
import { getConfig } from "locate-config-kt";

// Load tsconfig.json
const tsConfig = await getConfig({ configFileNameWithExtension: "tsconfig.json" });
console.log(tsConfig?.toString());

// Load .env from src/config directory
const envFile = await getConfig({
  configFileNameWithExtension: ".env",
  srcDirName: "src",
});
console.log(envFile?.toString());
```

---

### `clearConfigCache(): void`

Clears the internal cache used by `getConfig`.  
Useful if you modify or replace configuration files at runtime.

#### **Example**

```ts
import { clearConfigCache, getConfig } from "locate-config-kt";

await getConfig({ configFileNameWithExtension: "app.json" });
clearConfigCache(); // removes cached entries
```

---

## 🧩 Types

```ts
type UnwrapPromise<P> = P extends Promise<infer R> ? R : P;
type ReadValueType = UnwrapPromise<ReturnType<typeof readFile>>;
export type ConfigFileReadType = ReadValueType;
```

These internal types define the resolved type of file contents when using `getConfig`.

---

## 🪄 Example Project Structure

```
my-project/
├─ src/
│  ├─ config/
│  │  └─ app.json
│  └─ index.ts
├─ config/
│  └─ db.json
├─ package.json
└─ tsconfig.json
```

---

## ✅ Example

```ts
import { getConfig } from "locate-config-kt";

async function example() {
  const dbConfig = await getConfig({
    configFileNameWithExtension: "db.json",
  });

  if (dbConfig) {
    console.log("Database config:", dbConfig.toString());
  } else {
    console.warn("Database config not found!");
  }
}

example();
```
