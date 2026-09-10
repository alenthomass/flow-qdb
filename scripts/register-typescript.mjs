import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Data scripts share the application's extensionless TypeScript imports.
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".tsx")) {
      const source = ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2025 }
      }).outputText;
      return { format: "module", source, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
        return nextResolve(specifier + ".ts", context);
      }
      throw error;
    }
  }
});
