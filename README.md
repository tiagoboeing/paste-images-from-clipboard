# Paste images from clipboard

A JavaScript script to paste images from Clipboard.

Inspired on [Our Code World](http://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser) script example.

| Mode     | Implemented |
| -------- | ----------- |
| `blob`   | ✅ Yes       |
| `base64` | ✅ Yes       |

## Use

Create a `.js` file and copy the content from [`script.js`](script.js) to your project.

In your HTML page, import the script:

```html
<script src="script.js" type="text/javascript">
  CLIPBOARD.init('blob')
</script>
```

For `Blob` mode, you have create a `<canvas>`:

```html
<canvas id="clipboard-canvas"></canvas>
```

### Listener

Use `pasteFromClipboard` custom event to receive images pasted from clipboard.

```js
document.addEventListener('pasteFromClipboard', e => {
  console.log('Image received', e.detail)
})
```

The listener returns:

```js
{
  "bubbles": false,
  "cancelBubble": false,
  ...
  "detail": { ... }, // <-- returns pasted image
  
}
```
