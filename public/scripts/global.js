// node_modules/@firebase/util/dist/index.esm2017.js
var getGlobal = function() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("Unable to locate global object.");
};
var createMockUserToken = function(token, projectId) {
  if (token.uid) {
    throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
  }
  const header = {
    alg: "none",
    type: "JWT"
  };
  const project = projectId || "demo-project";
  const iat = token.iat || 0;
  const sub = token.sub || token.user_id;
  if (!sub) {
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  }
  const payload = Object.assign({
    iss: `https://securetoken.google.com/${project}`,
    aud: project,
    iat,
    exp: iat + 3600,
    auth_time: iat,
    sub,
    user_id: sub,
    firebase: {
      sign_in_provider: "custom",
      identities: {}
    }
  }, token);
  const signature = "";
  return [
    base64urlEncodeWithoutPadding(JSON.stringify(header)),
    base64urlEncodeWithoutPadding(JSON.stringify(payload)),
    signature
  ].join(".");
};
var getUA = function() {
  if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
    return navigator["userAgent"];
  } else {
    return "";
  }
};
var isMobileCordova = function() {
  return typeof window !== "undefined" && !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
};
var isBrowserExtension = function() {
  const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : undefined;
  return typeof runtime === "object" && runtime.id !== undefined;
};
var isReactNative = function() {
  return typeof navigator === "object" && navigator["product"] === "ReactNative";
};
var isIE = function() {
  const ua = getUA();
  return ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
};
var isIndexedDBAvailable = function() {
  try {
    return typeof indexedDB === "object";
  } catch (e) {
    return false;
  }
};
var validateIndexedDBOpenable = function() {
  return new Promise((resolve, reject) => {
    try {
      let preExist = true;
      const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
      const request = self.indexedDB.open(DB_CHECK_NAME);
      request.onsuccess = () => {
        request.result.close();
        if (!preExist) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME);
        }
        resolve(true);
      };
      request.onupgradeneeded = () => {
        preExist = false;
      };
      request.onerror = () => {
        var _a;
        reject(((_a = request.error) === null || _a === undefined ? undefined : _a.message) || "");
      };
    } catch (error) {
      reject(error);
    }
  });
};
var areCookiesEnabled = function() {
  if (typeof navigator === "undefined" || !navigator.cookieEnabled) {
    return false;
  }
  return true;
};
var replaceTemplate = function(template, data) {
  return template.replace(PATTERN, (_, key) => {
    const value = data[key];
    return value != null ? String(value) : `<${key}?>`;
  });
};
var isEmpty = function(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
};
var deepEqual = function(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (const k of aKeys) {
    if (!bKeys.includes(k)) {
      return false;
    }
    const aProp = a[k];
    const bProp = b[k];
    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }
  for (const k of bKeys) {
    if (!aKeys.includes(k)) {
      return false;
    }
  }
  return true;
};
var isObject = function(thing) {
  return thing !== null && typeof thing === "object";
};
var querystring = function(querystringParams) {
  const params = [];
  for (const [key, value] of Object.entries(querystringParams)) {
    if (Array.isArray(value)) {
      value.forEach((arrayVal) => {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
      });
    } else {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
  }
  return params.length ? "&" + params.join("&") : "";
};
var querystringDecode = function(querystring2) {
  const obj = {};
  const tokens = querystring2.replace(/^\?/, "").split("&");
  tokens.forEach((token) => {
    if (token) {
      const [key, value] = token.split("=");
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  return obj;
};
var extractQuerystring = function(url) {
  const queryStart = url.indexOf("?");
  if (!queryStart) {
    return "";
  }
  const fragmentStart = url.indexOf("#", queryStart);
  return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : undefined);
};
var createSubscribe = function(executor, onNoObservers) {
  const proxy = new ObserverProxy(executor, onNoObservers);
  return proxy.subscribe.bind(proxy);
};
var implementsAnyMethods = function(obj, methods) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  for (const method of methods) {
    if (method in obj && typeof obj[method] === "function") {
      return true;
    }
  }
  return false;
};
var noop = function() {
};
var calculateBackoffMillis = function(backoffCount, intervalMillis = DEFAULT_INTERVAL_MILLIS, backoffFactor = DEFAULT_BACKOFF_FACTOR) {
  const currBaseValue = intervalMillis * Math.pow(backoffFactor, backoffCount);
  const randomWait = Math.round(RANDOM_FACTOR * currBaseValue * (Math.random() - 0.5) * 2);
  return Math.min(MAX_VALUE_MILLIS, currBaseValue + randomWait);
};
var getModularInstance = function(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
};
var stringToByteArray$1 = function(str) {
  const out = [];
  let p = 0;
  for (let i = 0;i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
};
var byteArrayToString = function(bytes) {
  const out = [];
  let pos = 0, c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
      out[c++] = String.fromCharCode(55296 + (u >> 10));
      out[c++] = String.fromCharCode(56320 + (u & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join("");
};
var base64 = {
  byteToCharMap_: null,
  charToByteMap_: null,
  byteToCharMapWebSafe_: null,
  charToByteMapWebSafe_: null,
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  HAS_NATIVE_SUPPORT: typeof atob === "function",
  encodeByteArray(input, webSafe) {
    if (!Array.isArray(input)) {
      throw Error("encodeByteArray takes an array as a parameter");
    }
    this.init_();
    const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
    const output = [];
    for (let i = 0;i < input.length; i += 3) {
      const byte1 = input[i];
      const haveByte2 = i + 1 < input.length;
      const byte2 = haveByte2 ? input[i + 1] : 0;
      const haveByte3 = i + 2 < input.length;
      const byte3 = haveByte3 ? input[i + 2] : 0;
      const outByte1 = byte1 >> 2;
      const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
      let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
      let outByte4 = byte3 & 63;
      if (!haveByte3) {
        outByte4 = 64;
        if (!haveByte2) {
          outByte3 = 64;
        }
      }
      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }
    return output.join("");
  },
  encodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return btoa(input);
    }
    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
  },
  decodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return atob(input);
    }
    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
  },
  decodeStringToByteArray(input, webSafe) {
    this.init_();
    const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
    const output = [];
    for (let i = 0;i < input.length; ) {
      const byte1 = charToByteMap[input.charAt(i++)];
      const haveByte2 = i < input.length;
      const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
      ++i;
      const haveByte3 = i < input.length;
      const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      const haveByte4 = i < input.length;
      const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
        throw new DecodeBase64StringError;
      }
      const outByte1 = byte1 << 2 | byte2 >> 4;
      output.push(outByte1);
      if (byte3 !== 64) {
        const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
        output.push(outByte2);
        if (byte4 !== 64) {
          const outByte3 = byte3 << 6 & 192 | byte4;
          output.push(outByte3);
        }
      }
    }
    return output;
  },
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {};
      this.charToByteMap_ = {};
      this.byteToCharMapWebSafe_ = {};
      this.charToByteMapWebSafe_ = {};
      for (let i = 0;i < this.ENCODED_VALS.length; i++) {
        this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
        this.charToByteMap_[this.byteToCharMap_[i]] = i;
        this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
        this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
        if (i >= this.ENCODED_VALS_BASE.length) {
          this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
          this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
        }
      }
    }
  }
};

class DecodeBase64StringError extends Error {
  constructor() {
    super(...arguments);
    this.name = "DecodeBase64StringError";
  }
}
var base64Encode = function(str) {
  const utf8Bytes = stringToByteArray$1(str);
  return base64.encodeByteArray(utf8Bytes, true);
};
var base64urlEncodeWithoutPadding = function(str) {
  return base64Encode(str).replace(/\./g, "");
};
var base64Decode = function(str) {
  try {
    return base64.decodeString(str, true);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
var getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
var getDefaultsFromEnvVariable = () => {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return;
  }
  const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
  if (defaultsJsonString) {
    return JSON.parse(defaultsJsonString);
  }
};
var getDefaultsFromCookie = () => {
  if (typeof document === "undefined") {
    return;
  }
  let match;
  try {
    match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch (e) {
    return;
  }
  const decoded = match && base64Decode(match[1]);
  return decoded && JSON.parse(decoded);
};
var getDefaults = () => {
  try {
    return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
  } catch (e) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
    return;
  }
};
var getDefaultEmulatorHost = (productName) => {
  var _a, _b;
  return (_b = (_a = getDefaults()) === null || _a === undefined ? undefined : _a.emulatorHosts) === null || _b === undefined ? undefined : _b[productName];
};
var getDefaultEmulatorHostnameAndPort = (productName) => {
  const host = getDefaultEmulatorHost(productName);
  if (!host) {
    return;
  }
  const separatorIndex = host.lastIndexOf(":");
  if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
    throw new Error(`Invalid host ${host} with no separate hostname and port!`);
  }
  const port = parseInt(host.substring(separatorIndex + 1), 10);
  if (host[0] === "[") {
    return [host.substring(1, separatorIndex - 1), port];
  } else {
    return [host.substring(0, separatorIndex), port];
  }
};
var getDefaultAppConfig = () => {
  var _a;
  return (_a = getDefaults()) === null || _a === undefined ? undefined : _a.config;
};
var getExperimentalSetting = (name) => {
  var _a;
  return (_a = getDefaults()) === null || _a === undefined ? undefined : _a[`_${name}`];
};

class Deferred {
  constructor() {
    this.reject = () => {
    };
    this.resolve = () => {
    };
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  wrapCallback(callback) {
    return (error, value) => {
      if (error) {
        this.reject(error);
      } else {
        this.resolve(value);
      }
      if (typeof callback === "function") {
        this.promise.catch(() => {
        });
        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  }
}
var ERROR_NAME = "FirebaseError";

class FirebaseError extends Error {
  constructor(code, message, customData) {
    super(message);
    this.code = code;
    this.customData = customData;
    this.name = ERROR_NAME;
    Object.setPrototypeOf(this, FirebaseError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorFactory.prototype.create);
    }
  }
}

class ErrorFactory {
  constructor(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }
  create(code, ...data) {
    const customData = data[0] || {};
    const fullCode = `${this.service}/${code}`;
    const template = this.errors[code];
    const message = template ? replaceTemplate(template, customData) : "Error";
    const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
    const error = new FirebaseError(fullCode, fullMessage, customData);
    return error;
  }
}
var PATTERN = /\{\$([^}]+)}/g;
class ObserverProxy {
  constructor(executor, onNoObservers) {
    this.observers = [];
    this.unsubscribes = [];
    this.observerCount = 0;
    this.task = Promise.resolve();
    this.finalized = false;
    this.onNoObservers = onNoObservers;
    this.task.then(() => {
      executor(this);
    }).catch((e) => {
      this.error(e);
    });
  }
  next(value) {
    this.forEachObserver((observer) => {
      observer.next(value);
    });
  }
  error(error) {
    this.forEachObserver((observer) => {
      observer.error(error);
    });
    this.close(error);
  }
  complete() {
    this.forEachObserver((observer) => {
      observer.complete();
    });
    this.close();
  }
  subscribe(nextOrObserver, error, complete) {
    let observer;
    if (nextOrObserver === undefined && error === undefined && complete === undefined) {
      throw new Error("Missing Observer.");
    }
    if (implementsAnyMethods(nextOrObserver, [
      "next",
      "error",
      "complete"
    ])) {
      observer = nextOrObserver;
    } else {
      observer = {
        next: nextOrObserver,
        error,
        complete
      };
    }
    if (observer.next === undefined) {
      observer.next = noop;
    }
    if (observer.error === undefined) {
      observer.error = noop;
    }
    if (observer.complete === undefined) {
      observer.complete = noop;
    }
    const unsub = this.unsubscribeOne.bind(this, this.observers.length);
    if (this.finalized) {
      this.task.then(() => {
        try {
          if (this.finalError) {
            observer.error(this.finalError);
          } else {
            observer.complete();
          }
        } catch (e) {
        }
        return;
      });
    }
    this.observers.push(observer);
    return unsub;
  }
  unsubscribeOne(i) {
    if (this.observers === undefined || this.observers[i] === undefined) {
      return;
    }
    delete this.observers[i];
    this.observerCount -= 1;
    if (this.observerCount === 0 && this.onNoObservers !== undefined) {
      this.onNoObservers(this);
    }
  }
  forEachObserver(fn) {
    if (this.finalized) {
      return;
    }
    for (let i = 0;i < this.observers.length; i++) {
      this.sendOne(i, fn);
    }
  }
  sendOne(i, fn) {
    this.task.then(() => {
      if (this.observers !== undefined && this.observers[i] !== undefined) {
        try {
          fn(this.observers[i]);
        } catch (e) {
          if (typeof console !== "undefined" && console.error) {
            console.error(e);
          }
        }
      }
    });
  }
  close(err) {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    if (err !== undefined) {
      this.finalError = err;
    }
    this.task.then(() => {
      this.observers = undefined;
      this.onNoObservers = undefined;
    });
  }
}
var DEFAULT_INTERVAL_MILLIS = 1000;
var DEFAULT_BACKOFF_FACTOR = 2;
var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1000;
var RANDOM_FACTOR = 0.5;

// node_modules/@firebase/component/dist/esm/index.esm2017.js
var normalizeIdentifierForFactory = function(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? undefined : identifier;
};
var isComponentEager = function(component) {
  return component.instantiationMode === "EAGER";
};

class Component {
  constructor(name, instanceFactory, type) {
    this.name = name;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    this.serviceProps = {};
    this.instantiationMode = "LAZY";
    this.onInstanceCreated = null;
  }
  setInstantiationMode(mode) {
    this.instantiationMode = mode;
    return this;
  }
  setMultipleInstances(multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  }
  setServiceProps(props) {
    this.serviceProps = props;
    return this;
  }
  setInstanceCreatedCallback(callback) {
    this.onInstanceCreated = callback;
    return this;
  }
}
var DEFAULT_ENTRY_NAME = "[DEFAULT]";

class Provider {
  constructor(name, container) {
    this.name = name;
    this.container = container;
    this.component = null;
    this.instances = new Map;
    this.instancesDeferred = new Map;
    this.instancesOptions = new Map;
    this.onInitCallbacks = new Map;
  }
  get(identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      const deferred = new Deferred;
      this.instancesDeferred.set(normalizedIdentifier, deferred);
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          if (instance) {
            deferred.resolve(instance);
          }
        } catch (e) {
        }
      }
    }
    return this.instancesDeferred.get(normalizedIdentifier).promise;
  }
  getImmediate(options) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === undefined ? undefined : options.identifier);
    const optional = (_a = options === null || options === undefined ? undefined : options.optional) !== null && _a !== undefined ? _a : false;
    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        return this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      if (optional) {
        return null;
      } else {
        throw Error(`Service ${this.name} is not available`);
      }
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(component) {
    if (component.name !== this.name) {
      throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
    }
    if (this.component) {
      throw Error(`Component for ${this.name} has already been provided`);
    }
    this.component = component;
    if (!this.shouldAutoInitialize()) {
      return;
    }
    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
      } catch (e) {
      }
    }
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      try {
        const instance = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
        instanceDeferred.resolve(instance);
      } catch (e) {
      }
    }
  }
  clearInstance(identifier = DEFAULT_ENTRY_NAME) {
    this.instancesDeferred.delete(identifier);
    this.instancesOptions.delete(identifier);
    this.instances.delete(identifier);
  }
  async delete() {
    const services = Array.from(this.instances.values());
    await Promise.all([
      ...services.filter((service) => ("INTERNAL" in service)).map((service) => service.INTERNAL.delete()),
      ...services.filter((service) => ("_delete" in service)).map((service) => service._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(identifier = DEFAULT_ENTRY_NAME) {
    return this.instances.has(identifier);
  }
  getOptions(identifier = DEFAULT_ENTRY_NAME) {
    return this.instancesOptions.get(identifier) || {};
  }
  initialize(opts = {}) {
    const { options = {} } = opts;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
    if (this.isInitialized(normalizedIdentifier)) {
      throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
    }
    if (!this.isComponentSet()) {
      throw Error(`Component ${this.name} has not been registered yet`);
    }
    const instance = this.getOrInitializeService({
      instanceIdentifier: normalizedIdentifier,
      options
    });
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      if (normalizedIdentifier === normalizedDeferredIdentifier) {
        instanceDeferred.resolve(instance);
      }
    }
    return instance;
  }
  onInit(callback, identifier) {
    var _a;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== undefined ? _a : new Set;
    existingCallbacks.add(callback);
    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
    const existingInstance = this.instances.get(normalizedIdentifier);
    if (existingInstance) {
      callback(existingInstance, normalizedIdentifier);
    }
    return () => {
      existingCallbacks.delete(callback);
    };
  }
  invokeOnInitCallbacks(instance, identifier) {
    const callbacks = this.onInitCallbacks.get(identifier);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      try {
        callback(instance, identifier);
      } catch (_a) {
      }
    }
  }
  getOrInitializeService({ instanceIdentifier, options = {} }) {
    let instance = this.instances.get(instanceIdentifier);
    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, {
        instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
        options
      });
      this.instances.set(instanceIdentifier, instance);
      this.instancesOptions.set(instanceIdentifier, options);
      this.invokeOnInitCallbacks(instance, instanceIdentifier);
      if (this.component.onInstanceCreated) {
        try {
          this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
        } catch (_a) {
        }
      }
    }
    return instance || null;
  }
  normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
    } else {
      return identifier;
    }
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}

class ComponentContainer {
  constructor(name) {
    this.name = name;
    this.providers = new Map;
  }
  addComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
    }
    provider.setComponent(component);
  }
  addOrOverwriteComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      this.providers.delete(component.name);
    }
    this.addComponent(component);
  }
  getProvider(name) {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    }
    const provider = new Provider(name, this);
    this.providers.set(name, provider);
    return provider;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}

// node_modules/@firebase/logger/dist/esm/index.esm2017.js
var instances = [];
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
  LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
  LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
  debug: LogLevel.DEBUG,
  verbose: LogLevel.VERBOSE,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  silent: LogLevel.SILENT
};
var defaultLogLevel = LogLevel.INFO;
var ConsoleMethod = {
  [LogLevel.DEBUG]: "log",
  [LogLevel.VERBOSE]: "log",
  [LogLevel.INFO]: "info",
  [LogLevel.WARN]: "warn",
  [LogLevel.ERROR]: "error"
};
var defaultLogHandler = (instance, logType, ...args) => {
  if (logType < instance.logLevel) {
    return;
  }
  const now = new Date().toISOString();
  const method = ConsoleMethod[logType];
  if (method) {
    console[method](`[${now}]  ${instance.name}:`, ...args);
  } else {
    throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
  }
};

class Logger {
  constructor(name) {
    this.name = name;
    this._logLevel = defaultLogLevel;
    this._logHandler = defaultLogHandler;
    this._userLogHandler = null;
    instances.push(this);
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(val) {
    if (!(val in LogLevel)) {
      throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
    }
    this._logLevel = val;
  }
  setLogLevel(val) {
    this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(val) {
    if (typeof val !== "function") {
      throw new TypeError("Value assigned to `logHandler` must be a function");
    }
    this._logHandler = val;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(val) {
    this._userLogHandler = val;
  }
  debug(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
    this._logHandler(this, LogLevel.DEBUG, ...args);
  }
  log(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
    this._logHandler(this, LogLevel.VERBOSE, ...args);
  }
  info(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
    this._logHandler(this, LogLevel.INFO, ...args);
  }
  warn(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
    this._logHandler(this, LogLevel.WARN, ...args);
  }
  error(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
    this._logHandler(this, LogLevel.ERROR, ...args);
  }
}
// node_modules/idb/build/wrap-idb-value.js
var getIdbProxyableTypes = function() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
};
var getCursorAdvanceMethods = function() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
};
var promisifyRequest = function(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
};
var cacheDonePromiseForTransaction = function(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
};
var replaceTraps = function(callback) {
  idbProxyTraps = callback(idbProxyTraps);
};
var wrapFunction = function(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
};
var transformCachableValue = function(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
};
var wrap = function(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
};
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
var cursorRequestMap = new WeakMap;
var transactionDoneMap = new WeakMap;
var transactionStoreNamesMap = new WeakMap;
var transformCache = new WeakMap;
var reverseTransformCache = new WeakMap;
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
var unwrap = (value) => reverseTransformCache.get(value);

// node_modules/idb/build/index.js
var openDB = function(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(event.oldVersion, event.newVersion, event));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
};
var getMethod = function(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
};
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = new Map;
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// node_modules/@firebase/app/dist/esm/index.esm2017.js
var isVersionServiceProvider = function(provider) {
  const component2 = provider.getComponent();
  return (component2 === null || component2 === undefined ? undefined : component2.type) === "VERSION";
};
var _addComponent = function(app, component2) {
  try {
    app.container.addComponent(component2);
  } catch (e) {
    logger2.debug(`Component ${component2.name} failed to register with FirebaseApp ${app.name}`, e);
  }
};
var _registerComponent = function(component2) {
  const componentName = component2.name;
  if (_components.has(componentName)) {
    logger2.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }
  _components.set(componentName, component2);
  for (const app of _apps.values()) {
    _addComponent(app, component2);
  }
  return true;
};
var _getProvider = function(app, name) {
  const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
  if (heartbeatController) {
    heartbeatController.triggerHeartbeat();
  }
  return app.container.getProvider(name);
};
var initializeApp = function(_options, rawConfig = {}) {
  let options = _options;
  if (typeof rawConfig !== "object") {
    const name2 = rawConfig;
    rawConfig = { name: name2 };
  }
  const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
  const name = config.name;
  if (typeof name !== "string" || !name) {
    throw ERROR_FACTORY.create("bad-app-name", {
      appName: String(name)
    });
  }
  options || (options = getDefaultAppConfig());
  if (!options) {
    throw ERROR_FACTORY.create("no-options");
  }
  const existingApp = _apps.get(name);
  if (existingApp) {
    if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app", { appName: name });
    }
  }
  const container = new ComponentContainer(name);
  for (const component2 of _components.values()) {
    container.addComponent(component2);
  }
  const newApp = new FirebaseAppImpl(options, config, container);
  _apps.set(name, newApp);
  return newApp;
};
var getApp = function(name = DEFAULT_ENTRY_NAME2) {
  const app = _apps.get(name);
  if (!app && name === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
    return initializeApp();
  }
  if (!app) {
    throw ERROR_FACTORY.create("no-app", { appName: name });
  }
  return app;
};
var registerVersion = function(libraryKeyOrName, version, variant) {
  var _a;
  let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== undefined ? _a : libraryKeyOrName;
  if (variant) {
    library += `-${variant}`;
  }
  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version.match(/\s|\//);
  if (libraryMismatch || versionMismatch) {
    const warning = [
      `Unable to register library "${library}" with version "${version}":`
    ];
    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }
    if (libraryMismatch && versionMismatch) {
      warning.push("and");
    }
    if (versionMismatch) {
      warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
    }
    logger2.warn(warning.join(" "));
    return;
  }
  _registerComponent(new Component(`${library}-version`, () => ({ library, version }), "VERSION"));
};
var getDbPromise = function() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade: (db, oldVersion) => {
        switch (oldVersion) {
          case 0:
            try {
              db.createObjectStore(STORE_NAME);
            } catch (e) {
              console.warn(e);
            }
        }
      }
    }).catch((e) => {
      throw ERROR_FACTORY.create("idb-open", {
        originalErrorMessage: e.message
      });
    });
  }
  return dbPromise;
};
async function readHeartbeatsFromIndexedDB(app) {
  try {
    const db = await getDbPromise();
    const tx = db.transaction(STORE_NAME);
    const result = await tx.objectStore(STORE_NAME).get(computeKey(app));
    await tx.done;
    return result;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-get", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
  try {
    const db = await getDbPromise();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(STORE_NAME);
    await objectStore.put(heartbeatObject, computeKey(app));
    await tx.done;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger2.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-set", {
        originalErrorMessage: e === null || e === undefined ? undefined : e.message
      });
      logger2.warn(idbGetError.message);
    }
  }
}
var computeKey = function(app) {
  return `${app.name}!${app.options.appId}`;
};
var getUTCDateString = function() {
  const today = new Date;
  return today.toISOString().substring(0, 10);
};
var extractHeartbeatsForHeader = function(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
  const heartbeatsToSend = [];
  let unsentEntries = heartbeatsCache.slice();
  for (const singleDateHeartbeat of heartbeatsCache) {
    const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
    if (!heartbeatEntry) {
      heartbeatsToSend.push({
        agent: singleDateHeartbeat.agent,
        dates: [singleDateHeartbeat.date]
      });
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatsToSend.pop();
        break;
      }
    } else {
      heartbeatEntry.dates.push(singleDateHeartbeat.date);
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatEntry.dates.pop();
        break;
      }
    }
    unsentEntries = unsentEntries.slice(1);
  }
  return {
    heartbeatsToSend,
    unsentEntries
  };
};
var countBytes = function(heartbeatsCache) {
  return base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
};
var registerCoreComponents = function(variant) {
  _registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
  _registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
  registerVersion(name$o, version$1, variant);
  registerVersion(name$o, version$1, "esm2017");
  registerVersion("fire-js", "");
};

class PlatformLoggerServiceImpl {
  constructor(container) {
    this.container = container;
  }
  getPlatformInfoString() {
    const providers = this.container.getProviders();
    return providers.map((provider) => {
      if (isVersionServiceProvider(provider)) {
        const service = provider.getImmediate();
        return `${service.library}/${service.version}`;
      } else {
        return null;
      }
    }).filter((logString) => logString).join(" ");
  }
}
var name$o = "@firebase/app";
var version$1 = "0.9.27";
var logger2 = new Logger("@firebase/app");
var name$n = "@firebase/app-compat";
var name$m = "@firebase/analytics-compat";
var name$l = "@firebase/analytics";
var name$k = "@firebase/app-check-compat";
var name$j = "@firebase/app-check";
var name$i = "@firebase/auth";
var name$h = "@firebase/auth-compat";
var name$g = "@firebase/database";
var name$f = "@firebase/database-compat";
var name$e = "@firebase/functions";
var name$d = "@firebase/functions-compat";
var name$c = "@firebase/installations";
var name$b = "@firebase/installations-compat";
var name$a = "@firebase/messaging";
var name$9 = "@firebase/messaging-compat";
var name$8 = "@firebase/performance";
var name$7 = "@firebase/performance-compat";
var name$6 = "@firebase/remote-config";
var name$5 = "@firebase/remote-config-compat";
var name$4 = "@firebase/storage";
var name$3 = "@firebase/storage-compat";
var name$2 = "@firebase/firestore";
var name$1 = "@firebase/firestore-compat";
var name = "firebase";
var version = "10.8.0";
var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
var PLATFORM_LOG_STRING = {
  [name$o]: "fire-core",
  [name$n]: "fire-core-compat",
  [name$l]: "fire-analytics",
  [name$m]: "fire-analytics-compat",
  [name$j]: "fire-app-check",
  [name$k]: "fire-app-check-compat",
  [name$i]: "fire-auth",
  [name$h]: "fire-auth-compat",
  [name$g]: "fire-rtdb",
  [name$f]: "fire-rtdb-compat",
  [name$e]: "fire-fn",
  [name$d]: "fire-fn-compat",
  [name$c]: "fire-iid",
  [name$b]: "fire-iid-compat",
  [name$a]: "fire-fcm",
  [name$9]: "fire-fcm-compat",
  [name$8]: "fire-perf",
  [name$7]: "fire-perf-compat",
  [name$6]: "fire-rc",
  [name$5]: "fire-rc-compat",
  [name$4]: "fire-gcs",
  [name$3]: "fire-gcs-compat",
  [name$2]: "fire-fst",
  [name$1]: "fire-fst-compat",
  "fire-js": "fire-js",
  [name]: "fire-js-all"
};
var _apps = new Map;
var _components = new Map;
var ERRORS = {
  ["no-app"]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
  ["bad-app-name"]: "Illegal App name: '{$appName}",
  ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
  ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
  ["no-options"]: "Need to provide options, when not being deployed to hosting via source.",
  ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
  ["idb-open"]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-get"]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-set"]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  ["idb-delete"]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."
};
var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);

class FirebaseAppImpl {
  constructor(options, config, container) {
    this._isDeleted = false;
    this._options = Object.assign({}, options);
    this._config = Object.assign({}, config);
    this._name = config.name;
    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
    this._container = container;
    this.container.addComponent(new Component("app", () => this, "PUBLIC"));
  }
  get automaticDataCollectionEnabled() {
    this.checkDestroyed();
    return this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(val) {
    this.checkDestroyed();
    this._automaticDataCollectionEnabled = val;
  }
  get name() {
    this.checkDestroyed();
    return this._name;
  }
  get options() {
    this.checkDestroyed();
    return this._options;
  }
  get config() {
    this.checkDestroyed();
    return this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(val) {
    this._isDeleted = val;
  }
  checkDestroyed() {
    if (this.isDeleted) {
      throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
    }
  }
}
var SDK_VERSION = version;
var DB_NAME = "firebase-heartbeat-database";
var DB_VERSION = 1;
var STORE_NAME = "firebase-heartbeat-store";
var dbPromise = null;
var MAX_HEADER_BYTES = 1024;
var STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;

class HeartbeatServiceImpl {
  constructor(container) {
    this.container = container;
    this._heartbeatsCache = null;
    const app = this.container.getProvider("app").getImmediate();
    this._storage = new HeartbeatStorageImpl(app);
    this._heartbeatsCachePromise = this._storage.read().then((result) => {
      this._heartbeatsCache = result;
      return result;
    });
  }
  async triggerHeartbeat() {
    var _a, _b;
    const platformLogger = this.container.getProvider("platform-logger").getImmediate();
    const agent = platformLogger.getPlatformInfoString();
    const date = getUTCDateString();
    if (((_a = this._heartbeatsCache) === null || _a === undefined ? undefined : _a.heartbeats) == null) {
      this._heartbeatsCache = await this._heartbeatsCachePromise;
      if (((_b = this._heartbeatsCache) === null || _b === undefined ? undefined : _b.heartbeats) == null) {
        return;
      }
    }
    if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
      return;
    } else {
      this._heartbeatsCache.heartbeats.push({ date, agent });
    }
    this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
      const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
      const now = Date.now();
      return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
    });
    return this._storage.overwrite(this._heartbeatsCache);
  }
  async getHeartbeatsHeader() {
    var _a;
    if (this._heartbeatsCache === null) {
      await this._heartbeatsCachePromise;
    }
    if (((_a = this._heartbeatsCache) === null || _a === undefined ? undefined : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
      return "";
    }
    const date = getUTCDateString();
    const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
    const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
    this._heartbeatsCache.lastSentHeartbeatDate = date;
    if (unsentEntries.length > 0) {
      this._heartbeatsCache.heartbeats = unsentEntries;
      await this._storage.overwrite(this._heartbeatsCache);
    } else {
      this._heartbeatsCache.heartbeats = [];
      this._storage.overwrite(this._heartbeatsCache);
    }
    return headerString;
  }
}

class HeartbeatStorageImpl {
  constructor(app) {
    this.app = app;
    this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    if (!isIndexedDBAvailable()) {
      return false;
    } else {
      return validateIndexedDBOpenable().then(() => true).catch(() => false);
    }
  }
  async read() {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return { heartbeats: [] };
    } else {
      const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
      if (idbHeartbeatObject === null || idbHeartbeatObject === undefined ? undefined : idbHeartbeatObject.heartbeats) {
        return idbHeartbeatObject;
      } else {
        return { heartbeats: [] };
      }
    }
  }
  async overwrite(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: heartbeatsObject.heartbeats
      });
    }
  }
  async add(heartbeatsObject) {
    var _a;
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== undefined ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: [
          ...existingHeartbeatsObject.heartbeats,
          ...heartbeatsObject.heartbeats
        ]
      });
    }
  }
}
registerCoreComponents("");

