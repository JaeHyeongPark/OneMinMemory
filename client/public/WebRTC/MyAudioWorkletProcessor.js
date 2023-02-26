// MyAudioWorkletProcessor.js
class MyAudioWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._threshold = -120;
    this._isSpeaking = false;
    this.port.onmessage = (event) => {
      this._threshold = event.data.threshold;
    };
  }
  process(inputs, outputs) {
    const input = inputs[0][0];
    const normalizedInput = input.map((value) => value / 32767); // Normalize the input values
    let total = normalizedInput.reduce((sum, value) => sum + value * value, 0);
    const rms = Math.sqrt(total / input.length);
    const db = 20 * Math.log10(rms);

    const isSpeaking = db > this._threshold;
    if (isSpeaking !== this._isSpeaking) {
      this._isSpeaking = isSpeaking;
      this.port.postMessage({ isSpeaking });
    }
    return true;
  }
}

registerProcessor("my-audio-worklet-processor", MyAudioWorkletProcessor);
