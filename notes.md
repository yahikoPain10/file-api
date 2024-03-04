`Blob`
  - Stand for "Binary Large Object"
  - Data structure used to store binary data
  - Stored in the memory or filesystem depending on the browser and blob size

`URL.createObjectURL`
  - Create an object url for the given file or blob
  - Returns A string containing an object URL that can be used to reference the contents of the specified source object.
  - Each time you call it a new object URL is created, even if you've already created one for the same object
  - Must be released by calling URL.revokeObjectURL
  - Browsers will release object URLs automatically when the document is unloaded

View Later
  - [Example uploading a user selected files](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#example_uploading_a_user-selected_file)