// node_modules/@firebase/installations/dist/esm/index.esm2017.js
var isServerError = function(error) {
  return error instanceof FirebaseError && error.code.includes("request-failed");
};
var getInstallationsEndpoint = function({ projectId }) {
  return `${INSTALLATIONS_API_URL}/projects/${projectId}/installations`;
};
var extractAuthTokenInfoFromResponse = function(response) {
  return {
    token: response.token,
    requestStatus: 2,
    expiresIn: getExpiresInFromResponseExpiresIn(response.expiresIn),
    creationTime: Date.now()
  };
};
async function getErrorFromResponse(requestName, response) {
  const responseJson = await response.json();
  const errorData = responseJson.error;
  return ERROR_FACTORY2.create("request-failed", {
    requestName,
    serverCode: errorData.code,
    serverMessage: errorData.message,
    serverStatus: errorData.status
  });
}
var getHeaders = function({ apiKey }) {
  return new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-goog-api-key": apiKey
  });
};
var getHeadersWithAuth = function(appConfig, { refreshToken }) {
  const headers = getHeaders(appConfig);
  headers.append("Authorization", getAuthorizationHeader(refreshToken));
  return headers;
};
async function retryIfServerError(fn) {
  const result = await fn();
  if (result.status >= 500 && result.status < 600) {
    return fn();
  }
  return result;
}
var getExpiresInFromResponseExpiresIn = function(responseExpiresIn) {
  return Number(responseExpiresIn.replace("s", "000"));
};
var getAuthorizationHeader = function(refreshToken) {
  return `${INTERNAL_AUTH_VERSION} ${refreshToken}`;
};
async function createInstallationRequest({ appConfig, heartbeatServiceProvider }, { fid }) {
  const endpoint = getInstallationsEndpoint(appConfig);
  const headers = getHeaders(appConfig);
  const heartbeatService = heartbeatServiceProvider.getImmediate({
    optional: true
  });
  if (heartbeatService) {
    const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
    if (heartbeatsHeader) {
      headers.append("x-firebase-client", heartbeatsHeader);
    }
  }
  const body = {
    fid,
    authVersion: INTERNAL_AUTH_VERSION,
    appId: appConfig.appId,
    sdkVersion: PACKAGE_VERSION
  };
  const request = {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  };
  const response = await retryIfServerError(() => fetch(endpoint, request));
  if (response.ok) {
    const responseValue = await response.json();
    const registeredInstallationEntry = {
      fid: responseValue.fid || fid,
      registrationStatus: 2,
      refreshToken: responseValue.refreshToken,
      authToken: extractAuthTokenInfoFromResponse(responseValue.authToken)
    };
    return registeredInstallationEntry;
  } else {
    throw await getErrorFromResponse("Create Installation", response);
  }
}
var sleep = function(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
var bufferToBase64UrlSafe = function(array) {
  const b64 = btoa(String.fromCharCode(...array));
  return b64.replace(/\+/g, "-").replace(/\//g, "_");
};
var generateFid = function() {
  try {
    const fidByteArray = new Uint8Array(17);
    const crypto = self.crypto || self.msCrypto;
    crypto.getRandomValues(fidByteArray);
    fidByteArray[0] = 112 + fidByteArray[0] % 16;
    const fid = encode(fidByteArray);
    return VALID_FID_PATTERN.test(fid) ? fid : INVALID_FID;
  } catch (_a) {
    return INVALID_FID;
  }
};
var encode = function(fidByteArray) {
  const b64String = bufferToBase64UrlSafe(fidByteArray);
  return b64String.substr(0, 22);
};
var getKey = function(appConfig) {
  return `${appConfig.appName}!${appConfig.appId}`;
};
var fidChanged = function(appConfig, fid) {
  const key = getKey(appConfig);
  callFidChangeCallbacks(key, fid);
  broadcastFidChange(key, fid);
};
var callFidChangeCallbacks = function(key, fid) {
  const callbacks = fidChangeCallbacks.get(key);
  if (!callbacks) {
    return;
  }
  for (const callback of callbacks) {
    callback(fid);
  }
};
var broadcastFidChange = function(key, fid) {
  const channel = getBroadcastChannel();
  if (channel) {
    channel.postMessage({ key, fid });
  }
  closeBroadcastChannel();
};
var getBroadcastChannel = function() {
  if (!broadcastChannel && "BroadcastChannel" in self) {
    broadcastChannel = new BroadcastChannel("[Firebase] FID Change");
    broadcastChannel.onmessage = (e) => {
      callFidChangeCallbacks(e.data.key, e.data.fid);
    };
  }
  return broadcastChannel;
};
var closeBroadcastChannel = function() {
  if (fidChangeCallbacks.size === 0 && broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }
};
var getDbPromise2 = function() {
  if (!dbPromise2) {
    dbPromise2 = openDB(DATABASE_NAME, DATABASE_VERSION, {
      upgrade: (db, oldVersion) => {
        switch (oldVersion) {
          case 0:
            db.createObjectStore(OBJECT_STORE_NAME);
        }
      }
    });
  }
  return dbPromise2;
};
async function set(appConfig, value) {
  const key = getKey(appConfig);
  const db = await getDbPromise2();
  const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
  const objectStore = tx.objectStore(OBJECT_STORE_NAME);
  const oldValue = await objectStore.get(key);
  await objectStore.put(value, key);
  await tx.done;
  if (!oldValue || oldValue.fid !== value.fid) {
    fidChanged(appConfig, value.fid);
  }
  return value;
}
async function remove(appConfig) {
  const key = getKey(appConfig);
  const db = await getDbPromise2();
  const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
  await tx.objectStore(OBJECT_STORE_NAME).delete(key);
  await tx.done;
}
async function update(appConfig, updateFn) {
  const key = getKey(appConfig);
  const db = await getDbPromise2();
  const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
  const store = tx.objectStore(OBJECT_STORE_NAME);
  const oldValue = await store.get(key);
  const newValue = updateFn(oldValue);
  if (newValue === undefined) {
    await store.delete(key);
  } else {
    await store.put(newValue, key);
  }
  await tx.done;
  if (newValue && (!oldValue || oldValue.fid !== newValue.fid)) {
    fidChanged(appConfig, newValue.fid);
  }
  return newValue;
}
async function getInstallationEntry(installations) {
  let registrationPromise;
  const installationEntry = await update(installations.appConfig, (oldEntry) => {
    const installationEntry2 = updateOrCreateInstallationEntry(oldEntry);
    const entryWithPromise = triggerRegistrationIfNecessary(installations, installationEntry2);
    registrationPromise = entryWithPromise.registrationPromise;
    return entryWithPromise.installationEntry;
  });
  if (installationEntry.fid === INVALID_FID) {
    return { installationEntry: await registrationPromise };
  }
  return {
    installationEntry,
    registrationPromise
  };
}
var updateOrCreateInstallationEntry = function(oldEntry) {
  const entry = oldEntry || {
    fid: generateFid(),
    registrationStatus: 0
  };
  return clearTimedOutRequest(entry);
};
var triggerRegistrationIfNecessary = function(installations, installationEntry) {
  if (installationEntry.registrationStatus === 0) {
    if (!navigator.onLine) {
      const registrationPromiseWithError = Promise.reject(ERROR_FACTORY2.create("app-offline"));
      return {
        installationEntry,
        registrationPromise: registrationPromiseWithError
      };
    }
    const inProgressEntry = {
      fid: installationEntry.fid,
      registrationStatus: 1,
      registrationTime: Date.now()
    };
    const registrationPromise = registerInstallation(installations, inProgressEntry);
    return { installationEntry: inProgressEntry, registrationPromise };
  } else if (installationEntry.registrationStatus === 1) {
    return {
      installationEntry,
      registrationPromise: waitUntilFidRegistration(installations)
    };
  } else {
    return { installationEntry };
  }
};
async function registerInstallation(installations, installationEntry) {
  try {
    const registeredInstallationEntry = await createInstallationRequest(installations, installationEntry);
    return set(installations.appConfig, registeredInstallationEntry);
  } catch (e) {
    if (isServerError(e) && e.customData.serverCode === 409) {
      await remove(installations.appConfig);
    } else {
      await set(installations.appConfig, {
        fid: installationEntry.fid,
        registrationStatus: 0
      });
    }
    throw e;
  }
}
async function waitUntilFidRegistration(installations) {
  let entry = await updateInstallationRequest(installations.appConfig);
  while (entry.registrationStatus === 1) {
    await sleep(100);
    entry = await updateInstallationRequest(installations.appConfig);
  }
  if (entry.registrationStatus === 0) {
    const { installationEntry, registrationPromise } = await getInstallationEntry(installations);
    if (registrationPromise) {
      return registrationPromise;
    } else {
      return installationEntry;
    }
  }
  return entry;
}
var updateInstallationRequest = function(appConfig) {
  return update(appConfig, (oldEntry) => {
    if (!oldEntry) {
      throw ERROR_FACTORY2.create("installation-not-found");
    }
    return clearTimedOutRequest(oldEntry);
  });
};
var clearTimedOutRequest = function(entry) {
  if (hasInstallationRequestTimedOut(entry)) {
    return {
      fid: entry.fid,
      registrationStatus: 0
    };
  }
  return entry;
};
var hasInstallationRequestTimedOut = function(installationEntry) {
  return installationEntry.registrationStatus === 1 && installationEntry.registrationTime + PENDING_TIMEOUT_MS < Date.now();
};
async function generateAuthTokenRequest({ appConfig, heartbeatServiceProvider }, installationEntry) {
  const endpoint = getGenerateAuthTokenEndpoint(appConfig, installationEntry);
  const headers = getHeadersWithAuth(appConfig, installationEntry);
  const heartbeatService = heartbeatServiceProvider.getImmediate({
    optional: true
  });
  if (heartbeatService) {
    const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
    if (heartbeatsHeader) {
      headers.append("x-firebase-client", heartbeatsHeader);
    }
  }
  const body = {
    installation: {
      sdkVersion: PACKAGE_VERSION,
      appId: appConfig.appId
    }
  };
  const request = {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  };
  const response = await retryIfServerError(() => fetch(endpoint, request));
  if (response.ok) {
    const responseValue = await response.json();
    const completedAuthToken = extractAuthTokenInfoFromResponse(responseValue);
    return completedAuthToken;
  } else {
    throw await getErrorFromResponse("Generate Auth Token", response);
  }
}
var getGenerateAuthTokenEndpoint = function(appConfig, { fid }) {
  return `${getInstallationsEndpoint(appConfig)}/${fid}/authTokens:generate`;
};
async function refreshAuthToken(installations, forceRefresh = false) {
  let tokenPromise;
  const entry = await update(installations.appConfig, (oldEntry) => {
    if (!isEntryRegistered(oldEntry)) {
      throw ERROR_FACTORY2.create("not-registered");
    }
    const oldAuthToken = oldEntry.authToken;
    if (!forceRefresh && isAuthTokenValid(oldAuthToken)) {
      return oldEntry;
    } else if (oldAuthToken.requestStatus === 1) {
      tokenPromise = waitUntilAuthTokenRequest(installations, forceRefresh);
      return oldEntry;
    } else {
      if (!navigator.onLine) {
        throw ERROR_FACTORY2.create("app-offline");
      }
      const inProgressEntry = makeAuthTokenRequestInProgressEntry(oldEntry);
      tokenPromise = fetchAuthTokenFromServer(installations, inProgressEntry);
      return inProgressEntry;
    }
  });
  const authToken = tokenPromise ? await tokenPromise : entry.authToken;
  return authToken;
}
async function waitUntilAuthTokenRequest(installations, forceRefresh) {
  let entry = await updateAuthTokenRequest(installations.appConfig);
  while (entry.authToken.requestStatus === 1) {
    await sleep(100);
    entry = await updateAuthTokenRequest(installations.appConfig);
  }
  const authToken = entry.authToken;
  if (authToken.requestStatus === 0) {
    return refreshAuthToken(installations, forceRefresh);
  } else {
    return authToken;
  }
}
var updateAuthTokenRequest = function(appConfig) {
  return update(appConfig, (oldEntry) => {
    if (!isEntryRegistered(oldEntry)) {
      throw ERROR_FACTORY2.create("not-registered");
    }
    const oldAuthToken = oldEntry.authToken;
    if (hasAuthTokenRequestTimedOut(oldAuthToken)) {
      return Object.assign(Object.assign({}, oldEntry), { authToken: { requestStatus: 0 } });
    }
    return oldEntry;
  });
};
async function fetchAuthTokenFromServer(installations, installationEntry) {
  try {
    const authToken = await generateAuthTokenRequest(installations, installationEntry);
    const updatedInstallationEntry = Object.assign(Object.assign({}, installationEntry), { authToken });
    await set(installations.appConfig, updatedInstallationEntry);
    return authToken;
  } catch (e) {
    if (isServerError(e) && (e.customData.serverCode === 401 || e.customData.serverCode === 404)) {
      await remove(installations.appConfig);
    } else {
      const updatedInstallationEntry = Object.assign(Object.assign({}, installationEntry), { authToken: { requestStatus: 0 } });
      await set(installations.appConfig, updatedInstallationEntry);
    }
    throw e;
  }
}
var isEntryRegistered = function(installationEntry) {
  return installationEntry !== undefined && installationEntry.registrationStatus === 2;
};
var isAuthTokenValid = function(authToken) {
  return authToken.requestStatus === 2 && !isAuthTokenExpired(authToken);
};
var isAuthTokenExpired = function(authToken) {
  const now = Date.now();
  return now < authToken.creationTime || authToken.creationTime + authToken.expiresIn < now + TOKEN_EXPIRATION_BUFFER;
};
var makeAuthTokenRequestInProgressEntry = function(oldEntry) {
  const inProgressAuthToken = {
    requestStatus: 1,
    requestTime: Date.now()
  };
  return Object.assign(Object.assign({}, oldEntry), { authToken: inProgressAuthToken });
};
var hasAuthTokenRequestTimedOut = function(authToken) {
  return authToken.requestStatus === 1 && authToken.requestTime + PENDING_TIMEOUT_MS < Date.now();
};
async function getId(installations) {
  const installationsImpl = installations;
  const { installationEntry, registrationPromise } = await getInstallationEntry(installationsImpl);
  if (registrationPromise) {
    registrationPromise.catch(console.error);
  } else {
    refreshAuthToken(installationsImpl).catch(console.error);
  }
  return installationEntry.fid;
}
async function getToken(installations, forceRefresh = false) {
  const installationsImpl = installations;
  await completeInstallationRegistration(installationsImpl);
  const authToken = await refreshAuthToken(installationsImpl, forceRefresh);
  return authToken.token;
}
async function completeInstallationRegistration(installations) {
  const { registrationPromise } = await getInstallationEntry(installations);
  if (registrationPromise) {
    await registrationPromise;
  }
}
var extractAppConfig = function(app2) {
  if (!app2 || !app2.options) {
    throw getMissingValueError("App Configuration");
  }
  if (!app2.name) {
    throw getMissingValueError("App Name");
  }
  const configKeys = [
    "projectId",
    "apiKey",
    "appId"
  ];
  for (const keyName of configKeys) {
    if (!app2.options[keyName]) {
      throw getMissingValueError(keyName);
    }
  }
  return {
    appName: app2.name,
    projectId: app2.options.projectId,
    apiKey: app2.options.apiKey,
    appId: app2.options.appId
  };
};
var getMissingValueError = function(valueName) {
  return ERROR_FACTORY2.create("missing-app-config-values", {
    valueName
  });
};
var registerInstallations = function() {
  _registerComponent(new Component(INSTALLATIONS_NAME, publicFactory, "PUBLIC"));
  _registerComponent(new Component(INSTALLATIONS_NAME_INTERNAL, internalFactory, "PRIVATE"));
};
var name2 = "@firebase/installations";
var version2 = "0.6.5";
var PENDING_TIMEOUT_MS = 1e4;
var PACKAGE_VERSION = `w:${version2}`;
var INTERNAL_AUTH_VERSION = "FIS_v2";
var INSTALLATIONS_API_URL = "https://firebaseinstallations.googleapis.com/v1";
var TOKEN_EXPIRATION_BUFFER = 60 * 60 * 1000;
var SERVICE = "installations";
var SERVICE_NAME = "Installations";
var ERROR_DESCRIPTION_MAP = {
  ["missing-app-config-values"]: 'Missing App configuration value: "{$valueName}"',
  ["not-registered"]: "Firebase Installation is not registered.",
  ["installation-not-found"]: "Firebase Installation not found.",
  ["request-failed"]: '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
  ["app-offline"]: "Could not process request. Application offline.",
  ["delete-pending-registration"]: "Can't delete installation while there is a pending registration request."
};
var ERROR_FACTORY2 = new ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);
var VALID_FID_PATTERN = /^[cdef][\w-]{21}$/;
var INVALID_FID = "";
var fidChangeCallbacks = new Map;
var broadcastChannel = null;
var DATABASE_NAME = "firebase-installations-database";
var DATABASE_VERSION = 1;
var OBJECT_STORE_NAME = "firebase-installations-store";
var dbPromise2 = null;
var INSTALLATIONS_NAME = "installations";
var INSTALLATIONS_NAME_INTERNAL = "installations-internal";
var publicFactory = (container) => {
  const app2 = container.getProvider("app").getImmediate();
  const appConfig = extractAppConfig(app2);
  const heartbeatServiceProvider = _getProvider(app2, "heartbeat");
  const installationsImpl = {
    app: app2,
    appConfig,
    heartbeatServiceProvider,
    _delete: () => Promise.resolve()
  };
  return installationsImpl;
};
var internalFactory = (container) => {
  const app2 = container.getProvider("app").getImmediate();
  const installations = _getProvider(app2, INSTALLATIONS_NAME).getImmediate();
  const installationsInternal = {
    getId: () => getId(installations),
    getToken: (forceRefresh) => getToken(installations, forceRefresh)
  };
  return installationsInternal;
};
registerInstallations();
registerVersion(name2, version2);
registerVersion(name2, version2, "esm2017");

// node_modules/@firebase/analytics/dist/esm/index.esm2017.js
var createGtagTrustedTypesScriptURL = function(url) {
  if (!url.startsWith(GTAG_URL)) {
    const err = ERROR_FACTORY3.create("invalid-gtag-resource", {
      gtagURL: url
    });
    logger4.warn(err.message);
    return "";
  }
  return url;
};
var promiseAllSettled = function(promises) {
  return Promise.all(promises.map((promise) => promise.catch((e) => e)));
};
var createTrustedTypesPolicy = function(policyName, policyOptions) {
  let trustedTypesPolicy;
  if (window.trustedTypes) {
    trustedTypesPolicy = window.trustedTypes.createPolicy(policyName, policyOptions);
  }
  return trustedTypesPolicy;
};
var insertScriptTag = function(dataLayerName, measurementId) {
  const trustedTypesPolicy = createTrustedTypesPolicy("firebase-js-sdk-policy", {
    createScriptURL: createGtagTrustedTypesScriptURL
  });
  const script = document.createElement("script");
  const gtagScriptURL = `${GTAG_URL}?l=${dataLayerName}&id=${measurementId}`;
  script.src = trustedTypesPolicy ? trustedTypesPolicy === null || trustedTypesPolicy === undefined ? undefined : trustedTypesPolicy.createScriptURL(gtagScriptURL) : gtagScriptURL;
  script.async = true;
  document.head.appendChild(script);
};
var getOrCreateDataLayer = function(dataLayerName) {
  let dataLayer = [];
  if (Array.isArray(window[dataLayerName])) {
    dataLayer = window[dataLayerName];
  } else {
    window[dataLayerName] = dataLayer;
  }
  return dataLayer;
};
async function gtagOnConfig(gtagCore, initializationPromisesMap, dynamicConfigPromisesList, measurementIdToAppId, measurementId, gtagParams) {
  const correspondingAppId = measurementIdToAppId[measurementId];
  try {
    if (correspondingAppId) {
      await initializationPromisesMap[correspondingAppId];
    } else {
      const dynamicConfigResults = await promiseAllSettled(dynamicConfigPromisesList);
      const foundConfig = dynamicConfigResults.find((config) => config.measurementId === measurementId);
      if (foundConfig) {
        await initializationPromisesMap[foundConfig.appId];
      }
    }
  } catch (e) {
    logger4.error(e);
  }
  gtagCore("config", measurementId, gtagParams);
}
async function gtagOnEvent(gtagCore, initializationPromisesMap, dynamicConfigPromisesList, measurementId, gtagParams) {
  try {
    let initializationPromisesToWaitFor = [];
    if (gtagParams && gtagParams["send_to"]) {
      let gaSendToList = gtagParams["send_to"];
      if (!Array.isArray(gaSendToList)) {
        gaSendToList = [gaSendToList];
      }
      const dynamicConfigResults = await promiseAllSettled(dynamicConfigPromisesList);
      for (const sendToId of gaSendToList) {
        const foundConfig = dynamicConfigResults.find((config) => config.measurementId === sendToId);
        const initializationPromise = foundConfig && initializationPromisesMap[foundConfig.appId];
        if (initializationPromise) {
          initializationPromisesToWaitFor.push(initializationPromise);
        } else {
          initializationPromisesToWaitFor = [];
          break;
        }
      }
    }
    if (initializationPromisesToWaitFor.length === 0) {
      initializationPromisesToWaitFor = Object.values(initializationPromisesMap);
    }
    await Promise.all(initializationPromisesToWaitFor);
    gtagCore("event", measurementId, gtagParams || {});
  } catch (e) {
    logger4.error(e);
  }
}
var wrapGtag = function(gtagCore, initializationPromisesMap, dynamicConfigPromisesList, measurementIdToAppId) {
  async function gtagWrapper(command, ...args) {
    try {
      if (command === "event") {
        const [measurementId, gtagParams] = args;
        await gtagOnEvent(gtagCore, initializationPromisesMap, dynamicConfigPromisesList, measurementId, gtagParams);
      } else if (command === "config") {
        const [measurementId, gtagParams] = args;
        await gtagOnConfig(gtagCore, initializationPromisesMap, dynamicConfigPromisesList, measurementIdToAppId, measurementId, gtagParams);
      } else if (command === "consent") {
        const [gtagParams] = args;
        gtagCore("consent", "update", gtagParams);
      } else if (command === "get") {
        const [measurementId, fieldName, callback] = args;
        gtagCore("get", measurementId, fieldName, callback);
      } else if (command === "set") {
        const [customParams] = args;
        gtagCore("set", customParams);
      } else {
        gtagCore(command, ...args);
      }
    } catch (e) {
      logger4.error(e);
    }
  }
  return gtagWrapper;
};
var wrapOrCreateGtag = function(initializationPromisesMap, dynamicConfigPromisesList, measurementIdToAppId, dataLayerName, gtagFunctionName) {
  let gtagCore = function(..._args) {
    window[dataLayerName].push(arguments);
  };
  if (window[gtagFunctionName] && typeof window[gtagFunctionName] === "function") {
    gtagCore = window[gtagFunctionName];
  }
  window[gtagFunctionName] = wrapGtag(gtagCore, initializationPromisesMap, dynamicConfigPromisesList, measurementIdToAppId);
  return {
    gtagCore,
    wrappedGtag: window[gtagFunctionName]
  };
};
var findGtagScriptOnPage = function(dataLayerName) {
  const scriptTags = window.document.getElementsByTagName("script");
  for (const tag of Object.values(scriptTags)) {
    if (tag.src && tag.src.includes(GTAG_URL) && tag.src.includes(dataLayerName)) {
      return tag;
    }
  }
  return null;
};
var getHeaders2 = function(apiKey) {
  return new Headers({
    Accept: "application/json",
    "x-goog-api-key": apiKey
  });
};
async function fetchDynamicConfig(appFields) {
  var _a;
  const { appId, apiKey } = appFields;
  const request = {
    method: "GET",
    headers: getHeaders2(apiKey)
  };
  const appUrl = DYNAMIC_CONFIG_URL.replace("{app-id}", appId);
  const response = await fetch(appUrl, request);
  if (response.status !== 200 && response.status !== 304) {
    let errorMessage = "";
    try {
      const jsonResponse = await response.json();
      if ((_a = jsonResponse.error) === null || _a === undefined ? undefined : _a.message) {
        errorMessage = jsonResponse.error.message;
      }
    } catch (_ignored) {
    }
    throw ERROR_FACTORY3.create("config-fetch-failed", {
      httpStatus: response.status,
      responseMessage: errorMessage
    });
  }
  return response.json();
}
async function fetchDynamicConfigWithRetry(app3, retryData = defaultRetryData, timeoutMillis) {
  const { appId, apiKey, measurementId } = app3.options;
  if (!appId) {
    throw ERROR_FACTORY3.create("no-app-id");
  }
  if (!apiKey) {
    if (measurementId) {
      return {
        measurementId,
        appId
      };
    }
    throw ERROR_FACTORY3.create("no-api-key");
  }
  const throttleMetadata = retryData.getThrottleMetadata(appId) || {
    backoffCount: 0,
    throttleEndTimeMillis: Date.now()
  };
  const signal = new AnalyticsAbortSignal;
  setTimeout(async () => {
    signal.abort();
  }, timeoutMillis !== undefined ? timeoutMillis : FETCH_TIMEOUT_MILLIS);
  return attemptFetchDynamicConfigWithRetry({ appId, apiKey, measurementId }, throttleMetadata, signal, retryData);
}
async function attemptFetchDynamicConfigWithRetry(appFields, { throttleEndTimeMillis, backoffCount }, signal, retryData = defaultRetryData) {
  var _a;
  const { appId, measurementId } = appFields;
  try {
    await setAbortableTimeout(signal, throttleEndTimeMillis);
  } catch (e) {
    if (measurementId) {
      logger4.warn(`Timed out fetching this Firebase app's measurement ID from the server.` + ` Falling back to the measurement ID ${measurementId}` + ` provided in the "measurementId" field in the local Firebase config. [${e === null || e === undefined ? undefined : e.message}]`);
      return { appId, measurementId };
    }
    throw e;
  }
  try {
    const response = await fetchDynamicConfig(appFields);
    retryData.deleteThrottleMetadata(appId);
    return response;
  } catch (e) {
    const error = e;
    if (!isRetriableError(error)) {
      retryData.deleteThrottleMetadata(appId);
      if (measurementId) {
        logger4.warn(`Failed to fetch this Firebase app's measurement ID from the server.` + ` Falling back to the measurement ID ${measurementId}` + ` provided in the "measurementId" field in the local Firebase config. [${error === null || error === undefined ? undefined : error.message}]`);
        return { appId, measurementId };
      } else {
        throw e;
      }
    }
    const backoffMillis = Number((_a = error === null || error === undefined ? undefined : error.customData) === null || _a === undefined ? undefined : _a.httpStatus) === 503 ? calculateBackoffMillis(backoffCount, retryData.intervalMillis, LONG_RETRY_FACTOR) : calculateBackoffMillis(backoffCount, retryData.intervalMillis);
    const throttleMetadata = {
      throttleEndTimeMillis: Date.now() + backoffMillis,
      backoffCount: backoffCount + 1
    };
    retryData.setThrottleMetadata(appId, throttleMetadata);
    logger4.debug(`Calling attemptFetch again in ${backoffMillis} millis`);
    return attemptFetchDynamicConfigWithRetry(appFields, throttleMetadata, signal, retryData);
  }
}
var setAbortableTimeout = function(signal, throttleEndTimeMillis) {
  return new Promise((resolve, reject) => {
    const backoffMillis = Math.max(throttleEndTimeMillis - Date.now(), 0);
    const timeout = setTimeout(resolve, backoffMillis);
    signal.addEventListener(() => {
      clearTimeout(timeout);
      reject(ERROR_FACTORY3.create("fetch-throttle", {
        throttleEndTimeMillis
      }));
    });
  });
};
var isRetriableError = function(e) {
  if (!(e instanceof FirebaseError) || !e.customData) {
    return false;
  }
  const httpStatus = Number(e.customData["httpStatus"]);
  return httpStatus === 429 || httpStatus === 500 || httpStatus === 503 || httpStatus === 504;
};
async function logEvent$1(gtagFunction, initializationPromise, eventName, eventParams, options) {
  if (options && options.global) {
    gtagFunction("event", eventName, eventParams);
    return;
  } else {
    const measurementId = await initializationPromise;
    const params = Object.assign(Object.assign({}, eventParams), { send_to: measurementId });
    gtagFunction("event", eventName, params);
  }
}
var _setConsentDefaultForInit = function(consentSettings) {
  defaultConsentSettingsForInit = consentSettings;
};
var _setDefaultEventParametersForInit = function(customParams) {
  defaultEventParametersForInit = customParams;
};
async function validateIndexedDB() {
  if (!isIndexedDBAvailable()) {
    logger4.warn(ERROR_FACTORY3.create("indexeddb-unavailable", {
      errorInfo: "IndexedDB is not available in this environment."
    }).message);
    return false;
  } else {
    try {
      await validateIndexedDBOpenable();
    } catch (e) {
      logger4.warn(ERROR_FACTORY3.create("indexeddb-unavailable", {
        errorInfo: e === null || e === undefined ? undefined : e.toString()
      }).message);
      return false;
    }
  }
  return true;
}
async function _initializeAnalytics(app3, dynamicConfigPromisesList, measurementIdToAppId, installations2, gtagCore, dataLayerName, options) {
  var _a;
  const dynamicConfigPromise = fetchDynamicConfigWithRetry(app3);
  dynamicConfigPromise.then((config) => {
    measurementIdToAppId[config.measurementId] = config.appId;
    if (app3.options.measurementId && config.measurementId !== app3.options.measurementId) {
      logger4.warn(`The measurement ID in the local Firebase config (${app3.options.measurementId})` + ` does not match the measurement ID fetched from the server (${config.measurementId}).` + ` To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`);
    }
  }).catch((e) => logger4.error(e));
  dynamicConfigPromisesList.push(dynamicConfigPromise);
  const fidPromise = validateIndexedDB().then((envIsValid) => {
    if (envIsValid) {
      return installations2.getId();
    } else {
      return;
    }
  });
  const [dynamicConfig, fid] = await Promise.all([
    dynamicConfigPromise,
    fidPromise
  ]);
  if (!findGtagScriptOnPage(dataLayerName)) {
    insertScriptTag(dataLayerName, dynamicConfig.measurementId);
  }
  if (defaultConsentSettingsForInit) {
    gtagCore("consent", "default", defaultConsentSettingsForInit);
    _setConsentDefaultForInit(undefined);
  }
  gtagCore("js", new Date);
  const configProperties = (_a = options === null || options === undefined ? undefined : options.config) !== null && _a !== undefined ? _a : {};
  configProperties[ORIGIN_KEY] = "firebase";
  configProperties.update = true;
  if (fid != null) {
    configProperties[GA_FID_KEY] = fid;
  }
  gtagCore("config", dynamicConfig.measurementId, configProperties);
  if (defaultEventParametersForInit) {
    gtagCore("set", defaultEventParametersForInit);
    _setDefaultEventParametersForInit(undefined);
  }
  return dynamicConfig.measurementId;
}
var warnOnBrowserContextMismatch = function() {
  const mismatchedEnvMessages = [];
  if (isBrowserExtension()) {
    mismatchedEnvMessages.push("This is a browser extension environment.");
  }
  if (!areCookiesEnabled()) {
    mismatchedEnvMessages.push("Cookies are not available.");
  }
  if (mismatchedEnvMessages.length > 0) {
    const details = mismatchedEnvMessages.map((message, index) => `(${index + 1}) ${message}`).join(" ");
    const err = ERROR_FACTORY3.create("invalid-analytics-context", {
      errorInfo: details
    });
    logger4.warn(err.message);
  }
};
var factory = function(app3, installations2, options) {
  warnOnBrowserContextMismatch();
  const appId = app3.options.appId;
  if (!appId) {
    throw ERROR_FACTORY3.create("no-app-id");
  }
  if (!app3.options.apiKey) {
    if (app3.options.measurementId) {
      logger4.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest` + ` measurement ID for this Firebase app. Falling back to the measurement ID ${app3.options.measurementId}` + ` provided in the "measurementId" field in the local Firebase config.`);
    } else {
      throw ERROR_FACTORY3.create("no-api-key");
    }
  }
  if (initializationPromisesMap[appId] != null) {
    throw ERROR_FACTORY3.create("already-exists", {
      id: appId
    });
  }
  if (!globalInitDone) {
    getOrCreateDataLayer(dataLayerName);
    const { wrappedGtag, gtagCore } = wrapOrCreateGtag(initializationPromisesMap, dynamicConfigPromisesList, measurementIdToAppId, dataLayerName, gtagName);
    wrappedGtagFunction = wrappedGtag;
    gtagCoreFunction = gtagCore;
    globalInitDone = true;
  }
  initializationPromisesMap[appId] = _initializeAnalytics(app3, dynamicConfigPromisesList, measurementIdToAppId, installations2, gtagCoreFunction, dataLayerName, options);
  const analyticsInstance = new AnalyticsService(app3);
  return analyticsInstance;
};
var getAnalytics = function(app3 = getApp()) {
  app3 = getModularInstance(app3);
  const analyticsProvider = _getProvider(app3, ANALYTICS_TYPE);
  if (analyticsProvider.isInitialized()) {
    return analyticsProvider.getImmediate();
  }
  return initializeAnalytics(app3);
};
var initializeAnalytics = function(app3, options = {}) {
  const analyticsProvider = _getProvider(app3, ANALYTICS_TYPE);
  if (analyticsProvider.isInitialized()) {
    const existingInstance = analyticsProvider.getImmediate();
    if (deepEqual(options, analyticsProvider.getOptions())) {
      return existingInstance;
    } else {
      throw ERROR_FACTORY3.create("already-initialized");
    }
  }
  const analyticsInstance = analyticsProvider.initialize({ options });
  return analyticsInstance;
};
var logEvent = function(analyticsInstance, eventName, eventParams, options) {
  analyticsInstance = getModularInstance(analyticsInstance);
  logEvent$1(wrappedGtagFunction, initializationPromisesMap[analyticsInstance.app.options.appId], eventName, eventParams, options).catch((e) => logger4.error(e));
};
var registerAnalytics = function() {
  _registerComponent(new Component(ANALYTICS_TYPE, (container, { options: analyticsOptions }) => {
    const app3 = container.getProvider("app").getImmediate();
    const installations2 = container.getProvider("installations-internal").getImmediate();
    return factory(app3, installations2, analyticsOptions);
  }, "PUBLIC"));
  _registerComponent(new Component("analytics-internal", internalFactory2, "PRIVATE"));
  registerVersion(name3, version3);
  registerVersion(name3, version3, "esm2017");
  function internalFactory2(container) {
    try {
      const analytics = container.getProvider(ANALYTICS_TYPE).getImmediate();
      return {
        logEvent: (eventName, eventParams, options) => logEvent(analytics, eventName, eventParams, options)
      };
    } catch (e) {
      throw ERROR_FACTORY3.create("interop-component-reg-failed", {
        reason: e
      });
    }
  }
};
var ANALYTICS_TYPE = "analytics";
var GA_FID_KEY = "firebase_id";
var ORIGIN_KEY = "origin";
var FETCH_TIMEOUT_MILLIS = 60 * 1000;
var DYNAMIC_CONFIG_URL = "https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig";
var GTAG_URL = "https://www.googletagmanager.com/gtag/js";
var logger4 = new Logger("@firebase/analytics");
var ERRORS2 = {
  ["already-exists"]: "A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",
  ["already-initialized"]: "initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.",
  ["already-initialized-settings"]: "Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",
  ["interop-component-reg-failed"]: "Firebase Analytics Interop Component failed to instantiate: {$reason}",
  ["invalid-analytics-context"]: "Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
  ["indexeddb-unavailable"]: "IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
  ["fetch-throttle"]: "The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",
  ["config-fetch-failed"]: "Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",
  ["no-api-key"]: 'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
  ["no-app-id"]: 'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
  ["no-client-id"]: 'The "client_id" field is empty.',
  ["invalid-gtag-resource"]: "Trusted Types detected an invalid gtag resource: {$gtagURL}."
};
var ERROR_FACTORY3 = new ErrorFactory("analytics", "Analytics", ERRORS2);
var LONG_RETRY_FACTOR = 30;
var BASE_INTERVAL_MILLIS = 1000;

class RetryData {
  constructor(throttleMetadata = {}, intervalMillis = BASE_INTERVAL_MILLIS) {
    this.throttleMetadata = throttleMetadata;
    this.intervalMillis = intervalMillis;
  }
  getThrottleMetadata(appId) {
    return this.throttleMetadata[appId];
  }
  setThrottleMetadata(appId, metadata) {
    this.throttleMetadata[appId] = metadata;
  }
  deleteThrottleMetadata(appId) {
    delete this.throttleMetadata[appId];
  }
}
var defaultRetryData = new RetryData;

class AnalyticsAbortSignal {
  constructor() {
    this.listeners = [];
  }
  addEventListener(listener) {
    this.listeners.push(listener);
  }
  abort() {
    this.listeners.forEach((listener) => listener());
  }
}
var defaultEventParametersForInit;
var defaultConsentSettingsForInit;

class AnalyticsService {
  constructor(app3) {
    this.app = app3;
  }
  _delete() {
    delete initializationPromisesMap[this.app.options.appId];
    return Promise.resolve();
  }
}
var initializationPromisesMap = {};
var dynamicConfigPromisesList = [];
var measurementIdToAppId = {};
var dataLayerName = "dataLayer";
var gtagName = "gtag";
var gtagCoreFunction;
var wrappedGtagFunction;
var globalInitDone = false;
var name3 = "@firebase/analytics";
var version3 = "0.10.1";
registerAnalytics();
// node_modules/firebase/app/dist/esm/index.esm.js
var name4 = "firebase";
var version4 = "10.8.0";
registerVersion(name4, version4, "app");

// node_modules/tslib/tslib.es6.mjs
function __rest(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s);i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}

// node_modules/@firebase/auth/dist/esm2017/index-bea2a320.js
var _prodErrorMap = function() {
  return {
    ["dependent-sdk-initialized-before-auth"]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
  };
};
var _logWarn = function(msg, ...args) {
  if (logClient.logLevel <= LogLevel.WARN) {
    logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
};
var _logError = function(msg, ...args) {
  if (logClient.logLevel <= LogLevel.ERROR) {
    logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
};
var _fail = function(authOrCode, ...rest) {
  throw createErrorInternal(authOrCode, ...rest);
};
var _createError = function(authOrCode, ...rest) {
  return createErrorInternal(authOrCode, ...rest);
};
var _errorWithCustomMessage = function(auth, code, message) {
  const errorMap = Object.assign(Object.assign({}, prodErrorMap()), { [code]: message });
  const factory2 = new ErrorFactory("auth", "Firebase", errorMap);
  return factory2.create(code, {
    appName: auth.name
  });
};
var _assertInstanceOf = function(auth, object, instance) {
  const constructorInstance = instance;
  if (!(object instanceof constructorInstance)) {
    if (constructorInstance.name !== object.constructor.name) {
      _fail(auth, "argument-error");
    }
    throw _errorWithCustomMessage(auth, "argument-error", `Type of ${object.constructor.name} does not match expected instance.` + `Did you pass a reference from a different Auth SDK?`);
  }
};
var createErrorInternal = function(authOrCode, ...rest) {
  if (typeof authOrCode !== "string") {
    const code = rest[0];
    const fullParams = [...rest.slice(1)];
    if (fullParams[0]) {
      fullParams[0].appName = authOrCode.name;
    }
    return authOrCode._errorFactory.create(code, ...fullParams);
  }
  return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
};
var _assert = function(assertion, authOrCode, ...rest) {
  if (!assertion) {
    throw createErrorInternal(authOrCode, ...rest);
  }
};
var debugFail = function(failure) {
  const message = `INTERNAL ASSERTION FAILED: ` + failure;
  _logError(message);
  throw new Error(message);
};
var debugAssert = function(assertion, message) {
  if (!assertion) {
    debugFail(message);
  }
};
var _getCurrentUrl = function() {
  var _a;
  return typeof self !== "undefined" && ((_a = self.location) === null || _a === undefined ? undefined : _a.href) || "";
};
var _isHttpOrHttps = function() {
  return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
};
var _getCurrentScheme = function() {
  var _a;
  return typeof self !== "undefined" && ((_a = self.location) === null || _a === undefined ? undefined : _a.protocol) || null;
};
var _isOnline = function() {
  if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && (_isHttpOrHttps() || isBrowserExtension() || ("connection" in navigator))) {
    return navigator.onLine;
  }
  return true;
};
var _getUserLanguage = function() {
  if (typeof navigator === "undefined") {
    return null;
  }
  const navigatorLanguage = navigator;
  return navigatorLanguage.languages && navigatorLanguage.languages[0] || navigatorLanguage.language || null;
};
var _emulatorUrl = function(config, path) {
  debugAssert(config.emulator, "Emulator should always be set here");
  const { url } = config.emulator;
  if (!path) {
    return url;
  }
  return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
};
var _addTidIfNecessary = function(auth, request) {
  if (auth.tenantId && !request.tenantId) {
    return Object.assign(Object.assign({}, request), { tenantId: auth.tenantId });
  }
  return request;
};
async function _performApiRequest(auth, method, path, request, customErrorMap = {}) {
  return _performFetchWithErrorHandling(auth, customErrorMap, async () => {
    let body = {};
    let params = {};
    if (request) {
      if (method === "GET") {
        params = request;
      } else {
        body = {
          body: JSON.stringify(request)
        };
      }
    }
    const query = querystring(Object.assign({ key: auth.config.apiKey }, params)).slice(1);
    const headers = await auth._getAdditionalHeaders();
    headers["Content-Type"] = "application/json";
    if (auth.languageCode) {
      headers["X-Firebase-Locale"] = auth.languageCode;
    }
    return FetchProvider.fetch()(_getFinalTarget(auth, auth.config.apiHost, path, query), Object.assign({
      method,
      headers,
      referrerPolicy: "no-referrer"
    }, body));
  });
}
async function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
  auth._canInitEmulator = false;
  const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
  try {
    const networkTimeout = new NetworkTimeout(auth);
    const response = await Promise.race([
      fetchFn(),
      networkTimeout.promise
    ]);
    networkTimeout.clearNetworkTimeout();
    const json = await response.json();
    if ("needConfirmation" in json) {
      throw _makeTaggedError(auth, "account-exists-with-different-credential", json);
    }
    if (response.ok && !("errorMessage" in json)) {
      return json;
    } else {
      const errorMessage = response.ok ? json.errorMessage : json.error.message;
      const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
      if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
        throw _makeTaggedError(auth, "credential-already-in-use", json);
      } else if (serverErrorCode === "EMAIL_EXISTS") {
        throw _makeTaggedError(auth, "email-already-in-use", json);
      } else if (serverErrorCode === "USER_DISABLED") {
        throw _makeTaggedError(auth, "user-disabled", json);
      }
      const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
      if (serverErrorMessage) {
        throw _errorWithCustomMessage(auth, authError, serverErrorMessage);
      } else {
        _fail(auth, authError);
      }
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      throw e;
    }
    _fail(auth, "network-request-failed", { message: String(e) });
  }
}
async function _performSignInRequest(auth, method, path, request, customErrorMap = {}) {
  const serverResponse = await _performApiRequest(auth, method, path, request, customErrorMap);
  if ("mfaPendingCredential" in serverResponse) {
    _fail(auth, "multi-factor-auth-required", {
      _serverResponse: serverResponse
    });
  }
  return serverResponse;
}
var _getFinalTarget = function(auth, host, path, query) {
  const base = `${host}${path}?${query}`;
  if (!auth.config.emulator) {
    return `${auth.config.apiScheme}://${base}`;
  }
  return _emulatorUrl(auth.config, base);
};
var _parseEnforcementState = function(enforcementStateStr) {
  switch (enforcementStateStr) {
    case "ENFORCE":
      return "ENFORCE";
    case "AUDIT":
      return "AUDIT";
    case "OFF":
      return "OFF";
    default:
      return "ENFORCEMENT_STATE_UNSPECIFIED";
  }
};
var _makeTaggedError = function(auth, code, response) {
  const errorParams = {
    appName: auth.name
  };
  if (response.email) {
    errorParams.email = response.email;
  }
  if (response.phoneNumber) {
    errorParams.phoneNumber = response.phoneNumber;
  }
  const error = _createError(auth, code, errorParams);
  error.customData._tokenResponse = response;
  return error;
};
var isEnterprise = function(grecaptcha) {
  return grecaptcha !== undefined && grecaptcha.enterprise !== undefined;
};
async function getRecaptchaConfig(auth, request) {
  return _performApiRequest(auth, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth, request));
}
async function deleteAccount(auth, request) {
  return _performApiRequest(auth, "POST", "/v1/accounts:delete", request);
}
async function getAccountInfo(auth, request) {
  return _performApiRequest(auth, "POST", "/v1/accounts:lookup", request);
}
var utcTimestampToDateString = function(utcTimestamp) {
  if (!utcTimestamp) {
    return;
  }
  try {
    const date = new Date(Number(utcTimestamp));
    if (!isNaN(date.getTime())) {
      return date.toUTCString();
    }
  } catch (e) {
  }
  return;
};
async function getIdTokenResult(user, forceRefresh = false) {
  const userInternal = getModularInstance(user);
  const token = await userInternal.getIdToken(forceRefresh);
  const claims = _parseToken(token);
  _assert(claims && claims.exp && claims.auth_time && claims.iat, userInternal.auth, "internal-error");
  const firebase = typeof claims.firebase === "object" ? claims.firebase : undefined;
  const signInProvider = firebase === null || firebase === undefined ? undefined : firebase["sign_in_provider"];
  return {
    claims,
    token,
    authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
    issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
    expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
    signInProvider: signInProvider || null,
    signInSecondFactor: (firebase === null || firebase === undefined ? undefined : firebase["sign_in_second_factor"]) || null
  };
}
var secondsStringToMilliseconds = function(seconds) {
  return Number(seconds) * 1000;
};
var _parseToken = function(token) {
  const [algorithm, payload, signature] = token.split(".");
  if (algorithm === undefined || payload === undefined || signature === undefined) {
    _logError("JWT malformed, contained fewer than 3 sections");
    return null;
  }
  try {
    const decoded = base64Decode(payload);
    if (!decoded) {
      _logError("Failed to decode base64 JWT payload");
      return null;
    }
    return JSON.parse(decoded);
  } catch (e) {
    _logError("Caught error parsing JWT payload as JSON", e === null || e === undefined ? undefined : e.toString());
    return null;
  }
};
var _tokenExpiresIn = function(token) {
  const parsedToken = _parseToken(token);
  _assert(parsedToken, "internal-error");
  _assert(typeof parsedToken.exp !== "undefined", "internal-error");
  _assert(typeof parsedToken.iat !== "undefined", "internal-error");
  return Number(parsedToken.exp) - Number(parsedToken.iat);
};
async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
  if (bypassAuthState) {
    return promise;
  }
  try {
    return await promise;
  } catch (e) {
    if (e instanceof FirebaseError && isUserInvalidated(e)) {
      if (user.auth.currentUser === user) {
        await user.auth.signOut();
      }
    }
    throw e;
  }
}
var isUserInvalidated = function({ code }) {
  return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
};
async function _reloadWithoutSaving(user) {
  var _a;
  const auth = user.auth;
  const idToken = await user.getIdToken();
  const response = await _logoutIfInvalidated(user, getAccountInfo(auth, { idToken }));
  _assert(response === null || response === undefined ? undefined : response.users.length, auth, "internal-error");
  const coreAccount = response.users[0];
  user._notifyReloadListener(coreAccount);
  const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === undefined ? undefined : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
  const providerData = mergeProviderData(user.providerData, newProviderData);
  const oldIsAnonymous = user.isAnonymous;
  const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === undefined ? undefined : providerData.length);
  const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
  const updates = {
    uid: coreAccount.localId,
    displayName: coreAccount.displayName || null,
    photoURL: coreAccount.photoUrl || null,
    email: coreAccount.email || null,
    emailVerified: coreAccount.emailVerified || false,
    phoneNumber: coreAccount.phoneNumber || null,
    tenantId: coreAccount.tenantId || null,
    providerData,
    metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
    isAnonymous
  };
  Object.assign(user, updates);
}
async function reload(user) {
  const userInternal = getModularInstance(user);
  await _reloadWithoutSaving(userInternal);
  await userInternal.auth._persistUserIfCurrent(userInternal);
  userInternal.auth._notifyListenersIfCurrent(userInternal);
}
var mergeProviderData = function(original, newData) {
  const deduped = original.filter((o) => !newData.some((n) => n.providerId === o.providerId));
  return [...deduped, ...newData];
};
var extractProviderData = function(providers) {
  return providers.map((_a) => {
    var { providerId } = _a, provider = __rest(_a, ["providerId"]);
    return {
      providerId,
      uid: provider.rawId || "",
      displayName: provider.displayName || null,
      email: provider.email || null,
      phoneNumber: provider.phoneNumber || null,
      photoURL: provider.photoUrl || null
    };
  });
};
async function requestStsToken(auth, refreshToken) {
  const response = await _performFetchWithErrorHandling(auth, {}, async () => {
    const body = querystring({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }).slice(1);
    const { tokenApiHost, apiKey } = auth.config;
    const url = _getFinalTarget(auth, tokenApiHost, "/v1/token", `key=${apiKey}`);
    const headers = await auth._getAdditionalHeaders();
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    return FetchProvider.fetch()(url, {
      method: "POST",
      headers,
      body
    });
  });
  return {
    accessToken: response.access_token,
    expiresIn: response.expires_in,
    refreshToken: response.refresh_token
  };
}
async function revokeToken(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth, request));
}
var assertStringOrUndefined = function(assertion, appName) {
  _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
};
var _getInstance = function(cls) {
  debugAssert(cls instanceof Function, "Expected a class definition");
  let instance = instanceCache.get(cls);
  if (instance) {
    debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
    return instance;
  }
  instance = new cls;
  instanceCache.set(cls, instance);
  return instance;
};
var _persistenceKeyName = function(key, apiKey, appName) {
  return `${"firebase"}:${key}:${apiKey}:${appName}`;
};
var _getBrowserName = function(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) {
    return "Opera";
  } else if (_isIEMobile(ua)) {
    return "IEMobile";
  } else if (ua.includes("msie") || ua.includes("trident/")) {
    return "IE";
  } else if (ua.includes("edge/")) {
    return "Edge";
  } else if (_isFirefox(ua)) {
    return "Firefox";
  } else if (ua.includes("silk/")) {
    return "Silk";
  } else if (_isBlackBerry(ua)) {
    return "Blackberry";
  } else if (_isWebOS(ua)) {
    return "Webos";
  } else if (_isSafari(ua)) {
    return "Safari";
  } else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) {
    return "Chrome";
  } else if (_isAndroid(ua)) {
    return "Android";
  } else {
    const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
    const matches = userAgent.match(re);
    if ((matches === null || matches === undefined ? undefined : matches.length) === 2) {
      return matches[1];
    }
  }
  return "Other";
};
var _isFirefox = function(ua = getUA()) {
  return /firefox\//i.test(ua);
};
var _isSafari = function(userAgent = getUA()) {
  const ua = userAgent.toLowerCase();
  return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
};
var _isChromeIOS = function(ua = getUA()) {
  return /crios\//i.test(ua);
};
var _isIEMobile = function(ua = getUA()) {
  return /iemobile/i.test(ua);
};
var _isAndroid = function(ua = getUA()) {
  return /android/i.test(ua);
};
var _isBlackBerry = function(ua = getUA()) {
  return /blackberry/i.test(ua);
};
var _isWebOS = function(ua = getUA()) {
  return /webos/i.test(ua);
};
var _isIOS = function(ua = getUA()) {
  return /iphone|ipad|ipod/i.test(ua) || /macintosh/i.test(ua) && /mobile/i.test(ua);
};
var _isIOSStandalone = function(ua = getUA()) {
  var _a;
  return _isIOS(ua) && !!((_a = window.navigator) === null || _a === undefined ? undefined : _a.standalone);
};
var _isIE10 = function() {
  return isIE() && document.documentMode === 10;
};
var _isMobileBrowser = function(ua = getUA()) {
  return _isIOS(ua) || _isAndroid(ua) || _isWebOS(ua) || _isBlackBerry(ua) || /windows phone/i.test(ua) || _isIEMobile(ua);
};
var _isIframe = function() {
  try {
    return !!(window && window !== window.top);
  } catch (e) {
    return false;
  }
};
var _getClientVersion = function(clientPlatform, frameworks = []) {
  let reportedPlatform;
  switch (clientPlatform) {
    case "Browser":
      reportedPlatform = _getBrowserName(getUA());
      break;
    case "Worker":
      reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
      break;
    default:
      reportedPlatform = clientPlatform;
  }
  const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
  return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
};
async function _getPasswordPolicy(auth, request = {}) {
  return _performApiRequest(auth, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth, request));
}
var _castAuth = function(auth) {
  return getModularInstance(auth);
};
var _setExternalJSProvider = function(p) {
  externalJSProvider = p;
};
var _loadJS = function(url) {
  return externalJSProvider.loadJS(url);
};
var _recaptchaEnterpriseScriptUrl = function() {
  return externalJSProvider.recaptchaEnterpriseScript;
};
var _gapiScriptUrl = function() {
  return externalJSProvider.gapiScript;
};
var _generateCallbackName = function(prefix) {
  return `__${prefix}${Math.floor(Math.random() * 1e6)}`;
};
async function injectRecaptchaFields(auth, request, action, captchaResp = false) {
  const verifier = new RecaptchaEnterpriseVerifier(auth);
  let captchaResponse;
  try {
    captchaResponse = await verifier.verify(action);
  } catch (error) {
    captchaResponse = await verifier.verify(action, true);
  }
  const newRequest = Object.assign({}, request);
  if (!captchaResp) {
    Object.assign(newRequest, { captchaResponse });
  } else {
    Object.assign(newRequest, { captchaResp: captchaResponse });
  }
  Object.assign(newRequest, { clientType: "CLIENT_TYPE_WEB" });
  Object.assign(newRequest, {
    recaptchaVersion: "RECAPTCHA_ENTERPRISE"
  });
  return newRequest;
}
async function handleRecaptchaFlow(authInstance, request, actionName, actionMethod) {
  var _a;
  if ((_a = authInstance._getRecaptchaConfig()) === null || _a === undefined ? undefined : _a.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")) {
    const requestWithRecaptcha = await injectRecaptchaFields(authInstance, request, actionName, actionName === "getOobCode");
    return actionMethod(authInstance, requestWithRecaptcha);
  } else {
    return actionMethod(authInstance, request).catch(async (error) => {
      if (error.code === `auth/${"missing-recaptcha-token"}`) {
        console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
        const requestWithRecaptcha = await injectRecaptchaFields(authInstance, request, actionName, actionName === "getOobCode");
        return actionMethod(authInstance, requestWithRecaptcha);
      } else {
        return Promise.reject(error);
      }
    });
  }
}
var initializeAuth = function(app6, deps) {
  const provider = _getProvider(app6, "auth");
  if (provider.isInitialized()) {
    const auth2 = provider.getImmediate();
    const initialOptions = provider.getOptions();
    if (deepEqual(initialOptions, deps !== null && deps !== undefined ? deps : {})) {
      return auth2;
    } else {
      _fail(auth2, "already-initialized");
    }
  }
  const auth = provider.initialize({ options: deps });
  return auth;
};
var _initializeAuthInstance = function(auth, deps) {
  const persistence = (deps === null || deps === undefined ? undefined : deps.persistence) || [];
  const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
  if (deps === null || deps === undefined ? undefined : deps.errorMap) {
    auth._updateErrorMap(deps.errorMap);
  }
  auth._initializeWithPersistence(hierarchy, deps === null || deps === undefined ? undefined : deps.popupRedirectResolver);
};
var connectAuthEmulator = function(auth, url, options) {
  const authInternal = _castAuth(auth);
  _assert(authInternal._canInitEmulator, authInternal, "emulator-config-failed");
  _assert(/^https?:\/\//.test(url), authInternal, "invalid-emulator-scheme");
  const disableWarnings = !!(options === null || options === undefined ? undefined : options.disableWarnings);
  const protocol = extractProtocol(url);
  const { host, port } = extractHostAndPort(url);
  const portStr = port === null ? "" : `:${port}`;
  authInternal.config.emulator = { url: `${protocol}//${host}${portStr}/` };
  authInternal.settings.appVerificationDisabledForTesting = true;
  authInternal.emulatorConfig = Object.freeze({
    host,
    port,
    protocol: protocol.replace(":", ""),
    options: Object.freeze({ disableWarnings })
  });
  if (!disableWarnings) {
    emitEmulatorWarning();
  }
};
var extractProtocol = function(url) {
  const protocolEnd = url.indexOf(":");
  return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
};
var extractHostAndPort = function(url) {
  const protocol = extractProtocol(url);
  const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
  if (!authority) {
    return { host: "", port: null };
  }
  const hostAndPort = authority[2].split("@").pop() || "";
  const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
  if (bracketedIPv6) {
    const host = bracketedIPv6[1];
    return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
  } else {
    const [host, port] = hostAndPort.split(":");
    return { host, port: parsePort(port) };
  }
};
var parsePort = function(portStr) {
  if (!portStr) {
    return null;
  }
  const port = Number(portStr);
  if (isNaN(port)) {
    return null;
  }
  return port;
};
var emitEmulatorWarning = function() {
  function attachBanner() {
    const el = document.createElement("p");
    const sty = el.style;
    el.innerText = "Running in emulator mode. Do not use with production credentials.";
    sty.position = "fixed";
    sty.width = "100%";
    sty.backgroundColor = "#ffffff";
    sty.border = ".1em solid #000000";
    sty.color = "#b50000";
    sty.bottom = "0px";
    sty.left = "0px";
    sty.margin = "0px";
    sty.zIndex = "10000";
    sty.textAlign = "center";
    el.classList.add("firebase-emulator-warning");
    document.body.appendChild(el);
  }
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", attachBanner);
    } else {
      attachBanner();
    }
  }
};
async function linkEmailPassword(auth, request) {
  return _performApiRequest(auth, "POST", "/v1/accounts:signUp", request);
}
async function signInWithPassword(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth, request));
}
async function signInWithEmailLink$1(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
}
async function signInWithEmailLinkForLinking(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
}
async function signInWithIdp(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth, request));
}
async function sendPhoneVerificationCode(auth, request) {
  return _performApiRequest(auth, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth, request));
}
async function signInWithPhoneNumber$1(auth, request) {
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
}
async function linkWithPhoneNumber$1(auth, request) {
  const response = await _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
  if (response.temporaryProof) {
    throw _makeTaggedError(auth, "account-exists-with-different-credential", response);
  }
  return response;
}
async function verifyPhoneNumberForExisting(auth, request) {
  const apiRequest = Object.assign(Object.assign({}, request), { operation: "REAUTH" });
  return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
}
var parseMode = function(mode) {
  switch (mode) {
    case "recoverEmail":
      return "RECOVER_EMAIL";
    case "resetPassword":
      return "PASSWORD_RESET";
    case "signIn":
      return "EMAIL_SIGNIN";
    case "verifyEmail":
      return "VERIFY_EMAIL";
    case "verifyAndChangeEmail":
      return "VERIFY_AND_CHANGE_EMAIL";
    case "revertSecondFactorAddition":
      return "REVERT_SECOND_FACTOR_ADDITION";
    default:
      return null;
  }
};
var parseDeepLink = function(url) {
  const link = querystringDecode(extractQuerystring(url))["link"];
  const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
  const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
  const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
  return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
};
var providerIdForResponse = function(response) {
  if (response.providerId) {
    return response.providerId;
  }
  if ("phoneNumber" in response) {
    return "phone";
  }
  return null;
};
var _processCredentialSavingMfaContextIfNecessary = function(auth, operationType, credential, user) {
  const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth) : credential._getIdTokenResponse(auth);
  return idTokenProvider.catch((error) => {
    if (error.code === `auth/${"multi-factor-auth-required"}`) {
      throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user);
    }
    throw error;
  });
};
async function _link$1(user, credential, bypassAuthState = false) {
  const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
  return UserCredentialImpl._forOperation(user, "link", response);
}
async function _reauthenticate(user, credential, bypassAuthState = false) {
  const { auth } = user;
  const operationType = "reauthenticate";
  try {
    const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user), bypassAuthState);
    _assert(response.idToken, auth, "internal-error");
    const parsed = _parseToken(response.idToken);
    _assert(parsed, auth, "internal-error");
    const { sub: localId } = parsed;
    _assert(user.uid === localId, auth, "user-mismatch");
    return UserCredentialImpl._forOperation(user, operationType, response);
  } catch (e) {
    if ((e === null || e === undefined ? undefined : e.code) === `auth/${"user-not-found"}`) {
      _fail(auth, "user-mismatch");
    }
    throw e;
  }
}
async function _signInWithCredential(auth, credential, bypassAuthState = false) {
  const operationType = "signIn";
  const response = await _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential);
  const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth, operationType, response);
  if (!bypassAuthState) {
    await auth._updateCurrentUser(userCredential.user);
  }
  return userCredential;
}
var onIdTokenChanged = function(auth, nextOrObserver, error, completed) {
  return getModularInstance(auth).onIdTokenChanged(nextOrObserver, error, completed);
};
var beforeAuthStateChanged = function(auth, callback, onAbort) {
  return getModularInstance(auth).beforeAuthStateChanged(callback, onAbort);
};
var startEnrollPhoneMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
};
var finalizeEnrollPhoneMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
};
var startEnrollTotpMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
};
var finalizeEnrollTotpMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
};
var _iframeCannotSyncWebStorage = function() {
  const ua = getUA();
  return _isSafari(ua) || _isIOS(ua);
};
var _allSettled = function(promises) {
  return Promise.all(promises.map(async (promise) => {
    try {
      const value = await promise;
      return {
        fulfilled: true,
        value
      };
    } catch (reason) {
      return {
        fulfilled: false,
        reason
      };
    }
  }));
};
var _generateEventId = function(prefix = "", digits = 10) {
  let random = "";
  for (let i = 0;i < digits; i++) {
    random += Math.floor(Math.random() * 10);
  }
  return prefix + random;
};
var _window = function() {
  return window;
};
var _setWindowLocation = function(url) {
  _window().location.href = url;
};
var _isWorker = function() {
  return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
};
async function _getActiveServiceWorker() {
  if (!(navigator === null || navigator === undefined ? undefined : navigator.serviceWorker)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.active;
  } catch (_a) {
    return null;
  }
}
var _getServiceWorkerController = function() {
  var _a;
  return ((_a = navigator === null || navigator === undefined ? undefined : navigator.serviceWorker) === null || _a === undefined ? undefined : _a.controller) || null;
};
var _getWorkerGlobalScope = function() {
  return _isWorker() ? self : null;
};
var getObjectStore = function(db, isReadWrite) {
  return db.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
};
var _deleteDatabase = function() {
  const request = indexedDB.deleteDatabase(DB_NAME2);
  return new DBPromise(request).toPromise();
};
var _openDatabase = function() {
  const request = indexedDB.open(DB_NAME2, DB_VERSION2);
  return new Promise((resolve, reject) => {
    request.addEventListener("error", () => {
      reject(request.error);
    });
    request.addEventListener("upgradeneeded", () => {
      const db = request.result;
      try {
        db.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
      } catch (e) {
        reject(e);
      }
    });
    request.addEventListener("success", async () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
        db.close();
        await _deleteDatabase();
        resolve(await _openDatabase());
      } else {
        resolve(db);
      }
    });
  });
};
async function _putObject(db, key, value) {
  const request = getObjectStore(db, true).put({
    [DB_DATA_KEYPATH]: key,
    value
  });
  return new DBPromise(request).toPromise();
}
async function getObject(db, key) {
  const request = getObjectStore(db, false).get(key);
  const data = await new DBPromise(request).toPromise();
  return data === undefined ? null : data.value;
}
var _deleteObject = function(db, key) {
  const request = getObjectStore(db, true).delete(key);
  return new DBPromise(request).toPromise();
};
var startSignInPhoneMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth, request));
};
var finalizeSignInPhoneMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
};
var finalizeSignInTotpMfa = function(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
};
async function _verifyPhoneNumber(auth, options, verifier) {
  var _a;
  const recaptchaToken = await verifier.verify();
  try {
    _assert(typeof recaptchaToken === "string", auth, "argument-error");
    _assert(verifier.type === RECAPTCHA_VERIFIER_TYPE, auth, "argument-error");
    let phoneInfoOptions;
    if (typeof options === "string") {
      phoneInfoOptions = {
        phoneNumber: options
      };
    } else {
      phoneInfoOptions = options;
    }
    if ("session" in phoneInfoOptions) {
      const session = phoneInfoOptions.session;
      if ("phoneNumber" in phoneInfoOptions) {
        _assert(session.type === "enroll", auth, "internal-error");
        const response = await startEnrollPhoneMfa(auth, {
          idToken: session.credential,
          phoneEnrollmentInfo: {
            phoneNumber: phoneInfoOptions.phoneNumber,
            recaptchaToken
          }
        });
        return response.phoneSessionInfo.sessionInfo;
      } else {
        _assert(session.type === "signin", auth, "internal-error");
        const mfaEnrollmentId = ((_a = phoneInfoOptions.multiFactorHint) === null || _a === undefined ? undefined : _a.uid) || phoneInfoOptions.multiFactorUid;
        _assert(mfaEnrollmentId, auth, "missing-multi-factor-info");
        const response = await startSignInPhoneMfa(auth, {
          mfaPendingCredential: session.credential,
          mfaEnrollmentId,
          phoneSignInInfo: {
            recaptchaToken
          }
        });
        return response.phoneResponseInfo.sessionInfo;
      }
    } else {
      const { sessionInfo } = await sendPhoneVerificationCode(auth, {
        phoneNumber: phoneInfoOptions.phoneNumber,
        recaptchaToken
      });
      return sessionInfo;
    }
  } finally {
    verifier._reset();
  }
}
var _withDefaultResolver = function(auth, resolverOverride) {
  if (resolverOverride) {
    return _getInstance(resolverOverride);
  }
  _assert(auth._popupRedirectResolver, auth, "argument-error");
  return auth._popupRedirectResolver;
};
var _signIn = function(params) {
  return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
};
var _reauth = function(params) {
  const { auth, user } = params;
  _assert(user, auth, "internal-error");
  return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
};
async function _link(params) {
  const { auth, user } = params;
  _assert(user, auth, "internal-error");
  return _link$1(user, new IdpCredential(params), params.bypassAuthState);
}
async function signInWithPopup(auth, provider, resolver) {
  const authInternal = _castAuth(auth);
  _assertInstanceOf(auth, provider, FederatedAuthProvider);
  const resolverInternal = _withDefaultResolver(authInternal, resolver);
  const action = new PopupOperation(authInternal, "signInViaPopup", provider, resolverInternal);
  return action.executeNotNull();
}
async function _getAndClearPendingRedirectStatus(resolver, auth) {
  const key = pendingRedirectKey(auth);
  const persistence = resolverPersistence(resolver);
  if (!await persistence._isAvailable()) {
    return false;
  }
  const hasPendingRedirect = await persistence._get(key) === "true";
  await persistence._remove(key);
  return hasPendingRedirect;
}
var _overrideRedirectResult = function(auth, result) {
  redirectOutcomeMap.set(auth._key(), result);
};
var resolverPersistence = function(resolver) {
  return _getInstance(resolver._redirectPersistence);
};
var pendingRedirectKey = function(auth) {
  return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
};
async function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
  const authInternal = _castAuth(auth);
  const resolver = _withDefaultResolver(authInternal, resolverExtern);
  const action = new RedirectAction(authInternal, resolver, bypassAuthState);
  const result = await action.execute();
  if (result && !bypassAuthState) {
    delete result.user._redirectEventId;
    await authInternal._persistUserIfCurrent(result.user);
    await authInternal._setRedirectUser(null, resolverExtern);
  }
  return result;
}
var eventUid = function(e) {
  return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v) => v).join("-");
};
var isNullRedirectEvent = function({ type, error }) {
  return type === "unknown" && (error === null || error === undefined ? undefined : error.code) === `auth/${"no-auth-event"}`;
};
var isRedirectEvent = function(event) {
  switch (event.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
      return true;
    case "unknown":
      return isNullRedirectEvent(event);
    default:
      return false;
  }
};
async function _getProjectConfig(auth, request = {}) {
  return _performApiRequest(auth, "GET", "/v1/projects", request);
}
async function _validateOrigin(auth) {
  if (auth.config.emulator) {
    return;
  }
  const { authorizedDomains } = await _getProjectConfig(auth);
  for (const domain of authorizedDomains) {
    try {
      if (matchDomain(domain)) {
        return;
      }
    } catch (_a) {
    }
  }
  _fail(auth, "unauthorized-domain");
}
var matchDomain = function(expected) {
  const currentUrl = _getCurrentUrl();
  const { protocol, hostname } = new URL(currentUrl);
  if (expected.startsWith("chrome-extension://")) {
    const ceUrl = new URL(expected);
    if (ceUrl.hostname === "" && hostname === "") {
      return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
    }
    return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
  }
  if (!HTTP_REGEX.test(protocol)) {
    return false;
  }
  if (IP_ADDRESS_REGEX.test(expected)) {
    return hostname === expected;
  }
  const escapedDomainPattern = expected.replace(/\./g, "\\.");
  const re = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
  return re.test(hostname);
};
var resetUnloadedGapiModules = function() {
  const beacon = _window().___jsl;
  if (beacon === null || beacon === undefined ? undefined : beacon.H) {
    for (const hint of Object.keys(beacon.H)) {
      beacon.H[hint].r = beacon.H[hint].r || [];
      beacon.H[hint].L = beacon.H[hint].L || [];
      beacon.H[hint].r = [...beacon.H[hint].L];
      if (beacon.CP) {
        for (let i = 0;i < beacon.CP.length; i++) {
          beacon.CP[i] = null;
        }
      }
    }
  }
};
var loadGapi = function(auth) {
  return new Promise((resolve, reject) => {
    var _a, _b, _c;
    function loadGapiIframe() {
      resetUnloadedGapiModules();
      gapi.load("gapi.iframes", {
        callback: () => {
          resolve(gapi.iframes.getContext());
        },
        ontimeout: () => {
          resetUnloadedGapiModules();
          reject(_createError(auth, "network-request-failed"));
        },
        timeout: NETWORK_TIMEOUT.get()
      });
    }
    if ((_b = (_a = _window().gapi) === null || _a === undefined ? undefined : _a.iframes) === null || _b === undefined ? undefined : _b.Iframe) {
      resolve(gapi.iframes.getContext());
    } else if (!!((_c = _window().gapi) === null || _c === undefined ? undefined : _c.load)) {
      loadGapiIframe();
    } else {
      const cbName = _generateCallbackName("iframefcb");
      _window()[cbName] = () => {
        if (!!gapi.load) {
          loadGapiIframe();
        } else {
          reject(_createError(auth, "network-request-failed"));
        }
      };
      return _loadJS(`${_gapiScriptUrl()}?onload=${cbName}`).catch((e) => reject(e));
    }
  }).catch((error) => {
    cachedGApiLoader = null;
    throw error;
  });
};
var _loadGapi = function(auth) {
  cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
  return cachedGApiLoader;
};
var getIframeUrl = function(auth) {
  const config = auth.config;
  _assert(config.authDomain, auth, "auth-domain-config-required");
  const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth.config.authDomain}/${IFRAME_PATH}`;
  const params = {
    apiKey: config.apiKey,
    appName: auth.name,
    v: SDK_VERSION
  };
  const eid = EID_FROM_APIHOST.get(auth.config.apiHost);
  if (eid) {
    params.eid = eid;
  }
  const frameworks = auth._getFrameworks();
  if (frameworks.length) {
    params.fw = frameworks.join(",");
  }
  return `${url}?${querystring(params).slice(1)}`;
};
async function _openIframe(auth) {
  const context = await _loadGapi(auth);
  const gapi2 = _window().gapi;
  _assert(gapi2, auth, "internal-error");
  return context.open({
    where: document.body,
    url: getIframeUrl(auth),
    messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
    attributes: IFRAME_ATTRIBUTES,
    dontclear: true
  }, (iframe) => new Promise(async (resolve, reject) => {
    await iframe.restyle({
      setHideOnLeave: false
    });
    const networkError = _createError(auth, "network-request-failed");
    const networkErrorTimer = _window().setTimeout(() => {
      reject(networkError);
    }, PING_TIMEOUT.get());
    function clearTimerAndResolve() {
      _window().clearTimeout(networkErrorTimer);
      resolve(iframe);
    }
    iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
      reject(networkError);
    });
  }));
}
var _open = function(auth, url, name5, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
  const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
  let target = "";
  const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), {
    width: width.toString(),
    height: height.toString(),
    top,
    left
  });
  const ua = getUA().toLowerCase();
  if (name5) {
    target = _isChromeIOS(ua) ? TARGET_BLANK : name5;
  }
  if (_isFirefox(ua)) {
    url = url || FIREFOX_EMPTY_URL;
    options.scrollbars = "yes";
  }
  const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, "");
  if (_isIOSStandalone(ua) && target !== "_self") {
    openAsNewWindowIOS(url || "", target);
    return new AuthPopup(null);
  }
  const newWin = window.open(url || "", target, optionsString);
  _assert(newWin, auth, "popup-blocked");
  try {
    newWin.focus();
  } catch (e) {
  }
  return new AuthPopup(newWin);
};
var openAsNewWindowIOS = function(url, target) {
  const el = document.createElement("a");
  el.href = url;
  el.target = target;
  const click = document.createEvent("MouseEvent");
  click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
  el.dispatchEvent(click);
};
async function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
  _assert(auth.config.authDomain, auth, "auth-domain-config-required");
  _assert(auth.config.apiKey, auth, "invalid-api-key");
  const params = {
    apiKey: auth.config.apiKey,
    appName: auth.name,
    authType,
    redirectUrl,
    v: SDK_VERSION,
    eventId
  };
  if (provider instanceof FederatedAuthProvider) {
    provider.setDefaultLanguage(auth.languageCode);
    params.providerId = provider.providerId || "";
    if (!isEmpty(provider.getCustomParameters())) {
      params.customParameters = JSON.stringify(provider.getCustomParameters());
    }
    for (const [key, value] of Object.entries(additionalParams || {})) {
      params[key] = value;
    }
  }
  if (provider instanceof BaseOAuthProvider) {
    const scopes = provider.getScopes().filter((scope) => scope !== "");
    if (scopes.length > 0) {
      params.scopes = scopes.join(",");
    }
  }
  if (auth.tenantId) {
    params.tid = auth.tenantId;
  }
  const paramsDict = params;
  for (const key of Object.keys(paramsDict)) {
    if (paramsDict[key] === undefined) {
      delete paramsDict[key];
    }
  }
  const appCheckToken = await auth._getAppCheckToken();
  const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
  return `${getHandlerBase(auth)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
}
var getHandlerBase = function({ config }) {
  if (!config.emulator) {
    return `https://${config.authDomain}/${WIDGET_PATH}`;
  }
  return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
};
var _isEmptyString = function(input) {
  return typeof input === "undefined" || (input === null || input === undefined ? undefined : input.length) === 0;
};
var getVersionForPlatform = function(clientPlatform) {
  switch (clientPlatform) {
    case "Node":
      return "node";
    case "ReactNative":
      return "rn";
    case "Worker":
      return "webworker";
    case "Cordova":
      return "cordova";
    case "WebExtension":
      return "web-extension";
    default:
      return;
  }
};
var registerAuth = function(clientPlatform) {
  _registerComponent(new Component("auth", (container, { options: deps }) => {
    const app6 = container.getProvider("app").getImmediate();
    const heartbeatServiceProvider = container.getProvider("heartbeat");
    const appCheckServiceProvider = container.getProvider("app-check-internal");
    const { apiKey, authDomain } = app6.options;
    _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app6.name });
    const config = {
      apiKey,
      authDomain,
      clientPlatform,
      apiHost: "identitytoolkit.googleapis.com",
      tokenApiHost: "securetoken.googleapis.com",
      apiScheme: "https",
      sdkClientVersion: _getClientVersion(clientPlatform)
    };
    const authInstance = new AuthImpl(app6, heartbeatServiceProvider, appCheckServiceProvider, config);
    _initializeAuthInstance(authInstance, deps);
    return authInstance;
  }, "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
    const authInternalProvider = container.getProvider("auth-internal");
    authInternalProvider.initialize();
  }));
  _registerComponent(new Component("auth-internal", (container) => {
    const auth = _castAuth(container.getProvider("auth").getImmediate());
    return ((auth2) => new AuthInterop(auth2))(auth);
  }, "PRIVATE").setInstantiationMode("EXPLICIT"));
  registerVersion(name5, version5, getVersionForPlatform(clientPlatform));
  registerVersion(name5, version5, "esm2017");
};
var getAuth = function(app6 = getApp()) {
  const provider = _getProvider(app6, "auth");
  if (provider.isInitialized()) {
    return provider.getImmediate();
  }
  const auth = initializeAuth(app6, {
    popupRedirectResolver: browserPopupRedirectResolver,
    persistence: [
      indexedDBLocalPersistence,
      browserLocalPersistence,
      browserSessionPersistence
    ]
  });
  const authTokenSyncUrl = getExperimentalSetting("authTokenSyncURL");
  if (authTokenSyncUrl) {
    const mintCookie = mintCookieFactory(authTokenSyncUrl);
    beforeAuthStateChanged(auth, mintCookie, () => mintCookie(auth.currentUser));
    onIdTokenChanged(auth, (user) => mintCookie(user));
  }
  const authEmulatorHost = getDefaultEmulatorHost("auth");
  if (authEmulatorHost) {
    connectAuthEmulator(auth, `http://${authEmulatorHost}`);
  }
  return auth;
};
var getScriptParentElement = function() {
  var _a, _b;
  return (_b = (_a = document.getElementsByTagName("head")) === null || _a === undefined ? undefined : _a[0]) !== null && _b !== undefined ? _b : document;
};
var prodErrorMap = _prodErrorMap;
var _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
var logClient = new Logger("@firebase/auth");

