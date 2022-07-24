/* eslint-disable require-jsdoc */
window.addEventListener('load', () => {
	const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
	const ctx = canvas.getContext('2d')! as CanvasRenderingContext2D;
	const dino = document.getElementById('dino')! as HTMLElement;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
	class Bar {
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
		index: number;
		constructor(
			x: number,
			y: number,
			width: number,
			height: number,
			color: string,
			index: number
		) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.color = color;
			this.index = index;
		}
		update(micInput: number) {
			const sound: number = micInput * 2000;
			if (sound > this.height) {
				this.height = sound;
			} else {
				this.height -= this.height * 0.03;
			}
		}
		draw(context: CanvasRenderingContext2D) {
			if (context) {
				context.strokeStyle = this.color;
				context.lineWidth = this.width;
				context.save();
				context.translate(canvas.width / 2 - 30, canvas.height / 2);
				context.rotate(this.index * 0.03 + 180);
				context.beginPath();
				context.bezierCurveTo(
					this.x / 2,
					this.y / 2,
					this.height * -0.5 - 150,
					this.height + 50,
					this.x,
					this.y
				);
				context.stroke();
				if (this.index > 100) {
					context.beginPath();
					context.arc(
						this.x,
						this.y + 10 + this.height / 2 + this.height * 0.1,
						this.height * 0.1,
						0,
						Math.PI * 2
					);
					context.stroke();
					context.beginPath();
					context.moveTo(this.x, this.y + 10);
					context.lineTo(this.x, this.y + 10 + this.height / 2);
					context.stroke();
				}
				context.restore();
			}
		}
	}
	class Microphone {
		initilalized = false;
		audioContext: AudioContext | undefined;
		microphone: MediaStreamAudioSourceNode | undefined;
		analyser: AnalyserNode | undefined;
		dataArray: Uint8Array | undefined;

		constructor(fftSize: number) {
			this.initilalized = false;
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream: MediaStream) => {
					this.audioContext = new AudioContext();
					this.microphone = this.audioContext.createMediaStreamSource(stream);
					this.analyser = this.audioContext.createAnalyser();
					this.analyser.fftSize = fftSize;
					const bufferLenght: number = this.analyser.frequencyBinCount;
					this.dataArray = new Uint8Array(bufferLenght);
					this.microphone.connect(this.analyser);
					this.initilalized = true;
				})
				.catch((error: Error) => {
					alert(error.message);
				});
		}
		getSamples() {
			if (this.analyser !== undefined && this.dataArray !== undefined) {
				this.analyser.getByteTimeDomainData(this.dataArray);
				const normalSamples = Array.from(this.dataArray).map(
					(e) => e / 128 - 1
				);
				return normalSamples;
			}
		}
		getVolume() {
			if (this.analyser !== undefined && this.dataArray !== undefined) {
				this.analyser.getByteTimeDomainData(this.dataArray);
				const normalSamples: number[] = Array.from(this.dataArray).map(
					(e) => e / 128 - 1
				);
				let sum = 0;
				normalSamples.forEach((number: number) => {
					sum += Math.pow(number, 2);
				});
				const volume = Math.sqrt(sum / normalSamples.length);
				return volume;
			}
		}
	}
	const fftSize = 512;
	const microphone = new Microphone(fftSize);
	const bars: Bar[] = [];
	const barWidth: number = canvas.width / (fftSize / 2);
	function createBars() {
		for (let i = 1; i < fftSize / 2; i++) {
			bars.push(new Bar(0, i, 1, 50, `hsl(${i},121%,31%)`, i));
		}
	}
	createBars();
	let softVolume = 0;
	function animate() {
		if (microphone.initilalized === true) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const samples: number[] | undefined = microphone.getSamples();
			const volume: number | undefined = microphone.getVolume();
			if (samples !== undefined && bars && bars.length > 0) {
				bars.forEach((bar: Bar, index: number) => {
					bar.update(samples[index]);
					bar.draw(ctx);
				});
			}
			ctx.restore();
			if (volume) {
				softVolume = softVolume * 0.9 + volume * 0.1;
				if (dino) {
					dino.style.transform = `translate(-45%, -50%) scale(${
						2.5 + softVolume
					},${2.5 + softVolume})`;
				}
			}
		}
		requestAnimationFrame(animate);
	}
	animate();
});
