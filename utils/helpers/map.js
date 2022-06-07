let map = {};
const add = (key, value) => map[key] = value;
const has = (key) => Object.keys(map).includes(key);
const get = (key) => map[key] || null;
const all = () => map;

module.exports = {
  add,
  get,
  has,
  all
}