class Delay {
  constructor(shortDelay, longDelay) {
    this.shortDelay = shortDelay;
    this.longDelay = longDelay;
    debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
    this.isMobile = isMobileCordova() || isReactNative();
  }
  get() {
    if (!_isOnline()) {
      return Math.min(5000, this.shortDelay);
    }
    return this.isMobile ? this.longDelay : this.shortDelay;
  }
}

class FetchProvider {
  static initialize(fetchImpl, headersImpl, responseImpl) {
    this.fetchImpl = fetchImpl;
    if (headersImpl) {
      this.headersImpl = headersImpl;
    }
    if (responseImpl) {
      this.responseImpl = responseImpl;
    }
  }
  static fetch() {
    if (this.fetchImpl) {
      return this.fetchImpl;
    }
    if (typeof self !== "undefined" && "fetch" in self) {
      return self.fetch;
    }
    if (typeof globalThis !== "undefined" && globalThis.fetch) {
      return globalThis.fetch;
    }
    if (typeof fetch !== "undefined") {
      return fetch;
    }
    debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static headers() {
    if (this.headersImpl) {
      return this.headersImpl;
    }
    if (typeof self !== "undefined" && "Headers" in self) {
      return self.Headers;
    }
    if (typeof globalThis !== "undefined" && globalThis.Headers) {
      return globalThis.Headers;
    }
    if (typeof Headers !== "undefined") {
      return Headers;
    }
    debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static response() {
    if (this.responseImpl) {
      return this.responseImpl;
    }
    if (typeof self !== "undefined" && "Response" in self) {
      return self.Response;
    }
    if (typeof globalThis !== "undefined" && globalThis.Response) {
      return globalThis.Response;
    }
    if (typeof Response !== "undefined") {
      return Response;
    }
    debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
}
var SERVER_ERROR_MAP = {
  ["CREDENTIAL_MISMATCH"]: "custom-token-mismatch",
  ["MISSING_CUSTOM_TOKEN"]: "internal-error",
  ["INVALID_IDENTIFIER"]: "invalid-email",
  ["MISSING_CONTINUE_URI"]: "internal-error",
  ["INVALID_PASSWORD"]: "wrong-password",
  ["MISSING_PASSWORD"]: "missing-password",
  ["INVALID_LOGIN_CREDENTIALS"]: "invalid-credential",
  ["EMAIL_EXISTS"]: "email-already-in-use",
  ["PASSWORD_LOGIN_DISABLED"]: "operation-not-allowed",
  ["INVALID_IDP_RESPONSE"]: "invalid-credential",
  ["INVALID_PENDING_TOKEN"]: "invalid-credential",
  ["FEDERATED_USER_ID_ALREADY_LINKED"]: "credential-already-in-use",
  ["MISSING_REQ_TYPE"]: "internal-error",
  ["EMAIL_NOT_FOUND"]: "user-not-found",
  ["RESET_PASSWORD_EXCEED_LIMIT"]: "too-many-requests",
  ["EXPIRED_OOB_CODE"]: "expired-action-code",
  ["INVALID_OOB_CODE"]: "invalid-action-code",
  ["MISSING_OOB_CODE"]: "internal-error",
  ["CREDENTIAL_TOO_OLD_LOGIN_AGAIN"]: "requires-recent-login",
  ["INVALID_ID_TOKEN"]: "invalid-user-token",
  ["TOKEN_EXPIRED"]: "user-token-expired",
  ["USER_NOT_FOUND"]: "user-token-expired",
  ["TOO_MANY_ATTEMPTS_TRY_LATER"]: "too-many-requests",
  ["PASSWORD_DOES_NOT_MEET_REQUIREMENTS"]: "password-does-not-meet-requirements",
  ["INVALID_CODE"]: "invalid-verification-code",
  ["INVALID_SESSION_INFO"]: "invalid-verification-id",
  ["INVALID_TEMPORARY_PROOF"]: "invalid-credential",
  ["MISSING_SESSION_INFO"]: "missing-verification-id",
  ["SESSION_EXPIRED"]: "code-expired",
  ["MISSING_ANDROID_PACKAGE_NAME"]: "missing-android-pkg-name",
  ["UNAUTHORIZED_DOMAIN"]: "unauthorized-continue-uri",
  ["INVALID_OAUTH_CLIENT_ID"]: "invalid-oauth-client-id",
  ["ADMIN_ONLY_OPERATION"]: "admin-restricted-operation",
  ["INVALID_MFA_PENDING_CREDENTIAL"]: "invalid-multi-factor-session",
  ["MFA_ENROLLMENT_NOT_FOUND"]: "multi-factor-info-not-found",
  ["MISSING_MFA_ENROLLMENT_ID"]: "missing-multi-factor-info",
  ["MISSING_MFA_PENDING_CREDENTIAL"]: "missing-multi-factor-session",
  ["SECOND_FACTOR_EXISTS"]: "second-factor-already-in-use",
  ["SECOND_FACTOR_LIMIT_EXCEEDED"]: "maximum-second-factor-count-exceeded",
  ["BLOCKING_FUNCTION_ERROR_RESPONSE"]: "internal-error",
  ["RECAPTCHA_NOT_ENABLED"]: "recaptcha-not-enabled",
  ["MISSING_RECAPTCHA_TOKEN"]: "missing-recaptcha-token",
  ["INVALID_RECAPTCHA_TOKEN"]: "invalid-recaptcha-token",
  ["INVALID_RECAPTCHA_ACTION"]: "invalid-recaptcha-action",
  ["MISSING_CLIENT_TYPE"]: "missing-client-type",
  ["MISSING_RECAPTCHA_VERSION"]: "missing-recaptcha-version",
  ["INVALID_RECAPTCHA_VERSION"]: "invalid-recaptcha-version",
  ["INVALID_REQ_TYPE"]: "invalid-req-type"
};
var DEFAULT_API_TIMEOUT_MS = new Delay(30000, 60000);

class NetworkTimeout {
  constructor(auth) {
    this.auth = auth;
    this.timer = null;
    this.promise = new Promise((_, reject) => {
      this.timer = setTimeout(() => {
        return reject(_createError(this.auth, "network-request-failed"));
      }, DEFAULT_API_TIMEOUT_MS.get());
    });
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
}

class RecaptchaConfig {
  constructor(response) {
    this.siteKey = "";
    this.recaptchaEnforcementState = [];
    if (response.recaptchaKey === undefined) {
      throw new Error("recaptchaKey undefined");
    }
    this.siteKey = response.recaptchaKey.split("/")[3];
    this.recaptchaEnforcementState = response.recaptchaEnforcementState;
  }
  getProviderEnforcementState(providerStr) {
    if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
      return null;
    }
    for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
      if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
        return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
      }
    }
    return null;
  }
  isProviderEnabled(providerStr) {
    return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
  }
}

class ProactiveRefresh {
  constructor(user) {
    this.user = user;
    this.isRunning = false;
    this.timerId = null;
    this.errorBackoff = 30000;
  }
  _start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.schedule();
  }
  _stop() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }
  }
  getInterval(wasError) {
    var _a;
    if (wasError) {
      const interval = this.errorBackoff;
      this.errorBackoff = Math.min(this.errorBackoff * 2, 960000);
      return interval;
    } else {
      this.errorBackoff = 30000;
      const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== undefined ? _a : 0;
      const interval = expTime - Date.now() - 300000;
      return Math.max(0, interval);
    }
  }
  schedule(wasError = false) {
    if (!this.isRunning) {
      return;
    }
    const interval = this.getInterval(wasError);
    this.timerId = setTimeout(async () => {
      await this.iteration();
    }, interval);
  }
  async iteration() {
    try {
      await this.user.getIdToken(true);
    } catch (e) {
      if ((e === null || e === undefined ? undefined : e.code) === `auth/${"network-request-failed"}`) {
        this.schedule(true);
      }
      return;
    }
    this.schedule();
  }
}

