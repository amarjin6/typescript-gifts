
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3001/graphql",
  documents: "./src/components/**/*.{ts,tsx}",
  generates: {
    './src/generated/': {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
