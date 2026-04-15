/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admins from "../admins.js";
import type * as artworks from "../artworks.js";
import type * as auth from "../auth.js";
import type * as collections from "../collections.js";
import type * as http from "../http.js";
import type * as router from "../router.js";
import type * as settings from "../settings.js";
import type * as storage from "../storage.js";
import type * as userCleanup from "../userCleanup.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admins: typeof admins;
  artworks: typeof artworks;
  auth: typeof auth;
  collections: typeof collections;
  http: typeof http;
  router: typeof router;
  settings: typeof settings;
  storage: typeof storage;
  userCleanup: typeof userCleanup;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