class UserMetadata {
  constructor(createdAt, lastLoginAt) {
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
    this._initializeTime();
  }
  _initializeTime() {
    this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
    this.creationTime = utcTimestampToDateString(this.createdAt);
  }
  _copy(metadata) {
    this.createdAt = metadata.createdAt;
    this.lastLoginAt = metadata.lastLoginAt;
    this._initializeTime();
  }
  toJSON() {
    return {
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt
    };
  }
}

class StsTokenManager {
  constructor() {
    this.refreshToken = null;
    this.accessToken = null;
    this.expirationTime = null;
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 30000;
  }
  updateFromServerResponse(response) {
    _assert(response.idToken, "internal-error");
    _assert(typeof response.idToken !== "undefined", "internal-error");
    _assert(typeof response.refreshToken !== "undefined", "internal-error");
    const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
    this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
  }
  async getToken(auth, forceRefresh = false) {
    _assert(!this.accessToken || this.refreshToken, auth, "user-token-expired");
    if (!forceRefresh && this.accessToken && !this.isExpired) {
      return this.accessToken;
    }
    if (this.refreshToken) {
      await this.refresh(auth, this.refreshToken);
      return this.accessToken;
    }
    return null;
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  async refresh(auth, oldToken) {
    const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth, oldToken);
    this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
  }
  updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
    this.refreshToken = refreshToken || null;
    this.accessToken = accessToken || null;
    this.expirationTime = Date.now() + expiresInSec * 1000;
  }
  static fromJSON(appName, object) {
    const { refreshToken, accessToken, expirationTime } = object;
    const manager = new StsTokenManager;
    if (refreshToken) {
      _assert(typeof refreshToken === "string", "internal-error", {
        appName
      });
      manager.refreshToken = refreshToken;
    }
    if (accessToken) {
      _assert(typeof accessToken === "string", "internal-error", {
        appName
      });
      manager.accessToken = accessToken;
    }
    if (expirationTime) {
      _assert(typeof expirationTime === "number", "internal-error", {
        appName
      });
      manager.expirationTime = expirationTime;
    }
    return manager;
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime
    };
  }
  _assign(stsTokenManager) {
    this.accessToken = stsTokenManager.accessToken;
    this.refreshToken = stsTokenManager.refreshToken;
    this.expirationTime = stsTokenManager.expirationTime;
  }
  _clone() {
    return Object.assign(new StsTokenManager, this.toJSON());
  }
  _performRefresh() {
    return debugFail("not implemented");
  }
}

class UserImpl {
  constructor(_a) {
    var { uid, auth, stsTokenManager } = _a, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
    this.providerId = "firebase";
    this.proactiveRefresh = new ProactiveRefresh(this);
    this.reloadUserInfo = null;
    this.reloadListener = null;
    this.uid = uid;
    this.auth = auth;
    this.stsTokenManager = stsTokenManager;
    this.accessToken = stsTokenManager.accessToken;
    this.displayName = opt.displayName || null;
    this.email = opt.email || null;
    this.emailVerified = opt.emailVerified || false;
    this.phoneNumber = opt.phoneNumber || null;
    this.photoURL = opt.photoURL || null;
    this.isAnonymous = opt.isAnonymous || false;
    this.tenantId = opt.tenantId || null;
    this.providerData = opt.providerData ? [...opt.providerData] : [];
    this.metadata = new UserMetadata(opt.createdAt || undefined, opt.lastLoginAt || undefined);
  }
  async getIdToken(forceRefresh) {
    const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
    _assert(accessToken, this.auth, "internal-error");
    if (this.accessToken !== accessToken) {
      this.accessToken = accessToken;
      await this.auth._persistUserIfCurrent(this);
      this.auth._notifyListenersIfCurrent(this);
    }
    return accessToken;
  }
  getIdTokenResult(forceRefresh) {
    return getIdTokenResult(this, forceRefresh);
  }
  reload() {
    return reload(this);
  }
  _assign(user) {
    if (this === user) {
      return;
    }
    _assert(this.uid === user.uid, this.auth, "internal-error");
    this.displayName = user.displayName;
    this.photoURL = user.photoURL;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.phoneNumber = user.phoneNumber;
    this.isAnonymous = user.isAnonymous;
    this.tenantId = user.tenantId;
    this.providerData = user.providerData.map((userInfo) => Object.assign({}, userInfo));
    this.metadata._copy(user.metadata);
    this.stsTokenManager._assign(user.stsTokenManager);
  }
  _clone(auth) {
    const newUser = new UserImpl(Object.assign(Object.assign({}, this), { auth, stsTokenManager: this.stsTokenManager._clone() }));
    newUser.metadata._copy(this.metadata);
    return newUser;
  }
  _onReload(callback) {
    _assert(!this.reloadListener, this.auth, "internal-error");
    this.reloadListener = callback;
    if (this.reloadUserInfo) {
      this._notifyReloadListener(this.reloadUserInfo);
      this.reloadUserInfo = null;
    }
  }
  _notifyReloadListener(userInfo) {
    if (this.reloadListener) {
      this.reloadListener(userInfo);
    } else {
      this.reloadUserInfo = userInfo;
    }
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start();
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop();
  }
  async _updateTokensIfNecessary(response, reload2 = false) {
    let tokensRefreshed = false;
    if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
      this.stsTokenManager.updateFromServerResponse(response);
      tokensRefreshed = true;
    }
    if (reload2) {
      await _reloadWithoutSaving(this);
    }
    await this.auth._persistUserIfCurrent(this);
    if (tokensRefreshed) {
      this.auth._notifyListenersIfCurrent(this);
    }
  }
  async delete() {
    const idToken = await this.getIdToken();
    await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
    this.stsTokenManager.clearRefreshToken();
    return this.auth.signOut();
  }
  toJSON() {
    return Object.assign(Object.assign({
      uid: this.uid,
      email: this.email || undefined,
      emailVerified: this.emailVerified,
      displayName: this.displayName || undefined,
      isAnonymous: this.isAnonymous,
      photoURL: this.photoURL || undefined,
      phoneNumber: this.phoneNumber || undefined,
      tenantId: this.tenantId || undefined,
      providerData: this.providerData.map((userInfo) => Object.assign({}, userInfo)),
      stsTokenManager: this.stsTokenManager.toJSON(),
      _redirectEventId: this._redirectEventId
    }, this.metadata.toJSON()), {
      apiKey: this.auth.config.apiKey,
      appName: this.auth.name
    });
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || "";
  }
  static _fromJSON(auth, object) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const displayName = (_a = object.displayName) !== null && _a !== undefined ? _a : undefined;
    const email = (_b = object.email) !== null && _b !== undefined ? _b : undefined;
    const phoneNumber = (_c = object.phoneNumber) !== null && _c !== undefined ? _c : undefined;
    const photoURL = (_d = object.photoURL) !== null && _d !== undefined ? _d : undefined;
    const tenantId = (_e = object.tenantId) !== null && _e !== undefined ? _e : undefined;
    const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== undefined ? _f : undefined;
    const createdAt = (_g = object.createdAt) !== null && _g !== undefined ? _g : undefined;
    const lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== undefined ? _h : undefined;
    const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
    _assert(uid && plainObjectTokenManager, auth, "internal-error");
    const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
    _assert(typeof uid === "string", auth, "internal-error");
    assertStringOrUndefined(displayName, auth.name);
    assertStringOrUndefined(email, auth.name);
    _assert(typeof emailVerified === "boolean", auth, "internal-error");
    _assert(typeof isAnonymous === "boolean", auth, "internal-error");
    assertStringOrUndefined(phoneNumber, auth.name);
    assertStringOrUndefined(photoURL, auth.name);
    assertStringOrUndefined(tenantId, auth.name);
    assertStringOrUndefined(_redirectEventId, auth.name);
    assertStringOrUndefined(createdAt, auth.name);
    assertStringOrUndefined(lastLoginAt, auth.name);
    const user = new UserImpl({
      uid,
      auth,
      email,
      emailVerified,
      displayName,
      isAnonymous,
      photoURL,
      phoneNumber,
      tenantId,
      stsTokenManager,
      createdAt,
      lastLoginAt
    });
    if (providerData && Array.isArray(providerData)) {
      user.providerData = providerData.map((userInfo) => Object.assign({}, userInfo));
    }
    if (_redirectEventId) {
      user._redirectEventId = _redirectEventId;
    }
    return user;
  }
  static async _fromIdTokenResponse(auth, idTokenResponse, isAnonymous = false) {
    const stsTokenManager = new StsTokenManager;
    stsTokenManager.updateFromServerResponse(idTokenResponse);
    const user = new UserImpl({
      uid: idTokenResponse.localId,
      auth,
      stsTokenManager,
      isAnonymous
    });
    await _reloadWithoutSaving(user);
    return user;
  }
}
var instanceCache = new Map;

class InMemoryPersistence {
  constructor() {
    this.type = "NONE";
    this.storage = {};
  }
  async _isAvailable() {
    return true;
  }
  async _set(key, value) {
    this.storage[key] = value;
  }
  async _get(key) {
    const value = this.storage[key];
    return value === undefined ? null : value;
  }
  async _remove(key) {
    delete this.storage[key];
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
}
InMemoryPersistence.type = "NONE";
var inMemoryPersistence = InMemoryPersistence;

class PersistenceUserManager {
  constructor(persistence, auth, userKey) {
    this.persistence = persistence;
    this.auth = auth;
    this.userKey = userKey;
    const { config, name: name5 } = this.auth;
    this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name5);
    this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name5);
    this.boundEventHandler = auth._onStorageEvent.bind(auth);
    this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
  }
  setCurrentUser(user) {
    return this.persistence._set(this.fullUserKey, user.toJSON());
  }
  async getCurrentUser() {
    const blob = await this.persistence._get(this.fullUserKey);
    return blob ? UserImpl._fromJSON(this.auth, blob) : null;
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey);
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
  }
  async setPersistence(newPersistence) {
    if (this.persistence === newPersistence) {
      return;
    }
    const currentUser = await this.getCurrentUser();
    await this.removeCurrentUser();
    this.persistence = newPersistence;
    if (currentUser) {
      return this.setCurrentUser(currentUser);
    }
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static async create(auth, persistenceHierarchy, userKey = "authUser") {
    if (!persistenceHierarchy.length) {
      return new PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey);
    }
    const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
      if (await persistence._isAvailable()) {
        return persistence;
      }
      return;
    }))).filter((persistence) => persistence);
    let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
    const key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
    let userToMigrate = null;
    for (const persistence of persistenceHierarchy) {
      try {
        const blob = await persistence._get(key);
        if (blob) {
          const user = UserImpl._fromJSON(auth, blob);
          if (persistence !== selectedPersistence) {
            userToMigrate = user;
          }
          selectedPersistence = persistence;
          break;
        }
      } catch (_a) {
      }
    }
    const migrationHierarchy = availablePersistences.filter((p) => p._shouldAllowMigration);
    if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
      return new PersistenceUserManager(selectedPersistence, auth, userKey);
    }
    selectedPersistence = migrationHierarchy[0];
    if (userToMigrate) {
      await selectedPersistence._set(key, userToMigrate.toJSON());
    }
    await Promise.all(persistenceHierarchy.map(async (persistence) => {
      if (persistence !== selectedPersistence) {
        try {
          await persistence._remove(key);
        } catch (_a) {
        }
      }
    }));
    return new PersistenceUserManager(selectedPersistence, auth, userKey);
  }
}

class AuthMiddlewareQueue {
  constructor(auth) {
    this.auth = auth;
    this.queue = [];
  }
  pushCallback(callback, onAbort) {
    const wrappedCallback = (user) => new Promise((resolve, reject) => {
      try {
        const result = callback(user);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
    wrappedCallback.onAbort = onAbort;
    this.queue.push(wrappedCallback);
    const index = this.queue.length - 1;
    return () => {
      this.queue[index] = () => Promise.resolve();
    };
  }
  async runMiddleware(nextUser) {
    if (this.auth.currentUser === nextUser) {
      return;
    }
    const onAbortStack = [];
    try {
      for (const beforeStateCallback of this.queue) {
        await beforeStateCallback(nextUser);
        if (beforeStateCallback.onAbort) {
          onAbortStack.push(beforeStateCallback.onAbort);
        }
      }
    } catch (e) {
      onAbortStack.reverse();
      for (const onAbort of onAbortStack) {
        try {
          onAbort();
        } catch (_) {
        }
      }
      throw this.auth._errorFactory.create("login-blocked", {
        originalMessage: e === null || e === undefined ? undefined : e.message
      });
    }
  }
}
var MINIMUM_MIN_PASSWORD_LENGTH = 6;

class PasswordPolicyImpl {
  constructor(response) {
    var _a, _b, _c, _d;
    const responseOptions = response.customStrengthOptions;
    this.customStrengthOptions = {};
    this.customStrengthOptions.minPasswordLength = (_a = responseOptions.minPasswordLength) !== null && _a !== undefined ? _a : MINIMUM_MIN_PASSWORD_LENGTH;
    if (responseOptions.maxPasswordLength) {
      this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
    }
    if (responseOptions.containsLowercaseCharacter !== undefined) {
      this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
    }
    if (responseOptions.containsUppercaseCharacter !== undefined) {
      this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
    }
    if (responseOptions.containsNumericCharacter !== undefined) {
      this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
    }
    if (responseOptions.containsNonAlphanumericCharacter !== undefined) {
      this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
    }
    this.enforcementState = response.enforcementState;
    if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
      this.enforcementState = "OFF";
    }
    this.allowedNonAlphanumericCharacters = (_c = (_b = response.allowedNonAlphanumericCharacters) === null || _b === undefined ? undefined : _b.join("")) !== null && _c !== undefined ? _c : "";
    this.forceUpgradeOnSignin = (_d = response.forceUpgradeOnSignin) !== null && _d !== undefined ? _d : false;
    this.schemaVersion = response.schemaVersion;
  }
  validatePassword(password) {
    var _a, _b, _c, _d, _e, _f;
    const status = {
      isValid: true,
      passwordPolicy: this
    };
    this.validatePasswordLengthOptions(password, status);
    this.validatePasswordCharacterOptions(password, status);
    status.isValid && (status.isValid = (_a = status.meetsMinPasswordLength) !== null && _a !== undefined ? _a : true);
    status.isValid && (status.isValid = (_b = status.meetsMaxPasswordLength) !== null && _b !== undefined ? _b : true);
    status.isValid && (status.isValid = (_c = status.containsLowercaseLetter) !== null && _c !== undefined ? _c : true);
    status.isValid && (status.isValid = (_d = status.containsUppercaseLetter) !== null && _d !== undefined ? _d : true);
    status.isValid && (status.isValid = (_e = status.containsNumericCharacter) !== null && _e !== undefined ? _e : true);
    status.isValid && (status.isValid = (_f = status.containsNonAlphanumericCharacter) !== null && _f !== undefined ? _f : true);
    return status;
  }
  validatePasswordLengthOptions(password, status) {
    const minPasswordLength = this.customStrengthOptions.minPasswordLength;
    const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
    if (minPasswordLength) {
      status.meetsMinPasswordLength = password.length >= minPasswordLength;
    }
    if (maxPasswordLength) {
      status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
    }
  }
  validatePasswordCharacterOptions(password, status) {
    this.updatePasswordCharacterOptionsStatuses(status, false, false, false, false);
    let passwordChar;
    for (let i = 0;i < password.length; i++) {
      passwordChar = password.charAt(i);
      this.updatePasswordCharacterOptionsStatuses(status, passwordChar >= "a" && passwordChar <= "z", passwordChar >= "A" && passwordChar <= "Z", passwordChar >= "0" && passwordChar <= "9", this.allowedNonAlphanumericCharacters.includes(passwordChar));
    }
  }
  updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
    if (this.customStrengthOptions.containsLowercaseLetter) {
      status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
    }
    if (this.customStrengthOptions.containsUppercaseLetter) {
      status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
    }
    if (this.customStrengthOptions.containsNumericCharacter) {
      status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
    }
    if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
      status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
    }
  }
}

class AuthImpl {
  constructor(app6, heartbeatServiceProvider, appCheckServiceProvider, config) {
    this.app = app6;
    this.heartbeatServiceProvider = heartbeatServiceProvider;
    this.appCheckServiceProvider = appCheckServiceProvider;
    this.config = config;
    this.currentUser = null;
    this.emulatorConfig = null;
    this.operations = Promise.resolve();
    this.authStateSubscription = new Subscription(this);
    this.idTokenSubscription = new Subscription(this);
    this.beforeStateQueue = new AuthMiddlewareQueue(this);
    this.redirectUser = null;
    this.isProactiveRefreshEnabled = false;
    this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
    this._canInitEmulator = true;
    this._isInitialized = false;
    this._deleted = false;
    this._initializationPromise = null;
    this._popupRedirectResolver = null;
    this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
    this._agentRecaptchaConfig = null;
    this._tenantRecaptchaConfigs = {};
    this._projectPasswordPolicy = null;
    this._tenantPasswordPolicies = {};
    this.lastNotifiedUid = undefined;
    this.languageCode = null;
    this.tenantId = null;
    this.settings = { appVerificationDisabledForTesting: false };
    this.frameworks = [];
    this.name = app6.name;
    this.clientVersion = config.sdkClientVersion;
  }
  _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
    if (popupRedirectResolver) {
      this._popupRedirectResolver = _getInstance(popupRedirectResolver);
    }
    this._initializationPromise = this.queue(async () => {
      var _a, _b;
      if (this._deleted) {
        return;
      }
      this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
      if (this._deleted) {
        return;
      }
      if ((_a = this._popupRedirectResolver) === null || _a === undefined ? undefined : _a._shouldInitProactively) {
        try {
          await this._popupRedirectResolver._initialize(this);
        } catch (e) {
        }
      }
      await this.initializeCurrentUser(popupRedirectResolver);
      this.lastNotifiedUid = ((_b = this.currentUser) === null || _b === undefined ? undefined : _b.uid) || null;
      if (this._deleted) {
        return;
      }
      this._isInitialized = true;
    });
    return this._initializationPromise;
  }
  async _onStorageEvent() {
    if (this._deleted) {
      return;
    }
    const user = await this.assertedPersistence.getCurrentUser();
    if (!this.currentUser && !user) {
      return;
    }
    if (this.currentUser && user && this.currentUser.uid === user.uid) {
      this._currentUser._assign(user);
      await this.currentUser.getIdToken();
      return;
    }
    await this._updateCurrentUser(user, true);
  }
  async initializeCurrentUser(popupRedirectResolver) {
    var _a;
    const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
    let futureCurrentUser = previouslyStoredUser;
    let needsTocheckMiddleware = false;
    if (popupRedirectResolver && this.config.authDomain) {
      await this.getOrInitRedirectPersistenceManager();
      const redirectUserEventId = (_a = this.redirectUser) === null || _a === undefined ? undefined : _a._redirectEventId;
      const storedUserEventId = futureCurrentUser === null || futureCurrentUser === undefined ? undefined : futureCurrentUser._redirectEventId;
      const result = await this.tryRedirectSignIn(popupRedirectResolver);
      if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (result === null || result === undefined ? undefined : result.user)) {
        futureCurrentUser = result.user;
        needsTocheckMiddleware = true;
      }
    }
    if (!futureCurrentUser) {
      return this.directlySetCurrentUser(null);
    }
    if (!futureCurrentUser._redirectEventId) {
      if (needsTocheckMiddleware) {
        try {
          await this.beforeStateQueue.runMiddleware(futureCurrentUser);
        } catch (e) {
          futureCurrentUser = previouslyStoredUser;
          this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
        }
      }
      if (futureCurrentUser) {
        return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
      } else {
        return this.directlySetCurrentUser(null);
      }
    }
    _assert(this._popupRedirectResolver, this, "argument-error");
    await this.getOrInitRedirectPersistenceManager();
    if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
      return this.directlySetCurrentUser(futureCurrentUser);
    }
    return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
  }
  async tryRedirectSignIn(redirectResolver) {
    let result = null;
    try {
      result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
    } catch (e) {
      await this._setRedirectUser(null);
    }
    return result;
  }
  async reloadAndSetCurrentUserOrClear(user) {
    try {
      await _reloadWithoutSaving(user);
    } catch (e) {
      if ((e === null || e === undefined ? undefined : e.code) !== `auth/${"network-request-failed"}`) {
        return this.directlySetCurrentUser(null);
      }
    }
    return this.directlySetCurrentUser(user);
  }
  useDeviceLanguage() {
    this.languageCode = _getUserLanguage();
  }
  async _delete() {
    this._deleted = true;
  }
  async updateCurrentUser(userExtern) {
    const user = userExtern ? getModularInstance(userExtern) : null;
    if (user) {
      _assert(user.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token");
    }
    return this._updateCurrentUser(user && user._clone(this));
  }
  async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
    if (this._deleted) {
      return;
    }
    if (user) {
      _assert(this.tenantId === user.tenantId, this, "tenant-id-mismatch");
    }
    if (!skipBeforeStateCallbacks) {
      await this.beforeStateQueue.runMiddleware(user);
    }
    return this.queue(async () => {
      await this.directlySetCurrentUser(user);
      this.notifyAuthListeners();
    });
  }
  async signOut() {
    await this.beforeStateQueue.runMiddleware(null);
    if (this.redirectPersistenceManager || this._popupRedirectResolver) {
      await this._setRedirectUser(null);
    }
    return this._updateCurrentUser(null, true);
  }
  setPersistence(persistence) {
    return this.queue(async () => {
      await this.assertedPersistence.setPersistence(_getInstance(persistence));
    });
  }
  _getRecaptchaConfig() {
    if (this.tenantId == null) {
      return this._agentRecaptchaConfig;
    } else {
      return this._tenantRecaptchaConfigs[this.tenantId];
    }
  }
  async validatePassword(password) {
    if (!this._getPasswordPolicyInternal()) {
      await this._updatePasswordPolicy();
    }
    const passwordPolicy = this._getPasswordPolicyInternal();
    if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
      return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
    }
    return passwordPolicy.validatePassword(password);
  }
  _getPasswordPolicyInternal() {
    if (this.tenantId === null) {
      return this._projectPasswordPolicy;
    } else {
      return this._tenantPasswordPolicies[this.tenantId];
    }
  }
  async _updatePasswordPolicy() {
    const response = await _getPasswordPolicy(this);
    const passwordPolicy = new PasswordPolicyImpl(response);
    if (this.tenantId === null) {
      this._projectPasswordPolicy = passwordPolicy;
    } else {
      this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
    }
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type;
  }
  _updateErrorMap(errorMap) {
    this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
  }
  onAuthStateChanged(nextOrObserver, error, completed) {
    return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
  }
  beforeAuthStateChanged(callback, onAbort) {
    return this.beforeStateQueue.pushCallback(callback, onAbort);
  }
  onIdTokenChanged(nextOrObserver, error, completed) {
    return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
  }
  authStateReady() {
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        resolve();
      } else {
        const unsubscribe = this.onAuthStateChanged(() => {
          unsubscribe();
          resolve();
        }, reject);
      }
    });
  }
  async revokeAccessToken(token) {
    if (this.currentUser) {
      const idToken = await this.currentUser.getIdToken();
      const request = {
        providerId: "apple.com",
        tokenType: "ACCESS_TOKEN",
        token,
        idToken
      };
      if (this.tenantId != null) {
        request.tenantId = this.tenantId;
      }
      await revokeToken(this, request);
    }
  }
  toJSON() {
    var _a;
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser: (_a = this._currentUser) === null || _a === undefined ? undefined : _a.toJSON()
    };
  }
  async _setRedirectUser(user, popupRedirectResolver) {
    const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
    return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
  }
  async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
    if (!this.redirectPersistenceManager) {
      const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
      _assert(resolver, this, "argument-error");
      this.redirectPersistenceManager = await PersistenceUserManager.create(this, [_getInstance(resolver._redirectPersistence)], "redirectUser");
      this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
    }
    return this.redirectPersistenceManager;
  }
  async _redirectUserForId(id) {
    var _a, _b;
    if (this._isInitialized) {
      await this.queue(async () => {
      });
    }
    if (((_a = this._currentUser) === null || _a === undefined ? undefined : _a._redirectEventId) === id) {
      return this._currentUser;
    }
    if (((_b = this.redirectUser) === null || _b === undefined ? undefined : _b._redirectEventId) === id) {
      return this.redirectUser;
    }
    return null;
  }
  async _persistUserIfCurrent(user) {
    if (user === this.currentUser) {
      return this.queue(async () => this.directlySetCurrentUser(user));
    }
  }
  _notifyListenersIfCurrent(user) {
    if (user === this.currentUser) {
      this.notifyAuthListeners();
    }
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
  }
  _startProactiveRefresh() {
    this.isProactiveRefreshEnabled = true;
    if (this.currentUser) {
      this._currentUser._startProactiveRefresh();
    }
  }
  _stopProactiveRefresh() {
    this.isProactiveRefreshEnabled = false;
    if (this.currentUser) {
      this._currentUser._stopProactiveRefresh();
    }
  }
  get _currentUser() {
    return this.currentUser;
  }
  notifyAuthListeners() {
    var _a, _b;
    if (!this._isInitialized) {
      return;
    }
    this.idTokenSubscription.next(this.currentUser);
    const currentUid = (_b = (_a = this.currentUser) === null || _a === undefined ? undefined : _a.uid) !== null && _b !== undefined ? _b : null;
    if (this.lastNotifiedUid !== currentUid) {
      this.lastNotifiedUid = currentUid;
      this.authStateSubscription.next(this.currentUser);
    }
  }
  registerStateListener(subscription, nextOrObserver, error, completed) {
    if (this._deleted) {
      return () => {
      };
    }
    const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
    let isUnsubscribed = false;
    const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
    _assert(promise, this, "internal-error");
    promise.then(() => {
      if (isUnsubscribed) {
        return;
      }
      cb(this.currentUser);
    });
    if (typeof nextOrObserver === "function") {
      const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    } else {
      const unsubscribe = subscription.addObserver(nextOrObserver);
      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    }
  }
  async directlySetCurrentUser(user) {
    if (this.currentUser && this.currentUser !== user) {
      this._currentUser._stopProactiveRefresh();
    }
    if (user && this.isProactiveRefreshEnabled) {
      user._startProactiveRefresh();
    }
    this.currentUser = user;
    if (user) {
      await this.assertedPersistence.setCurrentUser(user);
    } else {
      await this.assertedPersistence.removeCurrentUser();
    }
  }
  queue(action) {
    this.operations = this.operations.then(action, action);
    return this.operations;
  }
  get assertedPersistence() {
    _assert(this.persistenceManager, this, "internal-error");
    return this.persistenceManager;
  }
  _logFramework(framework) {
    if (!framework || this.frameworks.includes(framework)) {
      return;
    }
    this.frameworks.push(framework);
    this.frameworks.sort();
    this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
  }
  _getFrameworks() {
    return this.frameworks;
  }
  async _getAdditionalHeaders() {
    var _a;
    const headers = {
      ["X-Client-Version"]: this.clientVersion
    };
    if (this.app.options.appId) {
      headers["X-Firebase-gmpid"] = this.app.options.appId;
    }
    const heartbeatsHeader = await ((_a = this.heartbeatServiceProvider.getImmediate({
      optional: true
    })) === null || _a === undefined ? undefined : _a.getHeartbeatsHeader());
    if (heartbeatsHeader) {
      headers["X-Firebase-Client"] = heartbeatsHeader;
    }
    const appCheckToken = await this._getAppCheckToken();
    if (appCheckToken) {
      headers["X-Firebase-AppCheck"] = appCheckToken;
    }
    return headers;
  }
  async _getAppCheckToken() {
    var _a;
    const appCheckTokenResult = await ((_a = this.appCheckServiceProvider.getImmediate({ optional: true })) === null || _a === undefined ? undefined : _a.getToken());
    if (appCheckTokenResult === null || appCheckTokenResult === undefined ? undefined : appCheckTokenResult.error) {
      _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
    }
    return appCheckTokenResult === null || appCheckTokenResult === undefined ? undefined : appCheckTokenResult.token;
  }
}

class Subscription {
  constructor(auth) {
    this.auth = auth;
    this.observer = null;
    this.addObserver = createSubscribe((observer) => this.observer = observer);
  }
  get next() {
    _assert(this.observer, this.auth, "internal-error");
    return this.observer.next.bind(this.observer);
  }
}
var externalJSProvider = {
  async loadJS() {
    throw new Error("Unable to load external scripts");
  },
  recaptchaV2Script: "",
  recaptchaEnterpriseScript: "",
  gapiScript: ""
};
var RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
var FAKE_TOKEN = "NO_RECAPTCHA";

class RecaptchaEnterpriseVerifier {
  constructor(authExtern) {
    this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
    this.auth = _castAuth(authExtern);
  }
  async verify(action = "verify", forceRefresh = false) {
    async function retrieveSiteKey(auth) {
      if (!forceRefresh) {
        if (auth.tenantId == null && auth._agentRecaptchaConfig != null) {
          return auth._agentRecaptchaConfig.siteKey;
        }
        if (auth.tenantId != null && auth._tenantRecaptchaConfigs[auth.tenantId] !== undefined) {
          return auth._tenantRecaptchaConfigs[auth.tenantId].siteKey;
        }
      }
      return new Promise(async (resolve, reject) => {
        getRecaptchaConfig(auth, {
          clientType: "CLIENT_TYPE_WEB",
          version: "RECAPTCHA_ENTERPRISE"
        }).then((response) => {
          if (response.recaptchaKey === undefined) {
            reject(new Error("recaptcha Enterprise site key undefined"));
          } else {
            const config = new RecaptchaConfig(response);
            if (auth.tenantId == null) {
              auth._agentRecaptchaConfig = config;
            } else {
              auth._tenantRecaptchaConfigs[auth.tenantId] = config;
            }
            return resolve(config.siteKey);
          }
        }).catch((error) => {
          reject(error);
        });
      });
    }
    function retrieveRecaptchaToken(siteKey, resolve, reject) {
      const grecaptcha = window.grecaptcha;
      if (isEnterprise(grecaptcha)) {
        grecaptcha.enterprise.ready(() => {
          grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
            resolve(token);
          }).catch(() => {
            resolve(FAKE_TOKEN);
          });
        });
      } else {
        reject(Error("No reCAPTCHA enterprise script loaded."));
      }
    }
    return new Promise((resolve, reject) => {
      retrieveSiteKey(this.auth).then((siteKey) => {
        if (!forceRefresh && isEnterprise(window.grecaptcha)) {
          retrieveRecaptchaToken(siteKey, resolve, reject);
        } else {
          if (typeof window === "undefined") {
            reject(new Error("RecaptchaVerifier is only supported in browser"));
            return;
          }
          let url = _recaptchaEnterpriseScriptUrl();
          if (url.length !== 0) {
            url += siteKey;
          }
          _loadJS(url).then(() => {
            retrieveRecaptchaToken(siteKey, resolve, reject);
          }).catch((error) => {
            reject(error);
          });
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

class AuthCredential {
  constructor(providerId, signInMethod) {
    this.providerId = providerId;
    this.signInMethod = signInMethod;
  }
  toJSON() {
    return debugFail("not implemented");
  }
  _getIdTokenResponse(_auth) {
    return debugFail("not implemented");
  }
  _linkToIdToken(_auth, _idToken) {
    return debugFail("not implemented");
  }
  _getReauthenticationResolver(_auth) {
    return debugFail("not implemented");
  }
}

class EmailAuthCredential extends AuthCredential {
  constructor(_email, _password, signInMethod, _tenantId = null) {
    super("password", signInMethod);
    this._email = _email;
    this._password = _password;
    this._tenantId = _tenantId;
  }
  static _fromEmailAndPassword(email, password) {
    return new EmailAuthCredential(email, password, "password");
  }
  static _fromEmailAndCode(email, oobCode, tenantId = null) {
    return new EmailAuthCredential(email, oobCode, "emailLink", tenantId);
  }
  toJSON() {
    return {
      email: this._email,
      password: this._password,
      signInMethod: this.signInMethod,
      tenantId: this._tenantId
    };
  }
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    if ((obj === null || obj === undefined ? undefined : obj.email) && (obj === null || obj === undefined ? undefined : obj.password)) {
      if (obj.signInMethod === "password") {
        return this._fromEmailAndPassword(obj.email, obj.password);
      } else if (obj.signInMethod === "emailLink") {
        return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
      }
    }
    return null;
  }
  async _getIdTokenResponse(auth) {
    switch (this.signInMethod) {
      case "password":
        const request = {
          returnSecureToken: true,
          email: this._email,
          password: this._password,
          clientType: "CLIENT_TYPE_WEB"
        };
        return handleRecaptchaFlow(auth, request, "signInWithPassword", signInWithPassword);
      case "emailLink":
        return signInWithEmailLink$1(auth, {
          email: this._email,
          oobCode: this._password
        });
      default:
        _fail(auth, "internal-error");
    }
  }
  async _linkToIdToken(auth, idToken) {
    switch (this.signInMethod) {
      case "password":
        const request = {
          idToken,
          returnSecureToken: true,
          email: this._email,
          password: this._password,
          clientType: "CLIENT_TYPE_WEB"
        };
        return handleRecaptchaFlow(auth, request, "signUpPassword", linkEmailPassword);
      case "emailLink":
        return signInWithEmailLinkForLinking(auth, {
          idToken,
          email: this._email,
          oobCode: this._password
        });
      default:
        _fail(auth, "internal-error");
    }
  }
  _getReauthenticationResolver(auth) {
    return this._getIdTokenResponse(auth);
  }
}
var IDP_REQUEST_URI$1 = "http://localhost";

class OAuthCredential extends AuthCredential {
  constructor() {
    super(...arguments);
    this.pendingToken = null;
  }
  static _fromParams(params) {
    const cred = new OAuthCredential(params.providerId, params.signInMethod);
    if (params.idToken || params.accessToken) {
      if (params.idToken) {
        cred.idToken = params.idToken;
      }
      if (params.accessToken) {
        cred.accessToken = params.accessToken;
      }
      if (params.nonce && !params.pendingToken) {
        cred.nonce = params.nonce;
      }
      if (params.pendingToken) {
        cred.pendingToken = params.pendingToken;
      }
    } else if (params.oauthToken && params.oauthTokenSecret) {
      cred.accessToken = params.oauthToken;
      cred.secret = params.oauthTokenSecret;
    } else {
      _fail("argument-error");
    }
    return cred;
  }
  toJSON() {
    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      secret: this.secret,
      nonce: this.nonce,
      pendingToken: this.pendingToken,
      providerId: this.providerId,
      signInMethod: this.signInMethod
    };
  }
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    const { providerId, signInMethod } = obj, rest = __rest(obj, ["providerId", "signInMethod"]);
    if (!providerId || !signInMethod) {
      return null;
    }
    const cred = new OAuthCredential(providerId, signInMethod);
    cred.idToken = rest.idToken || undefined;
    cred.accessToken = rest.accessToken || undefined;
    cred.secret = rest.secret;
    cred.nonce = rest.nonce;
    cred.pendingToken = rest.pendingToken || null;
    return cred;
  }
  _getIdTokenResponse(auth) {
    const request = this.buildRequest();
    return signInWithIdp(auth, request);
  }
  _linkToIdToken(auth, idToken) {
    const request = this.buildRequest();
    request.idToken = idToken;
    return signInWithIdp(auth, request);
  }
  _getReauthenticationResolver(auth) {
    const request = this.buildRequest();
    request.autoCreate = false;
    return signInWithIdp(auth, request);
  }
  buildRequest() {
    const request = {
      requestUri: IDP_REQUEST_URI$1,
      returnSecureToken: true
    };
    if (this.pendingToken) {
      request.pendingToken = this.pendingToken;
    } else {
      const postBody = {};
      if (this.idToken) {
        postBody["id_token"] = this.idToken;
      }
      if (this.accessToken) {
        postBody["access_token"] = this.accessToken;
      }
      if (this.secret) {
        postBody["oauth_token_secret"] = this.secret;
      }
      postBody["providerId"] = this.providerId;
      if (this.nonce && !this.pendingToken) {
        postBody["nonce"] = this.nonce;
      }
      request.postBody = querystring(postBody);
    }
    return request;
  }
}
var VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
  ["USER_NOT_FOUND"]: "user-not-found"
};

class PhoneAuthCredential extends AuthCredential {
  constructor(params) {
    super("phone", "phone");
    this.params = params;
  }
  static _fromVerification(verificationId, verificationCode) {
    return new PhoneAuthCredential({ verificationId, verificationCode });
  }
  static _fromTokenResponse(phoneNumber, temporaryProof) {
    return new PhoneAuthCredential({ phoneNumber, temporaryProof });
  }
  _getIdTokenResponse(auth) {
    return signInWithPhoneNumber$1(auth, this._makeVerificationRequest());
  }
  _linkToIdToken(auth, idToken) {
    return linkWithPhoneNumber$1(auth, Object.assign({ idToken }, this._makeVerificationRequest()));
  }
  _getReauthenticationResolver(auth) {
    return verifyPhoneNumberForExisting(auth, this._makeVerificationRequest());
  }
  _makeVerificationRequest() {
    const { temporaryProof, phoneNumber, verificationId, verificationCode } = this.params;
    if (temporaryProof && phoneNumber) {
      return { temporaryProof, phoneNumber };
    }
    return {
      sessionInfo: verificationId,
      code: verificationCode
    };
  }
  toJSON() {
    const obj = {
      providerId: this.providerId
    };
    if (this.params.phoneNumber) {
      obj.phoneNumber = this.params.phoneNumber;
    }
    if (this.params.temporaryProof) {
      obj.temporaryProof = this.params.temporaryProof;
    }
    if (this.params.verificationCode) {
      obj.verificationCode = this.params.verificationCode;
    }
    if (this.params.verificationId) {
      obj.verificationId = this.params.verificationId;
    }
    return obj;
  }
  static fromJSON(json) {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    const { verificationId, verificationCode, phoneNumber, temporaryProof } = json;
    if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) {
      return null;
    }
    return new PhoneAuthCredential({
      verificationId,
      verificationCode,
      phoneNumber,
      temporaryProof
    });
  }
}

class ActionCodeURL {
  constructor(actionLink) {
    var _a, _b, _c, _d, _e, _f;
    const searchParams = querystringDecode(extractQuerystring(actionLink));
    const apiKey = (_a = searchParams["apiKey"]) !== null && _a !== undefined ? _a : null;
    const code = (_b = searchParams["oobCode"]) !== null && _b !== undefined ? _b : null;
    const operation = parseMode((_c = searchParams["mode"]) !== null && _c !== undefined ? _c : null);
    _assert(apiKey && code && operation, "argument-error");
    this.apiKey = apiKey;
    this.operation = operation;
    this.code = code;
    this.continueUrl = (_d = searchParams["continueUrl"]) !== null && _d !== undefined ? _d : null;
    this.languageCode = (_e = searchParams["languageCode"]) !== null && _e !== undefined ? _e : null;
    this.tenantId = (_f = searchParams["tenantId"]) !== null && _f !== undefined ? _f : null;
  }
  static parseLink(link) {
    const actionLink = parseDeepLink(link);
    try {
      return new ActionCodeURL(actionLink);
    } catch (_a) {
      return null;
    }
  }
}

class EmailAuthProvider {
  constructor() {
    this.providerId = EmailAuthProvider.PROVIDER_ID;
  }
  static credential(email, password) {
    return EmailAuthCredential._fromEmailAndPassword(email, password);
  }
  static credentialWithLink(email, emailLink) {
    const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
    _assert(actionCodeUrl, "argument-error");
    return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
  }
}
EmailAuthProvider.PROVIDER_ID = "password";
EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";

