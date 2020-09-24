const { promisify } = require("util");
const resources = require('./resources');
const log = require("./log.js");
const cfg = require("./cfg.js");
const argv = require("minimist")(process.argv.slice(2), {
  boolean: ["color", "d", "daemon", "dev"]
});

let cache = {};
let config = null;

const cmd  = argv._[0];
const args = argv._.slice(1);

(async function loadCache(dev = {}) {
  try {

    await promisify((cb) => {
      cfg.init(null, (err, conf) => {
        if (!err) {
          config = conf;
          if (dev) config.dev = dev;
        }
        cb(err);
      });
    })();

    await promisify((cb) => {
      log.info("Loading resources ...");
      resources.load(args.dev, (err, c) => {
        log.info("Loading resources done");
        cache = c; cb(err);
      });
    })();
  } catch (error) {
    log.error(error);
  }
})();
