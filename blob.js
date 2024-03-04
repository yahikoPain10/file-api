let b = new Blob([
  JSON.stringify({username: "Essalihi mohammed ali"})
], {
  type: "application/json"
});

const reader = new FileReader();

const url1 = URL.createObjectURL(b);
const url2 = URL.createObjectURL(b);

document.write(url1.concat("\t").concat(url2));

// Changing the content of b does not affect the URLs previously generated from it.
b = new Blob(["New blob", "Created"], {
  type: "text/plain"
})

/** @param {Blob} blob */
function downloadFile(blob, name = "download") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

const newOne = b.slice(0, 3);

(async () => {
  console.log(await b.text());
  console.log(await newOne.text());

  console.log((await b.text()).length);
  console.log(b.type);
  console.log(b.size);

})()

reader.onload = () => {
  console.log(reader.result);
}

reader.readAsDataURL(b);