class FederatedAuthProvider {
  constructor(providerId) {
    this.providerId = providerId;
    this.defaultLanguageCode = null;
    this.customParameters = {};
  }
  setDefaultLanguage(languageCode) {
    this.defaultLanguageCode = languageCode;
  }
  setCustomParameters(customOAuthParameters) {
    this.customParameters = customOAuthParameters;
    return this;
  }
  getCustomParameters() {
    return this.customParameters;
  }
}

class BaseOAuthProvider extends FederatedAuthProvider {
  constructor() {
    super(...arguments);
    this.scopes = [];
  }
  addScope(scope) {
    if (!this.scopes.includes(scope)) {
      this.scopes.push(scope);
    }
    return this;
  }
  getScopes() {
    return [...this.scopes];
  }
}
class FacebookAuthProvider extends BaseOAuthProvider {
  constructor() {
    super("facebook.com");
  }
  static credential(accessToken) {
    return OAuthCredential._fromParams({
      providerId: FacebookAuthProvider.PROVIDER_ID,
      signInMethod: FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
      accessToken
    });
  }
  static credentialFromResult(userCredential) {
    return FacebookAuthProvider.credentialFromTaggedObject(userCredential);
  }
  static credentialFromError(error) {
    return FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
      return null;
    }
    if (!tokenResponse.oauthAccessToken) {
      return null;
    }
    try {
      return FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
}
FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
FacebookAuthProvider.PROVIDER_ID = "facebook.com";

class GoogleAuthProvider extends BaseOAuthProvider {
  constructor() {
    super("google.com");
    this.addScope("profile");
  }
  static credential(idToken, accessToken) {
    return OAuthCredential._fromParams({
      providerId: GoogleAuthProvider.PROVIDER_ID,
      signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
      idToken,
      accessToken
    });
  }
  static credentialFromResult(userCredential) {
    return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
  }
  static credentialFromError(error) {
    return GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { oauthIdToken, oauthAccessToken } = tokenResponse;
    if (!oauthIdToken && !oauthAccessToken) {
      return null;
    }
    try {
      return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
}
GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
GoogleAuthProvider.PROVIDER_ID = "google.com";

class GithubAuthProvider extends BaseOAuthProvider {
  constructor() {
    super("github.com");
  }
  static credential(accessToken) {
    return OAuthCredential._fromParams({
      providerId: GithubAuthProvider.PROVIDER_ID,
      signInMethod: GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
      accessToken
    });
  }
  static credentialFromResult(userCredential) {
    return GithubAuthProvider.credentialFromTaggedObject(userCredential);
  }
  static credentialFromError(error) {
    return GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
      return null;
    }
    if (!tokenResponse.oauthAccessToken) {
      return null;
    }
    try {
      return GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
}
GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
GithubAuthProvider.PROVIDER_ID = "github.com";
class TwitterAuthProvider extends BaseOAuthProvider {
  constructor() {
    super("twitter.com");
  }
  static credential(token, secret) {
    return OAuthCredential._fromParams({
      providerId: TwitterAuthProvider.PROVIDER_ID,
      signInMethod: TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
      oauthToken: token,
      oauthTokenSecret: secret
    });
  }
  static credentialFromResult(userCredential) {
    return TwitterAuthProvider.credentialFromTaggedObject(userCredential);
  }
  static credentialFromError(error) {
    return TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
    if (!oauthAccessToken || !oauthTokenSecret) {
      return null;
    }
    try {
      return TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
    } catch (_a) {
      return null;
    }
  }
}
TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
TwitterAuthProvider.PROVIDER_ID = "twitter.com";

class UserCredentialImpl {
  constructor(params) {
    this.user = params.user;
    this.providerId = params.providerId;
    this._tokenResponse = params._tokenResponse;
    this.operationType = params.operationType;
  }
  static async _fromIdTokenResponse(auth, operationType, idTokenResponse, isAnonymous = false) {
    const user = await UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous);
    const providerId = providerIdForResponse(idTokenResponse);
    const userCred = new UserCredentialImpl({
      user,
      providerId,
      _tokenResponse: idTokenResponse,
      operationType
    });
    return userCred;
  }
  static async _forOperation(user, operationType, response) {
    await user._updateTokensIfNecessary(response, true);
    const providerId = providerIdForResponse(response);
    return new UserCredentialImpl({
      user,
      providerId,
      _tokenResponse: response,
      operationType
    });
  }
}

class MultiFactorError extends FirebaseError {
  constructor(auth, error, operationType, user) {
    var _a;
    super(error.code, error.message);
    this.operationType = operationType;
    this.user = user;
    Object.setPrototypeOf(this, MultiFactorError.prototype);
    this.customData = {
      appName: auth.name,
      tenantId: (_a = auth.tenantId) !== null && _a !== undefined ? _a : undefined,
      _serverResponse: error.customData._serverResponse,
      operationType
    };
  }
  static _fromErrorAndOperation(auth, error, operationType, user) {
    return new MultiFactorError(auth, error, operationType, user);
  }
}
var multiFactorUserCache = new WeakMap;
var STORAGE_AVAILABLE_KEY = "__sak";

class BrowserPersistenceClass {
  constructor(storageRetriever, type) {
    this.storageRetriever = storageRetriever;
    this.type = type;
  }
  _isAvailable() {
    try {
      if (!this.storage) {
        return Promise.resolve(false);
      }
      this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
      this.storage.removeItem(STORAGE_AVAILABLE_KEY);
      return Promise.resolve(true);
    } catch (_a) {
      return Promise.resolve(false);
    }
  }
  _set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }
  _get(key) {
    const json = this.storage.getItem(key);
    return Promise.resolve(json ? JSON.parse(json) : null);
  }
  _remove(key) {
    this.storage.removeItem(key);
    return Promise.resolve();
  }
  get storage() {
    return this.storageRetriever();
  }
}
var _POLLING_INTERVAL_MS$1 = 1000;
var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;

class BrowserLocalPersistence extends BrowserPersistenceClass {
  constructor() {
    super(() => window.localStorage, "LOCAL");
    this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
    this.listeners = {};
    this.localCache = {};
    this.pollTimer = null;
    this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
    this.fallbackToPolling = _isMobileBrowser();
    this._shouldAllowMigration = true;
  }
  forAllChangedKeys(cb) {
    for (const key of Object.keys(this.listeners)) {
      const newValue = this.storage.getItem(key);
      const oldValue = this.localCache[key];
      if (newValue !== oldValue) {
        cb(key, oldValue, newValue);
      }
    }
  }
  onStorageEvent(event, poll = false) {
    if (!event.key) {
      this.forAllChangedKeys((key2, _oldValue, newValue) => {
        this.notifyListeners(key2, newValue);
      });
      return;
    }
    const key = event.key;
    if (poll) {
      this.detachListener();
    } else {
      this.stopPolling();
    }
    if (this.safariLocalStorageNotSynced) {
      const storedValue2 = this.storage.getItem(key);
      if (event.newValue !== storedValue2) {
        if (event.newValue !== null) {
          this.storage.setItem(key, event.newValue);
        } else {
          this.storage.removeItem(key);
        }
      } else if (this.localCache[key] === event.newValue && !poll) {
        return;
      }
    }
    const triggerListeners = () => {
      const storedValue2 = this.storage.getItem(key);
      if (!poll && this.localCache[key] === storedValue2) {
        return;
      }
      this.notifyListeners(key, storedValue2);
    };
    const storedValue = this.storage.getItem(key);
    if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
      setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
    } else {
      triggerListeners();
    }
  }
  notifyListeners(key, value) {
    this.localCache[key] = value;
    const listeners = this.listeners[key];
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(value ? JSON.parse(value) : value);
      }
    }
  }
  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      this.forAllChangedKeys((key, oldValue, newValue) => {
        this.onStorageEvent(new StorageEvent("storage", {
          key,
          oldValue,
          newValue
        }), true);
      });
    }, _POLLING_INTERVAL_MS$1);
  }
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  attachListener() {
    window.addEventListener("storage", this.boundEventHandler);
  }
  detachListener() {
    window.removeEventListener("storage", this.boundEventHandler);
  }
  _addListener(key, listener) {
    if (Object.keys(this.listeners).length === 0) {
      if (this.fallbackToPolling) {
        this.startPolling();
      } else {
        this.attachListener();
      }
    }
    if (!this.listeners[key]) {
      this.listeners[key] = new Set;
      this.localCache[key] = this.storage.getItem(key);
    }
    this.listeners[key].add(listener);
  }
  _removeListener(key, listener) {
    if (this.listeners[key]) {
      this.listeners[key].delete(listener);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    }
    if (Object.keys(this.listeners).length === 0) {
      this.detachListener();
      this.stopPolling();
    }
  }
  async _set(key, value) {
    await super._set(key, value);
    this.localCache[key] = JSON.stringify(value);
  }
  async _get(key) {
    const value = await super._get(key);
    this.localCache[key] = JSON.stringify(value);
    return value;
  }
  async _remove(key) {
    await super._remove(key);
    delete this.localCache[key];
  }
}
BrowserLocalPersistence.type = "LOCAL";
var browserLocalPersistence = BrowserLocalPersistence;

class BrowserSessionPersistence extends BrowserPersistenceClass {
  constructor() {
    super(() => window.sessionStorage, "SESSION");
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
}
BrowserSessionPersistence.type = "SESSION";
var browserSessionPersistence = BrowserSessionPersistence;

class Receiver {
  constructor(eventTarget) {
    this.eventTarget = eventTarget;
    this.handlersMap = {};
    this.boundEventHandler = this.handleEvent.bind(this);
  }
  static _getInstance(eventTarget) {
    const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new Receiver(eventTarget);
    this.receivers.push(newInstance);
    return newInstance;
  }
  isListeningto(eventTarget) {
    return this.eventTarget === eventTarget;
  }
  async handleEvent(event) {
    const messageEvent = event;
    const { eventId, eventType, data } = messageEvent.data;
    const handlers = this.handlersMap[eventType];
    if (!(handlers === null || handlers === undefined ? undefined : handlers.size)) {
      return;
    }
    messageEvent.ports[0].postMessage({
      status: "ack",
      eventId,
      eventType
    });
    const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
    const response = await _allSettled(promises);
    messageEvent.ports[0].postMessage({
      status: "done",
      eventId,
      eventType,
      response
    });
  }
  _subscribe(eventType, eventHandler) {
    if (Object.keys(this.handlersMap).length === 0) {
      this.eventTarget.addEventListener("message", this.boundEventHandler);
    }
    if (!this.handlersMap[eventType]) {
      this.handlersMap[eventType] = new Set;
    }
    this.handlersMap[eventType].add(eventHandler);
  }
  _unsubscribe(eventType, eventHandler) {
    if (this.handlersMap[eventType] && eventHandler) {
      this.handlersMap[eventType].delete(eventHandler);
    }
    if (!eventHandler || this.handlersMap[eventType].size === 0) {
      delete this.handlersMap[eventType];
    }
    if (Object.keys(this.handlersMap).length === 0) {
      this.eventTarget.removeEventListener("message", this.boundEventHandler);
    }
  }
}
Receiver.receivers = [];

class Sender {
  constructor(target) {
    this.target = target;
    this.handlers = new Set;
  }
  removeMessageHandler(handler) {
    if (handler.messageChannel) {
      handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
      handler.messageChannel.port1.close();
    }
    this.handlers.delete(handler);
  }
  async _send(eventType, data, timeout = 50) {
    const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel : null;
    if (!messageChannel) {
      throw new Error("connection_unavailable");
    }
    let completionTimer;
    let handler;
    return new Promise((resolve, reject) => {
      const eventId = _generateEventId("", 20);
      messageChannel.port1.start();
      const ackTimer = setTimeout(() => {
        reject(new Error("unsupported_event"));
      }, timeout);
      handler = {
        messageChannel,
        onMessage(event) {
          const messageEvent = event;
          if (messageEvent.data.eventId !== eventId) {
            return;
          }
          switch (messageEvent.data.status) {
            case "ack":
              clearTimeout(ackTimer);
              completionTimer = setTimeout(() => {
                reject(new Error("timeout"));
              }, 3000);
              break;
            case "done":
              clearTimeout(completionTimer);
              resolve(messageEvent.data.response);
              break;
            default:
              clearTimeout(ackTimer);
              clearTimeout(completionTimer);
              reject(new Error("invalid_response"));
              break;
          }
        }
      };
      this.handlers.add(handler);
      messageChannel.port1.addEventListener("message", handler.onMessage);
      this.target.postMessage({
        eventType,
        eventId,
        data
      }, [messageChannel.port2]);
    }).finally(() => {
      if (handler) {
        this.removeMessageHandler(handler);
      }
    });
  }
}
var DB_NAME2 = "firebaseLocalStorageDb";
var DB_VERSION2 = 1;
var DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
var DB_DATA_KEYPATH = "fbase_key";

class DBPromise {
  constructor(request) {
    this.request = request;
  }
  toPromise() {
    return new Promise((resolve, reject) => {
      this.request.addEventListener("success", () => {
        resolve(this.request.result);
      });
      this.request.addEventListener("error", () => {
        reject(this.request.error);
      });
    });
  }
}
var _POLLING_INTERVAL_MS = 800;
var _TRANSACTION_RETRY_COUNT = 3;

class IndexedDBLocalPersistence {
  constructor() {
    this.type = "LOCAL";
    this._shouldAllowMigration = true;
    this.listeners = {};
    this.localCache = {};
    this.pollTimer = null;
    this.pendingWrites = 0;
    this.receiver = null;
    this.sender = null;
    this.serviceWorkerReceiverAvailable = false;
    this.activeServiceWorker = null;
    this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
    }, () => {
    });
  }
  async _openDb() {
    if (this.db) {
      return this.db;
    }
    this.db = await _openDatabase();
    return this.db;
  }
  async _withRetries(op) {
    let numAttempts = 0;
    while (true) {
      try {
        const db = await this._openDb();
        return await op(db);
      } catch (e) {
        if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
          throw e;
        }
        if (this.db) {
          this.db.close();
          this.db = undefined;
        }
      }
    }
  }
  async initializeServiceWorkerMessaging() {
    return _isWorker() ? this.initializeReceiver() : this.initializeSender();
  }
  async initializeReceiver() {
    this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
    this.receiver._subscribe("keyChanged", async (_origin, data) => {
      const keys = await this._poll();
      return {
        keyProcessed: keys.includes(data.key)
      };
    });
    this.receiver._subscribe("ping", async (_origin, _data) => {
      return ["keyChanged"];
    });
  }
  async initializeSender() {
    var _a, _b;
    this.activeServiceWorker = await _getActiveServiceWorker();
    if (!this.activeServiceWorker) {
      return;
    }
    this.sender = new Sender(this.activeServiceWorker);
    const results = await this.sender._send("ping", {}, 800);
    if (!results) {
      return;
    }
    if (((_a = results[0]) === null || _a === undefined ? undefined : _a.fulfilled) && ((_b = results[0]) === null || _b === undefined ? undefined : _b.value.includes("keyChanged"))) {
      this.serviceWorkerReceiverAvailable = true;
    }
  }
  async notifyServiceWorker(key) {
    if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
      return;
    }
    try {
      await this.sender._send("keyChanged", { key }, this.serviceWorkerReceiverAvailable ? 800 : 50);
    } catch (_a) {
    }
  }
  async _isAvailable() {
    try {
      if (!indexedDB) {
        return false;
      }
      const db = await _openDatabase();
      await _putObject(db, STORAGE_AVAILABLE_KEY, "1");
      await _deleteObject(db, STORAGE_AVAILABLE_KEY);
      return true;
    } catch (_a) {
    }
    return false;
  }
  async _withPendingWrite(write) {
    this.pendingWrites++;
    try {
      await write();
    } finally {
      this.pendingWrites--;
    }
  }
  async _set(key, value) {
    return this._withPendingWrite(async () => {
      await this._withRetries((db) => _putObject(db, key, value));
      this.localCache[key] = value;
      return this.notifyServiceWorker(key);
    });
  }
  async _get(key) {
    const obj = await this._withRetries((db) => getObject(db, key));
    this.localCache[key] = obj;
    return obj;
  }
  async _remove(key) {
    return this._withPendingWrite(async () => {
      await this._withRetries((db) => _deleteObject(db, key));
      delete this.localCache[key];
      return this.notifyServiceWorker(key);
    });
  }
  async _poll() {
    const result = await this._withRetries((db) => {
      const getAllRequest = getObjectStore(db, false).getAll();
      return new DBPromise(getAllRequest).toPromise();
    });
    if (!result) {
      return [];
    }
    if (this.pendingWrites !== 0) {
      return [];
    }
    const keys = [];
    const keysInResult = new Set;
    if (result.length !== 0) {
      for (const { fbase_key: key, value } of result) {
        keysInResult.add(key);
        if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
          this.notifyListeners(key, value);
          keys.push(key);
        }
      }
    }
    for (const localKey of Object.keys(this.localCache)) {
      if (this.localCache[localKey] && !keysInResult.has(localKey)) {
        this.notifyListeners(localKey, null);
        keys.push(localKey);
      }
    }
    return keys;
  }
  notifyListeners(key, newValue) {
    this.localCache[key] = newValue;
    const listeners = this.listeners[key];
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(newValue);
      }
    }
  }
  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
  }
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  _addListener(key, listener) {
    if (Object.keys(this.listeners).length === 0) {
      this.startPolling();
    }
    if (!this.listeners[key]) {
      this.listeners[key] = new Set;
      this._get(key);
    }
    this.listeners[key].add(listener);
  }
  _removeListener(key, listener) {
    if (this.listeners[key]) {
      this.listeners[key].delete(listener);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    }
    if (Object.keys(this.listeners).length === 0) {
      this.stopPolling();
    }
  }
}
IndexedDBLocalPersistence.type = "LOCAL";
var indexedDBLocalPersistence = IndexedDBLocalPersistence;
var _JSLOAD_CALLBACK = _generateCallbackName("rcb");
var NETWORK_TIMEOUT_DELAY = new Delay(30000, 60000);
var RECAPTCHA_VERIFIER_TYPE = "recaptcha";
class PhoneAuthProvider {
  constructor(auth) {
    this.providerId = PhoneAuthProvider.PROVIDER_ID;
    this.auth = _castAuth(auth);
  }
  verifyPhoneNumber(phoneOptions, applicationVerifier) {
    return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
  }
  static credential(verificationId, verificationCode) {
    return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
  }
  static credentialFromResult(userCredential) {
    const credential = userCredential;
    return PhoneAuthProvider.credentialFromTaggedObject(credential);
  }
  static credentialFromError(error) {
    return PhoneAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { phoneNumber, temporaryProof } = tokenResponse;
    if (phoneNumber && temporaryProof) {
      return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
    }
    return null;
  }
}
PhoneAuthProvider.PROVIDER_ID = "phone";
PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";

class IdpCredential extends AuthCredential {
  constructor(params) {
    super("custom", "custom");
    this.params = params;
  }
  _getIdTokenResponse(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _linkToIdToken(auth, idToken) {
    return signInWithIdp(auth, this._buildIdpRequest(idToken));
  }
  _getReauthenticationResolver(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _buildIdpRequest(idToken) {
    const request = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: true,
      returnIdpCredential: true
    };
    if (idToken) {
      request.idToken = idToken;
    }
    return request;
  }
}

class AbstractPopupRedirectOperation {
  constructor(auth, filter, resolver, user, bypassAuthState = false) {
    this.auth = auth;
    this.resolver = resolver;
    this.user = user;
    this.bypassAuthState = bypassAuthState;
    this.pendingPromise = null;
    this.eventManager = null;
    this.filter = Array.isArray(filter) ? filter : [filter];
  }
  execute() {
    return new Promise(async (resolve, reject) => {
      this.pendingPromise = { resolve, reject };
      try {
        this.eventManager = await this.resolver._initialize(this.auth);
        await this.onExecution();
        this.eventManager.registerConsumer(this);
      } catch (e) {
        this.reject(e);
      }
    });
  }
  async onAuthEvent(event) {
    const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
    if (error) {
      this.reject(error);
      return;
    }
    const params = {
      auth: this.auth,
      requestUri: urlResponse,
      sessionId,
      tenantId: tenantId || undefined,
      postBody: postBody || undefined,
      user: this.user,
      bypassAuthState: this.bypassAuthState
    };
    try {
      this.resolve(await this.getIdpTask(type)(params));
    } catch (e) {
      this.reject(e);
    }
  }
  onError(error) {
    this.reject(error);
  }
  getIdpTask(type) {
    switch (type) {
      case "signInViaPopup":
      case "signInViaRedirect":
        return _signIn;
      case "linkViaPopup":
      case "linkViaRedirect":
        return _link;
      case "reauthViaPopup":
      case "reauthViaRedirect":
        return _reauth;
      default:
        _fail(this.auth, "internal-error");
    }
  }
  resolve(cred) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.resolve(cred);
    this.unregisterAndCleanUp();
  }
  reject(error) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.reject(error);
    this.unregisterAndCleanUp();
  }
  unregisterAndCleanUp() {
    if (this.eventManager) {
      this.eventManager.unregisterConsumer(this);
    }
    this.pendingPromise = null;
    this.cleanUp();
  }
}
var _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2000, 1e4);

class PopupOperation extends AbstractPopupRedirectOperation {
  constructor(auth, filter, provider, resolver, user) {
    super(auth, filter, resolver, user);
    this.provider = provider;
    this.authWindow = null;
    this.pollId = null;
    if (PopupOperation.currentPopupAction) {
      PopupOperation.currentPopupAction.cancel();
    }
    PopupOperation.currentPopupAction = this;
  }
  async executeNotNull() {
    const result = await this.execute();
    _assert(result, this.auth, "internal-error");
    return result;
  }
  async onExecution() {
    debugAssert(this.filter.length === 1, "Popup operations only handle one event");
    const eventId = _generateEventId();
    this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], eventId);
    this.authWindow.associatedEvent = eventId;
    this.resolver._originValidation(this.auth).catch((e) => {
      this.reject(e);
    });
    this.resolver._isIframeWebStorageSupported(this.auth, (isSupported) => {
      if (!isSupported) {
        this.reject(_createError(this.auth, "web-storage-unsupported"));
      }
    });
    this.pollUserCancellation();
  }
  get eventId() {
    var _a;
    return ((_a = this.authWindow) === null || _a === undefined ? undefined : _a.associatedEvent) || null;
  }
  cancel() {
    this.reject(_createError(this.auth, "cancelled-popup-request"));
  }
  cleanUp() {
    if (this.authWindow) {
      this.authWindow.close();
    }
    if (this.pollId) {
      window.clearTimeout(this.pollId);
    }
    this.authWindow = null;
    this.pollId = null;
    PopupOperation.currentPopupAction = null;
  }
  pollUserCancellation() {
    const poll = () => {
      var _a, _b;
      if ((_b = (_a = this.authWindow) === null || _a === undefined ? undefined : _a.window) === null || _b === undefined ? undefined : _b.closed) {
        this.pollId = window.setTimeout(() => {
          this.pollId = null;
          this.reject(_createError(this.auth, "popup-closed-by-user"));
        }, 8000);
        return;
      }
      this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
    };
    poll();
  }
}
PopupOperation.currentPopupAction = null;
var PENDING_REDIRECT_KEY = "pendingRedirect";
var redirectOutcomeMap = new Map;

class RedirectAction extends AbstractPopupRedirectOperation {
  constructor(auth, resolver, bypassAuthState = false) {
    super(auth, [
      "signInViaRedirect",
      "linkViaRedirect",
      "reauthViaRedirect",
      "unknown"
    ], resolver, undefined, bypassAuthState);
    this.eventId = null;
  }
  async execute() {
    let readyOutcome = redirectOutcomeMap.get(this.auth._key());
    if (!readyOutcome) {
      try {
        const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
        const result = hasPendingRedirect ? await super.execute() : null;
        readyOutcome = () => Promise.resolve(result);
      } catch (e) {
        readyOutcome = () => Promise.reject(e);
      }
      redirectOutcomeMap.set(this.auth._key(), readyOutcome);
    }
    if (!this.bypassAuthState) {
      redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
    }
    return readyOutcome();
  }
  async onAuthEvent(event) {
    if (event.type === "signInViaRedirect") {
      return super.onAuthEvent(event);
    } else if (event.type === "unknown") {
      this.resolve(null);
      return;
    }
    if (event.eventId) {
      const user = await this.auth._redirectUserForId(event.eventId);
      if (user) {
        this.user = user;
        return super.onAuthEvent(event);
      } else {
        this.resolve(null);
      }
    }
  }
  async onExecution() {
  }
  cleanUp() {
  }
}
var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1000;

class AuthEventManager {
  constructor(auth) {
    this.auth = auth;
    this.cachedEventUids = new Set;
    this.consumers = new Set;
    this.queuedRedirectEvent = null;
    this.hasHandledPotentialRedirect = false;
    this.lastProcessedEventTime = Date.now();
  }
  registerConsumer(authEventConsumer) {
    this.consumers.add(authEventConsumer);
    if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
      this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
      this.saveEventToCache(this.queuedRedirectEvent);
      this.queuedRedirectEvent = null;
    }
  }
  unregisterConsumer(authEventConsumer) {
    this.consumers.delete(authEventConsumer);
  }
  onEvent(event) {
    if (this.hasEventBeenHandled(event)) {
      return false;
    }
    let handled = false;
    this.consumers.forEach((consumer) => {
      if (this.isEventForConsumer(event, consumer)) {
        handled = true;
        this.sendToConsumer(event, consumer);
        this.saveEventToCache(event);
      }
    });
    if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
      return handled;
    }
    this.hasHandledPotentialRedirect = true;
    if (!handled) {
      this.queuedRedirectEvent = event;
      handled = true;
    }
    return handled;
  }
  sendToConsumer(event, consumer) {
    var _a;
    if (event.error && !isNullRedirectEvent(event)) {
      const code = ((_a = event.error.code) === null || _a === undefined ? undefined : _a.split("auth/")[1]) || "internal-error";
      consumer.onError(_createError(this.auth, code));
    } else {
      consumer.onAuthEvent(event);
    }
  }
  isEventForConsumer(event, consumer) {
    const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
    return consumer.filter.includes(event.type) && eventIdMatches;
  }
  hasEventBeenHandled(event) {
    if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
      this.cachedEventUids.clear();
    }
    return this.cachedEventUids.has(eventUid(event));
  }
  saveEventToCache(event) {
    this.cachedEventUids.add(eventUid(event));
    this.lastProcessedEventTime = Date.now();
  }
}
var IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
var HTTP_REGEX = /^https?/;
var NETWORK_TIMEOUT = new Delay(30000, 60000);
var cachedGApiLoader = null;
var PING_TIMEOUT = new Delay(5000, 15000);
var IFRAME_PATH = "__/auth/iframe";
var EMULATED_IFRAME_PATH = "emulator/auth/iframe";
var IFRAME_ATTRIBUTES = {
  style: {
    position: "absolute",
    top: "-100px",
    width: "1px",
    height: "1px"
  },
  "aria-hidden": "true",
  tabindex: "-1"
};
var EID_FROM_APIHOST = new Map([
  ["identitytoolkit.googleapis.com", "p"],
  ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
  ["test-identitytoolkit.sandbox.googleapis.com", "t"]
]);
var BASE_POPUP_OPTIONS = {
  location: "yes",
  resizable: "yes",
  statusbar: "yes",
  toolbar: "no"
};
var DEFAULT_WIDTH = 500;
var DEFAULT_HEIGHT = 600;
var TARGET_BLANK = "_blank";
var FIREFOX_EMPTY_URL = "http://localhost";

class AuthPopup {
  constructor(window2) {
    this.window = window2;
    this.associatedEvent = null;
  }
  close() {
    if (this.window) {
      try {
        this.window.close();
      } catch (e) {
      }
    }
  }
}
var WIDGET_PATH = "__/auth/handler";
var EMULATOR_WIDGET_PATH = "emulator/auth/handler";
var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
var WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";

class BrowserPopupRedirectResolver {
  constructor() {
    this.eventManagers = {};
    this.iframes = {};
    this.originValidationPromises = {};
    this._redirectPersistence = browserSessionPersistence;
    this._completeRedirectFn = _getRedirectResult;
    this._overrideRedirectResult = _overrideRedirectResult;
  }
  async _openPopup(auth, provider, authType, eventId) {
    var _a;
    debugAssert((_a = this.eventManagers[auth._key()]) === null || _a === undefined ? undefined : _a.manager, "_initialize() not called before _openPopup()");
    const url = await _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
    return _open(auth, url, _generateEventId());
  }
  async _openRedirect(auth, provider, authType, eventId) {
    await this._originValidation(auth);
    const url = await _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
    _setWindowLocation(url);
    return new Promise(() => {
    });
  }
  _initialize(auth) {
    const key = auth._key();
    if (this.eventManagers[key]) {
      const { manager, promise: promise2 } = this.eventManagers[key];
      if (manager) {
        return Promise.resolve(manager);
      } else {
        debugAssert(promise2, "If manager is not set, promise should be");
        return promise2;
      }
    }
    const promise = this.initAndGetManager(auth);
    this.eventManagers[key] = { promise };
    promise.catch(() => {
      delete this.eventManagers[key];
    });
    return promise;
  }
  async initAndGetManager(auth) {
    const iframe = await _openIframe(auth);
    const manager = new AuthEventManager(auth);
    iframe.register("authEvent", (iframeEvent) => {
      _assert(iframeEvent === null || iframeEvent === undefined ? undefined : iframeEvent.authEvent, auth, "invalid-auth-event");
      const handled = manager.onEvent(iframeEvent.authEvent);
      return { status: handled ? "ACK" : "ERROR" };
    }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    this.eventManagers[auth._key()] = { manager };
    this.iframes[auth._key()] = iframe;
    return manager;
  }
  _isIframeWebStorageSupported(auth, cb) {
    const iframe = this.iframes[auth._key()];
    iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, (result) => {
      var _a;
      const isSupported = (_a = result === null || result === undefined ? undefined : result[0]) === null || _a === undefined ? undefined : _a[WEB_STORAGE_SUPPORT_KEY];
      if (isSupported !== undefined) {
        cb(!!isSupported);
      }
      _fail(auth, "internal-error");
    }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
  }
  _originValidation(auth) {
    const key = auth._key();
    if (!this.originValidationPromises[key]) {
      this.originValidationPromises[key] = _validateOrigin(auth);
    }
    return this.originValidationPromises[key];
  }
  get _shouldInitProactively() {
    return _isMobileBrowser() || _isSafari() || _isIOS();
  }
}
var browserPopupRedirectResolver = BrowserPopupRedirectResolver;

class MultiFactorAssertionImpl {
  constructor(factorId) {
    this.factorId = factorId;
  }
  _process(auth, session, displayName) {
    switch (session.type) {
      case "enroll":
        return this._finalizeEnroll(auth, session.credential, displayName);
      case "signin":
        return this._finalizeSignIn(auth, session.credential);
      default:
        return debugFail("unexpected MultiFactorSessionType");
    }
  }
}

class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
  constructor(credential) {
    super("phone");
    this.credential = credential;
  }
  static _fromCredential(credential) {
    return new PhoneMultiFactorAssertionImpl(credential);
  }
  _finalizeEnroll(auth, idToken, displayName) {
    return finalizeEnrollPhoneMfa(auth, {
      idToken,
      displayName,
      phoneVerificationInfo: this.credential._makeVerificationRequest()
    });
  }
  _finalizeSignIn(auth, mfaPendingCredential) {
    return finalizeSignInPhoneMfa(auth, {
      mfaPendingCredential,
      phoneVerificationInfo: this.credential._makeVerificationRequest()
    });
  }
}

class PhoneMultiFactorGenerator {
  constructor() {
  }
  static assertion(credential) {
    return PhoneMultiFactorAssertionImpl._fromCredential(credential);
  }
}
PhoneMultiFactorGenerator.FACTOR_ID = "phone";

class TotpMultiFactorGenerator {
  static assertionForEnrollment(secret, oneTimePassword) {
    return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
  }
  static assertionForSignIn(enrollmentId, oneTimePassword) {
    return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
  }
  static async generateSecret(session) {
    var _a;
    const mfaSession = session;
    _assert(typeof ((_a = mfaSession.user) === null || _a === undefined ? undefined : _a.auth) !== "undefined", "internal-error");
    const response = await startEnrollTotpMfa(mfaSession.user.auth, {
      idToken: mfaSession.credential,
      totpEnrollmentInfo: {}
    });
    return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
  }
}
TotpMultiFactorGenerator.FACTOR_ID = "totp";

class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
  constructor(otp, enrollmentId, secret) {
    super("totp");
    this.otp = otp;
    this.enrollmentId = enrollmentId;
    this.secret = secret;
  }
  static _fromSecret(secret, otp) {
    return new TotpMultiFactorAssertionImpl(otp, undefined, secret);
  }
  static _fromEnrollmentId(enrollmentId, otp) {
    return new TotpMultiFactorAssertionImpl(otp, enrollmentId);
  }
  async _finalizeEnroll(auth, idToken, displayName) {
    _assert(typeof this.secret !== "undefined", auth, "argument-error");
    return finalizeEnrollTotpMfa(auth, {
      idToken,
      displayName,
      totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
    });
  }
  async _finalizeSignIn(auth, mfaPendingCredential) {
    _assert(this.enrollmentId !== undefined && this.otp !== undefined, auth, "argument-error");
    const totpVerificationInfo = { verificationCode: this.otp };
    return finalizeSignInTotpMfa(auth, {
      mfaPendingCredential,
      mfaEnrollmentId: this.enrollmentId,
      totpVerificationInfo
    });
  }
}

class TotpSecret {
  constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth) {
    this.sessionInfo = sessionInfo;
    this.auth = auth;
    this.secretKey = secretKey;
    this.hashingAlgorithm = hashingAlgorithm;
    this.codeLength = codeLength;
    this.codeIntervalSeconds = codeIntervalSeconds;
    this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
  }
  static _fromStartTotpMfaEnrollmentResponse(response, auth) {
    return new TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth);
  }
  _makeTotpVerificationInfo(otp) {
    return { sessionInfo: this.sessionInfo, verificationCode: otp };
  }
  generateQrCodeUrl(accountName, issuer) {
    var _a;
    let useDefaults = false;
    if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
      useDefaults = true;
    }
    if (useDefaults) {
      if (_isEmptyString(accountName)) {
        accountName = ((_a = this.auth.currentUser) === null || _a === undefined ? undefined : _a.email) || "unknownuser";
      }
      if (_isEmptyString(issuer)) {
        issuer = this.auth.name;
      }
    }
    return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
  }
}
var name5 = "@firebase/auth";
var version5 = "1.6.0";

