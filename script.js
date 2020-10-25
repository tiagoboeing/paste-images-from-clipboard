// inspired on http://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser

var CLIPBOARD = (function () {
  let MODE;

  /**
   * This handler retrieves the images from the clipboard as a blob and returns it in a callback.
   *
   * @param pasteEvent
   * @param callback
   */
  const convertFromClipboardToBlob = (pasteEvent, callback) => {
    if (pasteEvent.clipboardData === false) {
      if (typeof callback === "function") {
        callback(undefined);
      }
    }

    const {
      clipboardData: { items }
    } = pasteEvent;

    if (!items || items === undefined) {
      console.warn("Clipboard is empty");
      if (typeof callback === "function") callback(undefined);
    }

    for (let i in items) {
      if (items[i].type) {
        if (items[i].type.indexOf("image") === -1) continue;

        const blob = items[i].getAsFile();

        if (typeof callback === "function") callback(blob);
      }
    }
  };

  /**
   * This handler retrieves the images from the clipboard as a base64 string and returns it in a callback.
   *
   * @param pasteEvent
   * @param callback
   */
  const retrieveImageFromClipboardAsBase64 = (
    pasteEvent,
    callback,
    imageFormat
  ) => {
    if (pasteEvent.clipboardData === false) {
      if (typeof callback === "function") {
        callback(undefined);
      }
    }

    const {
      clipboardData: { items }
    } = pasteEvent;

    if (!items || items === undefined) {
      console.warn("Clipboard is empty");
      if (typeof callback === "function") callback(undefined);
    }

    for (let i in items) {
      if (items[i].type) {
        if (items[i].type.indexOf("image") === -1) continue;

        // Retrieve image on clipboard as blob
        const blob = items[i].getAsFile();

        // Create an abstract canvas and get context
        var mycanvas = document.createElement("canvas");
        var ctx = mycanvas.getContext("2d");

        // Create an image
        var img = new Image();

        // Once the image loads, render the img on the canvas
        img.onload = function () {
          // Update dimensions of the canvas with the dimensions of the image
          mycanvas.width = this.width;
          mycanvas.height = this.height;

          // Draw the image
          ctx.drawImage(img, 0, 0);

          // Execute callback with the base64 URI of the image
          if (typeof callback === "function") {
            callback(mycanvas.toDataURL(imageFormat || "image/png"));
          }
        };

        // Crossbrowser support for URL
        var URLObj = window.URL || window.webkitURL;

        // Creates a DOMString containing a URL representing the object given in the parameter
        // namely the original Blob
        img.src = URLObj.createObjectURL(blob);
      }
    }
  };

  const handleListener = (emit) => {
    return (pasteEvent) => {
      if (MODE === "blob") {
        convertFromClipboardToBlob(pasteEvent, (imageBlob) => {
          if (imageBlob) {
            const canvas = document.getElementById("my-image");
            const ctx = canvas.getContext("2d");

            const img = new Image();

            img.onload = function () {
              canvas.width = this.width;
              canvas.height = this.height;

              ctx.drawImage(img, 0, 0);
            };

            // Crossbrowser support for URL
            var URLObj = window.URL || window.webkitURL;

            // Creates a DOMString containing a URL representing the object given in the parameter
            // namely the original Blob
            img.src = URLObj.createObjectURL(imageBlob);

            document.dispatchEvent(emit(imageBlob));
          }
        });
      } else if (MODE === "base64") {
        //     // Handle the event
        retrieveImageFromClipboardAsBase64(pasteEvent, function (
          imageDataBase64
        ) {
          // If there's an image, open it in the browser as a new window :)
          if (imageDataBase64) {
            // data:image/png;base64,iVBORw0KGgoAAAAN......
            console.log(imageDataBase64);

            document.dispatchEvent(emit(imageDataBase64));
          }
        });
      }
    };
  };

  return {
    /**
     * Initialize listener
     * @param mode "blob" | "base64"
     */
    init: function (mode) {
      MODE = mode;

      function emit(data) {
        return new CustomEvent("pasteFromClipboard", { detail: data });
      }

      document.removeEventListener(
        "paste",
        () => console.log("Removed"),
        false
      );
      document.addEventListener("paste", handleListener(emit), false);
    }
  };
})();
