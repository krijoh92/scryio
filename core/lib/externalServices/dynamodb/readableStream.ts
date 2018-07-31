import Stream from 'stream'
import util from 'util'

function ReadableStream(data) {
  Stream.Readable.call(this)
  this._data = data
}

ReadableStream.prototype._read = function() {
  this.push(this._data)
  this._data = ''

  // const ret = this.push(this._data)
  // this._data = ''
  // return ret
}

ReadableStream.prototype.append = function(data) {
  this.push(data)

  // this._data = data
  // this.read(0)
}

ReadableStream.prototype.end = function() {
  this.push(null)
}

util.inherits(ReadableStream, Stream.Readable)

export default ReadableStream as any