class AuthInterop {
  constructor(auth) {
    this.auth = auth;
    this.internalListeners = new Map;
  }
  getUid() {
    var _a;
    this.assertAuthConfigured();
    return ((_a = this.auth.currentUser) === null || _a === undefined ? undefined : _a.uid) || null;
  }
  async getToken(forceRefresh) {
    this.assertAuthConfigured();
    await this.auth._initializationPromise;
    if (!this.auth.currentUser) {
      return null;
    }
    const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
    return { accessToken };
  }
  addAuthTokenListener(listener) {
    this.assertAuthConfigured();
    if (this.internalListeners.has(listener)) {
      return;
    }
    const unsubscribe = this.auth.onIdTokenChanged((user) => {
      listener((user === null || user === undefined ? undefined : user.stsTokenManager.accessToken) || null);
    });
    this.internalListeners.set(listener, unsubscribe);
    this.updateProactiveRefresh();
  }
  removeAuthTokenListener(listener) {
    this.assertAuthConfigured();
    const unsubscribe = this.internalListeners.get(listener);
    if (!unsubscribe) {
      return;
    }
    this.internalListeners.delete(listener);
    unsubscribe();
    this.updateProactiveRefresh();
  }
  assertAuthConfigured() {
    _assert(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
  }
  updateProactiveRefresh() {
    if (this.internalListeners.size > 0) {
      this.auth._startProactiveRefresh();
    } else {
      this.auth._stopProactiveRefresh();
    }
  }
}
var DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
var authIdTokenMaxAge = getExperimentalSetting("authIdTokenMaxAge") || DEFAULT_ID_TOKEN_MAX_AGE;
var lastPostedIdToken = null;
var mintCookieFactory = (url) => async (user) => {
  const idTokenResult = user && await user.getIdTokenResult();
  const idTokenAge = idTokenResult && (new Date().getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1000;
  if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
    return;
  }
  const idToken = idTokenResult === null || idTokenResult === undefined ? undefined : idTokenResult.token;
  if (lastPostedIdToken === idToken) {
    return;
  }
  lastPostedIdToken = idToken;
  await fetch(url, {
    method: idToken ? "POST" : "DELETE",
    headers: idToken ? {
      Authorization: `Bearer ${idToken}`
    } : {}
  });
};
_setExternalJSProvider({
  loadJS(url) {
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.setAttribute("src", url);
      el.onload = resolve;
      el.onerror = (e) => {
        const error = _createError("internal-error");
        error.customData = e;
        reject(error);
      };
      el.type = "text/javascript";
      el.charset = "UTF-8";
      getScriptParentElement().appendChild(el);
    });
  },
  gapiScript: "https://apis.google.com/js/api.js",
  recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
  recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
});
registerAuth("Browser");
// node_modules/@firebase/webchannel-wrapper/dist/esm/index.esm2017.js
var aa = function(a) {
  var b = typeof a;
  b = b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null";
  return b == "array" || b == "object" && typeof a.length == "number";
};
var p = function(a) {
  var b = typeof a;
  return b == "object" && a != null || b == "function";
};
var ba = function(a) {
  return Object.prototype.hasOwnProperty.call(a, ca) && a[ca] || (a[ca] = ++da);
};
var ea = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
var fa = function(a, b, c) {
  if (!a)
    throw Error();
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var e = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(e, d);
      return a.apply(b, e);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
var q = function(a, b, c) {
  Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? q = ea : q = fa;
  return q.apply(null, arguments);
};
var ha = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var d = c.slice();
    d.push.apply(d, arguments);
    return a.apply(this, d);
  };
};
var r = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.$ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.ac = function(d, e, f) {
    for (var h = Array(arguments.length - 2), n = 2;n < arguments.length; n++)
      h[n - 2] = arguments[n];
    return b.prototype[e].apply(d, h);
  };
};
var v = function() {
  this.s = this.s;
  this.o = this.o;
};
var ma = function(a) {
  const b = a.length;
  if (0 < b) {
    const c = Array(b);
    for (let d = 0;d < b; d++)
      c[d] = a[d];
    return c;
  }
  return [];
};
var na = function(a, b) {
  for (let c = 1;c < arguments.length; c++) {
    const d = arguments[c];
    if (aa(d)) {
      const e = a.length || 0, f = d.length || 0;
      a.length = e + f;
      for (let h = 0;h < f; h++)
        a[e + h] = d[h];
    } else
      a.push(d);
  }
};
var w = function(a, b) {
  this.type = a;
  this.g = this.target = b;
  this.defaultPrevented = false;
};
var x = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
var pa = function() {
  var a = l.navigator;
  return a && (a = a.userAgent) ? a : "";
};
var y = function(a) {
  return pa().indexOf(a) != -1;
};
var qa = function(a) {
  qa[" "](a);
  return a;
};
var ra = function(a, b) {
  var c = sa;
  return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a);
};
var ya = function() {
  var a = l.document;
  return a ? a.documentMode : undefined;
};
var A = function(a, b) {
  w.call(this, a ? a.type : "");
  this.relatedTarget = this.g = this.target = null;
  this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
  this.key = "";
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
  this.state = null;
  this.pointerId = 0;
  this.pointerType = "";
  this.i = null;
  if (a) {
    var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
    this.target = a.target || a.srcElement;
    this.g = b;
    if (b = a.relatedTarget) {
      if (wa) {
        a: {
          try {
            qa(b.nodeName);
            var e = true;
            break a;
          } catch (f) {
          }
          e = false;
        }
        e || (b = null);
      }
    } else
      c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement);
    this.relatedTarget = b;
    d ? (this.clientX = d.clientX !== undefined ? d.clientX : d.pageX, this.clientY = d.clientY !== undefined ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== undefined ? a.clientX : a.pageX, this.clientY = a.clientY !== undefined ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
    this.button = a.button;
    this.key = a.key || "";
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = typeof a.pointerType === "string" ? a.pointerType : Ga[a.pointerType] || "";
    this.state = a.state;
    this.i = a;
    a.defaultPrevented && A.$.h.call(this);
  }
};
var Ja = function(a, b, c, d, e) {
  this.listener = a;
  this.proxy = null;
  this.src = b;
  this.type = c;
  this.capture = !!d;
  this.la = e;
  this.key = ++Ia;
  this.fa = this.ia = false;
};
var Ma = function(a) {
  a.fa = true;
  a.listener = null;
  a.proxy = null;
  a.src = null;
  a.la = null;
};
var Na = function(a, b, c) {
  for (const d in a)
    b.call(c, a[d], d, a);
};
var Oa = function(a, b) {
  for (const c in a)
    b.call(undefined, a[c], c, a);
};
var Pa = function(a) {
  const b = {};
  for (const c in a)
    b[c] = a[c];
  return b;
};
var Ra = function(a, b) {
  let c, d;
  for (let e = 1;e < arguments.length; e++) {
    d = arguments[e];
    for (c in d)
      a[c] = d[c];
    for (let f = 0;f < Qa.length; f++)
      c = Qa[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
  }
};
var Sa = function(a) {
  this.src = a;
  this.g = {};
  this.h = 0;
};
var Ua = function(a, b) {
  var c = b.type;
  if (c in a.g) {
    var d = a.g[c], e = ka(d, b), f;
    (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
    f && (Ma(b), a.g[c].length == 0 && (delete a.g[c], a.h--));
  }
};
var Ta = function(a, b, c, d) {
  for (var e = 0;e < a.length; ++e) {
    var f = a[e];
    if (!f.fa && f.listener == b && f.capture == !!c && f.la == d)
      return e;
  }
  return -1;
};
var Ya = function(a, b, c, d, e) {
  if (d && d.once)
    return Za(a, b, c, d, e);
  if (Array.isArray(b)) {
    for (var f = 0;f < b.length; f++)
      Ya(a, b[f], c, d, e);
    return null;
  }
  c = $a(c);
  return a && a[Ha] ? a.O(b, c, p(d) ? !!d.capture : !!d, e) : ab(a, b, c, false, d, e);
};
var ab = function(a, b, c, d, e, f) {
  if (!b)
    throw Error("Invalid event type");
  var h = p(e) ? !!e.capture : !!e, n = bb(a);
  n || (a[Va] = n = new Sa(a));
  c = n.add(b, c, d, h, f);
  if (c.proxy)
    return c;
  d = cb();
  c.proxy = d;
  d.src = a;
  d.listener = c;
  if (a.addEventListener)
    oa || (e = h), e === undefined && (e = false), a.addEventListener(b.toString(), d, e);
  else if (a.attachEvent)
    a.attachEvent(db(b.toString()), d);
  else if (a.addListener && a.removeListener)
    a.addListener(d);
  else
    throw Error("addEventListener and attachEvent are unavailable.");
  return c;
};
var cb = function() {
  function a(c) {
    return b.call(a.src, a.listener, c);
  }
  const b = eb;
  return a;
};
var Za = function(a, b, c, d, e) {
  if (Array.isArray(b)) {
    for (var f = 0;f < b.length; f++)
      Za(a, b[f], c, d, e);
    return null;
  }
  c = $a(c);
  return a && a[Ha] ? a.P(b, c, p(d) ? !!d.capture : !!d, e) : ab(a, b, c, true, d, e);
};
var fb = function(a, b, c, d, e) {
  if (Array.isArray(b))
    for (var f = 0;f < b.length; f++)
      fb(a, b[f], c, d, e);
  else
    (d = p(d) ? !!d.capture : !!d, c = $a(c), a && a[Ha]) ? (a = a.i, b = String(b).toString(), (b in a.g) && (f = a.g[b], c = Ta(f, c, d, e), -1 < c && (Ma(f[c]), Array.prototype.splice.call(f, c, 1), f.length == 0 && (delete a.g[b], a.h--)))) : a && (a = bb(a)) && (b = a.g[b.toString()], a = -1, b && (a = Ta(b, c, d, e)), (c = -1 < a ? b[a] : null) && gb(c));
};
var gb = function(a) {
  if (typeof a !== "number" && a && !a.fa) {
    var b = a.src;
    if (b && b[Ha])
      Ua(b.i, a);
    else {
      var { type: c, proxy: d } = a;
      b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(db(c), d) : b.addListener && b.removeListener && b.removeListener(d);
      (c = bb(b)) ? (Ua(c, a), c.h == 0 && (c.src = null, b[Va] = null)) : Ma(a);
    }
  }
};
var db = function(a) {
  return a in Wa ? Wa[a] : Wa[a] = "on" + a;
};
var eb = function(a, b) {
  if (a.fa)
    a = true;
  else {
    b = new A(b, this);
    var c = a.listener, d = a.la || a.src;
    a.ia && gb(a);
    a = c.call(d, b);
  }
  return a;
};
var bb = function(a) {
  a = a[Va];
  return a instanceof Sa ? a : null;
};
var $a = function(a) {
  if (typeof a === "function")
    return a;
  a[hb] || (a[hb] = function(b) {
    return a.handleEvent(b);
  });
  return a[hb];
};
var B = function() {
  v.call(this);
  this.i = new Sa(this);
  this.S = this;
  this.J = null;
};
var C = function(a, b) {
  var c, d = a.J;
  if (d)
    for (c = [];d; d = d.J)
      c.push(d);
  a = a.S;
  d = b.type || b;
  if (typeof b === "string")
    b = new w(b, a);
  else if (b instanceof w)
    b.target = b.target || a;
  else {
    var e = b;
    b = new w(d, a);
    Ra(b, e);
  }
  e = true;
  if (c)
    for (var f = c.length - 1;0 <= f; f--) {
      var h = b.g = c[f];
      e = ib(h, d, true, b) && e;
    }
  h = b.g = a;
  e = ib(h, d, true, b) && e;
  e = ib(h, d, false, b) && e;
  if (c)
    for (f = 0;f < c.length; f++)
      h = b.g = c[f], e = ib(h, d, false, b) && e;
};
var ib = function(a, b, c, d) {
  b = a.i.g[String(b)];
  if (!b)
    return true;
  b = b.concat();
  for (var e = true, f = 0;f < b.length; ++f) {
    var h = b[f];
    if (h && !h.fa && h.capture == c) {
      var n = h.listener, t = h.la || h.src;
      h.ia && Ua(a.i, h);
      e = n.call(t, d) !== false && e;
    }
  }
  return e && !d.defaultPrevented;
};
var lb = function() {
  var a = mb;
  let b = null;
  a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
  return b;
};
var qb = function(a) {
  var b = 1;
  a = a.split(":");
  const c = [];
  for (;0 < b && a.length; )
    c.push(a.shift()), b--;
  a.length && c.push(a.join(":"));
  return c;
};
var rb = function(a) {
  l.setTimeout(() => {
    throw a;
  }, 0);
};
var wb = function(a, b) {
  B.call(this);
  this.h = a || 1;
  this.g = b || l;
  this.j = q(this.qb, this);
  this.l = Date.now();
};
var xb = function(a) {
  a.ga = false;
  a.T && (a.g.clearTimeout(a.T), a.T = null);
};
var yb = function(a, b, c) {
  if (typeof a === "function")
    c && (a = q(a, c));
  else if (a && typeof a.handleEvent == "function")
    a = q(a.handleEvent, a);
  else
    throw Error("Invalid listener argument");
  return 2147483647 < Number(b) ? -1 : l.setTimeout(a, b || 0);
};
var zb = function(a) {
  a.g = yb(() => {
    a.g = null;
    a.i && (a.i = false, zb(a));
  }, a.j);
  const b = a.h;
  a.h = null;
  a.m.apply(null, b);
};
var Bb = function(a) {
  v.call(this);
  this.h = a;
  this.g = {};
};
var Eb = function(a, b, c, d) {
  Array.isArray(c) || (c && (Cb[0] = c.toString()), c = Cb);
  for (var e = 0;e < c.length; e++) {
    var f = Ya(b, c[e], d || a.handleEvent, false, a.h || a);
    if (!f)
      break;
    a.g[f.key] = f;
  }
};
var Fb = function(a) {
  Na(a.g, function(b, c) {
    this.g.hasOwnProperty(c) && gb(b);
  }, a);
  a.g = {};
};
var Gb = function() {
  this.g = true;
};
var Hb = function(a, b, c, d, e, f) {
  a.info(function() {
    if (a.g)
      if (f) {
        var h = "";
        for (var n = f.split("&"), t = 0;t < n.length; t++) {
          var m = n[t].split("=");
          if (1 < m.length) {
            var u = m[0];
            m = m[1];
            var L = u.split("_");
            h = 2 <= L.length && L[1] == "type" ? h + (u + "=" + m + "&") : h + (u + "=redacted&");
          }
        }
      } else
        h = null;
    else
      h = f;
    return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + h;
  });
};
var Ib = function(a, b, c, d, e, f, h) {
  a.info(function() {
    return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + h;
  });
};
var D = function(a, b, c, d) {
  a.info(function() {
    return "XMLHTTP TEXT (" + b + "): " + Jb(a, c) + (d ? " " + d : "");
  });
};
var Kb = function(a, b) {
  a.info(function() {
    return "TIMEOUT: " + b;
  });
};
var Jb = function(a, b) {
  if (!a.g)
    return b;
  if (!b)
    return null;
  try {
    var c = JSON.parse(b);
    if (c) {
      for (a = 0;a < c.length; a++)
        if (Array.isArray(c[a])) {
          var d = c[a];
          if (!(2 > d.length)) {
            var e = d[1];
            if (Array.isArray(e) && !(1 > e.length)) {
              var f = e[0];
              if (f != "noop" && f != "stop" && f != "close")
                for (var h = 1;h < e.length; h++)
                  e[h] = "";
            }
          }
        }
    }
    return jb(c);
  } catch (n) {
    return b;
  }
};
var Mb = function() {
  return Lb = Lb || new B;
};
var Nb = function(a) {
  w.call(this, E.Ta, a);
};
var Ob = function(a) {
  const b = Mb();
  C(b, new Nb(b));
};
var Pb = function(a, b) {
  w.call(this, E.STAT_EVENT, a);
  this.stat = b;
};
var F = function(a) {
  const b = Mb();
  C(b, new Pb(b, a));
};
var Qb = function(a, b) {
  w.call(this, E.Ua, a);
  this.size = b;
};
var Rb = function(a, b) {
  if (typeof a !== "function")
    throw Error("Fn must not be null and must be a function");
  return l.setTimeout(function() {
    a();
  }, b);
};
var Ub = function() {
};
var Vb = function(a) {
  return a.h || (a.h = a.i());
};
var Wb = function() {
};
var Yb = function() {
  w.call(this, "d");
};
var Zb = function() {
  w.call(this, "c");
};
var ac = function() {
};
var bc = function(a, b, c, d) {
  this.l = a;
  this.j = b;
  this.m = c;
  this.W = d || 1;
  this.U = new Bb(this);
  this.P = cc;
  a = va ? 125 : undefined;
  this.V = new wb(a);
  this.I = null;
  this.i = false;
  this.u = this.B = this.A = this.L = this.G = this.Y = this.C = null;
  this.F = [];
  this.g = null;
  this.o = 0;
  this.s = this.v = null;
  this.ca = -1;
  this.J = false;
  this.O = 0;
  this.M = null;
  this.ba = this.K = this.aa = this.S = false;
  this.h = new dc;
};
var dc = function() {
  this.i = null;
  this.g = "";
  this.h = false;
};
var gc = function(a, b, c) {
  a.L = 1;
  a.A = hc(G(b));
  a.u = c;
  a.S = true;
  ic(a, null);
};
var ic = function(a, b) {
  a.G = Date.now();
  jc(a);
  a.B = G(a.A);
  var { B: c, W: d } = a;
  Array.isArray(d) || (d = [String(d)]);
  kc(c.i, "t", d);
  a.o = 0;
  c = a.l.J;
  a.h = new dc;
  a.g = lc(a.l, c ? b : null, !a.u);
  0 < a.O && (a.M = new Ab(q(a.Pa, a, a.g), a.O));
  Eb(a.U, a.g, "readystatechange", a.nb);
  b = a.I ? Pa(a.I) : {};
  a.u ? (a.v || (a.v = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ha(a.B, a.v, a.u, b)) : (a.v = "GET", a.g.ha(a.B, a.v, null, b));
  Ob();
  Hb(a.j, a.v, a.B, a.m, a.W, a.u);
};
var oc = function(a) {
  return a.g ? a.v == "GET" && a.L != 2 && a.l.Ha : false;
};
var rc = function(a, b, c) {
  let d = true, e;
  for (;!a.J && a.o < c.length; )
    if (e = uc(a, c), e == fc) {
      b == 4 && (a.s = 4, F(14), d = false);
      D(a.j, a.m, null, "[Incomplete Response]");
      break;
    } else if (e == ec) {
      a.s = 4;
      F(15);
      D(a.j, a.m, c, "[Invalid Chunk]");
      d = false;
      break;
    } else
      D(a.j, a.m, e, null), qc(a, e);
  oc(a) && a.o != 0 && (a.h.g = a.h.g.slice(a.o), a.o = 0);
  b != 4 || c.length != 0 || a.h.h || (a.s = 1, F(16), d = false);
  a.i = a.i && d;
  d ? 0 < c.length && !a.ba && (a.ba = true, b = a.l, b.g == a && b.ca && !b.M && (b.l.info("Great, no buffering proxy detected. Bytes received: " + c.length), vc(b), b.M = true, F(11))) : (D(a.j, a.m, c, "[Invalid Chunked Response]"), I(a), pc(a));
};
var uc = function(a, b) {
  var c = a.o, d = b.indexOf("\n", c);
  if (d == -1)
    return fc;
  c = Number(b.substring(c, d));
  if (isNaN(c))
    return ec;
  d += 1;
  if (d + c > b.length)
    return fc;
  b = b.slice(d, d + c);
  a.o = d + c;
  return b;
};
var jc = function(a) {
  a.Y = Date.now() + a.P;
  wc(a, a.P);
};
var wc = function(a, b) {
  if (a.C != null)
    throw Error("WatchDog timer not null");
  a.C = Rb(q(a.lb, a), b);
};
var nc = function(a) {
  a.C && (l.clearTimeout(a.C), a.C = null);
};
var pc = function(a) {
  a.l.H == 0 || a.J || sc(a.l, a);
};
var I = function(a) {
  nc(a);
  var b = a.M;
  b && typeof b.sa == "function" && b.sa();
  a.M = null;
  xb(a.V);
  Fb(a.U);
  a.g && (b = a.g, a.g = null, b.abort(), b.sa());
};
var qc = function(a, b) {
  try {
    var c = a.l;
    if (c.H != 0 && (c.g == a || xc(c.i, a))) {
      if (!a.K && xc(c.i, a) && c.H == 3) {
        try {
          var d = c.Ja.g.parse(b);
        } catch (m) {
          d = null;
        }
        if (Array.isArray(d) && d.length == 3) {
          var e = d;
          if (e[0] == 0)
            a: {
              if (!c.u) {
                if (c.g)
                  if (c.g.G + 3000 < a.G)
                    yc(c), zc(c);
                  else
                    break a;
                Ac(c);
                F(18);
              }
            }
          else
            c.Fa = e[1], 0 < c.Fa - c.V && 37500 > e[2] && c.G && c.A == 0 && !c.v && (c.v = Rb(q(c.ib, c), 6000));
          if (1 >= Bc(c.i) && c.oa) {
            try {
              c.oa();
            } catch (m) {
            }
            c.oa = undefined;
          }
        } else
          J(c, 11);
      } else if ((a.K || c.g == a) && yc(c), !x(b))
        for (e = c.Ja.g.parse(b), b = 0;b < e.length; b++) {
          let m = e[b];
          c.V = m[0];
          m = m[1];
          if (c.H == 2)
            if (m[0] == "c") {
              c.K = m[1];
              c.pa = m[2];
              const u = m[3];
              u != null && (c.ra = u, c.l.info("VER=" + c.ra));
              const L = m[4];
              L != null && (c.Ga = L, c.l.info("SVER=" + c.Ga));
              const Ka = m[5];
              Ka != null && typeof Ka === "number" && 0 < Ka && (d = 1.5 * Ka, c.L = d, c.l.info("backChannelRequestTimeoutMs_=" + d));
              d = c;
              const la = a.g;
              if (la) {
                const La = la.g ? la.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                if (La) {
                  var f = d.i;
                  f.g || La.indexOf("spdy") == -1 && La.indexOf("quic") == -1 && La.indexOf("h2") == -1 || (f.j = f.l, f.g = new Set, f.h && (Cc(f, f.h), f.h = null));
                }
                if (d.F) {
                  const Db = la.g ? la.g.getResponseHeader("X-HTTP-Session-Id") : null;
                  Db && (d.Da = Db, K(d.I, d.F, Db));
                }
              }
              c.H = 3;
              c.h && c.h.Ba();
              c.ca && (c.S = Date.now() - a.G, c.l.info("Handshake RTT: " + c.S + "ms"));
              d = c;
              var h = a;
              d.wa = Dc(d, d.J ? d.pa : null, d.Y);
              if (h.K) {
                Ec(d.i, h);
                var n = h, t = d.L;
                t && n.setTimeout(t);
                n.C && (nc(n), jc(n));
                d.g = h;
              } else
                Fc(d);
              0 < c.j.length && Gc(c);
            } else
              m[0] != "stop" && m[0] != "close" || J(c, 7);
          else
            c.H == 3 && (m[0] == "stop" || m[0] == "close" ? m[0] == "stop" ? J(c, 7) : Hc(c) : m[0] != "noop" && c.h && c.h.Aa(m), c.A = 0);
        }
    }
    Ob(4);
  } catch (m) {
  }
};
var Ic = function(a) {
  if (a.Z && typeof a.Z == "function")
    return a.Z();
  if (typeof Map !== "undefined" && a instanceof Map || typeof Set !== "undefined" && a instanceof Set)
    return Array.from(a.values());
  if (typeof a === "string")
    return a.split("");
  if (aa(a)) {
    for (var b = [], c = a.length, d = 0;d < c; d++)
      b.push(a[d]);
    return b;
  }
  b = [];
  c = 0;
  for (d in a)
    b[c++] = a[d];
  return b;
};
var Jc = function(a) {
  if (a.ta && typeof a.ta == "function")
    return a.ta();
  if (!a.Z || typeof a.Z != "function") {
    if (typeof Map !== "undefined" && a instanceof Map)
      return Array.from(a.keys());
    if (!(typeof Set !== "undefined" && a instanceof Set)) {
      if (aa(a) || typeof a === "string") {
        var b = [];
        a = a.length;
        for (var c = 0;c < a; c++)
          b.push(c);
        return b;
      }
      b = [];
      c = 0;
      for (const d in a)
        b[c++] = d;
      return b;
    }
  }
};
var Kc = function(a, b) {
  if (a.forEach && typeof a.forEach == "function")
    a.forEach(b, undefined);
  else if (aa(a) || typeof a === "string")
    Array.prototype.forEach.call(a, b, undefined);
  else
    for (var c = Jc(a), d = Ic(a), e = d.length, f = 0;f < e; f++)
      b.call(undefined, d[f], c && c[f], a);
};
var Mc = function(a, b) {
  if (a) {
    a = a.split("&");
    for (var c = 0;c < a.length; c++) {
      var d = a[c].indexOf("="), e = null;
      if (0 <= d) {
        var f = a[c].substring(0, d);
        e = a[c].substring(d + 1);
      } else
        f = a[c];
      b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
    }
  }
};
var M = function(a) {
  this.g = this.s = this.j = "";
  this.m = null;
  this.o = this.l = "";
  this.h = false;
  if (a instanceof M) {
    this.h = a.h;
    Nc(this, a.j);
    this.s = a.s;
    this.g = a.g;
    Oc(this, a.m);
    this.l = a.l;
    var b = a.i;
    var c = new Pc;
    c.i = b.i;
    b.g && (c.g = new Map(b.g), c.h = b.h);
    Qc(this, c);
    this.o = a.o;
  } else
    a && (b = String(a).match(Lc)) ? (this.h = false, Nc(this, b[1] || "", true), this.s = Rc(b[2] || ""), this.g = Rc(b[3] || "", true), Oc(this, b[4]), this.l = Rc(b[5] || "", true), Qc(this, b[6] || "", true), this.o = Rc(b[7] || "")) : (this.h = false, this.i = new Pc(null, this.h));
};
var G = function(a) {
  return new M(a);
};
var Nc = function(a, b, c) {
  a.j = c ? Rc(b, true) : b;
  a.j && (a.j = a.j.replace(/:$/, ""));
};
var Oc = function(a, b) {
  if (b) {
    b = Number(b);
    if (isNaN(b) || 0 > b)
      throw Error("Bad port number " + b);
    a.m = b;
  } else
    a.m = null;
};
var Qc = function(a, b, c) {
  b instanceof Pc ? (a.i = b, Xc(a.i, a.h)) : (c || (b = Sc(b, Yc)), a.i = new Pc(b, a.h));
};
var K = function(a, b, c) {
  a.i.set(b, c);
};
var hc = function(a) {
  K(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
  return a;
};
var Rc = function(a, b) {
  return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
};
var Sc = function(a, b, c) {
  return typeof a === "string" ? (a = encodeURI(a).replace(b, Zc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
};
var Zc = function(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
};
var Pc = function(a, b) {
  this.h = this.g = null;
  this.i = a || null;
  this.j = !!b;
};
var N = function(a) {
  a.g || (a.g = new Map, a.h = 0, a.i && Mc(a.i, function(b, c) {
    a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
  }));
};
var $c = function(a, b) {
  N(a);
  b = O(a, b);
  a.g.has(b) && (a.i = null, a.h -= a.g.get(b).length, a.g.delete(b));
};
var ad = function(a, b) {
  N(a);
  b = O(a, b);
  return a.g.has(b);
};
var kc = function(a, b, c) {
  $c(a, b);
  0 < c.length && (a.i = null, a.g.set(O(a, b), ma(c)), a.h += c.length);
};
var O = function(a, b) {
  b = String(b);
  a.j && (b = b.toLowerCase());
  return b;
};
var Xc = function(a, b) {
  b && !a.j && (N(a), a.i = null, a.g.forEach(function(c, d) {
    var e = d.toLowerCase();
    d != e && ($c(this, d), kc(this, e, c));
  }, a));
  a.j = b;
};
var cd = function(a) {
  this.l = a || dd;
  l.PerformanceNavigationTiming ? (a = l.performance.getEntriesByType("navigation"), a = 0 < a.length && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(l.g && l.g.Ka && l.g.Ka() && l.g.Ka().dc);
  this.j = a ? this.l : 1;
  this.g = null;
  1 < this.j && (this.g = new Set);
  this.h = null;
  this.i = [];
};
var ed = function(a) {
  return a.h ? true : a.g ? a.g.size >= a.j : false;
};
var Bc = function(a) {
  return a.h ? 1 : a.g ? a.g.size : 0;
};
var xc = function(a, b) {
  return a.h ? a.h == b : a.g ? a.g.has(b) : false;
};
var Cc = function(a, b) {
  a.g ? a.g.add(b) : a.h = b;
};
var Ec = function(a, b) {
  a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
};
var fd = function(a) {
  if (a.h != null)
    return a.i.concat(a.h.F);
  if (a.g != null && a.g.size !== 0) {
    let b = a.i;
    for (const c of a.g.values())
      b = b.concat(c.F);
    return b;
  }
  return ma(a.i);
};
var hd = function() {
  this.g = new gd;
};
var id = function(a, b, c) {
  const d = c || "";
  try {
    Kc(a, function(e, f) {
      let h = e;
      p(e) && (h = jb(e));
      b.push(d + f + "=" + encodeURIComponent(h));
    });
  } catch (e) {
    throw b.push(d + "type=" + encodeURIComponent("_badmap")), e;
  }
};
var jd = function(a, b) {
  const c = new Gb;
  if (l.Image) {
    const d = new Image;
    d.onload = ha(kd, c, d, "TestLoadImage: loaded", true, b);
    d.onerror = ha(kd, c, d, "TestLoadImage: error", false, b);
    d.onabort = ha(kd, c, d, "TestLoadImage: abort", false, b);
    d.ontimeout = ha(kd, c, d, "TestLoadImage: timeout", false, b);
    l.setTimeout(function() {
      if (d.ontimeout)
        d.ontimeout();
    }, 1e4);
    d.src = a;
  } else
    b(false);
};
var kd = function(a, b, c, d, e) {
  try {
    b.onload = null, b.onerror = null, b.onabort = null, b.ontimeout = null, e(d);
  } catch (f) {
  }
};
var ld = function(a) {
  this.l = a.ec || null;
  this.j = a.ob || false;
};
var md = function(a, b) {
  B.call(this);
  this.F = a;
  this.u = b;
  this.m = undefined;
  this.readyState = nd;
  this.status = 0;
  this.responseType = this.responseText = this.response = this.statusText = "";
  this.onreadystatechange = null;
  this.v = new Headers;
  this.h = null;
  this.C = "GET";
  this.B = "";
  this.g = false;
  this.A = this.j = this.l = null;
};
var qd = function(a) {
  a.j.read().then(a.Xa.bind(a)).catch(a.ka.bind(a));
};
var pd = function(a) {
  a.readyState = 4;
  a.l = null;
  a.j = null;
  a.A = null;
  od(a);
};
var od = function(a) {
  a.onreadystatechange && a.onreadystatechange.call(a);
};
var P = function(a) {
  B.call(this);
  this.headers = new Map;
  this.u = a || null;
  this.h = false;
  this.C = this.g = null;
  this.I = "";
  this.m = 0;
  this.j = "";
  this.l = this.G = this.v = this.F = false;
  this.B = 0;
  this.A = null;
  this.K = sd;
  this.L = this.M = false;
};
var xd = function(a) {
  return z && typeof a.timeout === "number" && a.ontimeout !== undefined;
};
var vd = function(a, b) {
  a.h = false;
  a.g && (a.l = true, a.g.abort(), a.l = false);
  a.j = b;
  a.m = 5;
  yd(a);
  zd(a);
};
var yd = function(a) {
  a.F || (a.F = true, C(a, "complete"), C(a, "error"));
};
var Ad = function(a) {
  if (a.h && typeof goog != "undefined" && (!a.C[1] || H(a) != 4 || a.da() != 2)) {
    if (a.v && H(a) == 4)
      yb(a.La, 0, a);
    else if (C(a, "readystatechange"), H(a) == 4) {
      a.h = false;
      try {
        const h = a.da();
        a:
          switch (h) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var b = true;
              break a;
            default:
              b = false;
          }
        var c;
        if (!(c = b)) {
          var d;
          if (d = h === 0) {
            var e = String(a.I).match(Lc)[1] || null;
            !e && l.self && l.self.location && (e = l.self.location.protocol.slice(0, -1));
            d = !td.test(e ? e.toLowerCase() : "");
          }
          c = d;
        }
        if (c)
          C(a, "complete"), C(a, "success");
        else {
          a.m = 6;
          try {
            var f = 2 < H(a) ? a.g.statusText : "";
          } catch (n) {
            f = "";
          }
          a.j = f + " [" + a.da() + "]";
          yd(a);
        }
      } finally {
        zd(a);
      }
    }
  }
};
var zd = function(a, b) {
  if (a.g) {
    wd(a);
    const c = a.g, d = a.C[0] ? () => {
    } : null;
    a.g = null;
    a.C = null;
    b || C(a, "ready");
    try {
      c.onreadystatechange = d;
    } catch (e) {
    }
  }
};
var wd = function(a) {
  a.g && a.L && (a.g.ontimeout = null);
  a.A && (l.clearTimeout(a.A), a.A = null);
};
var H = function(a) {
  return a.g ? a.g.readyState : 0;
};
var mc = function(a) {
  try {
    if (!a.g)
      return null;
    if ("response" in a.g)
      return a.g.response;
    switch (a.K) {
      case sd:
      case "text":
        return a.g.responseText;
      case "arraybuffer":
        if ("mozResponseArrayBuffer" in a.g)
          return a.g.mozResponseArrayBuffer;
    }
    return null;
  } catch (b) {
    return null;
  }
};
var tc = function(a) {
  const b = {};
  a = (a.g && 2 <= H(a) ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
  for (let d = 0;d < a.length; d++) {
    if (x(a[d]))
      continue;
    var c = qb(a[d]);
    const e = c[0];
    c = c[1];
    if (typeof c !== "string")
      continue;
    c = c.trim();
    const f = b[e] || [];
    b[e] = f;
    f.push(c);
  }
  Oa(b, function(d) {
    return d.join(", ");
  });
};
var Bd = function(a) {
  let b = "";
  Na(a, function(c, d) {
    b += d;
    b += ":";
    b += c;
    b += "\r\n";
  });
  return b;
};
var Cd = function(a, b, c) {
  a: {
    for (d in c) {
      var d = false;
      break a;
    }
    d = true;
  }
  d || (c = Bd(c), typeof a === "string" ? c != null && encodeURIComponent(String(c)) : K(a, b, c));
};
var Dd = function(a, b, c) {
  return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
};
var Ed = function(a) {
  this.Ga = 0;
  this.j = [];
  this.l = new Gb;
  this.pa = this.wa = this.I = this.Y = this.g = this.Da = this.F = this.na = this.o = this.U = this.s = null;
  this.fb = this.W = 0;
  this.cb = Dd("failFast", false, a);
  this.G = this.v = this.u = this.m = this.h = null;
  this.aa = true;
  this.Fa = this.V = -1;
  this.ba = this.A = this.C = 0;
  this.ab = Dd("baseRetryDelayMs", 5000, a);
  this.hb = Dd("retryDelaySeedMs", 1e4, a);
  this.eb = Dd("forwardChannelMaxRetries", 2, a);
  this.xa = Dd("forwardChannelRequestTimeoutMs", 20000, a);
  this.va = a && a.xmlHttpFactory || undefined;
  this.Ha = a && a.useFetchStreams || false;
  this.L = undefined;
  this.J = a && a.supportsCrossDomainXhr || false;
  this.K = "";
  this.i = new cd(a && a.concurrentRequestLimit);
  this.Ja = new hd;
  this.P = a && a.fastHandshake || false;
  this.O = a && a.encodeInitMessageHeaders || false;
  this.P && this.O && (this.O = false);
  this.bb = a && a.bc || false;
  a && a.Ea && this.l.Ea();
  a && a.forceLongPolling && (this.aa = false);
  this.ca = !this.P && this.aa && a && a.detectBufferingProxy || false;
  this.qa = undefined;
  a && a.longPollingTimeout && 0 < a.longPollingTimeout && (this.qa = a.longPollingTimeout);
  this.oa = undefined;
  this.S = 0;
  this.M = false;
  this.ma = this.B = null;
};
var Hc = function(a) {
  Fd(a);
  if (a.H == 3) {
    var b = a.W++, c = G(a.I);
    K(c, "SID", a.K);
    K(c, "RID", b);
    K(c, "TYPE", "terminate");
    Gd(a, c);
    b = new bc(a, a.l, b);
    b.L = 2;
    b.A = hc(G(c));
    c = false;
    if (l.navigator && l.navigator.sendBeacon)
      try {
        c = l.navigator.sendBeacon(b.A.toString(), "");
      } catch (d) {
      }
    !c && l.Image && (new Image().src = b.A, c = true);
    c || (b.g = lc(b.l, null), b.g.ha(b.A));
    b.G = Date.now();
    jc(b);
  }
  Hd(a);
};
var zc = function(a) {
  a.g && (vc(a), a.g.cancel(), a.g = null);
};
var Fd = function(a) {
  zc(a);
  a.u && (l.clearTimeout(a.u), a.u = null);
  yc(a);
  a.i.cancel();
  a.m && (typeof a.m === "number" && l.clearTimeout(a.m), a.m = null);
};
var Gc = function(a) {
  if (!ed(a.i) && !a.m) {
    a.m = true;
    var b = a.Na;
    sb || vb();
    tb || (sb(), tb = true);
    mb.add(b, a);
    a.C = 0;
  }
};
var Id = function(a, b) {
  if (Bc(a.i) >= a.i.j - (a.m ? 1 : 0))
    return false;
  if (a.m)
    return a.j = b.F.concat(a.j), true;
  if (a.H == 1 || a.H == 2 || a.C >= (a.cb ? 0 : a.eb))
    return false;
  a.m = Rb(q(a.Na, a, b), Jd(a, a.C));
  a.C++;
  return true;
};
var Ld = function(a, b) {
  var c;
  b ? c = b.m : c = a.W++;
  const d = G(a.I);
  K(d, "SID", a.K);
  K(d, "RID", c);
  K(d, "AID", a.V);
  Gd(a, d);
  a.o && a.s && Cd(d, a.o, a.s);
  c = new bc(a, a.l, c, a.C + 1);
  a.o === null && (c.I = a.s);
  b && (a.j = b.F.concat(a.j));
  b = Kd(a, c, 1000);
  c.setTimeout(Math.round(0.5 * a.xa) + Math.round(0.5 * a.xa * Math.random()));
  Cc(a.i, c);
  gc(c, d, b);
};
var Gd = function(a, b) {
  a.na && Na(a.na, function(c, d) {
    K(b, d, c);
  });
  a.h && Kc({}, function(c, d) {
    K(b, d, c);
  });
};
var Kd = function(a, b, c) {
  c = Math.min(a.j.length, c);
  var d = a.h ? q(a.h.Va, a.h, a) : null;
  a: {
    var e = a.j;
    let f = -1;
    for (;; ) {
      const h = ["count=" + c];
      f == -1 ? 0 < c ? (f = e[0].g, h.push("ofs=" + f)) : f = 0 : h.push("ofs=" + f);
      let n = true;
      for (let t = 0;t < c; t++) {
        let m = e[t].g;
        const u = e[t].map;
        m -= f;
        if (0 > m)
          f = Math.max(0, e[t].g - 100), n = false;
        else
          try {
            id(u, h, "req" + m + "_");
          } catch (L) {
            d && d(u);
          }
      }
      if (n) {
        d = h.join("&");
        break a;
      }
    }
  }
  a = a.j.splice(0, c);
  b.F = a;
  return d;
};
var Fc = function(a) {
  if (!a.g && !a.u) {
    a.ba = 1;
    var b = a.Ma;
    sb || vb();
    tb || (sb(), tb = true);
    mb.add(b, a);
    a.A = 0;
  }
};
var Ac = function(a) {
  if (a.g || a.u || 3 <= a.A)
    return false;
  a.ba++;
  a.u = Rb(q(a.Ma, a), Jd(a, a.A));
  a.A++;
  return true;
};
var vc = function(a) {
  a.B != null && (l.clearTimeout(a.B), a.B = null);
};
var Md = function(a) {
  a.g = new bc(a, a.l, "rpc", a.ba);
  a.o === null && (a.g.I = a.s);
  a.g.O = 0;
  var b = G(a.wa);
  K(b, "RID", "rpc");
  K(b, "SID", a.K);
  K(b, "AID", a.V);
  K(b, "CI", a.G ? "0" : "1");
  !a.G && a.qa && K(b, "TO", a.qa);
  K(b, "TYPE", "xmlhttp");
  Gd(a, b);
  a.o && a.s && Cd(b, a.o, a.s);
  a.L && a.g.setTimeout(a.L);
  var c = a.g;
  a = a.pa;
  c.L = 1;
  c.A = hc(G(b));
  c.u = null;
  c.S = true;
  ic(c, a);
};
var yc = function(a) {
  a.v != null && (l.clearTimeout(a.v), a.v = null);
};
var sc = function(a, b) {
  var c = null;
  if (a.g == b) {
    yc(a);
    vc(a);
    a.g = null;
    var d = 2;
  } else if (xc(a.i, b))
    c = b.F, Ec(a.i, b), d = 1;
  else
    return;
  if (a.H != 0) {
    if (b.i)
      if (d == 1) {
        c = b.u ? b.u.length : 0;
        b = Date.now() - b.G;
        var e = a.C;
        d = Mb();
        C(d, new Qb(d, c));
        Gc(a);
      } else
        Fc(a);
    else if (e = b.s, e == 3 || e == 0 && 0 < b.ca || !(d == 1 && Id(a, b) || d == 2 && Ac(a)))
      switch (c && 0 < c.length && (b = a.i, b.i = b.i.concat(c)), e) {
        case 1:
          J(a, 5);
          break;
        case 4:
          J(a, 10);
          break;
        case 3:
          J(a, 6);
          break;
        default:
          J(a, 2);
      }
  }
};
var Jd = function(a, b) {
  let c = a.ab + Math.floor(Math.random() * a.hb);
  a.isActive() || (c *= 2);
  return c * b;
};
var J = function(a, b) {
  a.l.info("Error code " + b);
  if (b == 2) {
    var c = null;
    a.h && (c = null);
    var d = q(a.pb, a);
    c || (c = new M("//www.google.com/images/cleardot.gif"), l.location && l.location.protocol == "http" || Nc(c, "https"), hc(c));
    jd(c.toString(), d);
  } else
    F(2);
  a.H = 0;
  a.h && a.h.za(b);
  Hd(a);
  Fd(a);
};
var Hd = function(a) {
  a.H = 0;
  a.ma = [];
  if (a.h) {
    const b = fd(a.i);
    if (b.length != 0 || a.j.length != 0)
      na(a.ma, b), na(a.ma, a.j), a.i.i.length = 0, ma(a.j), a.j.length = 0;
    a.h.ya();
  }
};
var Dc = function(a, b, c) {
  var d = c instanceof M ? G(c) : new M(c);
  if (d.g != "")
    b && (d.g = b + "." + d.g), Oc(d, d.m);
  else {
    var e = l.location;
    d = e.protocol;
    b = b ? b + "." + e.hostname : e.hostname;
    e = +e.port;
    var f = new M(null);
    d && Nc(f, d);
    b && (f.g = b);
    e && Oc(f, e);
    c && (f.l = c);
    d = f;
  }
  c = a.F;
  b = a.Da;
  c && b && K(d, c, b);
  K(d, "VER", a.ra);
  Gd(a, d);
  return d;
};
var lc = function(a, b, c) {
  if (b && !a.J)
    throw Error("Can't create secondary domain capable XhrIo object.");
  b = a.Ha && !a.va ? new P(new ld({ ob: c })) : new P(a.va);
  b.Oa(a.J);
  return b;
};
var Nd = function() {
};
var Od = function() {
  if (z && !(10 <= Number(Fa)))
    throw Error("Environmental error: no available transport.");
};
var Q = function(a, b) {
  B.call(this);
  this.g = new Ed(b);
  this.l = a;
  this.h = b && b.messageUrlParams || null;
  a = b && b.messageHeaders || null;
  b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
  this.g.s = a;
  a = b && b.initMessageHeaders || null;
  b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = { "X-WebChannel-Content-Type": b.messageContentType });
  b && b.Ca && (a ? a["X-WebChannel-Client-Profile"] = b.Ca : a = { "X-WebChannel-Client-Profile": b.Ca });
  this.g.U = a;
  (a = b && b.cc) && !x(a) && (this.g.o = a);
  this.A = b && b.supportsCrossDomainXhr || false;
  this.v = b && b.sendRawJson || false;
  (b = b && b.httpSessionIdParam) && !x(b) && (this.g.F = b, a = this.h, a !== null && (b in a) && (a = this.h, (b in a) && delete a[b]));
  this.j = new R(this);
};
var Pd = function(a) {
  Yb.call(this);
  a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
  var b = a.__sm__;
  if (b) {
    a: {
      for (const c in b) {
        a = c;
        break a;
      }
      a = undefined;
    }
    if (this.i = a)
      a = this.i, b = b !== null && a in b ? b[a] : undefined;
    this.data = b;
  } else
    this.data = a;
};
var Qd = function() {
  Zb.call(this);
  this.status = 1;
};
var R = function(a) {
  this.g = a;
};
var Rd = function() {
  this.blockSize = -1;
};
var S = function() {
  this.blockSize = -1;
  this.blockSize = 64;
  this.g = Array(4);
  this.m = Array(this.blockSize);
  this.i = this.h = 0;
  this.reset();
};
var Sd = function(a, b, c) {
  c || (c = 0);
  var d = Array(16);
  if (typeof b === "string")
    for (var e = 0;16 > e; ++e)
      d[e] = b.charCodeAt(c++) | b.charCodeAt(c++) << 8 | b.charCodeAt(c++) << 16 | b.charCodeAt(c++) << 24;
  else
    for (e = 0;16 > e; ++e)
      d[e] = b[c++] | b[c++] << 8 | b[c++] << 16 | b[c++] << 24;
  b = a.g[0];
  c = a.g[1];
  e = a.g[2];
  var f = a.g[3];
  var h = b + (f ^ c & (e ^ f)) + d[0] + 3614090360 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[1] + 3905402710 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[2] + 606105819 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[3] + 3250441966 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[4] + 4118548399 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[5] + 1200080426 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[6] + 2821735955 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[7] + 4249261313 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[8] + 1770035416 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[9] + 2336552879 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[10] + 4294925233 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[11] + 2304563134 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (f ^ c & (e ^ f)) + d[12] + 1804603682 & 4294967295;
  b = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b & (c ^ e)) + d[13] + 4254626195 & 4294967295;
  f = b + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b ^ c)) + d[14] + 2792965006 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b ^ e & (f ^ b)) + d[15] + 1236535329 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b + (e ^ f & (c ^ e)) + d[1] + 4129170786 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[6] + 3225465664 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[11] + 643717713 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[0] + 3921069994 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[5] + 3593408605 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[10] + 38016083 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[15] + 3634488961 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[4] + 3889429448 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[9] + 568446438 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[14] + 3275163606 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[3] + 4107603335 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[8] + 1163531501 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (e ^ f & (c ^ e)) + d[13] + 2850285829 & 4294967295;
  b = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b ^ c)) + d[2] + 4243563512 & 4294967295;
  f = b + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b ^ c & (f ^ b)) + d[7] + 1735328473 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b & (e ^ f)) + d[12] + 2368359562 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b + (c ^ e ^ f) + d[5] + 4294588738 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[8] + 2272392833 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[11] + 1839030562 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[14] + 4259657740 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[1] + 2763975236 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[4] + 1272893353 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[7] + 4139469664 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[10] + 3200236656 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[13] + 681279174 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[0] + 3936430074 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[3] + 3572445317 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[6] + 76029189 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (c ^ e ^ f) + d[9] + 3654602809 & 4294967295;
  b = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b ^ c ^ e) + d[12] + 3873151461 & 4294967295;
  f = b + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b ^ c) + d[15] + 530742520 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b) + d[2] + 3299628645 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b + (e ^ (c | ~f)) + d[0] + 4096336452 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[7] + 1126891415 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[14] + 2878612391 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[5] + 4237533241 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[12] + 1700485571 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[3] + 2399980690 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[10] + 4293915773 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[1] + 2240044497 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[8] + 1873313359 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[15] + 4264355552 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[6] + 2734768916 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[13] + 1309151649 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b + (e ^ (c | ~f)) + d[4] + 4149444226 & 4294967295;
  b = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b | ~e)) + d[11] + 3174756917 & 4294967295;
  f = b + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b ^ (f | ~c)) + d[2] + 718787259 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b)) + d[9] + 3951481745 & 4294967295;
  a.g[0] = a.g[0] + b & 4294967295;
  a.g[1] = a.g[1] + (e + (h << 21 & 4294967295 | h >>> 11)) & 4294967295;
  a.g[2] = a.g[2] + e & 4294967295;
  a.g[3] = a.g[3] + f & 4294967295;
};
var T = function(a, b) {
  this.h = b;
  for (var c = [], d = true, e = a.length - 1;0 <= e; e--) {
    var f = a[e] | 0;
    d && f == b || (c[e] = f, d = false);
  }
  this.g = c;
};
var Td = function(a) {
  return -128 <= a && 128 > a ? ra(a, function(b) {
    return new T([b | 0], 0 > b ? -1 : 0);
  }) : new T([a | 0], 0 > a ? -1 : 0);
};
var U = function(a) {
  if (isNaN(a) || !isFinite(a))
    return V;
  if (0 > a)
    return W(U(-a));
  for (var b = [], c = 1, d = 0;a >= c; d++)
    b[d] = a / c | 0, c *= Ud;
  return new T(b, 0);
};
var Vd = function(a, b) {
  if (a.length == 0)
    throw Error("number format error: empty string");
  b = b || 10;
  if (2 > b || 36 < b)
    throw Error("radix out of range: " + b);
  if (a.charAt(0) == "-")
    return W(Vd(a.substring(1), b));
  if (0 <= a.indexOf("-"))
    throw Error('number format error: interior "-" character');
  for (var c = U(Math.pow(b, 8)), d = V, e = 0;e < a.length; e += 8) {
    var f = Math.min(8, a.length - e), h = parseInt(a.substring(e, e + f), b);
    8 > f ? (f = U(Math.pow(b, f)), d = d.R(f).add(U(h))) : (d = d.R(c), d = d.add(U(h)));
  }
  return d;
};
var Y = function(a) {
  if (a.h != 0)
    return false;
  for (var b = 0;b < a.g.length; b++)
    if (a.g[b] != 0)
      return false;
  return true;
};
var X = function(a) {
  return a.h == -1;
};
var W = function(a) {
  for (var b = a.g.length, c = [], d = 0;d < b; d++)
    c[d] = ~a.g[d];
  return new T(c, ~a.h).add(Wd);
};
var Zd = function(a, b) {
  return a.add(W(b));
};
var $d = function(a, b) {
  for (;(a[b] & 65535) != a[b]; )
    a[b + 1] += a[b] >>> 16, a[b] &= 65535, b++;
};
var ae = function(a, b) {
  this.g = a;
  this.h = b;
};
var Yd = function(a, b) {
  if (Y(b))
    throw Error("division by zero");
  if (Y(a))
    return new ae(V, V);
  if (X(a))
    return b = Yd(W(a), b), new ae(W(b.g), W(b.h));
  if (X(b))
    return b = Yd(a, W(b)), new ae(W(b.g), b.h);
  if (30 < a.g.length) {
    if (X(a) || X(b))
      throw Error("slowDivide_ only works with positive integers.");
    for (var c = Wd, d = b;0 >= d.X(a); )
      c = be(c), d = be(d);
    var e = Z(c, 1), f = Z(d, 1);
    d = Z(d, 2);
    for (c = Z(c, 2);!Y(d); ) {
      var h = f.add(d);
      0 >= h.X(a) && (e = e.add(c), f = h);
      d = Z(d, 1);
      c = Z(c, 1);
    }
    b = Zd(a, e.R(b));
    return new ae(e, b);
  }
  for (e = V;0 <= a.X(b); ) {
    c = Math.max(1, Math.floor(a.ea() / b.ea()));
    d = Math.ceil(Math.log(c) / Math.LN2);
    d = 48 >= d ? 1 : Math.pow(2, d - 48);
    f = U(c);
    for (h = f.R(b);X(h) || 0 < h.X(a); )
      c -= d, f = U(c), h = f.R(b);
    Y(f) && (f = Wd);
    e = e.add(f);
    a = Zd(a, h);
  }
  return new ae(e, a);
};
var be = function(a) {
  for (var b = a.g.length + 1, c = [], d = 0;d < b; d++)
    c[d] = a.D(d) << 1 | a.D(d - 1) >>> 31;
  return new T(c, a.h);
};
var Z = function(a, b) {
  var c = b >> 5;
  b %= 32;
  for (var d = a.g.length - c, e = [], f = 0;f < d; f++)
    e[f] = 0 < b ? a.D(f + c) >>> b | a.D(f + c + 1) << 32 - b : a.D(f + c);
  return new T(e, a.h);
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var esm = {};
var k;
var goog = goog || {};
var l = commonjsGlobal || self;
var ca = "closure_uid_" + (1e9 * Math.random() >>> 0);
var da = 0;
var ia = 0;
v.prototype.s = false;
v.prototype.sa = function() {
  if (!this.s && (this.s = true, this.N(), ia != 0)) {
    ba(this);
  }
};
v.prototype.N = function() {
  if (this.o)
    for (;this.o.length; )
      this.o.shift()();
};
var ka = Array.prototype.indexOf ? function(a, b) {
  return Array.prototype.indexOf.call(a, b, undefined);
} : function(a, b) {
  if (typeof a === "string")
    return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
  for (let c = 0;c < a.length; c++)
    if (c in a && a[c] === b)
      return c;
  return -1;
};
w.prototype.h = function() {
  this.defaultPrevented = true;
};
var oa = function() {
  if (!l.addEventListener || !Object.defineProperty)
    return false;
  var a = false, b = Object.defineProperty({}, "passive", { get: function() {
    a = true;
  } });
  try {
    const c = () => {
    };
    l.addEventListener("test", c, b);
    l.removeEventListener("test", c, b);
  } catch (c) {
  }
  return a;
}();
qa[" "] = function() {
};
var ta = y("Opera");
var z = y("Trident") || y("MSIE");
var ua = y("Edge");
var va = ua || z;
var wa = y("Gecko") && !(pa().toLowerCase().indexOf("webkit") != -1 && !y("Edge")) && !(y("Trident") || y("MSIE")) && !y("Edge");
var xa = pa().toLowerCase().indexOf("webkit") != -1 && !y("Edge");
var za;
a: {
  Aa = "", Ba = function() {
    var a = pa();
    if (wa)
      return /rv:([^\);]+)(\)|;)/.exec(a);
    if (ua)
      return /Edge\/([\d\.]+)/.exec(a);
    if (z)
      return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
    if (xa)
      return /WebKit\/(\S+)/.exec(a);
    if (ta)
      return /(?:Version)[ \/]?(\S+)/.exec(a);
  }();
  Ba && (Aa = Ba ? Ba[1] : "");
  if (z) {
    Ca = ya();
    if (Ca != null && Ca > parseFloat(Aa)) {
      za = String(Ca);
      break a;
    }
  }
  za = Aa;
}
var Aa;
var Ba;
var Ca;
var Da;
if (l.document && z) {
  Ea = ya();
  Da = Ea ? Ea : parseInt(za, 10) || undefined;
} else
  Da = undefined;
