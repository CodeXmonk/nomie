/**
 * Context Store
  Context are like categories, or "soft tags", things that help you group
  posts and content. 
 */

// Svelte
import { writable } from "svelte/store";

// utils
import Logger from "../utils/log/log";

// Vendors
import Storage from "../modules/storage/storage";

// Get Config
import config from "../../config/global";
import { get } from "sortablejs";

const console = new Logger("🗺 $ContextStore");

// Nomie API Store

const ContextInit = () => {
  const ContextState = {};
  const { update, subscribe, set } = writable(ContextState);

  const methods = {
    async init() {
      let context = await methods.get();
      update((d) => context || []);
      return context;
    },
    async get() {
      let context = Storage.get(`${config.data_root}/context.json`);
      return context || [];
    },
    async save(contextArray) {
      update((context) => {
        let changed = false;
        contextArray.forEach((contextElement) => {
          if (context.indexOf(`${contextElement.id}`) == -1) {
            changed = true;
            context.push(`${contextElement.id}`);
          }
        });
        if (changed) {
          this.write(context);
        }
        return context;
      });
    },
    async write(payload) {
      return Storage.put(`${config.data_root}/context.json`, payload);
    },
  };

  return {
    update,
    subscribe,
    set,
    ...methods,
  };
};

export const ContextStore = ContextInit();
