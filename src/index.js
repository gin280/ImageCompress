export default class CompressImg {
  options = {
    files: [], // 文件列表
    maxSize: 500 * 1024, // 压缩限度
    quality: 0.6, // 质量
  }

  constructor(options) {
    this.options = options
  }

  // file change
  getBlob() {
    let files = this.options.files
    if (files.length === 0) {
      this.$msg("请选择图片")
      return
    }
    let file = files[0]
    let reader = new FileReader()

    reader.readAsDataURL(file)

    let uploadCb = (img) => {
      let base64 = this._compress(img, this.options.quality)
      img = null
      return this._generateBlob(base64, file.type)
    }

    let blob
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        let base64 = reader.result
        let img = new Image()
        img.src = base64
        // if image file size is not greater than 100 kb, upload it directly
        if (base64.length <= this.options.maxSize) {
          img = null
          blob = this._generateBlob(base64, file.type)
          resolve(blob)
        } else if (img.complete) {
          blob = uploadCb(img)
          resolve(blob)
        } else {
          img.onload = () => {
            blob = uploadCb(img)
            resolve(blob)
          }
        }
      }
    })
  }

  // 压缩图片
  _compress(objImg, quality) {
    let width = objImg.width
    let height = objImg.height
    // 用于压缩图片的canvas
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")
    // 瓦片canvas
    let tCanvas = document.createElement("canvas")
    let tctx = tCanvas.getContext("2d")
    // 如果图片大于400万像素，计算压缩比并将大小压至400万以下
    let ratio = (width * height) / 4000000
    if (ratio > 1) {
      ratio = Math.sqrt(ratio)
      width /= ratio
      height /= ratio
    } else {
      ratio = 1
    }
    canvas.width = width
    canvas.height = height
    // 铺底色
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // 如果图片像素大于100万则使用瓦片绘制
    let count = (width * height) / 1000000
    if (count > 1) {
      // 计算要分成多少块瓦片
      count = ~~(Math.sqrt(count) + 1)
      let nw = ~~(width / count)
      let nh = ~~(height / count)
      tCanvas.width = nw
      tCanvas.height = nh
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          tctx.drawImage(
            objImg,
            i * nw * ratio,
            j * nh * ratio,
            nw * ratio,
            nh * ratio,
            0,
            0,
            nw,
            nh
          )
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
        }
      }
    } else {
      ctx.drawImage(objImg, 0, 0, width, height)
    }
    // 进行压缩
    let nData = canvas.toDataURL("image/jpeg", quality)
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
    return nData
  }

  // 生成blob
  _generateBlob(baseStr, type) {
    let text = window.atob(baseStr.split(",")[1])
    let buffer = new Uint8Array(text.length)
    for (let i = 0; i < text.length; i++) {
      buffer[i] = text.charCodeAt(i)
    }
    return this._createBlob([buffer], { type })
  }

  // 兼容写法
  _createBlob(parts, properties) {
    parts = parts || []
    properties = properties || {}
    try {
      return new Blob(parts, properties)
    } catch (e) {
      if (e.name !== "TypeError") {
        throw e
      }
      var BlobBuilder =
        window.BlobBuilder ||
        window.MSBlobBuilder ||
        window.MozBlobBuilder ||
        window.WebKitBlobBuilder
      var builder = new BlobBuilder()
      for (var i = 0; i < parts.length; i += 1) {
        builder.append(parts[i])
      }
      return builder.getBlob(properties.type)
    }
  }
}