var Ea;
var Fa = Da;
r(A, w);
var Ga = { 2: "touch", 3: "pen", 4: "mouse" };
A.prototype.h = function() {
  A.$.h.call(this);
  var a = this.i;
  a.preventDefault ? a.preventDefault() : a.returnValue = false;
};
var Ha = "closure_listenable_" + (1e6 * Math.random() | 0);
var Ia = 0;
var Qa = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
Sa.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.g[f];
  a || (a = this.g[f] = [], this.h++);
  var h = Ta(a, b, d, e);
  -1 < h ? (b = a[h], c || (b.ia = false)) : (b = new Ja(b, this.src, f, !!d, e), b.ia = c, a.push(b));
  return b;
};
var Va = "closure_lm_" + (1e6 * Math.random() | 0);
var Wa = {};
var hb = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
r(B, v);
B.prototype[Ha] = true;
B.prototype.removeEventListener = function(a, b, c, d) {
  fb(this, a, b, c, d);
};
B.prototype.N = function() {
  B.$.N.call(this);
  if (this.i) {
    var a = this.i, c;
    for (c in a.g) {
      for (var d = a.g[c], e = 0;e < d.length; e++)
        Ma(d[e]);
      delete a.g[c];
      a.h--;
    }
  }
  this.J = null;
};
B.prototype.O = function(a, b, c, d) {
  return this.i.add(String(a), b, false, c, d);
};
B.prototype.P = function(a, b, c, d) {
  return this.i.add(String(a), b, true, c, d);
};
var jb = l.JSON.stringify;

class kb {
  constructor(a, b) {
    this.i = a;
    this.j = b;
    this.h = 0;
    this.g = null;
  }
  get() {
    let a;
    0 < this.h ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
    return a;
  }
}

class nb {
  constructor() {
    this.h = this.g = null;
  }
  add(a, b) {
    const c = ob.get();
    c.set(a, b);
    this.h ? this.h.next = c : this.g = c;
    this.h = c;
  }
}
var ob = new kb(() => new pb, (a) => a.reset());

class pb {
  constructor() {
    this.next = this.g = this.h = null;
  }
  set(a, b) {
    this.h = a;
    this.g = b;
    this.next = null;
  }
  reset() {
    this.next = this.g = this.h = null;
  }
}
var sb;
var tb = false;
var mb = new nb;
var vb = () => {
  const a = l.Promise.resolve(undefined);
  sb = () => {
    a.then(ub);
  };
};
var ub = () => {
  for (var a;a = lb(); ) {
    try {
      a.h.call(a.g);
    } catch (c) {
      rb(c);
    }
    var b = ob;
    b.j(a);
    100 > b.h && (b.h++, a.next = b.g, b.g = a);
  }
  tb = false;
};
r(wb, B);
k = wb.prototype;
k.ga = false;
k.T = null;
k.qb = function() {
  if (this.ga) {
    var a = Date.now() - this.l;
    0 < a && a < 0.8 * this.h ? this.T = this.g.setTimeout(this.j, this.h - a) : (this.T && (this.g.clearTimeout(this.T), this.T = null), C(this, "tick"), this.ga && (xb(this), this.start()));
  }
};
k.start = function() {
  this.ga = true;
  this.T || (this.T = this.g.setTimeout(this.j, this.h), this.l = Date.now());
};
k.N = function() {
  wb.$.N.call(this);
  xb(this);
  delete this.g;
};

class Ab extends v {
  constructor(a, b) {
    super();
    this.m = a;
    this.j = b;
    this.h = null;
    this.i = false;
    this.g = null;
  }
  l(a) {
    this.h = arguments;
    this.g ? this.i = true : zb(this);
  }
  N() {
    super.N();
    this.g && (l.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
  }
}
r(Bb, v);
var Cb = [];
Bb.prototype.N = function() {
  Bb.$.N.call(this);
  Fb(this);
};
Bb.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
Gb.prototype.Ea = function() {
  this.g = false;
};
Gb.prototype.info = function() {
};
var E = {};
var Lb = null;
E.Ta = "serverreachability";
r(Nb, w);
E.STAT_EVENT = "statevent";
r(Pb, w);
E.Ua = "timingevent";
r(Qb, w);
var Sb = { NO_ERROR: 0, rb: 1, Eb: 2, Db: 3, yb: 4, Cb: 5, Fb: 6, Qa: 7, TIMEOUT: 8, Ib: 9 };
var Tb = { wb: "complete", Sb: "success", Ra: "error", Qa: "abort", Kb: "ready", Lb: "readystatechange", TIMEOUT: "timeout", Gb: "incrementaldata", Jb: "progress", zb: "downloadprogress", $b: "uploadprogress" };
Ub.prototype.h = null;
var Xb = { OPEN: "a", vb: "b", Ra: "c", Hb: "d" };
r(Yb, w);
r(Zb, w);
var $b;
r(ac, Ub);
ac.prototype.g = function() {
  return new XMLHttpRequest;
};
ac.prototype.i = function() {
  return {};
};
$b = new ac;
var cc = 45000;
var ec = {};
var fc = {};
k = bc.prototype;
k.setTimeout = function(a) {
  this.P = a;
};
k.nb = function(a) {
  a = a.target;
  const b = this.M;
  b && H(a) == 3 ? b.l() : this.Pa(a);
};
k.Pa = function(a) {
  try {
    if (a == this.g)
      a: {
        const u = H(this.g);
        var b = this.g.Ia();
        const L = this.g.da();
        if (!(3 > u) && (u != 3 || va || this.g && (this.h.h || this.g.ja() || mc(this.g)))) {
          this.J || u != 4 || b == 7 || (b == 8 || 0 >= L ? Ob(3) : Ob(2));
          nc(this);
          var c = this.g.da();
          this.ca = c;
          b:
            if (oc(this)) {
              var d = mc(this.g);
              a = "";
              var e = d.length, f = H(this.g) == 4;
              if (!this.h.i) {
                if (typeof TextDecoder === "undefined") {
                  I(this);
                  pc(this);
                  var h = "";
                  break b;
                }
                this.h.i = new l.TextDecoder;
              }
              for (b = 0;b < e; b++)
                this.h.h = true, a += this.h.i.decode(d[b], { stream: f && b == e - 1 });
              d.length = 0;
              this.h.g += a;
              this.o = 0;
              h = this.h.g;
            } else
              h = this.g.ja();
          this.i = c == 200;
          Ib(this.j, this.v, this.B, this.m, this.W, u, c);
          if (this.i) {
            if (this.aa && !this.K) {
              b: {
                if (this.g) {
                  var n, t = this.g;
                  if ((n = t.g ? t.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !x(n)) {
                    var m = n;
                    break b;
                  }
                }
                m = null;
              }
              if (c = m)
                D(this.j, this.m, c, "Initial handshake response via X-HTTP-Initial-Response"), this.K = true, qc(this, c);
              else {
                this.i = false;
                this.s = 3;
                F(12);
                I(this);
                pc(this);
                break a;
              }
            }
            this.S ? (rc(this, u, h), va && this.i && u == 3 && (Eb(this.U, this.V, "tick", this.mb), this.V.start())) : (D(this.j, this.m, h, null), qc(this, h));
            u == 4 && I(this);
            this.i && !this.J && (u == 4 ? sc(this.l, this) : (this.i = false, jc(this)));
          } else
            tc(this.g), c == 400 && 0 < h.indexOf("Unknown SID") ? (this.s = 3, F(12)) : (this.s = 0, F(13)), I(this), pc(this);
        }
      }
  } catch (u) {
  } finally {
  }
};
k.mb = function() {
  if (this.g) {
    var a = H(this.g), b = this.g.ja();
    this.o < b.length && (nc(this), rc(this, a, b), this.i && a != 4 && jc(this));
  }
};
k.cancel = function() {
  this.J = true;
  I(this);
};
k.lb = function() {
  this.C = null;
  const a = Date.now();
  0 <= a - this.Y ? (Kb(this.j, this.B), this.L != 2 && (Ob(), F(17)), I(this), this.s = 2, pc(this)) : wc(this, this.Y - a);
};
var Lc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
M.prototype.toString = function() {
  var a = [], b = this.j;
  b && a.push(Sc(b, Tc, true), ":");
  var c = this.g;
  if (c || b == "file")
    a.push("//"), (b = this.s) && a.push(Sc(b, Tc, true), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.m, c != null && a.push(":", String(c));
  if (c = this.l)
    this.g && c.charAt(0) != "/" && a.push("/"), a.push(Sc(c, c.charAt(0) == "/" ? Uc : Vc, true));
  (c = this.i.toString()) && a.push("?", c);
  (c = this.o) && a.push("#", Sc(c, Wc));
  return a.join("");
};
var Tc = /[#\/\?@]/g;
var Vc = /[#\?:]/g;
var Uc = /[#\?]/g;
var Yc = /[#\?@]/g;
var Wc = /#/g;
k = Pc.prototype;
k.add = function(a, b) {
  N(this);
  this.i = null;
  a = O(this, a);
  var c = this.g.get(a);
  c || this.g.set(a, c = []);
  c.push(b);
  this.h += 1;
  return this;
};
k.forEach = function(a, b) {
  N(this);
  this.g.forEach(function(c, d) {
    c.forEach(function(e) {
      a.call(b, e, d, this);
    }, this);
  }, this);
};
k.ta = function() {
  N(this);
  const a = Array.from(this.g.values()), b = Array.from(this.g.keys()), c = [];
  for (let d = 0;d < b.length; d++) {
    const e = a[d];
    for (let f = 0;f < e.length; f++)
      c.push(b[d]);
  }
  return c;
};
k.Z = function(a) {
  N(this);
  let b = [];
  if (typeof a === "string")
    ad(this, a) && (b = b.concat(this.g.get(O(this, a))));
  else {
    a = Array.from(this.g.values());
    for (let c = 0;c < a.length; c++)
      b = b.concat(a[c]);
  }
  return b;
};
k.set = function(a, b) {
  N(this);
  this.i = null;
  a = O(this, a);
  ad(this, a) && (this.h -= this.g.get(a).length);
  this.g.set(a, [b]);
  this.h += 1;
  return this;
};
k.get = function(a, b) {
  if (!a)
    return b;
  a = this.Z(a);
  return 0 < a.length ? String(a[0]) : b;
};
k.toString = function() {
  if (this.i)
    return this.i;
  if (!this.g)
    return "";
  const a = [], b = Array.from(this.g.keys());
  for (var c = 0;c < b.length; c++) {
    var d = b[c];
    const f = encodeURIComponent(String(d)), h = this.Z(d);
    for (d = 0;d < h.length; d++) {
      var e = f;
      h[d] !== "" && (e += "=" + encodeURIComponent(String(h[d])));
      a.push(e);
    }
  }
  return this.i = a.join("&");
};
var bd = class {
  constructor(a, b) {
    this.g = a;
    this.map = b;
  }
};
var dd = 10;
cd.prototype.cancel = function() {
  this.i = fd(this);
  if (this.h)
    this.h.cancel(), this.h = null;
  else if (this.g && this.g.size !== 0) {
    for (const a of this.g.values())
      a.cancel();
    this.g.clear();
  }
};
var gd = class {
  stringify(a) {
    return l.JSON.stringify(a, undefined);
  }
  parse(a) {
    return l.JSON.parse(a, undefined);
  }
};
r(ld, Ub);
ld.prototype.g = function() {
  return new md(this.l, this.j);
};
ld.prototype.i = function(a) {
  return function() {
    return a;
  };
}({});
r(md, B);
var nd = 0;
k = md.prototype;
k.open = function(a, b) {
  if (this.readyState != nd)
    throw this.abort(), Error("Error reopening a connection");
  this.C = a;
  this.B = b;
  this.readyState = 1;
  od(this);
};
k.send = function(a) {
  if (this.readyState != 1)
    throw this.abort(), Error("need to call open() first. ");
  this.g = true;
  const b = { headers: this.v, method: this.C, credentials: this.m, cache: undefined };
  a && (b.body = a);
  (this.F || l).fetch(new Request(this.B, b)).then(this.$a.bind(this), this.ka.bind(this));
};
k.abort = function() {
  this.response = this.responseText = "";
  this.v = new Headers;
  this.status = 0;
  this.j && this.j.cancel("Request was aborted.").catch(() => {
  });
  1 <= this.readyState && this.g && this.readyState != 4 && (this.g = false, pd(this));
  this.readyState = nd;
};
k.$a = function(a) {
  if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, od(this)), this.g && (this.readyState = 3, od(this), this.g)))
    if (this.responseType === "arraybuffer")
      a.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this));
    else if (typeof l.ReadableStream !== "undefined" && "body" in a) {
      this.j = a.body.getReader();
      if (this.u) {
        if (this.responseType)
          throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        this.response = [];
      } else
        this.response = this.responseText = "", this.A = new TextDecoder;
      qd(this);
    } else
      a.text().then(this.Za.bind(this), this.ka.bind(this));
};
k.Xa = function(a) {
  if (this.g) {
    if (this.u && a.value)
      this.response.push(a.value);
    else if (!this.u) {
      var b = a.value ? a.value : new Uint8Array(0);
      if (b = this.A.decode(b, { stream: !a.done }))
        this.response = this.responseText += b;
    }
    a.done ? pd(this) : od(this);
    this.readyState == 3 && qd(this);
  }
};
k.Za = function(a) {
  this.g && (this.response = this.responseText = a, pd(this));
};
k.Ya = function(a) {
  this.g && (this.response = a, pd(this));
};
k.ka = function() {
  this.g && pd(this);
};
k.setRequestHeader = function(a, b) {
  this.v.append(a, b);
};
k.getResponseHeader = function(a) {
  return this.h ? this.h.get(a.toLowerCase()) || "" : "";
};
k.getAllResponseHeaders = function() {
  if (!this.h)
    return "";
  const a = [], b = this.h.entries();
  for (var c = b.next();!c.done; )
    c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
  return a.join("\r\n");
};
Object.defineProperty(md.prototype, "withCredentials", { get: function() {
  return this.m === "include";
}, set: function(a) {
  this.m = a ? "include" : "same-origin";
} });
var rd = l.JSON.parse;
r(P, B);
var sd = "";
var td = /^https?$/i;
var ud = ["POST", "PUT"];
k = P.prototype;
k.Oa = function(a) {
  this.M = a;
};
k.ha = function(a, b, c, d) {
  if (this.g)
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.I + "; newUri=" + a);
  b = b ? b.toUpperCase() : "GET";
  this.I = a;
  this.j = "";
  this.m = 0;
  this.F = false;
  this.h = true;
  this.g = this.u ? this.u.g() : $b.g();
  this.C = this.u ? Vb(this.u) : Vb($b);
  this.g.onreadystatechange = q(this.La, this);
  try {
    this.G = true, this.g.open(b, String(a), true), this.G = false;
  } catch (f) {
    vd(this, f);
    return;
  }
  a = c || "";
  c = new Map(this.headers);
  if (d)
    if (Object.getPrototypeOf(d) === Object.prototype)
      for (var e in d)
        c.set(e, d[e]);
    else if (typeof d.keys === "function" && typeof d.get === "function")
      for (const f of d.keys())
        c.set(f, d.get(f));
    else
      throw Error("Unknown input type for opt_headers: " + String(d));
  d = Array.from(c.keys()).find((f) => f.toLowerCase() == "content-type");
  e = l.FormData && a instanceof l.FormData;
  !(0 <= ka(ud, b)) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  for (const [f, h] of c)
    this.g.setRequestHeader(f, h);
  this.K && (this.g.responseType = this.K);
  "withCredentials" in this.g && this.g.withCredentials !== this.M && (this.g.withCredentials = this.M);
  try {
    wd(this), 0 < this.B && ((this.L = xd(this.g)) ? (this.g.timeout = this.B, this.g.ontimeout = q(this.ua, this)) : this.A = yb(this.ua, this.B, this)), this.v = true, this.g.send(a), this.v = false;
  } catch (f) {
    vd(this, f);
  }
};
k.ua = function() {
  typeof goog != "undefined" && this.g && (this.j = "Timed out after " + this.B + "ms, aborting", this.m = 8, C(this, "timeout"), this.abort(8));
};
k.abort = function(a) {
  this.g && this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false, this.m = a || 7, C(this, "complete"), C(this, "abort"), zd(this));
};
k.N = function() {
  this.g && (this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false), zd(this, true));
  P.$.N.call(this);
};
k.La = function() {
  this.s || (this.G || this.v || this.l ? Ad(this) : this.kb());
};
k.kb = function() {
  Ad(this);
};
k.isActive = function() {
  return !!this.g;
};
k.da = function() {
  try {
    return 2 < H(this) ? this.g.status : -1;
  } catch (a) {
    return -1;
  }
};
k.ja = function() {
  try {
    return this.g ? this.g.responseText : "";
  } catch (a) {
    return "";
  }
};
k.Wa = function(a) {
  if (this.g) {
    var b = this.g.responseText;
    a && b.indexOf(a) == 0 && (b = b.substring(a.length));
    return rd(b);
  }
};
k.Ia = function() {
  return this.m;
};
k.Sa = function() {
  return typeof this.j === "string" ? this.j : String(this.j);
};
k = Ed.prototype;
k.ra = 8;
k.H = 1;
k.Na = function(a) {
  if (this.m)
    if (this.m = null, this.H == 1) {
      if (!a) {
        this.W = Math.floor(1e5 * Math.random());
        a = this.W++;
        const e = new bc(this, this.l, a);
        let f = this.s;
        this.U && (f ? (f = Pa(f), Ra(f, this.U)) : f = this.U);
        this.o !== null || this.O || (e.I = f, f = null);
        if (this.P)
          a: {
            var b = 0;
            for (var c = 0;c < this.j.length; c++) {
              b: {
                var d = this.j[c];
                if ("__data__" in d.map && (d = d.map.__data__, typeof d === "string")) {
                  d = d.length;
                  break b;
                }
                d = undefined;
              }
              if (d === undefined)
                break;
              b += d;
              if (4096 < b) {
                b = c;
                break a;
              }
              if (b === 4096 || c === this.j.length - 1) {
                b = c + 1;
                break a;
              }
            }
            b = 1000;
          }
        else
          b = 1000;
        b = Kd(this, e, b);
        c = G(this.I);
        K(c, "RID", a);
        K(c, "CVER", 22);
        this.F && K(c, "X-HTTP-Session-Id", this.F);
        Gd(this, c);
        f && (this.O ? b = "headers=" + encodeURIComponent(String(Bd(f))) + "&" + b : this.o && Cd(c, this.o, f));
        Cc(this.i, e);
        this.bb && K(c, "TYPE", "init");
        this.P ? (K(c, "$req", b), K(c, "SID", "null"), e.aa = true, gc(e, c, null)) : gc(e, c, b);
        this.H = 2;
      }
    } else
      this.H == 3 && (a ? Ld(this, a) : this.j.length == 0 || ed(this.i) || Ld(this));
};
k.Ma = function() {
  this.u = null;
  Md(this);
  if (this.ca && !(this.M || this.g == null || 0 >= this.S)) {
    var a = 2 * this.S;
    this.l.info("BP detection timer enabled: " + a);
    this.B = Rb(q(this.jb, this), a);
  }
};
k.jb = function() {
  this.B && (this.B = null, this.l.info("BP detection timeout reached."), this.l.info("Buffering proxy detected and switch to long-polling!"), this.G = false, this.M = true, F(10), zc(this), Md(this));
};
k.ib = function() {
  this.v != null && (this.v = null, zc(this), Ac(this), F(19));
};
k.pb = function(a) {
  a ? (this.l.info("Successfully pinged google.com"), F(2)) : (this.l.info("Failed to ping google.com"), F(1));
};
k.isActive = function() {
  return !!this.h && this.h.isActive(this);
};
k = Nd.prototype;
k.Ba = function() {
};
k.Aa = function() {
};
k.za = function() {
};
k.ya = function() {
};
k.isActive = function() {
  return true;
};
k.Va = function() {
};
Od.prototype.g = function(a, b) {
  return new Q(a, b);
};
r(Q, B);
Q.prototype.m = function() {
  this.g.h = this.j;
  this.A && (this.g.J = true);
  var a = this.g, b = this.l, c = this.h || undefined;
  F(0);
  a.Y = b;
  a.na = c || {};
  a.G = a.aa;
  a.I = Dc(a, null, a.Y);
  Gc(a);
};
Q.prototype.close = function() {
  Hc(this.g);
};
Q.prototype.u = function(a) {
  var b = this.g;
  if (typeof a === "string") {
    var c = {};
    c.__data__ = a;
    a = c;
  } else
    this.v && (c = {}, c.__data__ = jb(a), a = c);
  b.j.push(new bd(b.fb++, a));
  b.H == 3 && Gc(b);
};
Q.prototype.N = function() {
  this.g.h = null;
  delete this.j;
  Hc(this.g);
  delete this.g;
  Q.$.N.call(this);
};
r(Pd, Yb);
r(Qd, Zb);
r(R, Nd);
R.prototype.Ba = function() {
  C(this.g, "a");
};
R.prototype.Aa = function(a) {
  C(this.g, new Pd(a));
};
R.prototype.za = function(a) {
  C(this.g, new Qd);
};
R.prototype.ya = function() {
  C(this.g, "b");
};
r(S, Rd);
S.prototype.reset = function() {
  this.g[0] = 1732584193;
  this.g[1] = 4023233417;
  this.g[2] = 2562383102;
  this.g[3] = 271733878;
  this.i = this.h = 0;
};
S.prototype.j = function(a, b) {
  b === undefined && (b = a.length);
  for (var c = b - this.blockSize, d = this.m, e = this.h, f = 0;f < b; ) {
    if (e == 0)
      for (;f <= c; )
        Sd(this, a, f), f += this.blockSize;
    if (typeof a === "string")
      for (;f < b; ) {
        if (d[e++] = a.charCodeAt(f++), e == this.blockSize) {
          Sd(this, d);
          e = 0;
          break;
        }
      }
    else
      for (;f < b; )
        if (d[e++] = a[f++], e == this.blockSize) {
          Sd(this, d);
          e = 0;
          break;
        }
  }
  this.h = e;
  this.i += b;
};
S.prototype.l = function() {
  var a = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
  a[0] = 128;
  for (var b = 1;b < a.length - 8; ++b)
    a[b] = 0;
  var c = 8 * this.i;
  for (b = a.length - 8;b < a.length; ++b)
    a[b] = c & 255, c /= 256;
  this.j(a);
  a = Array(16);
  for (b = c = 0;4 > b; ++b)
    for (var d = 0;32 > d; d += 8)
      a[c++] = this.g[b] >>> d & 255;
  return a;
};
var sa = {};
var Ud = 4294967296;
var V = Td(0);
var Wd = Td(1);
var Xd = Td(16777216);
k = T.prototype;
k.ea = function() {
  if (X(this))
    return -W(this).ea();
  for (var a = 0, b = 1, c = 0;c < this.g.length; c++) {
    var d = this.D(c);
    a += (0 <= d ? d : Ud + d) * b;
    b *= Ud;
  }
  return a;
};
k.toString = function(a) {
  a = a || 10;
  if (2 > a || 36 < a)
    throw Error("radix out of range: " + a);
  if (Y(this))
    return "0";
  if (X(this))
    return "-" + W(this).toString(a);
  for (var b = U(Math.pow(a, 6)), c = this, d = "";; ) {
    var e = Yd(c, b).g;
    c = Zd(c, e.R(b));
    var f = ((0 < c.g.length ? c.g[0] : c.h) >>> 0).toString(a);
    c = e;
    if (Y(c))
      return f + d;
    for (;6 > f.length; )
      f = "0" + f;
    d = f + d;
  }
};
k.D = function(a) {
  return 0 > a ? 0 : a < this.g.length ? this.g[a] : this.h;
};
k.X = function(a) {
  a = Zd(this, a);
  return X(a) ? -1 : Y(a) ? 0 : 1;
};
k.abs = function() {
  return X(this) ? W(this) : this;
};
k.add = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0, e = 0;e <= b; e++) {
    var f = d + (this.D(e) & 65535) + (a.D(e) & 65535), h = (f >>> 16) + (this.D(e) >>> 16) + (a.D(e) >>> 16);
    d = h >>> 16;
    f &= 65535;
    h &= 65535;
    c[e] = h << 16 | f;
  }
  return new T(c, c[c.length - 1] & -2147483648 ? -1 : 0);
};
k.R = function(a) {
  if (Y(this) || Y(a))
    return V;
  if (X(this))
    return X(a) ? W(this).R(W(a)) : W(W(this).R(a));
  if (X(a))
    return W(this.R(W(a)));
  if (0 > this.X(Xd) && 0 > a.X(Xd))
    return U(this.ea() * a.ea());
  for (var b = this.g.length + a.g.length, c = [], d = 0;d < 2 * b; d++)
    c[d] = 0;
  for (d = 0;d < this.g.length; d++)
    for (var e = 0;e < a.g.length; e++) {
      var f = this.D(d) >>> 16, h = this.D(d) & 65535, n = a.D(e) >>> 16, t = a.D(e) & 65535;
      c[2 * d + 2 * e] += h * t;
      $d(c, 2 * d + 2 * e);
      c[2 * d + 2 * e + 1] += f * t;
      $d(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 1] += h * n;
      $d(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 2] += f * n;
      $d(c, 2 * d + 2 * e + 2);
    }
  for (d = 0;d < b; d++)
    c[d] = c[2 * d + 1] << 16 | c[2 * d];
  for (d = b;d < 2 * b; d++)
    c[d] = 0;
  return new T(c, 0);
};
k.gb = function(a) {
  return Yd(this, a).h;
};
k.and = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) & a.D(d);
  return new T(c, this.h & a.h);
};
k.or = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) | a.D(d);
  return new T(c, this.h | a.h);
};
k.xor = function(a) {
  for (var b = Math.max(this.g.length, a.g.length), c = [], d = 0;d < b; d++)
    c[d] = this.D(d) ^ a.D(d);
  return new T(c, this.h ^ a.h);
};
Od.prototype.createWebChannel = Od.prototype.g;
Q.prototype.send = Q.prototype.u;
Q.prototype.open = Q.prototype.m;
Q.prototype.close = Q.prototype.close;
Sb.NO_ERROR = 0;
Sb.TIMEOUT = 8;
Sb.HTTP_ERROR = 6;
Tb.COMPLETE = "complete";
Wb.EventType = Xb;
Xb.OPEN = "a";
Xb.CLOSE = "b";
Xb.ERROR = "c";
Xb.MESSAGE = "d";
B.prototype.listen = B.prototype.O;
P.prototype.listenOnce = P.prototype.P;
P.prototype.getLastError = P.prototype.Sa;
P.prototype.getLastErrorCode = P.prototype.Ia;
P.prototype.getStatus = P.prototype.da;
P.prototype.getResponseJson = P.prototype.Wa;
P.prototype.getResponseText = P.prototype.ja;
P.prototype.send = P.prototype.ha;
P.prototype.setWithCredentials = P.prototype.Oa;
S.prototype.digest = S.prototype.l;
S.prototype.reset = S.prototype.reset;
S.prototype.update = S.prototype.j;
T.prototype.add = T.prototype.add;
T.prototype.multiply = T.prototype.R;
T.prototype.modulo = T.prototype.gb;
T.prototype.compare = T.prototype.X;
T.prototype.toNumber = T.prototype.ea;
T.prototype.toString = T.prototype.toString;
T.prototype.getBits = T.prototype.D;
T.fromNumber = U;
T.fromString = Vd;
var createWebChannelTransport = esm.createWebChannelTransport = function() {
  return new Od;
};
var getStatEventTarget = esm.getStatEventTarget = function() {
  return Mb();
};
var ErrorCode = esm.ErrorCode = Sb;
var EventType = esm.EventType = Tb;
var Event = esm.Event = E;
var Stat = esm.Stat = { xb: 0, Ab: 1, Bb: 2, Ub: 3, Zb: 4, Wb: 5, Xb: 6, Vb: 7, Tb: 8, Yb: 9, PROXY: 10, NOPROXY: 11, Rb: 12, Nb: 13, Ob: 14, Mb: 15, Pb: 16, Qb: 17, tb: 18, sb: 19, ub: 20 };
var FetchXmlHttpFactory = esm.FetchXmlHttpFactory = ld;
var WebChannel = esm.WebChannel = Wb;
var XhrIo = esm.XhrIo = P;
var Md5 = esm.Md5 = S;
var Integer = esm.Integer = T;

