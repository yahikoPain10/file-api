/** @type {HTMLInputElement} */
const fileInput = document.getElementById("file");
const content = document.getElementById("content");
// Empty: No data has been loaded yet
const fileReaderStates = ["EMPTY", "LOADING", "DONE"];

/** @param {File} file */
function appendFileMetadata(file) {
  content.innerHTML += `
    <ul>
      <li><b>Name: </b> ${file.name}</li>
      <li><b>Size: </b> ${file.size} byte(s)</li>
      <li><b>MIME type: </b> ${file.type}</li>
      <li><b>last modified: </b> ${new Date(file.lastModified).toString()}</li>
    </ul>
  `
}

/**
 * @param {File} file
 * @param {"text" | "dataURL" | "objectURL"} readAs
 */
function readFile(file, readAs) {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.addEventListener("error", function () {
      rej(this.error);
    })

    reader.addEventListener("abort", function () {
      rej(new Error("Read operation aborted"));
    })

    reader.addEventListener("loadstart", function () {
      console.time("Loadtime");
      console.groupCollapsed(file.name);
      console.log("Read as: %s", readAs);
      console.log("Loadstart, state: %d, stateText: %s", this.readyState, fileReaderStates[this.readyState]);
    })

    reader.addEventListener("progress", function () {
      console.log("Progress, state: %d, stateText: %s", this.readyState, fileReaderStates[this.readyState]);
    })
    
    // Fired when a read has completed successfully.
    reader.addEventListener("load", function () {
      console.log("Load, state: %d, stateText: %s", this.readyState, fileReaderStates[this.readyState]);
      res(this.result);
    })
    
    // Fired when a read has completed, successfully or not.
    reader.addEventListener("loadend", function () {
      console.log("Loadend, state: %d, stateText: %s", this.readyState, fileReaderStates[this.readyState]);
      console.timeEnd("Loadtime");
      console.groupEnd();
    })

    if(readAs === "text") {
      reader.readAsText(file);
    }
    else if(readAs === "dataURL") {
      reader.readAsDataURL(file);
    }
    else {
      res(URL.createObjectURL(file));
    }
  })
}

fileInput.addEventListener("change", function () {
  const files = this.files;
  const readAsDataURL = document.getElementById("dataurl").checked;
  let file;

  function errorHandler(e) {
    content.innerHTML += `
      Failed to load Due to an error: ${e.message || "Unknown Error"}
    `
  }

  if(!files || !files.length) return;

  content.innerHTML  = "";

  for(let i = 0; i < files.length; i++) {
    file = files[i];

    appendFileMetadata(file);

    if(file.type.startsWith("text")) {
      readFile(file, "text")
      .then(text => content.innerHTML += `<pre><code>${text}</code></pre>`)
      .catch(errorHandler);
    }
    else if(file.type.startsWith("image")) {
      let img = new Image();
      if(readAsDataURL) {
        readFile(file, "dataURL")
        .then(dataurl => {
          img.src = dataurl;
          content.innerHTML += `<pre>${img.outerHTML}</pre>`
        })
        .catch(errorHandler);
      }
      else {
        readFile(file, "objectURL")
        .then(url => {
          img.src = url;
          img.onload = () => URL.revokeObjectURL(url);
          content.innerHTML += `<pre>${img.outerHTML}</pre>`
        })
        .catch(errorHandler)
      }
    }
  }
})