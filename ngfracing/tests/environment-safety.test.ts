import assert from "node:assert/strict";
import { test } from "node:test";
import { assertBlobEnvironment, assertDatabaseEnvironment } from "../lib/environment-safety";

test("blocks production DB connections in development, preview and local production builds", () => {
  for (const environment of ["development", "preview", "", undefined]) {
    for (const host of ["ep-quiet-fog-acbasb6k.sa-east-1.aws.neon.tech", "ep-quiet-fog-acbasb6k-pooler.sa-east-1.aws.neon.tech", "ep-quiet-fog-acbasb6k-bqr-pooler.sa-east-1.aws.neon.tech"]) {
      assert.throws(() => assertDatabaseEnvironment(`postgresql://user:secret@${host}/neondb`, environment));
    }
    assert.doesNotThrow(() => assertDatabaseEnvironment("postgresql://user:secret@ep-mute-brook-ac0mvlvc-pooler.sa-east-1.aws.neon.tech/neondb", environment));
  }
  assert.doesNotThrow(() => assertDatabaseEnvironment("postgresql://user:secret@ep-quiet-fog-acbasb6k-pooler.sa-east-1.aws.neon.tech/neondb", "production"));
  assert.throws(() => assertDatabaseEnvironment("malformed"));
});

test("blocks production Blob uploads outside production and rejects mismatched store tokens before writing", () => {
  const prod = "aktrfq1jwvzwlpjn.public.blob.vercel-storage.com";
  const preview = "naolyupptlsrd8e9.public.blob.vercel-storage.com";
  for (const environment of ["preview", "development", ""]) {
    assert.throws(() => assertBlobEnvironment(prod, "vercel_blob_rw_aktrfq1jwvzwlpjn_fixture", environment));
    assert.doesNotThrow(() => assertBlobEnvironment(preview, "vercel_blob_rw_naolyupptlsrd8e9_fixture", environment));
  }
  assert.throws(() => assertBlobEnvironment(preview, "vercel_blob_rw_aktrfq1jwvzwlpjn_fixture", "production"));
  assert.doesNotThrow(() => assertBlobEnvironment(prod, "vercel_blob_rw_aktrfq1jwvzwlpjn_fixture", "production"));
});