// node_modules/@firebase/firestore/dist/index.esm2017.js
var __PRIVATE_logDebug = function(e, ...t) {
  if (b.logLevel <= LogLevel.DEBUG) {
    const n = t.map(__PRIVATE_argToString);
    b.debug(`Firestore (${S2}): ${e}`, ...n);
  }
};
var __PRIVATE_logError = function(e, ...t) {
  if (b.logLevel <= LogLevel.ERROR) {
    const n = t.map(__PRIVATE_argToString);
    b.error(`Firestore (${S2}): ${e}`, ...n);
  }
};
var __PRIVATE_logWarn = function(e, ...t) {
  if (b.logLevel <= LogLevel.WARN) {
    const n = t.map(__PRIVATE_argToString);
    b.warn(`Firestore (${S2}): ${e}`, ...n);
  }
};
var __PRIVATE_argToString = function(e) {
  if (typeof e == "string")
    return e;
  try {
    return function __PRIVATE_formatJSON(e2) {
      return JSON.stringify(e2);
    }(e);
  } catch (t) {
    return e;
  }
};
var fail = function(e = "Unexpected state") {
  const t = `FIRESTORE (${S2}) INTERNAL ASSERTION FAILED: ` + e;
  throw __PRIVATE_logError(t), new Error(t);
};
var __PRIVATE_hardAssert = function(e, t) {
  e || fail();
};
var __PRIVATE_randomBytes = function(e) {
  const t = typeof self != "undefined" && (self.crypto || self.msCrypto), n = new Uint8Array(e);
  if (t && typeof t.getRandomValues == "function")
    t.getRandomValues(n);
  else
    for (let t2 = 0;t2 < e; t2++)
      n[t2] = Math.floor(256 * Math.random());
  return n;
};
var __PRIVATE_primitiveComparator = function(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
};
var __PRIVATE_isIndexedDbTransactionError = function(e) {
  return e.name === "IndexedDbTransactionError";
};
var __PRIVATE_isNegativeZero = function(e) {
  return e === 0 && 1 / e == -1 / 0;
};
var __PRIVATE_normalizeNumber = function(e) {
  return typeof e == "number" ? e : typeof e == "string" ? Number(e) : 0;
};
var __PRIVATE_normalizeByteString = function(e) {
  return typeof e == "string" ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
};
var __PRIVATE_isMaxValue = function(e) {
  return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === "__max__";
};
var getDocument = function() {
  return typeof document != "undefined" ? document : null;
};
var __PRIVATE_wrapInUserErrorIfRecoverable = function(e, t) {
  if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e))
    return new FirestoreError(D2.UNAVAILABLE, `${t}: ${e}`);
  throw e;
};
var __PRIVATE_cloneLongPollingOptions = function(e) {
  const t = {};
  return e.timeoutSeconds !== undefined && (t.timeoutSeconds = e.timeoutSeconds), t;
};
var __PRIVATE_validateIsNotUsedTogether = function(e, t, n, r2) {
  if (t === true && r2 === true)
    throw new FirestoreError(D2.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
};
var __PRIVATE_valueDescription = function(e) {
  if (e === undefined)
    return "undefined";
  if (e === null)
    return "null";
  if (typeof e == "string")
    return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean")
    return "" + e;
  if (typeof e == "object") {
    if (e instanceof Array)
      return "an array";
    {
      const t = function __PRIVATE_tryGetCustomObjectType(e2) {
        if (e2.constructor)
          return e2.constructor.name;
        return null;
      }(e);
      return t ? `a custom ${t} object` : "an object";
    }
  }
  return typeof e == "function" ? "a function" : fail();
};
var __PRIVATE_cast = function(e, t) {
  if ("_delegate" in e && (e = e._delegate), !(e instanceof t)) {
    if (t.name === e.constructor.name)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const n = __PRIVATE_valueDescription(e);
      throw new FirestoreError(D2.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
    }
  }
  return e;
};
var connectFirestoreEmulator = function(e, t, n, r2 = {}) {
  var i;
  const s = (e = __PRIVATE_cast(e, Firestore$1))._getSettings(), o = `${t}:${n}`;
  if (s.host !== "firestore.googleapis.com" && s.host !== o && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."), e._setSettings(Object.assign(Object.assign({}, s), {
    host: o,
    ssl: false
  })), r2.mockUserToken) {
    let t2, n2;
    if (typeof r2.mockUserToken == "string")
      t2 = r2.mockUserToken, n2 = User.MOCK_USER;
    else {
      t2 = createMockUserToken(r2.mockUserToken, (i = e._app) === null || i === undefined ? undefined : i.options.projectId);
      const s2 = r2.mockUserToken.sub || r2.mockUserToken.user_id;
      if (!s2)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
      n2 = new User(s2);
    }
    e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t2, n2));
  }
};
var getFirestore = function(t, n) {
  const r2 = typeof t == "object" ? t : getApp(), i = typeof t == "string" ? t : n || "(default)", s = _getProvider(r2, "firestore").getImmediate({
    identifier: i
  });
  if (!s._initialized) {
    const e = getDefaultEmulatorHostnameAndPort("firestore");
    e && connectFirestoreEmulator(s, ...e);
  }
  return s;
};
var __PRIVATE_configureFirestore = function(e) {
  var t, n, r2;
  const i = e._freezeSettings(), s = function __PRIVATE_makeDatabaseInfo(e2, t2, n2, r3) {
    return new DatabaseInfo(e2, t2, n2, r3.host, r3.ssl, r3.experimentalForceLongPolling, r3.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(r3.experimentalLongPollingOptions), r3.useFetchStreams);
  }(e._databaseId, ((t = e._app) === null || t === undefined ? undefined : t.options.appId) || "", e._persistenceKey, i);
  e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, s), ((n = i.localCache) === null || n === undefined ? undefined : n._offlineComponentProvider) && ((r2 = i.localCache) === null || r2 === undefined ? undefined : r2._onlineComponentProvider) && (e._firestoreClient._uninitializedComponentsProvider = {
    _offlineKind: i.localCache.kind,
    _offline: i.localCache._offlineComponentProvider,
    _online: i.localCache._onlineComponentProvider
  });
};
var w2 = "@firebase/firestore";

class User {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return this.uid != null;
  }
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
User.UNAUTHENTICATED = new User(null), User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
var S2 = "10.8.0";
var b = new Logger("@firebase/firestore");
var D2 = {
  OK: "ok",
  CANCELLED: "cancelled",
  UNKNOWN: "unknown",
  INVALID_ARGUMENT: "invalid-argument",
  DEADLINE_EXCEEDED: "deadline-exceeded",
  NOT_FOUND: "not-found",
  ALREADY_EXISTS: "already-exists",
  PERMISSION_DENIED: "permission-denied",
  UNAUTHENTICATED: "unauthenticated",
  RESOURCE_EXHAUSTED: "resource-exhausted",
  FAILED_PRECONDITION: "failed-precondition",
  ABORTED: "aborted",
  OUT_OF_RANGE: "out-of-range",
  UNIMPLEMENTED: "unimplemented",
  INTERNAL: "internal",
  UNAVAILABLE: "unavailable",
  DATA_LOSS: "data-loss"
};

class FirestoreError extends FirebaseError {
  constructor(e, t) {
    super(e, t), this.code = e, this.message = t, this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
}

class __PRIVATE_Deferred {
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}

class __PRIVATE_OAuthToken {
  constructor(e, t) {
    this.user = t, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", `Bearer ${e}`);
  }
}

class __PRIVATE_EmptyAuthCredentialsProvider {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.UNAUTHENTICATED));
  }
  shutdown() {
  }
}

class __PRIVATE_EmulatorAuthCredentialsProvider {
  constructor(e) {
    this.token = e, this.changeListener = null;
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {
  }
  start(e, t) {
    this.changeListener = t, e.enqueueRetryable(() => t(this.token.user));
  }
  shutdown() {
    this.changeListener = null;
  }
}

class __PRIVATE_FirebaseAuthCredentialsProvider {
  constructor(e) {
    this.t = e, this.currentUser = User.UNAUTHENTICATED, this.i = 0, this.forceRefresh = false, this.auth = null;
  }
  start(e, t) {
    let n = this.i;
    const __PRIVATE_guardedChangeListener = (e2) => this.i !== n ? (n = this.i, t(e2)) : Promise.resolve();
    let r2 = new __PRIVATE_Deferred;
    this.o = () => {
      this.i++, this.currentUser = this.u(), r2.resolve(), r2 = new __PRIVATE_Deferred, e.enqueueRetryable(() => __PRIVATE_guardedChangeListener(this.currentUser));
    };
    const __PRIVATE_awaitNextToken = () => {
      const t2 = r2;
      e.enqueueRetryable(async () => {
        await t2.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
      });
    }, __PRIVATE_registerAuth = (e2) => {
      __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e2, this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken();
    };
    this.t.onInit((e2) => __PRIVATE_registerAuth(e2)), setTimeout(() => {
      if (!this.auth) {
        const e2 = this.t.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAuth(e2) : (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r2.resolve(), r2 = new __PRIVATE_Deferred);
      }
    }, 0), __PRIVATE_awaitNextToken();
  }
  getToken() {
    const e = this.i, t = this.forceRefresh;
    return this.forceRefresh = false, this.auth ? this.auth.getToken(t).then((t2) => this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t2 ? (__PRIVATE_hardAssert(typeof t2.accessToken == "string"), new __PRIVATE_OAuthToken(t2.accessToken, this.currentUser)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.auth && this.auth.removeAuthTokenListener(this.o);
  }
  u() {
    const e = this.auth && this.auth.getUid();
    return __PRIVATE_hardAssert(e === null || typeof e == "string"), new User(e);
  }
}

class __PRIVATE_FirstPartyToken {
  constructor(e, t, n) {
    this.l = e, this.h = t, this.P = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.I = new Map;
  }
  T() {
    return this.P ? this.P() : null;
  }
  get headers() {
    this.I.set("X-Goog-AuthUser", this.l);
    const e = this.T();
    return e && this.I.set("Authorization", e), this.h && this.I.set("X-Goog-Iam-Authorization-Token", this.h), this.I;
  }
}

class __PRIVATE_FirstPartyAuthCredentialsProvider {
  constructor(e, t, n) {
    this.l = e, this.h = t, this.P = n;
  }
  getToken() {
    return Promise.resolve(new __PRIVATE_FirstPartyToken(this.l, this.h, this.P));
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.FIRST_PARTY));
  }
  shutdown() {
  }
  invalidateToken() {
  }
}

class AppCheckToken {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = new Map, e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
}

class __PRIVATE_FirebaseAppCheckTokenProvider {
  constructor(e) {
    this.A = e, this.forceRefresh = false, this.appCheck = null, this.R = null;
  }
  start(e, t) {
    const onTokenChanged = (e2) => {
      e2.error != null && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e2.error.message}`);
      const n = e2.token !== this.R;
      return this.R = e2.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e2.token) : Promise.resolve();
    };
    this.o = (t2) => {
      e.enqueueRetryable(() => onTokenChanged(t2));
    };
    const __PRIVATE_registerAppCheck = (e2) => {
      __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e2, this.appCheck.addTokenListener(this.o);
    };
    this.A.onInit((e2) => __PRIVATE_registerAppCheck(e2)), setTimeout(() => {
      if (!this.appCheck) {
        const e2 = this.A.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAppCheck(e2) : __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
      }
    }, 0);
  }
  getToken() {
    const e = this.forceRefresh;
    return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e).then((e2) => e2 ? (__PRIVATE_hardAssert(typeof e2.token == "string"), this.R = e2.token, new AppCheckToken(e2.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.appCheck && this.appCheck.removeTokenListener(this.o);
  }
}
class __PRIVATE_AutoId {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = Math.floor(256 / e.length) * e.length;
    let n = "";
    for (;n.length < 20; ) {
      const r2 = __PRIVATE_randomBytes(40);
      for (let i = 0;i < r2.length; ++i)
        n.length < 20 && r2[i] < t && (n += e.charAt(r2[i] % e.length));
    }
    return n;
  }
}
class BasePath {
  constructor(e, t, n) {
    t === undefined ? t = 0 : t > e.length && fail(), n === undefined ? n = e.length - t : n > e.length - t && fail(), this.segments = e, this.offset = t, this.len = n;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return BasePath.comparator(this, e) === 0;
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return e instanceof BasePath ? e.forEach((e2) => {
      t.push(e2);
    }) : t.push(e), this.construct(t);
  }
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = e === undefined ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return this.length === 0;
  }
  isPrefixOf(e) {
    if (e.length < this.length)
      return false;
    for (let t = 0;t < this.length; t++)
      if (this.get(t) !== e.get(t))
        return false;
    return true;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length)
      return false;
    for (let t = 0;t < this.length; t++)
      if (this.get(t) !== e.get(t))
        return false;
    return true;
  }
  forEach(e) {
    for (let t = this.offset, n = this.limit();t < n; t++)
      e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  static comparator(e, t) {
    const n = Math.min(e.length, t.length);
    for (let r2 = 0;r2 < n; r2++) {
      const n2 = e.get(r2), i = t.get(r2);
      if (n2 < i)
        return -1;
      if (n2 > i)
        return 1;
    }
    return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
  }
}

class ResourcePath extends BasePath {
  construct(e, t, n) {
    return new ResourcePath(e, t, n);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join("/");
  }
  static fromString(...e) {
    const t = [];
    for (const n of e) {
      if (n.indexOf("//") >= 0)
        throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
      t.push(...n.split("/").filter((e2) => e2.length > 0));
    }
    return new ResourcePath(t);
  }
  static emptyPath() {
    return new ResourcePath([]);
  }
}
class DocumentKey {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new DocumentKey(ResourcePath.fromString(e));
  }
  static fromName(e) {
    return new DocumentKey(ResourcePath.fromString(e).popFirst(5));
  }
  static empty() {
    return new DocumentKey(ResourcePath.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return e !== null && ResourcePath.comparator(this.path, e.path) === 0;
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return ResourcePath.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  static fromSegments(e) {
    return new DocumentKey(new ResourcePath(e.slice()));
  }
}

class FieldIndex {
  constructor(e, t, n, r2) {
    this.indexId = e, this.collectionGroup = t, this.fields = n, this.indexState = r2;
  }
}
FieldIndex.UNKNOWN_ID = -1;
class __PRIVATE_ListenSequence {
  constructor(e, t) {
    this.previousValue = e, t && (t.sequenceNumberHandler = (e2) => this.se(e2), this.oe = (e2) => t.writeSequenceNumber(e2));
  }
  se(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this.oe && this.oe(e), e;
  }
}
__PRIVATE_ListenSequence._e = -1;
var H2 = [...[...[...[...["mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments"], "clientMetadata"], "remoteDocumentGlobal"], "collectionParents"], "bundles", "namedQueries"];
var J2 = [...H2, "documentOverlays"];
var Y2 = ["mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays"];
var Z2 = Y2;
var X2 = [...Z2, "indexConfiguration", "indexState", "indexEntries"];
class SortedMap {
  constructor(e, t) {
    this.comparator = e, this.root = t || LLRBNode.EMPTY;
  }
  insert(e, t) {
    return new SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  remove(e) {
    return new SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  get(e) {
    let t = this.root;
    for (;!t.isEmpty(); ) {
      const n = this.comparator(e, t.key);
      if (n === 0)
        return t.value;
      n < 0 ? t = t.left : n > 0 && (t = t.right);
    }
    return null;
  }
  indexOf(e) {
    let t = 0, n = this.root;
    for (;!n.isEmpty(); ) {
      const r2 = this.comparator(e, n.key);
      if (r2 === 0)
        return t + n.left.size;
      r2 < 0 ? n = n.left : (t += n.left.size + 1, n = n.right);
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  get size() {
    return this.root.size;
  }
  minKey() {
    return this.root.minKey();
  }
  maxKey() {
    return this.root.maxKey();
  }
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t, n) => (e(t, n), false));
  }
  toString() {
    const e = [];
    return this.inorderTraversal((t, n) => (e.push(`${t}:${n}`), false)), `{${e.join(", ")}}`;
  }
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  getIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, false);
  }
  getIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, false);
  }
  getReverseIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, true);
  }
  getReverseIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, true);
  }
}

class SortedMapIterator {
  constructor(e, t, n, r2) {
    this.isReverse = r2, this.nodeStack = [];
    let i = 1;
    for (;!e.isEmpty(); )
      if (i = t ? n(e.key, t) : 1, t && r2 && (i *= -1), i < 0)
        e = this.isReverse ? e.left : e.right;
      else {
        if (i === 0) {
          this.nodeStack.push(e);
          break;
        }
        this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
      }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse)
      for (e = e.left;!e.isEmpty(); )
        this.nodeStack.push(e), e = e.right;
    else
      for (e = e.right;!e.isEmpty(); )
        this.nodeStack.push(e), e = e.left;
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (this.nodeStack.length === 0)
      return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
}

class LLRBNode {
  constructor(e, t, n, r2, i) {
    this.key = e, this.value = t, this.color = n != null ? n : LLRBNode.RED, this.left = r2 != null ? r2 : LLRBNode.EMPTY, this.right = i != null ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  copy(e, t, n, r2, i) {
    return new LLRBNode(e != null ? e : this.key, t != null ? t : this.value, n != null ? n : this.color, r2 != null ? r2 : this.left, i != null ? i : this.right);
  }
  isEmpty() {
    return false;
  }
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  minKey() {
    return this.min().key;
  }
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  insert(e, t, n) {
    let r2 = this;
    const i = n(e, r2.key);
    return r2 = i < 0 ? r2.copy(null, null, null, r2.left.insert(e, t, n), null) : i === 0 ? r2.copy(null, t, null, null, null) : r2.copy(null, null, null, null, r2.right.insert(e, t, n)), r2.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty())
      return LLRBNode.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  remove(e, t) {
    let n, r2 = this;
    if (t(e, r2.key) < 0)
      r2.left.isEmpty() || r2.left.isRed() || r2.left.left.isRed() || (r2 = r2.moveRedLeft()), r2 = r2.copy(null, null, null, r2.left.remove(e, t), null);
    else {
      if (r2.left.isRed() && (r2 = r2.rotateRight()), r2.right.isEmpty() || r2.right.isRed() || r2.right.left.isRed() || (r2 = r2.moveRedRight()), t(e, r2.key) === 0) {
        if (r2.right.isEmpty())
          return LLRBNode.EMPTY;
        n = r2.right.min(), r2 = r2.copy(n.key, n.value, null, null, r2.right.removeMin());
      }
      r2 = r2.copy(null, null, null, null, r2.right.remove(e, t));
    }
    return r2.fixUp();
  }
  isRed() {
    return this.color;
  }
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, LLRBNode.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, LLRBNode.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  check() {
    if (this.isRed() && this.left.isRed())
      throw fail();
    if (this.right.isRed())
      throw fail();
    const e = this.left.check();
    if (e !== this.right.check())
      throw fail();
    return e + (this.isRed() ? 0 : 1);
  }
}
LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
LLRBNode.EMPTY = new class LLRBEmptyNode {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw fail();
  }
  get value() {
    throw fail();
  }
  get color() {
    throw fail();
  }
  get left() {
    throw fail();
  }
  get right() {
    throw fail();
  }
  copy(e, t, n, r2, i) {
    return this;
  }
  insert(e, t, n) {
    return new LLRBNode(e, t);
  }
  remove(e, t) {
    return this;
  }
  isEmpty() {
    return true;
  }
  inorderTraversal(e) {
    return false;
  }
  reverseTraversal(e) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return false;
  }
  checkMaxDepth() {
    return true;
  }
  check() {
    return 0;
  }
};

class SortedSet {
  constructor(e) {
    this.comparator = e, this.data = new SortedMap(this.comparator);
  }
  has(e) {
    return this.data.get(e) !== null;
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  forEach(e) {
    this.data.inorderTraversal((t, n) => (e(t), false));
  }
  forEachInRange(e, t) {
    const n = this.data.getIteratorFrom(e[0]);
    for (;n.hasNext(); ) {
      const r2 = n.getNext();
      if (this.comparator(r2.key, e[1]) >= 0)
        return;
      t(r2.key);
    }
  }
  forEachWhile(e, t) {
    let n;
    for (n = t !== undefined ? this.data.getIteratorFrom(t) : this.data.getIterator();n.hasNext(); ) {
      if (!e(n.getNext().key))
        return;
    }
  }
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new SortedSetIterator(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new SortedSetIterator(this.data.getIteratorFrom(e));
  }
  add(e) {
    return this.copy(this.data.remove(e).insert(e, true));
  }
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return t.size < e.size && (t = e, e = this), e.forEach((e2) => {
      t = t.add(e2);
    }), t;
  }
  isEqual(e) {
    if (!(e instanceof SortedSet))
      return false;
    if (this.size !== e.size)
      return false;
    const t = this.data.getIterator(), n = e.data.getIterator();
    for (;t.hasNext(); ) {
      const e2 = t.getNext().key, r2 = n.getNext().key;
      if (this.comparator(e2, r2) !== 0)
        return false;
    }
    return true;
  }
  toArray() {
    const e = [];
    return this.forEach((t) => {
      e.push(t);
    }), e;
  }
  toString() {
    const e = [];
    return this.forEach((t) => e.push(t)), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t = new SortedSet(this.comparator);
    return t.data = e, t;
  }
}

class SortedSetIterator {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}
class __PRIVATE_Base64DecodeError extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
}

class ByteString {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = function __PRIVATE_decodeBase64(e2) {
      try {
        return atob(e2);
      } catch (e3) {
        throw typeof DOMException != "undefined" && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
      }
    }(e);
    return new ByteString(t);
  }
  static fromUint8Array(e) {
    const t = function __PRIVATE_binaryStringFromUint8Array(e2) {
      let t2 = "";
      for (let n = 0;n < e2.length; ++n)
        t2 += String.fromCharCode(e2[n]);
      return t2;
    }(e);
    return new ByteString(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: false
      } : {
        value: undefined,
        done: true
      }
    };
  }
  toBase64() {
    return function __PRIVATE_encodeBase64(e) {
      return btoa(e);
    }(this.binaryString);
  }
  toUint8Array() {
    return function __PRIVATE_uint8ArrayFromBinaryString(e) {
      const t = new Uint8Array(e.length);
      for (let n = 0;n < e.length; n++)
        t[n] = e.charCodeAt(n);
      return t;
    }(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
}
ByteString.EMPTY_BYTE_STRING = new ByteString("");
var ee = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

class DatabaseInfo {
  constructor(e, t, n, r2, i, s, o, _, a) {
    this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r2, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, this.useFetchStreams = a;
  }
}

class DatabaseId {
  constructor(e, t) {
    this.projectId = e, this.database = t || "(default)";
  }
  static empty() {
    return new DatabaseId("", "");
  }
  get isDefaultDatabase() {
    return this.database === "(default)";
  }
  isEqual(e) {
    return e instanceof DatabaseId && e.projectId === this.projectId && e.database === this.database;
  }
}
var re = new SortedMap(DocumentKey.comparator);
var ie = new SortedMap(DocumentKey.comparator);
var se = new SortedMap(DocumentKey.comparator);
var oe = new SortedSet(DocumentKey.comparator);
var _e = new SortedSet(__PRIVATE_primitiveComparator);
var ae2;
var ue;
(ue = ae2 || (ae2 = {}))[ue.OK = 0] = "OK", ue[ue.CANCELLED = 1] = "CANCELLED", ue[ue.UNKNOWN = 2] = "UNKNOWN", ue[ue.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", ue[ue.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ue[ue.NOT_FOUND = 5] = "NOT_FOUND", ue[ue.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ue[ue.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", ue[ue.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ue[ue.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", ue[ue.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ue[ue.ABORTED = 10] = "ABORTED", ue[ue.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ue[ue.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", ue[ue.INTERNAL = 13] = "INTERNAL", ue[ue.UNAVAILABLE = 14] = "UNAVAILABLE", ue[ue.DATA_LOSS = 15] = "DATA_LOSS";
var le = new Integer([4294967295, 4294967295], 0);
var he = (() => {
  const e = {
    asc: "ASCENDING",
    desc: "DESCENDING"
  };
  return e;
})();
var Pe = (() => {
  const e = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
  };
  return e;
})();
var Ie = (() => {
  const e = {
    and: "AND",
    or: "OR"
  };
  return e;
})();
class __PRIVATE_FirestoreIndexValueWriter {
  constructor() {
  }
  Pt(e, t) {
    this.It(e, t), t.Tt();
  }
  It(e, t) {
    if ("nullValue" in e)
      this.Et(t, 5);
    else if ("booleanValue" in e)
      this.Et(t, 10), t.dt(e.booleanValue ? 1 : 0);
    else if ("integerValue" in e)
      this.Et(t, 15), t.dt(__PRIVATE_normalizeNumber(e.integerValue));
    else if ("doubleValue" in e) {
      const n = __PRIVATE_normalizeNumber(e.doubleValue);
      isNaN(n) ? this.Et(t, 13) : (this.Et(t, 15), __PRIVATE_isNegativeZero(n) ? t.dt(0) : t.dt(n));
    } else if ("timestampValue" in e) {
      const n = e.timestampValue;
      this.Et(t, 20), typeof n == "string" ? t.At(n) : (t.At(`${n.seconds || ""}`), t.dt(n.nanos || 0));
    } else if ("stringValue" in e)
      this.Rt(e.stringValue, t), this.Vt(t);
    else if ("bytesValue" in e)
      this.Et(t, 30), t.ft(__PRIVATE_normalizeByteString(e.bytesValue)), this.Vt(t);
    else if ("referenceValue" in e)
      this.gt(e.referenceValue, t);
    else if ("geoPointValue" in e) {
      const n = e.geoPointValue;
      this.Et(t, 45), t.dt(n.latitude || 0), t.dt(n.longitude || 0);
    } else
      "mapValue" in e ? __PRIVATE_isMaxValue(e) ? this.Et(t, Number.MAX_SAFE_INTEGER) : (this.yt(e.mapValue, t), this.Vt(t)) : ("arrayValue" in e) ? (this.wt(e.arrayValue, t), this.Vt(t)) : fail();
  }
  Rt(e, t) {
    this.Et(t, 25), this.St(e, t);
  }
  St(e, t) {
    t.At(e);
  }
  yt(e, t) {
    const n = e.fields || {};
    this.Et(t, 55);
    for (const e2 of Object.keys(n))
      this.Rt(e2, t), this.It(n[e2], t);
  }
  wt(e, t) {
    const n = e.values || [];
    this.Et(t, 50);
    for (const e2 of n)
      this.It(e2, t);
  }
  gt(e, t) {
    this.Et(t, 37);
    DocumentKey.fromName(e).path.forEach((e2) => {
      this.Et(t, 60), this.St(e2, t);
    });
  }
  Et(e, t) {
    e.dt(t);
  }
  Vt(e) {
    e.dt(2);
  }
}
__PRIVATE_FirestoreIndexValueWriter.bt = new __PRIVATE_FirestoreIndexValueWriter;
var Te = new Uint8Array(0);
class LruParams {
  constructor(e, t, n) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
  }
  static withCacheSize(e) {
    return new LruParams(e, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
}
LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1000, LruParams.DEFAULT = new LruParams(41943040, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
class __PRIVATE_ExponentialBackoff {
  constructor(e, t, n = 1000, r2 = 1.5, i = 60000) {
    this.oi = e, this.timerId = t, this.Mo = n, this.xo = r2, this.Oo = i, this.No = 0, this.Bo = null, this.Lo = Date.now(), this.reset();
  }
  reset() {
    this.No = 0;
  }
  ko() {
    this.No = this.Oo;
  }
  qo(e) {
    this.cancel();
    const t = Math.floor(this.No + this.Qo()), n = Math.max(0, Date.now() - this.Lo), r2 = Math.max(0, t - n);
    r2 > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r2} ms (base delay: ${this.No} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.Bo = this.oi.enqueueAfterDelay(this.timerId, r2, () => (this.Lo = Date.now(), e())), this.No *= this.xo, this.No < this.Mo && (this.No = this.Mo), this.No > this.Oo && (this.No = this.Oo);
  }
  Ko() {
    this.Bo !== null && (this.Bo.skipDelay(), this.Bo = null);
  }
  cancel() {
    this.Bo !== null && (this.Bo.cancel(), this.Bo = null);
  }
  Qo() {
    return (Math.random() - 0.5) * this.No;
  }
}
class DelayedOperation {
  constructor(e, t, n, r2, i) {
    this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r2, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred, this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((e2) => {
    });
  }
  get promise() {
    return this.deferred.promise;
  }
  static createAndSchedule(e, t, n, r2, i) {
    const s = Date.now() + n, o = new DelayedOperation(e, t, s, r2, i);
    return o.start(n), o;
  }
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  skipDelay() {
    return this.handleDelayElapsed();
  }
  cancel(e) {
    this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new FirestoreError(D2.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => this.timerHandle !== null ? (this.clearTimeout(), this.op().then((e) => this.deferred.resolve(e))) : Promise.resolve());
  }
  clearTimeout() {
    this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
}
class FirestoreClient {
  constructor(e, t, n, r2) {
    this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this.databaseInfo = r2, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n, async (e2) => {
      __PRIVATE_logDebug("FirestoreClient", "Received user=", e2.uid), await this.authCredentialListener(e2), this.user = e2;
    }), this.appCheckCredentials.start(n, (e2) => (__PRIVATE_logDebug("FirestoreClient", "Received new app check token=", e2), this.appCheckCredentialListener(e2, this.user)));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this.databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  verifyNotTerminated() {
    if (this.asyncQueue.isShuttingDown)
      throw new FirestoreError(D2.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new __PRIVATE_Deferred;
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
      try {
        this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t) {
        const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
        e.reject(n);
      }
    }), e.promise;
  }
}
var me = new Map;

class FirestoreSettingsImpl {
  constructor(e) {
    var t, n;
    if (e.host === undefined) {
      if (e.ssl !== undefined)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = "firestore.googleapis.com", this.ssl = true;
    } else
      this.host = e.host, this.ssl = (t = e.ssl) === null || t === undefined || t;
    if (this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, e.cacheSizeBytes === undefined)
      this.cacheSizeBytes = 41943040;
    else {
      if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < 1048576)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : e.experimentalAutoDetectLongPolling === undefined ? this.experimentalAutoDetectLongPolling = true : this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling, this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions((n = e.experimentalLongPollingOptions) !== null && n !== undefined ? n : {}), function __PRIVATE_validateLongPollingOptions(e2) {
      if (e2.timeoutSeconds !== undefined) {
        if (isNaN(e2.timeoutSeconds))
          throw new FirestoreError(D2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
        if (e2.timeoutSeconds < 5)
          throw new FirestoreError(D2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
        if (e2.timeoutSeconds > 30)
          throw new FirestoreError(D2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e2, t) {
      return e2.timeoutSeconds === t.timeoutSeconds;
    }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
}

class Firestore$1 {
  constructor(e, t, n, r2) {
    this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r2, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false;
  }
  get app() {
    if (!this._app)
      throw new FirestoreError(D2.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return this._terminateTask !== undefined;
  }
  _setSettings(e) {
    if (this._settingsFrozen)
      throw new FirestoreError(D2.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new FirestoreSettingsImpl(e), e.credentials !== undefined && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e2) {
      if (!e2)
        return new __PRIVATE_EmptyAuthCredentialsProvider;
      switch (e2.type) {
        case "firstParty":
          return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
        case "provider":
          return e2.client;
        default:
          throw new FirestoreError(D2.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _freezeSettings() {
    return this._settingsFrozen = true, this._settings;
  }
  _delete() {
    return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
  }
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  _terminate() {
    return function __PRIVATE_removeComponents(e) {
      const t = me.get(e);
      t && (__PRIVATE_logDebug("ComponentProvider", "Removing Datastore"), me.delete(e), t.terminate());
    }(this), Promise.resolve();
  }
}
class __PRIVATE_AsyncQueueImpl {
  constructor() {
    this.Xa = Promise.resolve(), this.eu = [], this.tu = false, this.nu = [], this.ru = null, this.iu = false, this.su = false, this.ou = [], this.jo = new __PRIVATE_ExponentialBackoff(this, "async_queue_retry"), this._u = () => {
      const e2 = getDocument();
      e2 && __PRIVATE_logDebug("AsyncQueue", "Visibility state changed to " + e2.visibilityState), this.jo.Ko();
    };
    const e = getDocument();
    e && typeof e.addEventListener == "function" && e.addEventListener("visibilitychange", this._u);
  }
  get isShuttingDown() {
    return this.tu;
  }
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.au(), this.uu(e);
  }
  enterRestrictedMode(e) {
    if (!this.tu) {
      this.tu = true, this.su = e || false;
      const t = getDocument();
      t && typeof t.removeEventListener == "function" && t.removeEventListener("visibilitychange", this._u);
    }
  }
  enqueue(e) {
    if (this.au(), this.tu)
      return new Promise(() => {
      });
    const t = new __PRIVATE_Deferred;
    return this.uu(() => this.tu && this.su ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)).then(() => t.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.eu.push(e), this.cu()));
  }
  async cu() {
    if (this.eu.length !== 0) {
      try {
        await this.eu[0](), this.eu.shift(), this.jo.reset();
      } catch (e) {
        if (!__PRIVATE_isIndexedDbTransactionError(e))
          throw e;
        __PRIVATE_logDebug("AsyncQueue", "Operation failed with retryable error: " + e);
      }
      this.eu.length > 0 && this.jo.qo(() => this.cu());
    }
  }
  uu(e) {
    const t = this.Xa.then(() => (this.iu = true, e().catch((e2) => {
      this.ru = e2, this.iu = false;
      const t2 = function __PRIVATE_getMessageOrStack(e3) {
        let t3 = e3.message || "";
        e3.stack && (t3 = e3.stack.includes(e3.message) ? e3.stack : e3.message + "\n" + e3.stack);
        return t3;
      }(e2);
      throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", t2), e2;
    }).then((e2) => (this.iu = false, e2))));
    return this.Xa = t, t;
  }
  enqueueAfterDelay(e, t, n) {
    this.au(), this.ou.indexOf(e) > -1 && (t = 0);
    const r2 = DelayedOperation.createAndSchedule(this, e, t, n, (e2) => this.lu(e2));
    return this.nu.push(r2), r2;
  }
  au() {
    this.ru && fail();
  }
  verifyOperationInProgress() {
  }
  async hu() {
    let e;
    do {
      e = this.Xa, await e;
    } while (e !== this.Xa);
  }
  Pu(e) {
    for (const t of this.nu)
      if (t.timerId === e)
        return true;
    return false;
  }
  Iu(e) {
    return this.hu().then(() => {
      this.nu.sort((e2, t) => e2.targetTimeMs - t.targetTimeMs);
      for (const t of this.nu)
        if (t.skipDelay(), e !== "all" && t.timerId === e)
          break;
      return this.hu();
    });
  }
  Tu(e) {
    this.ou.push(e);
  }
  lu(e) {
    const t = this.nu.indexOf(e);
    this.nu.splice(t, 1);
  }
}
class Firestore extends Firestore$1 {
  constructor(e, t, n, r2) {
    super(e, t, n, r2), this.type = "firestore", this._queue = function __PRIVATE_newAsyncQueue() {
      return new __PRIVATE_AsyncQueueImpl;
    }(), this._persistenceKey = (r2 == null ? undefined : r2.name) || "[DEFAULT]";
  }
  _terminate() {
    return this._firestoreClient || __PRIVATE_configureFirestore(this), this._firestoreClient.terminate();
  }
}
var pe = new RegExp("[~\\*/\\[\\]]");
var we = new WeakMap;
(function __PRIVATE_registerFirestore(e, t = true) {
  (function __PRIVATE_setSDKVersion(e2) {
    S2 = e2;
  })(SDK_VERSION), _registerComponent(new Component("firestore", (e2, { instanceIdentifier: n, options: r2 }) => {
    const i = e2.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(e2.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(e2.getProvider("app-check-internal")), function __PRIVATE_databaseIdFromApp(e3, t2) {
      if (!Object.prototype.hasOwnProperty.apply(e3.options, ["projectId"]))
        throw new FirestoreError(D2.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
      return new DatabaseId(e3.options.projectId, t2);
    }(i, n), i);
    return r2 = Object.assign({
      useFetchStreams: t
    }, r2), s._setSettings(r2), s;
  }, "PUBLIC").setMultipleInstances(true)), registerVersion(w2, "4.4.2", e), registerVersion(w2, "4.4.2", "esm2017");
})();
// client-modules/util.ts
function getCookie(name6) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name6}=`);
  if (parts.length === 2)
    return parts.pop().split(";").shift();
}

// client-modules/firebase.ts
var firebaseConfig = {
  apiKey: "AIzaSyBGGAL7ufq8SWvaGXbcDIj70xRY5v7dLZw",
  authDomain: "dollar-waitlist.firebaseapp.com",
  projectId: "dollar-waitlist",
  storageBucket: "dollar-waitlist.appspot.com",
  messagingSenderId: "366514623889",
  appId: "1:366514623889:web:dfeba19026cf16755cf630",
  measurementId: "G-VCHLQ18EMB"
};
var app9 = initializeApp(firebaseConfig);
var analytics3 = getAnalytics(app9);
var db2 = getFirestore(app9);
var auth3 = getAuth(app9);
auth3.setPersistence(inMemoryPersistence);
window.signIn = async (lastLogin) => {
  try {
    const provider = new GoogleAuthProvider;
    if (lastLogin)
      provider.setCustomParameters({ login_hint: lastLogin });
    const { user } = await signInWithPopup(auth3, provider);
    const idToken = await user.getIdToken();
    const csrfToken = getCookie("csrfToken");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken, csrfToken })
    });
    if (!res.ok)
      throw new Error("Failed to sign in");
    window.location.assign("/");
  } catch (err) {
    console.error(err);
    window.location.reload();
  }
};

// client-scripts/global.ts
var quickQuerySelector = function(selector, parent = document) {
  return parent.querySelector(selector);
};
var quickQuerySelectorAll = function(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
};
var randomId = function(prefix, withDash = true) {
  const rand = Math.random().toString(36).substring(2, 10);
  return `${prefix ? withDash ? `${prefix}-` : prefix : ""}${rand}`;
};
window.onload = () => {
  window.$ = quickQuerySelector;
  window.$$ = quickQuerySelectorAll;
  window.randomId = randomId;
};
