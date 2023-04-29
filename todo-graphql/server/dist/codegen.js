"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    overwrite: true,
    schema: "./schema.graphql",
    generates: {
        "src/graphql-types.ts": {
            plugins: ["typescript", "typescript-resolvers"]
        }
    }
};
exports.default = config;
//# sourceMappingURL=codegen.js.map