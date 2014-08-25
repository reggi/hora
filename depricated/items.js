var items = function(options) {
  if (typeof options.item == "string") options.item = [options.item];
  if (typeof options.items == "string") options.items = [options.items];
  var items = [];
  items = items.concat(options.item);
  items = items.concat(options.items);
  return items;
}

var test = items({
  item: ["hello/world"],
  items: ["hello/thomas", "janet/jackson"]
})

console.log(test);